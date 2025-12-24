import { ref, unref } from 'vue';
import { fabric } from 'fabric';

// === 模块级单例状态 ===
let canvasRef = null;
let saveHistoryFn = null;

export const DASH_OPTIONS = [
    { label: '实线', value: [], icon: 'solid' },
    { label: '长虚线', value: [15, 15], icon: 'long-dash' },
    { label: '短虚线', value: [5, 5], icon: 'short-dash' },
    { label: '疏点线', value: [0, 8], strokeLineCap: 'round' }, 
    { label: '密点线', value: [0, 4], strokeLineCap: 'round' },
    { label: '点划线', value: [15, 5, 0, 5], strokeLineCap: 'round' } 
];

export const CAP_STYLES = [
    { id: 'line', label: '短线' },
    { id: 'arrow', label: '外向箭头' },
    { id: 'arrow_in', label: '内向箭头' },
    { id: 'dot', label: '圆点' },
    { id: 'none', label: '无' }
];

const isDrawing = ref(false);
const rulerConfig = ref({
    value: 20,
    unit: 'cm',
    color: '#ff0000',
    opacity: 100,
    fontSize: 24,
    fontFamily: 'Arial',
    strokeWidth: 4,
    showBg: true,
    capStyle: 'line',    
    dashArray: [],       
    strokeLineCap: 'butt'
});

export const registerRulerModule = (canvas, saveHistory) => {
    canvasRef = canvas;
    saveHistoryFn = saveHistory;

    const c = unref(canvas);
    if (c) {
        c.off('selection:created', onSelectionChanged);
        c.off('selection:updated', onSelectionChanged);
        c.on('selection:created', onSelectionChanged);
        c.on('selection:updated', onSelectionChanged);
    }
};

const createCap = (type, color, strokeWidth) => {
    const size = 10 + strokeWidth; 
    if (type === 'arrow' || type === 'arrow_in') {
        return new fabric.Triangle({
            width: size, height: size, fill: color,
            originX: 'center', originY: 'center', selectable: false
        });
    } else if (type === 'dot') {
        return new fabric.Circle({
            radius: strokeWidth * 1.5, fill: color,
            originX: 'center', originY: 'center', selectable: false
        });
    } else if (type === 'line') {
        return new fabric.Line([0, -size, 0, size], {
            stroke: color, strokeWidth: strokeWidth,
            originX: 'center', originY: 'center', selectable: false
        });
    } else {
        return new fabric.Rect({ width: 0, height: 0, visible: false });
    }
};

const createRulerObject = (start, end) => {
    const canvas = unref(canvasRef);
    const cfg = rulerConfig.value;
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const halfLen = length / 2;

    const line = new fabric.Line([-halfLen, 0, halfLen, 0], {
        stroke: cfg.color, strokeWidth: cfg.strokeWidth,
        strokeDashArray: cfg.dashArray, strokeLineCap: cfg.strokeLineCap || 'butt',
        originX: 'center', originY: 'center'
    });

    const startCap = createCap(cfg.capStyle, cfg.color, cfg.strokeWidth);
    const endCap = createCap(cfg.capStyle, cfg.color, cfg.strokeWidth);
    startCap.set({ left: -halfLen, top: 0 });
    endCap.set({ left: halfLen, top: 0 });
    
    const updateCapRotation = (cap, isStart) => {
        if (cfg.capStyle.includes('arrow')) {
            let rot = 90;
            if (cfg.capStyle === 'arrow') rot = isStart ? -90 : 90;
            else rot = isStart ? 90 : -90;
            cap.set({ angle: rot });
        } else { cap.set({ angle: 0 }); }
    };
    updateCapRotation(startCap, true);
    updateCapRotation(endCap, false);

    const textObj = new fabric.Text(`${cfg.value} ${cfg.unit}`, {
        fontSize: cfg.fontSize, fill: cfg.color, fontFamily: cfg.fontFamily,
        backgroundColor: cfg.showBg ? 'rgba(255,255,255,0.8)' : '',
        originX: 'center', originY: 'bottom', left: 0, top: -10
    });
    if (Math.abs(angle) > 90) textObj.set({ angle: 180, originY: 'bottom', top: 10 });

    const group = new fabric.Group([line, startCap, endCap, textObj], {
        left: midX, top: midY, angle: angle,
        originX: 'center', originY: 'center', opacity: cfg.opacity / 100,
        customTab: 'ruler', customTool: 'adjust', isRuler: true,
        _rulerValue: cfg.value, _rulerUnit: cfg.unit,
        _capStyle: cfg.capStyle, _dashArray: cfg.dashArray, _strokeLineCap: cfg.strokeLineCap,
        lockScalingY: true, lockUniScaling: true
    });

    // 标尺只允许旋转和横向拉伸(实际上是通过Group的scaleX)
    group.setControlsVisibility({ mtr: true, ml: true, mr: true, mt:false, mb:false, tl:false, tr:false, bl:false, br:false });
    canvas.add(group);
    
    if (saveHistoryFn) saveHistoryFn();
    return group; // 返回对象供调用者使用
};

