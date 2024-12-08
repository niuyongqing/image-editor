import {usePsStore} from "~/stores/ps.js";
import setting from "~/config/default-setting.js"
import {ref} from 'vue'
import {Rect} from "fabric";
const selectionRect = ref(null);  // 用于保存用户绘制的矩形
// 自由比例裁剪
const isDrawing = ref(false);
const xRef = ref(0);
const yRef = ref(0);
const widthRef = ref(0);
const heightRef = ref(0);

// 开始裁剪
export function Cropping() {
  undo();
  isDrawing.value = true;
  const canvas = usePsStore().FabricCanvas.value;

  // 监听鼠标事件来绘制矩形
  canvas.on('mouse:down', (event) => {
    if (!isDrawing.value) return;
    const pointer = canvas.getPointer(event.e);
    const { x, y } = pointer;

    // 记录裁剪框的初始位置
    xRef.value = x;
    yRef.value = y;

    // 初始化矩形
    setRect();
    // 添加矩形到画布
    canvas.add(selectionRect.value);
  });

  // 监听鼠标移动事件
  canvas.on('mouse:move', (event) => {
    if (!selectionRect.value || !isDrawing.value) return;
    const pointer = canvas.getPointer(event.e);
    const { x, y } = pointer;

    // 更新矩形的宽高
    const width = x - xRef.value;  // 动态计算宽度
    const height = y - yRef.value; // 动态计算高度
    widthRef.value = width;
    heightRef.value = height;

    // 更新矩形尺寸
    selectionRect.value.set({ width, height });
    canvas.renderAll();  // 强制重新渲染
  });

  // 鼠标抬起事件
  canvas.on('mouse:up', () => {
    isDrawing.value = false;
  });

  // 监听对象调整大小事件
  canvas.on('object:scaling', (event) => {
    calculateWidthAndHeight(event,canvas);
  });

  // 监听对象修改事件（包括移动或缩放完成）
  canvas.on('object:modified', (event) => {
    calculateWidthAndHeight(event,canvas);
  });

  return this;
}


export { xRef,yRef }


// 计算截屏调整后的宽高
function calculateWidthAndHeight(event,canvas) {
  const obj = event.target;
  const { left, top,  width, height, scaleX, scaleY } = obj;
  const realWidth = width * scaleX;
  const realHeight = height * scaleY;
  xRef.value = left;
  yRef.value = top;
  widthRef.value = realWidth;
  heightRef.value = realHeight;
  canvas.renderAll();
}

/**
 * 手动更新X轴
 * @param newX
 */
export function updateRectanglePositionX(newX) {
  const canvas = usePsStore().FabricCanvas.value;
  xRef.value = newX;
  if (selectionRect.value) {
    selectionRect.value.set({
      left: xRef.value,
    });
    canvas.renderAll();
  }
}

/**
 * 手动更新Y轴
 * @param newY
 */
export function updateRectanglePositionY(newY) {
  const canvas = usePsStore().FabricCanvas.value;
  yRef.value = newY;
  // 更新矩形的左上角位置
  if (selectionRect.value) {
    selectionRect.value.set({
      top: yRef.value
    });
    canvas.renderAll();
  }
}



/**
 * 清空画布的所有裁剪信息，还原到最原始的画布
 */
export function undo() {
    const canvas = usePsStore().FabricCanvas.value;
    canvas.getObjects().slice().forEach((obj) => canvas.remove(obj));
    xRef.value = 0
    yRef.value = 0
    widthRef.value = 0
    heightRef.value = 0
    const backgroundImage = canvas.backgroundImage;
    backgroundImage.set({
      angle: 0,
      flipX: false,  // 恢复水平翻转
      flipY: false   // 恢复垂直翻转
    });
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.renderAll();
}

