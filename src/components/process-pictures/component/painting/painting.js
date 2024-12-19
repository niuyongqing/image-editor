import {message} from "ant-design-vue";
import {usePsStore} from "~/stores/ps.js";
import {Canvas, FabricImage} from "fabric";


export async function createCanvas(el) {
    const psStore = usePsStore();
    psStore.FabricCanvas.value = new Canvas(el, {
        width: psStore.Props.value.canvasWidth,
        height: psStore.Props.value.canvasHeight,
    });
    await setBackgroundImage()
}

export async function setBackgroundImage(){
    const psStore = usePsStore();
    try {
        psStore.FabricImage.value = await FabricImage.fromURL(psStore.Props.value.imgUrl, {
            crossOrigin: "anonymous",
        });
        const imgWidth = psStore.FabricImage.value.width;
        const imgHeight = psStore.FabricImage.value.height;
        const scaleX = psStore.Props.value.canvasWidth / imgWidth;
        const scaleY = psStore.Props.value.canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY) * 0.9; // 保持比例缩放,放大尺寸，需要按照比例时将scaleX、scaleY设置为scale
        psStore.FabricImage.value.set({
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            objectCaching: false,
            originX: "center",
            originY: "center",
            left: psStore.Props.value.canvasWidth  / 2,
            top: psStore.Props.value.canvasHeight / 2,
        });
        psStore.FabricCanvas.value.backgroundImage = psStore.FabricImage.value
        usePsStore().FabricCanvas.value.renderAll();
    } catch (error) {
        message.error({
            content: () => "图片加载失败，请检查图片路径是否正确",
            class: "custom-class",
            style: {
                marginTop: "20vh",
            },
        });
    }

}