// === 4. 原地重生逻辑 (编辑模式) ===
const recreateActiveRuler = (activeGroup) => {
    const canvas = unref(canvasRef);
    const center = activeGroup.getCenterPoint();
    const lineObj = activeGroup.getObjects()[0];
    const currentWidth = lineObj.width * activeGroup.scaleX;
    const angleRad = fabric.util.degreesToRadians(activeGroup.angle);
    const dx = (currentWidth / 2) * Math.cos(angleRad);
    const dy = (currentWidth / 2) * Math.sin(angleRad);
    const start = { x: center.x - dx, y: center.y - dy };
    const end = { x: center.x + dx, y: center.y + dy };
    
    // 移除旧的
    canvas.remove(activeGroup);
    
    // 创建新的
    const newGroup = createRulerObject(start, end);
    
    // [修复点 1] 重生后必须立即选中，否则蓝框会消失，用户会失去焦点
    canvas.setActiveObject(newGroup);
    canvas.requestRenderAll();
};

export const updateActiveRuler = () => {
    const canvas = unref(canvasRef);
    if (!canvas) return;
    const group = canvas.getActiveObject();
    if (!group || !group.isRuler) return;

    const cfg = rulerConfig.value;
    const needsRebuild = (group._capStyle !== cfg.capStyle) || (group.getObjects()[3].fontSize !== cfg.fontSize);

    if (needsRebuild) {
        recreateActiveRuler(group);
    } else {
        // 轻量更新
        const items = group.getObjects(); 
        items[0].set({
            stroke: cfg.color, strokeWidth: cfg.strokeWidth,
            strokeDashArray: cfg.dashArray, strokeLineCap: cfg.strokeLineCap || 'butt'
        });
        items[1].set({ fill: cfg.color, stroke: cfg.color });
        items[2].set({ fill: cfg.color, stroke: cfg.color });
        items[3].set({
            text: `${cfg.value} ${cfg.unit}`, fill: cfg.color,
            backgroundColor: cfg.showBg ? 'rgba(255,255,255,0.8)' : ''
        });
        group.set({ opacity: cfg.opacity / 100 });
        group._rulerValue = cfg.value;
        group._rulerUnit = cfg.unit;
        group._dashArray = cfg.dashArray;
        group._strokeLineCap = cfg.strokeLineCap;

        canvas.requestRenderAll();
        if (saveHistoryFn) saveHistoryFn();
    }
};

// === 5. 状态同步 (从画布 -> Config) ===
const onSelectionChanged = (e) => {
    // 如果正在绘制中，不要让选中的物体打断配置，除非我们决定中断绘制
    // 这里我们保持简单的策略：只有在非绘制模式下才同步
    if (isDrawing.value) return;

    const activeObj = e.selected?.[0];
    syncConfigFromObject(activeObj);
};