function setRect(){
  selectionRect.value = new Rect({
    left: xRef.value,
    top: yRef.value,
    width: widthRef.value,
    height: heightRef.value,
    fill: 'rgba(0, 0, 0, 0)', // 透明填充
    stroke: setting.colorPrimary, // 设置主颜色
    strokeWidth: 2, // 边框宽度
    selectable: true, // 允许选择
    cornerStyle: 'circle', // 控制点样式为圆形，便于进一步调整
    cornerSize: 10, // 设置较大控制点大小以模拟长圆筒形状
    transparentCorners: false, // 不透明的控制点
    hasControls: true, // 启用控制点
    lockRotation: false, // 锁定旋转
    objectCaching: false, // 优化性能，禁用缓存
    borderColor: setting.colorPrimary, // 边框颜色
    cornerColor: setting.colorPrimary, // 控制点颜色
    cornerStrokeColor: 'white', // 控制点边框颜色
    cornerStrokeWidth: 10, // 控制点边框宽度
    isCropRect:true
  });
}

// 保存裁剪图像
export function saveCroppedImage(){
  if(xRef.value === 0 && yRef.value === 0) {
    isDrawing.value = true;
    calculateTheCuttingPosition(1);
  }
  if (!selectionRect.value) return;
  const croppedCanvas = document.createElement('canvas');
  const ctx = croppedCanvas.getContext('2d');
  croppedCanvas.width = widthRef.value;
  croppedCanvas.height = heightRef.value;
  const originalCanvas = usePsStore().FabricCanvas.value.getElement();
  ctx.drawImage(originalCanvas,xRef.value + 5, yRef.value + 5,  widthRef.value - 10, heightRef.value - 10, 0, 0, widthRef.value - 10, heightRef.value - 10);
  const croppedDataUrl = croppedCanvas.toDataURL();
  undo()
  console.log('裁剪后的图片数据：', croppedDataUrl);
}

// 比例裁剪
export function toRatio(x,y) {
  isDrawing.value = true;
  const canvas = usePsStore().FabricCanvas.value;
  undo();
  const backgroundImage = canvas.backgroundImage;
  if (backgroundImage) {
    const aspectRatio = x / y; // 3:2比例
    calculateTheCuttingPosition(aspectRatio);
    canvas.on('object:scaling', (event) => {
      calculateWidthAndHeight(event, canvas);
    });
    canvas.on('object:modified', (event) => {
      calculateWidthAndHeight(event, canvas);
    });
  }
  return this;
}

// 计算裁剪位置
function calculateTheCuttingPosition(aspectRatio){
  const canvas = usePsStore().FabricCanvas.value;
  const backgroundImage = canvas.backgroundImage;
  const scaleX = backgroundImage.scaleX;
  const scaleY = backgroundImage.scaleY;
  const imgWidth = backgroundImage.width * scaleX;
  const imgHeight = backgroundImage.height * scaleY;
  let cropWidth, cropHeight;
  if (imgWidth / imgHeight > aspectRatio) {
    cropHeight = imgHeight;
    cropWidth = cropHeight * aspectRatio;
  } else {
    cropWidth = imgWidth;
    cropHeight = cropWidth / aspectRatio;
  }
  const canvasCenterX = canvas.width / 2;
  const canvasCenterY = canvas.height / 2;
  widthRef.value = cropWidth;
  heightRef.value = cropHeight;
  xRef.value = canvasCenterX - cropWidth / 2;
  yRef.value = canvasCenterY - cropHeight / 2;
  setRect();
  canvas.add(selectionRect.value);
}


// 旋转
export function rotate(degree) {
  const canvas = usePsStore().FabricCanvas.value;
  const backgroundImage = canvas.backgroundImage;
  if (!backgroundImage) {
    return;
  }
  let currentAngle = backgroundImage.angle || 0;
  currentAngle += degree;
  backgroundImage.set({
    angle: currentAngle
  });
  canvas.renderAll();
  return this;
}

// 翻转
export function flipImage(direction) {
  const canvas = usePsStore().FabricCanvas.value;
  const backgroundImage = canvas.backgroundImage;
  if (!backgroundImage) {
    console.error('背景图像无效或未加载');
    return;
  }
  if (direction === 'horizontal') {
    backgroundImage.set({ flipX: !backgroundImage.flipX });
  } else if (direction === 'vertical') {
    backgroundImage.set({ flipY: !backgroundImage.flipY });
  }
  canvas.renderAll();
  return this;
}