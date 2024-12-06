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
export function FreeProportion() {
  usePsStore().FabricCanvas.value.remove(selectionRect.value);
  xRef.value = 0
  yRef.value = 0
  widthRef.value = 0
  heightRef.value = 0
  isDrawing.value = true;
  const canvas = usePsStore().FabricCanvas.value;
  // 监听鼠标事件来绘制矩形
  canvas.on('mouse:down', (event) => {
    if (!isDrawing.value) return;
    const pointer = canvas.getPointer(event.e);
    const { x, y } = pointer;
    xRef.value = x;
    yRef.value = y;
    selectionRect.value = new Rect({
      left: x,
      top: y,
      width: 0,
      height: 0,
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
      cornerStrokeWidth: 3, // 控制点边框宽度
    });
    // 添加矩形到画布
    canvas.add(selectionRect.value);
  });

  // 监听鼠标移动事件
  canvas.on('mouse:move', (event) => {
    if (!selectionRect.value || !isDrawing.value) return;
    const pointer = canvas.getPointer(event.e);
    const { x, y } = pointer;

    // 更新宽高
    const width = x - selectionRect.value.left;
    const height = y - selectionRect.value.top;
    xRef.value = x;
    yRef.value = y;
    widthRef.value = width;
    heightRef.value = height;
    // 设置矩形宽高
    selectionRect.value.set({ width, height });
    canvas.renderAll();
  });

  // 鼠标抬起事件
  canvas.on('mouse:up', () => {
    isDrawing.value = false;
  });

  // 监听对象调整大小事件
  canvas.on('object:scaling', (event) => {
    calculateWidthAndHeight(event,canvas)
  });

  // 监听对象修改事件（包括移动或缩放完成）
  canvas.on('object:modified', (event) => {
    calculateWidthAndHeight(event,canvas)
  });
  return this;
}



export { xRef,yRef }

// 动态更新蒙层
function updateMask(canvas) {
  // 获取画布宽高
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // 清除现有蒙层（如果存在）
  const existingOverlay = canvas.getObjects().find(obj => obj.overlay);
  if (existingOverlay) {
    canvas.remove(existingOverlay);
  }

  // 创建新的蒙层
  const overlay = new Rect({
    left: 0,
    top: 0,
    width: canvasWidth,
    height: canvasHeight,
    fill: 'rgba(0, 0, 0, 0.5)', // 半透明黑色
    selectable: false,
    overlay: true, // 标记这个对象是蒙层
  });

  // 添加蒙层到画布
  canvas.add(overlay);

  // 创建裁剪框的透明区域
  const cropBox = new Rect({
    left: xRef.value,
    top: yRef.value,
    width: widthRef.value,
    height: heightRef.value,
    fill: 'transparent', // 裁剪框是透明的
    selectable: false,
    evented: false, // 禁止事件响应
  });



  // 创建一个裁剪区域并应用到蒙层上
  overlay.clipTo = function (ctx) {
    cropBox.render(ctx); // 通过裁剪框裁剪蒙层
  };


  // 添加裁剪框的透明区域
  canvas.add(cropBox);
  // 刷新画布
  canvas.renderAll();
}



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

// 保存裁剪图像
export function saveCroppedImage(){
  if(xRef.value === 0 && yRef.value === 0) {
    return false;
  }
  if (!selectionRect.value) return;
  const croppedCanvas = document.createElement('canvas');
  const ctx = croppedCanvas.getContext('2d');
  croppedCanvas.width = widthRef.value;
  croppedCanvas.height = heightRef.value;
  const originalCanvas = usePsStore().FabricCanvas.value.getElement();
  ctx.drawImage(originalCanvas,xRef.value + 5, yRef.value + 5,  widthRef.value - 10, heightRef.value - 10, 0, 0, widthRef.value - 10, heightRef.value - 10);
  const croppedDataUrl = croppedCanvas.toDataURL();
  selectionRect.value = null;
  console.log('裁剪后的图片数据：', croppedDataUrl);
  usePsStore().FabricCanvas.value.remove(selectionRect.value);
}

/**
 * 回滚裁剪
 */
export function undo() {
    const canvas = usePsStore().FabricCanvas.value;
      if (selectionRect.value) {
        canvas.remove(selectionRect.value);
      }
    xRef.value = 0
    yRef.value = 0
    // 更新画布
    canvas.renderAll();
}


// 1比1裁剪
export function to1and1(){
  const canvas = usePsStore().FabricCanvas.value;
  new FreeProportion()
  selectionRect.value.set({ width: 100, height: 100 });
  canvas.renderAll();

}