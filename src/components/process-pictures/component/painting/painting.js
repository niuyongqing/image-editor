import {message} from "ant-design-vue";
import {usePsStore} from "~/stores/ps.js";
import {Canvas, FabricImage,Line,FabricText} from "fabric";


export async function createCanvas(el,props) {
    const psStore = usePsStore();
    psStore.FabricCanvas.value = new Canvas(el, {
        width: props.canvasWidth, // 初始化画布宽度
        height: props.canvasHeight, // 初始化画布高度
    });

    try {
        // 异步加载图片
        psStore.FabricImage.value = await FabricImage.fromURL(props.imgUrl, {
            crossOrigin: "anonymous", // 处理跨域问题
        });

        // 获取图片原始宽高
        const imgWidth = psStore.FabricImage.value.width;
        const imgHeight = psStore.FabricImage.value.height;

        // 计算缩放比例
        const scaleX = props.canvasWidth / imgWidth;
        const scaleY = props.canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY); // 保持比例缩放

        // 设置图片的缩放比例和居中
        psStore.FabricImage.value.set({
            scaleX: scale,
            scaleY: scale,
            selectable: false, // 禁止选择
            objectCaching: false, // 禁用缓存，提升缩放性能
            originX: "center", // 设置图片原点为中心
            originY: "center",
            left: props.canvasWidth / 2,
            top: props.canvasHeight / 2,
        });

        // 设置底图
        psStore.FabricCanvas.value.backgroundImage = psStore.FabricImage.value

        // psStore.FabricCanvas.value.add(psStore.FabricImage.value);
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

