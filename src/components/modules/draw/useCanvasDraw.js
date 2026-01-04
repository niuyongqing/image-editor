import { onUnmounted, unref } from 'vue';
import { fabric } from 'fabric';
import { useEditorState } from '@/composables/useEditorState';

// 绘制模式交互与对象创建（Fabric v5 同步事件）
// 支持 7 种：rect / ellipse / line / brush / arrow / rectFill / ellipseFill
//
// 交互：选择类型进入绘制模式（crosshair + 禁止选中其它对象由 Workspace 锁策略保证）
// - 画完自动选中，并退出绘制模式进入编辑态
// - 点击已存在绘制对象：退出绘制模式并选中该对象
// - ESC：退出绘制模式

export function useCanvasDraw(canvasAPI) {
  const { state, setDrawMode, setDrawType, updateDrawStyle } = useEditorState();

  let disposeFns = [];

  // 临时状态
  let isPointerDown = false;
  let startPoint = null;
  let previewObj = null; // fabric.Object

  // arrow 预览专用：用“相对 group 本地坐标”更新，避免飞走
  let arrowLocal = null; // { line, head }

  const getCanvas = () => unref(canvasAPI?.canvas);

  const setCursor = (cursor) => {
    const c = getCanvas();
    if (!c) return;
    c.defaultCursor = cursor;
    c.hoverCursor = cursor;
};

  // 兼容 hex/rgb/rgba：若本身已是 rgba 则直接替换 alpha
  const applyOpacityToColor = (color, opacity) => {
    try {
      if (!color) return `rgba(0,0,0,${opacity})`;
      if (color.startsWith('rgba(')) {
        const parts = color
          .replace('rgba(', '')
          .replace(')', '')
          .split(',')
          .map((p) => p.trim());
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
      }
      if (color.startsWith('rgb(')) {
        const parts = color
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((p) => p.trim());
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
      }
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        const full =
          hex.length === 3
            ? hex
                .split('')
                .map((ch) => ch + ch)
                .join('')
            : hex.padEnd(6, '0').slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      return color;
    } catch (_) {
      return color;
    }
  };

  const normalizeStyle = () => {
    const s = state.drawStyle || {};
    const strokeWidth = Number(s.strokeWidth) || 1;
    const opacity = Math.max(0, Math.min(1, Number(s.opacity ?? 1)));
    const strokeRaw = s.strokeColor || '#000000';
    const fillRaw = s.fillColor || '';

    const stroke = applyOpacityToColor(strokeRaw, opacity);
    const fill = fillRaw ? applyOpacityToColor(fillRaw, opacity) : 'rgba(0,0,0,0)';
    
    let dashArray = null;
    if (s.lineStyle === 'dash') dashArray = [8, 6];
    else if (s.lineStyle === 'dotted') dashArray = [2, 4];

    return { strokeWidth, opacity, stroke, fill, dashArray };
  };

  const ensureBrush = () => {
    const c = getCanvas();
    if (!c) return;

    const { strokeWidth, stroke } = normalizeStyle();

    const brush = new fabric.PencilBrush(c);
    brush.color = stroke;
    brush.width = strokeWidth;
    c.freeDrawingBrush = brush;
  };

  const isDrawTarget = (t) => !!t?.isDrawObject;

  const markAsDrawObject = (obj) => {
    if (!obj) return;
    obj.isDrawObject = true;
    if (!obj.customTool) obj.customTool = 'draw';
  };

  const finalizeObject = (obj) => {
    const c = getCanvas();
    if (!c || !obj) return;

    obj.set({ selectable: true, evented: true });
    markAsDrawObject(obj);
    c.setActiveObject(obj);
    c.requestRenderAll();
  };

  const clearPreview = () => {
    const c = getCanvas();
    if (c && previewObj) {
      c.remove(previewObj);
      previewObj = null;
      c.requestRenderAll();
    }
    arrowLocal = null;
  };

  const unbindAll = () => {
    disposeFns.forEach((fn) => {
      try {
        fn();
      } catch (_) {
        /* noop */
      }
    });
    disposeFns = [];
  };

  const exitDrawMode = () => {
    const c = getCanvas();

    setDrawMode(false);
    setDrawType('');

    if (c) {
      c.isDrawingMode = false;
      setCursor('default');
    }

    clearPreview();
    unbindAll();

    isPointerDown = false;
    startPoint = null;
  };

  // --- 形状创建 ---

  const createLine = (p1, p2) => {
    const { strokeWidth, stroke, dashArray } = normalizeStyle();
    const line = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
      stroke,
      strokeWidth,
      selectable: false,
      evented: false,
      strokeUniform: true,
      objectCaching: false,
    });
    if (dashArray) line.set('strokeDashArray', dashArray);
    return line;
  };

  // ✅ 箭头预览：Group 本身在中心点，子对象用 group 的本地坐标（相对中心）
  const createArrowGroup = (p1, p2) => {
    const { strokeWidth, stroke, dashArray } = normalizeStyle();

    // 避免零长度
    if (p1.x === p2.x && p1.y === p2.y) {
      p2 = { x: p1.x + 1, y: p1.y + 1 };
    }

    const cx = (p1.x + p2.x) / 2;
    const cy = (p1.y + p2.y) / 2;

    // 本地坐标（相对 group 中心）
    const x1 = p1.x - cx;
    const y1 = p1.y - cy;
    const x2 = p2.x - cx;
    const y2 = p2.y - cy;

    const line = new fabric.Line([x1, y1, x2, y2], {
      stroke,
      strokeWidth,
      selectable: false,
      evented: false,
      strokeUniform: true,
      objectCaching: false,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });
    if (dashArray) line.set('strokeDashArray', dashArray);

    const headLen = Math.max(10, strokeWidth * 2.2);
    const head = new fabric.Triangle({
      width: headLen,
      height: headLen,
      fill: stroke,
      originX: 'center',
      originY: 'center',
      left: x2,
      top: y2,
      selectable: false,
      evented: false,
      objectCaching: false,
    });

    const angle = Math.atan2(y2 - y1, x2 - x1);
    head.set('angle', angle * 180 / Math.PI + 90);

    const group = new fabric.Group([line, head], {
      left: cx,
      top: cy,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      hasBorders: true,
      hasControls: true,
      objectCaching: false,
    });

    // 缓存子引用用于 move 更新
    arrowLocal = { line, head };

    group.setCoords();
    return group;
  };

  const createRect = (p1, p2, isFill) => {
    const { strokeWidth, stroke, fill, dashArray } = normalizeStyle();
    const left = Math.min(p1.x, p2.x);
    const top = Math.min(p1.y, p2.y);
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);

    const rect = new fabric.Rect({
      left,
      top,
      width,
      height,
      fill: isFill ? (fill || '#000000') : 'rgba(0,0,0,0)',
      stroke,
      strokeWidth,
      selectable: false,
      evented: false,
      strokeUniform: true,
      objectCaching: false,
    });
    if (dashArray) rect.set('strokeDashArray', dashArray);
    return rect;
  };

  const createEllipse = (p1, p2, isFill) => {
    const { strokeWidth, stroke, fill, dashArray } = normalizeStyle();
    const left = Math.min(p1.x, p2.x);
    const top = Math.min(p1.y, p2.y);
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);

    const rx = width / 2;
    const ry = height / 2;

    const ellipse = new fabric.Ellipse({
      left: left + rx,
      top: top + ry,
      originX: 'center',
      originY: 'center',
      rx,
      ry,
      fill: isFill ? (fill || '#000000') : 'rgba(0,0,0,0)',
      stroke,
      strokeWidth,
      selectable: false,
      evented: false,
      strokeUniform: true,
      objectCaching: false,
    });
    if (dashArray) ellipse.set('strokeDashArray', dashArray);
    return ellipse;
  };

  const updateRect = (rect, p1, p2, isFill) => {
    if (!rect) return;
    const { strokeWidth, stroke, fill, dashArray } = normalizeStyle();
    const left = Math.min(p1.x, p2.x);
    const top = Math.min(p1.y, p2.y);
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);

    rect.set({
      left,
      top,
      width,
      height,
      stroke,
      strokeWidth,
      fill: isFill ? (fill || '#000000') : 'rgba(0,0,0,0)',
    });

    rect.set('strokeDashArray', dashArray);
  };

  const updateEllipse = (ellipse, p1, p2, isFill) => {
    if (!ellipse) return;
    const { strokeWidth, stroke, fill, dashArray } = normalizeStyle();
    const left = Math.min(p1.x, p2.x);
    const top = Math.min(p1.y, p2.y);
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);

    const rx = width / 2;
    const ry = height / 2;

    ellipse.set({
      left: left + rx,
      top: top + ry,
      rx,
      ry,
      stroke,
      strokeWidth,
      fill: isFill ? (fill || '#000000') : 'rgba(0,0,0,0)',
    });

    ellipse.set('strokeDashArray', dashArray);
  };

  // --- 事件绑定 ---

  const bindShapeEvents = () => {
    const c = getCanvas();
    if (!c) return;

    const onMouseDown = (opt) => {
      if (!state.drawMode) return;

      // 点击已有绘制对象 => 退出绘制模式并选中
      if (opt?.target && isDrawTarget(opt.target)) {
        exitDrawMode();
        c.setActiveObject(opt.target);
        c.requestRenderAll();
        return;
      }

      isPointerDown = true;
      startPoint = c.getPointer(opt.e);
      const p2 = startPoint;

      const type = state.drawType;
      if (type === 'arrow') previewObj = createArrowGroup(startPoint, p2);
      else if (type === 'line') previewObj = createLine(startPoint, p2);
      else if (type === 'rect') previewObj = createRect(startPoint, p2, false);
      else if (type === 'rectFill') previewObj = createRect(startPoint, p2, true);
      else if (type === 'ellipse') previewObj = createEllipse(startPoint, p2, false);
      else if (type === 'ellipseFill') previewObj = createEllipse(startPoint, p2, true);
      else previewObj = null;

      if (previewObj) {
        c.add(previewObj);
        previewObj.set({ selectable: false, evented: false });
      }
    };

    const onMouseMove = (opt) => {
      if (!state.drawMode || !isPointerDown || !startPoint || !previewObj) return;
      const p = c.getPointer(opt.e);
      const type = state.drawType;

      if (type === 'arrow') {
        // ✅ 更新“本地坐标”而不是用绝对坐标写入子对象，避免飞走
        if (!arrowLocal?.line || !arrowLocal?.head) return;

        const cx = (startPoint.x + p.x) / 2;
        const cy = (startPoint.y + p.y) / 2;

        // 更新 group 的中心
        previewObj.set({ left: cx, top: cy });

        // 新的本地坐标
        const x1 = startPoint.x - cx;
        const y1 = startPoint.y - cy;
        const x2 = p.x - cx;
        const y2 = p.y - cy;

        arrowLocal.line.set({ x1, y1, x2, y2 });
        arrowLocal.head.set({ left: x2, top: y2 });

        const angle = Math.atan2(y2 - y1, x2 - x1);
        arrowLocal.head.set('angle', angle * 180 / Math.PI + 90);

        previewObj.addWithUpdate();
      } else if (type === 'line') {
        previewObj.set({ x1: startPoint.x, y1: startPoint.y, x2: p.x, y2: p.y });
      } else if (type === 'rect') {
        updateRect(previewObj, startPoint, p, false);
      } else if (type === 'rectFill') {
        updateRect(previewObj, startPoint, p, true);
      } else if (type === 'ellipse') {
        updateEllipse(previewObj, startPoint, p, false);
      } else if (type === 'ellipseFill') {
        updateEllipse(previewObj, startPoint, p, true);
      }

      previewObj.setCoords();
      c.requestRenderAll();
    };

    const onMouseUp = () => {
      if (!state.drawMode || !isPointerDown) return;
      isPointerDown = false;

      const obj = previewObj;
      previewObj = null;
      arrowLocal = null;

      if (obj) {
        finalizeObject(obj);
      }

      exitDrawMode();
    };

    c.on('mouse:down', onMouseDown);
    c.on('mouse:move', onMouseMove);
    c.on('mouse:up', onMouseUp);

    disposeFns.push(() => c.off('mouse:down', onMouseDown));
    disposeFns.push(() => c.off('mouse:move', onMouseMove));
    disposeFns.push(() => c.off('mouse:up', onMouseUp));
  };

  const bindBrushEvents = () => {
    const c = getCanvas();
    if (!c) return;

    ensureBrush();
    c.isDrawingMode = true;

    const onPathCreated = (opt) => {
      const path = opt?.path;
      if (!path) return;

      path.set({ selectable: true, evented: true, objectCaching: false });
      markAsDrawObject(path);

      c.setActiveObject(path);
      c.requestRenderAll();

      exitDrawMode();
    };

    c.on('path:created', onPathCreated);
    disposeFns.push(() => c.off('path:created', onPathCreated));
  };

  const enterDrawMode = (type) => {
    const c = getCanvas();
    if (!c) return;

    setDrawMode(true);
    setDrawType(type);
    setCursor('crosshair');

    c.discardActiveObject();
    c.requestRenderAll();

    if (type === 'brush') {
      bindBrushEvents();
    } else {
      bindShapeEvents();
    }
  };

  const onKeyDown = (e) => {
    if (!state.drawMode) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      exitDrawMode();
    }
  };

  const bindGlobalKeys = () => {
    window.addEventListener('keydown', onKeyDown);
    disposeFns.push(() => window.removeEventListener('keydown', onKeyDown));
  };

  // 对外：当样式变更时，刷新 brush（仅 brush 生效）
  const refreshStyle = (patch = {}) => {
    updateDrawStyle(patch);
    const c = getCanvas();
    if (!c) return;
    if (state.drawMode && state.drawType === 'brush') {
      ensureBrush();
      }
  };

  bindGlobalKeys();

  onUnmounted(() => {
    exitDrawMode();
  });

  return {
    enterDrawMode,
    exitDrawMode,
    refreshStyle,
  };
}
