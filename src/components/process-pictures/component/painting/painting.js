import {message} from "ant-design-vue";
import {usePsStore} from "~/stores/ps.js";
import {Canvas, FabricImage} from "fabric";

export async function createCanvas(el,props) {
    usePsStore().FabricCanvas.value = new Canvas(el);
    try {
        // 异步加载图片
        usePsStore().FabricImage.value = await FabricImage.fromURL(props.imgUrl, {
            crossOrigin: 'anonymous',  // 处理跨域问题
        });
    } catch (error) {
        message.error({
            content: () => '图片加载失败，请检查图片路径是否正确',
            class: 'custom-class',
            style: {
                marginTop: '20vh',
            },
        });
    }
    // 获取图片原始宽高
    const imgWidth = usePsStore().FabricImage.value.width;
    const imgHeight = usePsStore().FabricImage.value.height;

    // 计算缩放比例
    const scaleX = props.canvasWidth / imgWidth;
    const scaleY = props.canvasHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY);  // 保持比例缩放

    // 设置图片的缩放比例
    usePsStore().FabricImage.value.set({
        scaleX: scale,
        scaleY: scale,
        selectable: false,  // 禁止选择
        objectCaching: false, // 禁用缓存，提升缩放时性能
    });

    // 将图片添加到 canvas
    usePsStore().FabricCanvas.value.add(usePsStore().FabricImage.value);

}

