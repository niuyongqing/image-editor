import {Canvas,FabricImage} from 'fabric'
import {ref} from "vue";
import {message} from "ant-design-vue";
const canvas = ref(null);
const fabricImage = ref(null)


export async function createCanvas(el,props) {
    canvas.value = new Canvas(el);
    try {
        // 异步加载图片
        fabricImage.value = await FabricImage.fromURL(props.imgUrl, {
            crossOrigin: 'anonymous',  // 处理跨域问题
        });

        // 获取图片原始宽高
        const imgWidth = fabricImage.value.width;
        const imgHeight = fabricImage.value.height;

        // 计算缩放比例
        const scaleX = props.canvasWidth / imgWidth;
        const scaleY = props.canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);  // 保持比例缩放

        // 设置图片的缩放比例
        fabricImage.value.set({
            scaleX: scale,
            scaleY: scale,
            selectable: false,  // 禁止选择
        });

        // 将图片添加到 canvas
        canvas.value.add(fabricImage.value);
    } catch (error) {
        message.error({
            content: () => '图片加载失败，请检查图片路径是否正确',
            class: 'custom-class',
            style: {
                marginTop: '20vh',
            },
        });
    }
    return canvas;
}

