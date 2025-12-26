import { ref, unref } from 'vue';
import { fabric } from 'fabric';

// === 单例状态 (SSOT) ===
const textState = ref({
    isActive: false,
    fontFamily: 'Arial',
    fontSize: 40,
    fill: '#333333',
    textAlign: 'left',
    fontWeight: 'normal',
    fontStyle: 'normal',
    underline: false,
    linethrough: false,
    // --- 新增功能点 ---
    charSpacing: 0,
    lineHeight: 1.16,
    angle: 0,
    textBackgroundColor: '',
    stroke: '#000000',
    strokeWidth: 0,
    shadowColor: '#000000',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0
});

let canvasRef = null;
let saveHistoryFn = null;

export function useCanvasText() {
    
    const initTextModule = (canvas, saveHistory) => {
        canvasRef = canvas;
        saveHistoryFn = saveHistory;
        const c = unref(canvasRef);
        if (!c) return;
        c.on('selection:created', handleSelection);
        c.on('selection:updated', handleSelection);
        c.on('selection:cleared', clearSelection);
    };

    const destroyTextModule = () => {
        const c = unref(canvasRef);
        if (!c) return;
        c.off('selection:created', handleSelection);
        c.off('selection:updated', handleSelection);
        c.off('selection:cleared', clearSelection);
    };

    const addText = (textStr = "双击编辑") => {
        const c = unref(canvasRef);
        if (!c) return;
        const textObj = new fabric.IText(textStr, {
            left: 100, top: 100,
            fontSize: 40,
            fill: '#333333',
            fontFamily: 'Arial',
            customTab: 'text',
            transparentCorners: false,
            cornerColor: '#ffffff',
            cornerStrokeColor: '#1890ff',
            borderColor: '#1890ff',
            cornerSize: 10
        });
        c.add(textObj).setActiveObject(textObj).requestRenderAll();
        if (saveHistoryFn) saveHistoryFn();
    };

    // --- 核心属性更新逻辑 ---
    const updateTextProp = (key, value, shouldSave = true) => {
        const c = unref(canvasRef);
        const activeObj = c?.getActiveObject();
        if (!activeObj || !activeObj.type.includes('text')) return;

        // 1. 处理特殊复合属性：阴影
        if (['shadowColor', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY'].includes(key)) {
            const currentShadow = activeObj.shadow ? { ...activeObj.shadow } : { color: '#000000', blur: 0, offsetX: 0, offsetY: 0 };
            const shadowMap = {
                shadowColor: 'color',
                shadowBlur: 'blur',
                shadowOffsetX: 'offsetX',
                shadowOffsetY: 'offsetY'
            };
            currentShadow[shadowMap[key]] = value;
            activeObj.set('shadow', new fabric.Shadow(currentShadow));
        } 
        // 2. 处理背景色 (空字符串代表透明)
        else if (key === 'textBackgroundColor' && !value) {
            activeObj.set(key, '');
        }
        // 3. 通用属性处理
        else {
            activeObj.set(key, value);
        }

        // 同步 UI 状态
        textState.value[key] = value;
        
        c.requestRenderAll();
        if (shouldSave && saveHistoryFn) saveHistoryFn();
    };

    const handleSelection = (e) => {
        const selected = e.selected?.[0] || unref(canvasRef)?.getActiveObject();
        if (selected && selected.type.includes('text')) {
            textState.value.isActive = true;
            // 批量同步属性
            const props = [
                'fontFamily', 'fontSize', 'fill', 'textAlign', 
                'fontWeight', 'fontStyle', 'underline', 'linethrough',
                'charSpacing', 'lineHeight', 'angle', 'textBackgroundColor',
                'stroke', 'strokeWidth'
            ];
            props.forEach(p => textState.value[p] = selected[p]);

            // 阴影特殊解析
            if (selected.shadow) {
                textState.value.shadowColor = selected.shadow.color;
                textState.value.shadowBlur = selected.shadow.blur;
                textState.value.shadowOffsetX = selected.shadow.offsetX;
                textState.value.shadowOffsetY = selected.shadow.offsetY;
            }
        } else {
            textState.value.isActive = false;
        }
    };

    const clearSelection = () => { textState.value.isActive = false; };

    const toggleStyle = (key) => {
        if (key === 'bold') {
            const isBold = textState.value.fontWeight === 'bold';
            updateTextProp('fontWeight', isBold ? 'normal' : 'bold');
        } else if (key === 'italic') {
            const isItalic = textState.value.fontStyle === 'italic';
            updateTextProp('fontStyle', isItalic ? 'normal' : 'italic');
        } else {
            updateTextProp(key, !textState.value[key]);
        }
    };

    return {
        textState, initTextModule, destroyTextModule,
        addText, updateTextProp, toggleStyle
    };
}