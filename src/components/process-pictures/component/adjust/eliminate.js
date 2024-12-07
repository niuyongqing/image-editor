import {usePsStore} from "~/stores/ps.js";
import {Circle} from "fabric";
import {ref} from 'vue'

const eraserSize = ref(50)
const eraser = ref(null)

// 开始擦除
export function eliminate(){
    const canvas = usePsStore().FabricCanvas.value;

    // 开启擦除模式
    let isErasing = false;

    // 创建橡皮擦工具
    eraser.value = new Circle({
        radius: eraserSize.value / 2,
        fill: 'rgba(236,125,15,0.49)',
        selectable: false,
        evented: false
    });

    // 开启擦除模式
    canvas.on('mouse:down', function(e) {
        if (isErasing) {
            // 获取鼠标位置并显示橡皮擦
            const pointer = canvas.getPointer(e.e);
            eraser.value.set({
                left: pointer.x - eraserSize.value / 2,
                top: pointer.y - eraserSize.value / 2
            });
            canvas.add(eraser.value);
        }
    });

    // 在鼠标拖动时擦除
    canvas.on('mouse:move', function(e) {
        if (isErasing && e.pointer) {
            const pointer = canvas.getPointer(e.e);
            eraser.value.set({
                left: pointer.x - eraserSize.value / 2,
                top: pointer.y - eraserSize.value / 2
            });

            // 使用透明覆盖模拟擦除效果
            const objects = canvas.getObjects();
            objects.forEach(function(obj) {
                if (obj !== eraser.value && obj.intersectsWithObject(eraser.value)) {
                    // 获取擦除区域的颜色并填充
                    const x = pointer.x;
                    const y = pointer.y;
                    const surroundingColor = getColorAt(x, y);
                    // 填充擦除区域
                    obj.set('fill', surroundingColor);  // 改变对象的填充颜色
                }
            });

            canvas.renderAll();
        }
    });
    canvas.on('mouse:up', function() {
        if (isErasing) {
            canvas.remove(eraser.value);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'e') {
            isErasing = !isErasing;
            if (isErasing) {
                console.log('Eraser enabled');
            } else {
                console.log('Eraser disabled');
            }
        }
    });
}

// 获取指定位置的颜色（周围的颜色）
function getColorAt(x, y) {
    const canvas = usePsStore().FabricCanvas.value;
    const pixels = canvas.contextContainer.getImageData(x, y, 1, 1).data;
    return `rgb(${pixels[0]}, ${pixels[1]}, ${pixels[2]})`;
}

// 更新橡皮擦大小
function updateEraserSize(size) {
    eraserSize.value = size;
    eraser.value.set({ radius: eraserSize.value / 2 });
}