import {message} from "ant-design-vue";
import {usePsStore} from "~/stores/ps.js";
import {Canvas, FabricImage} from "fabric";


export async function createCanvas(el,props) {
    const psStore = usePsStore();
    psStore.FabricCanvas.value = new Canvas(el, {
        width: props.canvasWidth,
        height: props.canvasHeight,
    });

    try {
        psStore.FabricImage.value = await FabricImage.fromURL(props.imgUrl, {
            crossOrigin: "anonymous",
        });
        const imgWidth = psStore.FabricImage.value.width;
        const imgHeight = psStore.FabricImage.value.height;
        const scaleX = props.canvasWidth / imgWidth;
        const scaleY = props.canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY) * 0.9; // 保持比例缩放,放大尺寸，需要按照比例时将scaleX、scaleY设置为scale
        psStore.FabricImage.value.set({
            scaleX: 1,
            scaleY: 1,
            selectable: false,
            objectCaching: false,
            originX: "center",
            originY: "center",
            left: props.canvasWidth  / 2,
            top: props.canvasHeight / 2,
        });
        psStore.FabricCanvas.value.backgroundImage = psStore.FabricImage.value
    } catch (error) {
        console.log(error)
        message.error({
            content: () => "图片加载失败，请检查图片路径是否正确",
            class: "custom-class",
            style: {
                marginTop: "20vh",
            },
        });
    }

    usePsStore().FabricCanvas.value.renderAll();
}

