import { usePsStore } from "~/stores/ps.js";
import { ref } from "vue";
import {Circle} from "fabric";
import {editEliminateApi} from "~/api/ps/eliminate.js";
import {setBackgroundImage} from "~/components/process-pictures/component/painting/painting.js";
import {undo} from "~/components/process-pictures/component/adjust/cropping.js";
import {message} from "ant-design-vue"; // 使用 axios 发送请求

const eraserSize = ref(50); // 橡皮擦大小
let erasePath = []; // 擦除路径
const historyImg = ref([])

export function eliminate() {
    const canvas = usePsStore().FabricCanvas.value;

    let eraserCircle; // 橡皮擦显示
    let isMouseDown = false; // 是否按下鼠标

    canvas.selection = false; // 禁用选择功能
    canvas.defaultCursor = "none"; // 禁用鼠标样式

    // 创建橡皮擦工具
    function createEraser() {
        return new Circle({
            radius: eraserSize.value / 2,
            fill: "rgba(236,125,15,0.3)",
            selectable: false,
            evented: false,
            originX: "center",
            originY: "center",
        });
    }
    const image = canvas.backgroundImage;
    console.log(image)
    // 鼠标按下，开始记录路径
    canvas.on("mouse:down", function (e) {
        isMouseDown = true;
        erasePath = []; // 重置路径
        const pointer = canvas.getPointer(e.e);
        if (!eraserCircle) {
            eraserCircle = createEraser();
            canvas.add(eraserCircle);
        }
        eraserCircle.set({
            left: pointer.x,
            top: pointer.y,
        });

        // todo 擦除偏移
        pointer.x = (pointer.x - 50 ).toFixed(0)
        pointer.y = (pointer.y - 150).toFixed(0)
        erasePath.push(pointer); // 添加初始点
        canvas.renderAll();
    });


    // 鼠标移动，记录路径
    canvas.on("mouse:move", function (e) {
        if (!isMouseDown) return;
        const pointer = canvas.getPointer(e.e);
        eraserCircle.set({
            left: pointer.x,
            top: pointer.y,
        });
        // todo 擦除偏移
        pointer.x = (pointer.x- 50).toFixed(0)
        pointer.y = (pointer.y - 150).toFixed(0)
        erasePath.push(pointer); // 记录路径
        canvas.renderAll();
    });

    // 鼠标抬起，发送路径到后端
    canvas.on("mouse:up", function () {
        if (!isMouseDown) return;
        isMouseDown = false;
        if(erasePath.length > 0){
            sendErasePathToBackend(erasePath); // 调用发送函数
        }
        if (eraserCircle) {
            canvas.remove(eraserCircle);
            eraserCircle = null;
        }
        erasePath = []; // 清空路径
        canvas.renderAll();
    });
}

// 将路径发送到后端
function sendErasePathToBackend(path) {
    historyImg.value.push(usePsStore().Props.value.imgUrl)
    editEliminateApi({paths:path,eraseSize:eraserSize.value,imagePath:decodeURI(usePsStore().Props.value.imgUrl)}).then(async res => {
        if (res.code === 200) {
            console.log(historyImg)
            undo();
            usePsStore().Props.value.imgUrl = res.msg;
            await setBackgroundImage();
            eliminate()
        } else {
            message.error(res.msg);
        }
    })
}

// 更新橡皮擦大小
export function updateEraserSize(size) {
    eraserSize.value = size;
}