// [新增] 供外部组件调用的强制同步
export const syncConfigFromActiveSelection = () => {
    const canvas = unref(canvasRef);
    const activeObj = canvas?.getActiveObject();
    syncConfigFromObject(activeObj);
    return activeObj;
};

const syncConfigFromObject = (activeObj) => {
    if (activeObj && activeObj.isRuler) {
        const items = activeObj.getObjects();
        rulerConfig.value.value = activeObj._rulerValue ?? 20;
        rulerConfig.value.unit = activeObj._rulerUnit ?? 'cm';
        rulerConfig.value.opacity = (activeObj.opacity || 1) * 100;
        rulerConfig.value.capStyle = activeObj._capStyle || 'line'; 
        rulerConfig.value.dashArray = activeObj._dashArray || [];
        rulerConfig.value.strokeLineCap = activeObj._strokeLineCap || 'butt';
        if (items[0]) {
            rulerConfig.value.color = items[0].stroke;
            rulerConfig.value.strokeWidth = items[0].strokeWidth;
        }
        if (items[3]) {
            rulerConfig.value.fontSize = items[3].fontSize;
            rulerConfig.value.showBg = !!items[3].backgroundColor;
        }
    }
};

// === 6. 绘制交互 (Continuos Mode) ===
let startPoint = null;
let activeLine = null;

const onKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        stopDrawMode();
    }
};

export const startDrawMode = () => {
    if (isDrawing.value) return;

    const canvas = unref(canvasRef);
    if (!canvas) return;
    isDrawing.value = true;
    
    canvas.discardActiveObject();
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.getObjects().forEach(obj => {
        obj._prevSelectable = obj.selectable;
        obj.selectable = false;
    });

    canvas.on('mouse:down', onMouseDown);
    window.addEventListener('keydown', onKeyDown);
    canvas.requestRenderAll();
};

export const stopDrawMode = () => {
    const canvas = unref(canvasRef);
    if (!canvas) return;
    isDrawing.value = false;
    
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.getObjects().forEach(obj => {
        if (obj._prevSelectable !== undefined) {
            obj.selectable = obj._prevSelectable;
            delete obj._prevSelectable;
        }
    });

    canvas.off('mouse:down', onMouseDown);
    canvas.off('mouse:move', onMouseMove);
    canvas.off('mouse:up', onMouseUp);
    window.removeEventListener('keydown', onKeyDown);
    canvas.requestRenderAll();
};

const onMouseDown = (opt) => {
    const canvas = unref(canvasRef);
    // [场景 2A 核心]：如果点击到了现有的尺子 -> 中断绘制，切换为选中编辑
    if (opt.target && opt.target.isRuler) {
        stopDrawMode();
        canvas.setActiveObject(opt.target);
        syncConfigFromObject(opt.target); // 立即同步配置
        return;
    }

    const pointer = canvas.getPointer(opt.e);
    startPoint = { x: pointer.x, y: pointer.y };
    activeLine = new fabric.Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
        stroke: rulerConfig.value.color,
        strokeWidth: rulerConfig.value.strokeWidth,
        strokeDashArray: [5, 5], 
        selectable: false, evented: false
    });
    canvas.add(activeLine);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
};

const onMouseMove = (opt) => {
    if (!activeLine) return;
    const canvas = unref(canvasRef);
    const pointer = canvas.getPointer(opt.e);
    activeLine.set({ x2: pointer.x, y2: pointer.y });
    canvas.requestRenderAll();
};

const onMouseUp = () => {
    const canvas = unref(canvasRef);
    canvas.off('mouse:move', onMouseMove);
    canvas.off('mouse:up', onMouseUp);
    
    if (!activeLine) return;
    
    const endPoint = { x: activeLine.x2, y: activeLine.y2 };
    canvas.remove(activeLine);
    activeLine = null;
    
    const dist = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
    
    if (dist > 10) {
        // 画完不选中，继续保持连续绘制状态
        createRulerObject(startPoint, endPoint);
    }
};

export { rulerConfig, isDrawing };