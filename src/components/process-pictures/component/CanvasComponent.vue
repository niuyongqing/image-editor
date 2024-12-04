<template>
 <div>
   <canvas :width="canvasWidth" :height="canvasHeight" id="canvasElement" ref="canvasElement"></canvas>
   <a-button @click="isDrawing = true">开始裁剪</a-button>
   <a-button @click="saveCroppedImage">保存图片</a-button>
 </div>
</template>
<script lang="ts" setup>

import {ref} from 'vue'
import {createCanvas} from './FabricCancas.js'
const canvas = ref(null)
const canvasElement = ref(null);
const selectionRect = ref(null);  // 用于保存用户绘制的矩形
const isDrawing = ref(false); // 是否正在绘制

const props = defineProps({
  canvasWidth:{type:Number, required:true},
  canvasHeight:{type:Number, required:true},
  imgUrl:{type:String,required: true},
})



onMounted(async () => {
  if (canvasElement.value) {
    canvas.value = await createCanvas(canvasElement.value,props)
  }
  
  // 创建canvas对象

  // 监听鼠标事件来绘制矩形
  // canvas.value.on('mouse:down', (event) => {
  //   if (!isDrawing.value) return;
  //   const pointer = canvas.value.getPointer(event.e);
  //   const { x, y } = pointer;
  //
  //   selectionRect.value = new Rect({
  //     left: x,
  //     top: y,
  //     width: 0,
  //     height: 0,
  //     fill: 'rgba(0, 0, 0, 0.2)',
  //     stroke: 'black',
  //     strokeWidth: 2,
  //     selectable: false,
  //   });
  //
  //   canvas.value.add(selectionRect.value);
  // });
  //
  // canvas.value.on('mouse:move', (event) => {
  //   if (!selectionRect.value || !isDrawing.value) return;
  //   const pointer = canvas.value.getPointer(event.e);
  //   const { x, y } = pointer;
  //
  //   // 更新矩形的大小
  //   const width = x - selectionRect.value.left;
  //   const height = y - selectionRect.value.top;
  //
  //   selectionRect.value.set({ width, height });
  //   canvas.value.renderAll();
  // });
  //
  // canvas.value.on('mouse:up', () => {
  //   isDrawing.value = false; // 停止绘制矩形
  // });
  //
  // // 开始绘制矩形
  // // 暴露绘制和保存功能
  // window.startDrawing = () => {
  //   isDrawing.value = true;
  // };
  // window.saveCroppedImage = saveCroppedImage;
  // EventBus.emit("scale",canvas);
});

// 保存裁剪图像
function saveCroppedImage(){
  if (!selectionRect.value) return;

  // 获取矩形区域的坐标
  const { left, top, width, height } = selectionRect.value;

  // 创建一个新的 canvas 元素，用于裁剪区域
  const croppedCanvas = document.createElement('canvas');
  const ctx = croppedCanvas.getContext('2d');

  // 设置裁剪区域的 canvas 尺寸
  croppedCanvas.width = width;
  croppedCanvas.height = height;

  // 获取原始 canvas 的图像数据
  const originalCanvas = canvas.value.getElement();

  // 将裁剪区域绘制到新 canvas 上
  ctx.drawImage(originalCanvas, left, top, width, height, 0, 0, width, height);

  // 将裁剪后的图像作为 Data URL 保存
  const croppedDataUrl = croppedCanvas.toDataURL();
  console.log('裁剪后的图片数据：', croppedDataUrl);

  // 你可以将裁剪后的图像显示在页面中
  const img = new Image();
  img.src = croppedDataUrl;
  document.body.appendChild(img);  // 将裁剪后的图像显示在页面上

  // 完成裁剪后，移除蒙层
  canvas.value.remove(selectionRect.value);


  // 如果需要让裁剪框可以手动调整大小，可以重新创建一个新的可调整矩形
  enableResizingAndDragging();
  selectionRect.value = null;
}

// 允许手动调整裁剪框
const enableResizingAndDragging = () => {
  const { left, top, width, height } = selectionRect.value;
  const newSelectionRect = new Rect({
    left: left,           // 设置裁剪框的左上角位置
    top: top,             // 设置裁剪框的左上角位置
    width: width,         // 设置裁剪框的宽度
    height: height,       // 设置裁剪框的高度
    fill: 'rgba(0, 0, 0, 0)',  // 设置填充颜色（半透明背景）
    stroke: 'linear-gradient(45deg, red, yellow)', // 渐变边框
    strokeWidth: 1,       // 设置边框宽度
    cornerSize: 15,       // 增大角点的尺寸
    transparentCorners: false, // 设置角点为不透明
    cornerStyle: 'circle', // 使用圆形角点
    hasControls: true,    // 启用调整大小
    lockScalingFlip: false, // 防止翻转
    shadow: new Shadow({
      color: 'rgba(0, 0, 0, 0.5)',  // 阴影颜色
      blur: 10,                    // 阴影模糊程度
      offsetX: 5,                  // 阴影偏移X
      offsetY: 5,                  // 阴影偏移Y
    }),
  });

  // 将裁剪框添加到画布中
  canvas.value.add(newSelectionRect);

  // 监听框的移动事件
  newSelectionRect.on('moving', (e) => {
    if (e.target) {
      console.log('裁剪框位置:', e.target.left, e.target.top);
    }
  });

  // 监听框的缩放事件
  newSelectionRect.on('scaling', (e) => {
    if (e.target) {
      console.log('裁剪框尺寸:', e.target.width, e.target.height);
    }
  });

  // 允许框的边框调整样式
  newSelectionRect.set({
    hasControls: true,    // 启用控制点
    lockScalingFlip: false, // 启用大小调整
    cornerSize: 12,       // 调整角点的大小
    transparentCorners: false, // 角点不透明
    hasBorders: true      // 显示边框
  });
};

function save() {
  const imageSrc = canvas.value.toDataURL();
  const a = document.createElement('a');
  a.href = imageSrc;
  a.download = 'image.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
</script>



<style scoped lang="less">
#canvasElement {
  border: 1px solid #f30606;
  border-radius: 10px;
}
</style>