import { ref, onMounted, onUnmounted, watch } from 'vue';
import { fabric } from 'fabric';
import { useCanvas } from '@/composables/useCanvas';
import { useEditorState } from '@/composables/useEditorState';
import { aiApi } from '@/api/ai';
import { Toast } from '@/utils/toast';

export function useCanvasInpaint() {
    const { canvas, toggleDrawing, exportMask, replaceActiveImage } = useCanvas();
    const { setLoading } = useEditorState();

    // 状态
    const brushSize = ref(30);
    const drawMode = ref('brush'); // 'brush' | 'rect'

    // 内部变量：用于记录框选过程
    let isDragging = false;
    let startPoint = null;
    let activeRect = null;

    // === 1. 画笔模式逻辑 ===
    const enableBrush = () => {
        if (!canvas.value) return;
        toggleDrawing(true);
        canvas.value.freeDrawingBrush.color = 'rgba(255, 0, 0, 0.5)';
        canvas.value.freeDrawingBrush.width = brushSize.value;
        canvas.value.defaultCursor = 'crosshair';
    };

    // === 2. 框选模式逻辑 (手动实现) ===
    const onMouseDown = (opt) => {
        if (drawMode.value !== 'rect') return;

        const pointer = canvas.value.getPointer(opt.e);
        isDragging = true;
        startPoint = { x: pointer.x, y: pointer.y };

        // 创建一个新的矩形
        activeRect = new fabric.Rect({
            left: startPoint.x,
            top: startPoint.y,
            width: 0,
            height: 0,
            fill: 'rgba(255, 0, 0, 0.5)', // 红色半透明
            stroke: 'transparent',
            selectable: false, // 禁止用户选中拖拽它
            evented: false,
            id: 'inpaint-rect',
            isMaskObject: true // 🔥 关键标记：告诉 exportMask 这是遮罩
        });

        canvas.value.add(activeRect);
    };

    const onMouseMove = (opt) => {
        if (!isDragging || !activeRect) return;
        const pointer = canvas.value.getPointer(opt.e);

        // 计算新的宽和高
        let w = Math.abs(pointer.x - startPoint.x);
        let h = Math.abs(pointer.y - startPoint.y);

        // 处理反向拖拽
        if (pointer.x < startPoint.x) activeRect.set({ left: pointer.x });
        if (pointer.y < startPoint.y) activeRect.set({ top: pointer.y });

        activeRect.set({ width: w, height: h });
        canvas.value.requestRenderAll();
    };

    const onMouseUp = () => {
        if (drawMode.value !== 'rect') return;
        isDragging = false;
        activeRect = null;
    };

    const enableRect = () => {
        if (!canvas.value) return;
        toggleDrawing(false); // 关闭 Fabric 自带画笔
        canvas.value.defaultCursor = 'crosshair'; // 十字光标
        canvas.value.selection = false; // 关闭原生框选多选功能
    };

    // === 3. 模式切换控制器 ===
    watch([drawMode, brushSize], () => {
        if (!canvas.value) return;

        // 解绑旧事件（防止重复）
        canvas.value.off('mouse:down', onMouseDown);
        canvas.value.off('mouse:move', onMouseMove);
        canvas.value.off('mouse:up', onMouseUp);

        if (drawMode.value === 'brush') {
            canvas.value.selection = true; // 恢复默认
            enableBrush();
        } else {
            enableRect();
            // 绑定新事件
            canvas.value.on('mouse:down', onMouseDown);
            canvas.value.on('mouse:move', onMouseMove);
            canvas.value.on('mouse:up', onMouseUp);
        }
    }, { immediate: true });

    // === 4. 执行消除 (Handle Inpaint) ===
    const handleInpaint = async () => {
        // 检查是否有内容 (Path 或 标记为 Mask 的 Rect)
        const hasContent = canvas.value.getObjects().some(o => o.type === 'path' || o.isMaskObject);
        if (!hasContent) {
            toast('请先涂抹或框选消除区域');
            return;
        }

        try {
            setLoading(true, 'AI 正在智能消除...');
            const activeObj = canvas.value.getObjects().find(o => o.type === 'image'); // 简单寻找底图
            if (!activeObj) throw new Error('未找到底图');

            const maskBase64 = exportMask();
            const resultUrl = await aiApi.inpaint(activeObj.getSrc(), maskBase64);

            if (resultUrl) {
                replaceActiveImage(resultUrl);
                toast('消除成功');
            }

            // 清理所有遮罩对象 (Path 和 Rect)
            const objects = canvas.value.getObjects();
            objects.forEach(obj => {
                if (obj.type === 'path' || obj.isMaskObject) {
                    canvas.value.remove(obj);
                }
            });
            canvas.value.requestRenderAll();

        } catch (error) {
            console.error(error);
            toast('消除失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 生命周期
    onMounted(() => {
        // 默认触发一次 brush 模式
        drawMode.value = 'brush';
    });

    onUnmounted(() => {
        toggleDrawing(false);
        if (canvas.value) {
            canvas.value.defaultCursor = 'default';
            canvas.value.selection = true;
            canvas.value.off('mouse:down', onMouseDown);
            canvas.value.off('mouse:move', onMouseMove);
            canvas.value.off('mouse:up', onMouseUp);
            // 清理残留
            const objects = canvas.value.getObjects();
            objects.forEach(obj => {
                if (obj.type === 'path' || obj.isMaskObject) canvas.value.remove(obj);
            });
        }
    });

    return {
        brushSize,
        drawMode,
        handleInpaint
    };
}