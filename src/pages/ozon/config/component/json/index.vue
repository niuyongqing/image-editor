<!-- 移动端详情编辑器 -->
<template>
  <div class="mobile-detail-editor">
    <!-- 外显的部分 -->
    <div class="preview">
      <div class="wrap">
        <div v-for="(item, i) in moduleList" :key="i">
          <div v-if="item.type === 'text'">
            <div v-for="(text, i2) in item.texts" :key="i2">
              <!-- 类型(class)分为 title 和 body, 但没有区别, 只是编辑时设置的默认样式不一样 -->
              <div
                :style="{ 'font-size': text.style.fontSize + 'px', 'font-weight': text.style.fontWeight, 'text-align': text.style.align, color: text.style.color }"
                :innerText="text.content"></div>
            </div>
          </div>
          <div v-else-if="item.type === 'image'">
            <div v-for="(image, i2) in item.images" :key="i2">
              <!-- 固定尺寸, 撑满 -->
              <img :src="image.url" width="100%" :class="image.style.hasMargin ? 'mb-2' : ''" />
            </div>
          </div>
          <div v-else-if="item.type === 'text-image'">图文</div>
          <div v-else>暂不支持该类型: {{ item.type }}</div>
        </div>
      </div>
      <div class="mask">
        <a-button type="primary" size="large" class="mt-60 mb-4 w30" @click="show = true">编辑</a-button>
        <br />
        <a-button size="large" class="w-30" @click="clear">清空</a-button>
      </div>
    </div>

    <!-- 编辑器部分 -->
    <div v-if="show" class="editor">
      <div class="header">
        <div></div>
        <div>富内容编辑</div>
        <a-space>
          <a-button type="link">批量设置图片尺寸</a-button>
          <a-button @click="show = false">关闭</a-button>
          <a-button type="primary" @click="show = false">保存</a-button>
        </a-space>
      </div>
      <!-- 版心 -->
      <div class="main">
        <!-- 左侧 -->
        <div class="left">
          <div class="font-bold mb-2">添加模块</div>
          <div class="module">
            <div v-for="item in modules" :key="item.name" :data-name="item.name" class="module-item" draggable="true"
              @dragstart="handleDragStart($event, item)" @dragend="dragends">
              <div :class="['module-item-icon', item.name]"></div>
              <div>
                <div>{{ item.text }}</div>
              </div>
            </div>
          </div>
          <div class="font-bold mb-2">使用中的模块</div>
          <a-empty v-if="moduleList.length === 0" :image="simpleImage" />
          <Draggable v-else class="active-module" :list="moduleList" item-key="id" group="left" animation="200">
            <template #item="{ element: item }">
              <div v-if="item.type != 'tip'" :class="['active-module-item', activeId === item.id && 'active-bar']"
                @click="turnActive(item.id)">
                <div>
                  <HolderOutlined class="mx-2" />
                  <span>{{ TEXT_ENUM[item.type] }}</span>
                </div>
                <div class="optionBtn">
                  <a-space class="text-xl">
                    <a-button type="text" title="上移" :disabled="moduleList.length === 0" @click="moduleUp">
                      <ArrowUpOutlined />
                    </a-button>
                    <a-button type="text" title="下移" :disabled="activeModuleIndex === moduleList.length - 1"
                      @click="moduleDown">
                      <ArrowDownOutlined />
                    </a-button>
                    <a-button type="text" title="复制" @click="moduleCopy">
                      <CopyOutlined />
                    </a-button>
                    <a-button type="text" title="删除" @click="moduleDel">
                      <DeleteOutlined />
                    </a-button>
                  </a-space>
                </div>
              </div>
            </template>
          </Draggable>
        </div>

        <!-- 中间内容 -->
        <div :class="['content', false && 'pointer-events-none']" @dragleave="dragleaves" @drop="handleDrop"
          @dragover.prevent>
          <div v-for="(item, i) in moduleList" :key="i" @click="e => selectModule(i, item.id)">
            <div v-if="item.type != 'tip'" :class="['content-module-item', activeId === item.id && 'active']">
              <div v-if="item.type === 'text'" class="textModule">
                <a-textarea v-model:value="item.title.content" placeholder="点击输入标题" :style="item.title.tstyles"
                  class="titleAreas" :auto-size="{ minRows: 1, maxRows: 3 }" />
                <a-textarea v-model:value="item.text.content" :style="item.text.cStyles" placeholder="点击输入内容"
                  class="areas" :auto-size="{ minRows: 1 }" />
              </div>
              <div v-else-if="item.type === 'image'">
                <div class="imageModule" v-if="!item.img.src">
                  <PictureOutlined :style="{ fontSize: '60px', color: '#a0a3a6' }" />
                  <span>文件格式为 JPEG、JPG、PNG，大小不能超过10MB</span>
                </div>
                <img v-else :src="item.img.src" alt="">
              </div>
              <div v-else-if="item.type === 'text-image'" class="textImageModule">
                <template v-if="item.imgText.dataType != 'chess'">
                  <div :class="getClassName(item.imgText.dataType)">
                    <div class="item" v-for="(imgItem, index) in item.imgText.dataList" :key="index">
                      <div class="top">
                        <div v-if="!imgItem.src" class="tip">
                          <PictureOutlined :style="{ fontSize: '60px', color: '#a0a3a6' }" />
                          <span style="color: #a0a3a6">文件格式为 JPEG、JPG、PNG，大小不能超过10MB</span>
                        </div>
                        <img v-if="imgItem.src" :src="imgItem.src" alt="">
                      </div>
                      <div class="textareas">
                        <a-textarea v-model:value="item.title.content" placeholder="点击输入标题" :style="item.title.tstyles"
                          class="titleAreas" :auto-size="{ minRows: 1, maxRows: 3 }" />
                        <a-textarea v-model:value="item.text.content" :style="item.text.cStyles" placeholder="点击输入内容"
                          class="areas" :auto-size="{ minRows: 1 }" />
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="chessList">
                    <div class="item" v-for="(imgItem, index) in item.imgText.dataList" :key="index">
                      <div class="top">
                        <div v-if="!imgItem.src" class="tip">
                          <PictureOutlined :style="{ fontSize: '60px', color: '#a0a3a6' }" />
                          <span style="color: #a0a3a6">文件格式为 JPEG、JPG、PNG，大小不能超过10MB</span>
                        </div>
                        <img v-if="imgItem.src" :src="imgItem.src" alt="">
                      </div>
                      <div class="textareas">
                        <a-textarea v-model:value="item.title.content" placeholder="点击输入标题" :style="item.title.tstyles"
                          class="titleAreas" :auto-size="{ minRows: 1, maxRows: 3 }" />
                        <a-textarea v-model:value="item.text.content" :style="item.text.cStyles" placeholder="点击输入内容"
                          class="areas" :auto-size="{ minRows: 1 }" />
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <!-- 提示模块 -->
            <div v-if="item.type === 'tip' && item.show" class="placement-area">{{ item.tip }}</div>
          </div>
        </div>

        <!-- 右侧详情 -->
        <div class="right-panel" v-if="activeComponent">
          <a-form class="rightForm" :model="formState">
            <template v-if="activeComponent.type === 'text'">
              <h2>标题</h2>
              <a-form-item label="文字大小:">
                <a-select v-model:value="activeComponent.styles.fontSize" :options="sizeOption"></a-select>
              </a-form-item>
              <a-form-item label="文字颜色:">
                <!-- <color-picker v-model:value="activeComponent.styles.color" /> -->
              </a-form-item>
              <a-form-item label="对齐方式" style="border-bottom: 1px dotted #ccc;padding-bottom: 20px;">
                <a-radio-group v-model:value="activeComponent.styles.textAlign">
                  <a-radio-button value="left">左对齐</a-radio-button>
                  <a-radio-button value="center">居中</a-radio-button>
                  <a-radio-button value="right">右对齐</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <h2>内容文本</h2>
              <a-form-item label="文字大小:">
                <a-select v-model:value="activeComponent.styles.fontSize" :options="sizeOption"></a-select>
              </a-form-item>
              <a-form-item label="文字颜色:">
                <!-- <color-picker v-model:value="activeComponent.styles.color" /> -->
              </a-form-item>
              <a-form-item label="对齐方式">
                <a-radio-group v-model:value="activeComponent.styles.textAlign">
                  <a-radio-button value="left">左对齐</a-radio-button>
                  <a-radio-button value="center">居中</a-radio-button>
                  <a-radio-button value="right">右对齐</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </template>
            <template v-if="activeComponent.type === 'text-image'">
              <a-form-item label="图文类型:">
                <a-select v-model:value="formState.imgStyleType" @change="changeTextImg" :options="typeList"></a-select>
              </a-form-item>
            </template>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import Draggable from 'vuedraggable'
import {
  HolderOutlined, CloseOutlined, UpOutlined,
  DownOutlined, ArrowUpOutlined, ArrowDownOutlined,
  LinkOutlined, DeleteOutlined, RightSquareOutlined,
  CopyOutlined, PictureOutlined
} from '@ant-design/icons-vue'
import { Empty, Modal } from 'ant-design-vue'
import { title } from 'process'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

defineOptions({ name: 'MobileDetailEditor' })

const show = ref(true)
const moduleList = ref([])
const formState = reactive({
  imgStyleType: "billboard"
})

const typeList = ref([
  {
    label: "单组图文",
    value: "billboard"
  },
  {
    label: "两组图文",
    value: "tileXL"
  },
  {
    label: "三组图文",
    value: "tileL"
  },
  {
    label: "四组图文",
    value: "tileM"
  },
  {
    label: "交错排列",
    value: "chess"
  }
])

function clear() {
  Modal.confirm({
    title: '确定清空吗？',
    // content: '将PC端描述生成到APP端描述可能存在一定的格式损耗和内容丢失，且之前已有的APP端描述将被覆盖，确定要生成吗？',
    onOk: () => {
      moduleList.value = []
    }
  })
}

const changeTextImg = () => {
  let obj = {
    src: "",
    title: "",
    content: "",
    imgTextStyle: {
      with: "100%"
    },
    cStyles: {
      fontSize: '16px',
      color: '#000000',
      textAlign: 'left',
      width: '100%',
      height: '100px',
      marginTop: "20px"
    },
    styles: {
      fontSize: '16px',
      color: '#000000',
      textAlign: 'left',
      width: '100%',
      height: '100px',
      marginTop: "20px"
    },
  }
  switch (formState.imgStyleType) {
    case "billboard":
      moduleList.value.forEach(item => {
        if (item.imgText.dataList.length > 0) {
          item.imgText.dataList = [];
        }
        item.imgText.dataList.push(obj)
        item.imgText.dataType = "billboard"
      })
      break;
    case "tileXL":
      moduleList.value.forEach(item => {
        if (item.imgText.dataList.length > 0) {
          item.imgText.dataList = [];
        }
        item.imgText.dataList.push(obj, obj)
        item.imgText.dataType = "tileXL"
      })
      break;
    case "tileL":
      moduleList.value.forEach(item => {
        if (item.imgText.dataList.length > 0) {
          item.imgText.dataList = [];
        }
        item.imgText.dataList.push(obj, obj, obj)
        item.imgText.dataType = "tileL"
      })
      break;
    case "tileM":
      moduleList.value.forEach(item => {
        if (item.imgText.dataList.length > 0) {
          item.imgText.dataList = [];
        }
        item.imgText.dataList.push(obj, obj, obj, obj)
        item.imgText.dataType = "tileM"
      })
      break;
    case "chess":
      moduleList.value.forEach(item => {
        if (item.imgText.dataList.length > 0) {
          item.imgText.dataList = [];
        }
        item.imgText.dataList.push(obj, obj, obj)
        item.imgText.dataType = "chess"
      })
      break;
    default:
      break;
  }
}

const getClassName = (type) => {
  switch (type) {
    case 'billboard':
      return 'list';
    case 'tileXL':
      return 'tileXLFlex';
    case 'tileL':
      return 'tileLFlex';
    case 'tileM':
      return 'tileXLFlex';
    default:
      return '';
  }
}

/** 编辑器部分 */
// 模块
const modules = ref([
  {
    text: '文字',
    name: 'text',
  },
  {
    text: '图片',
    name: 'image',
  },
  {
    text: '图文',
    name: 'text-image',
  }
])
const TEXT_ENUM = {
  text: '文字',
  image: '图片',
  'text-image': '图文',
}
const activeId = ref('')
function turnActive(id) {
  console.log('id', id);

  activeId.value = id
}
// 拖拽方法
const pointerEventsNone = ref(false)

function handleDragStart(e, component) {
  pointerEventsNone.value = true
  e.dataTransfer.setData('componentName', component.name)
  console.log('moduleList', moduleList.value);
  let obj = { tip: "可将模块放置到此区域", type: 'tip', show: true }
  if (moduleList.value.length === 0) {
    moduleList.value.push(obj)
  } else {
    let newList = [];
    moduleList.value.forEach((item, index) => {
      // 检查前一个元素是否与 obj 相同
      if (index === 0 || !isEqual(newList[newList.length - 1], obj)) {
        newList.push(obj);
      }
      newList.push(item);
      // 检查下一个元素是否是数组最后一个元素且与 obj 相同
      if (index === moduleList.value.length - 1 || !isEqual(moduleList.value[index + 1], obj)) {
        newList.push(obj);
      }
    });
    moduleList.value = newList;
  }
}
// 辅助函数，用于深度比较两个对象是否相等
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
function dragends(e) {
  pointerEventsNone.value = false
}

// 释放方法
// 当在有效放置目标上放置元素时触发此事件
function handleDrop(e) {
  console.log('drop--', e)
  const type = e.dataTransfer.getData('componentName')
  console.log('e', e, type);
  let arr = ['text', 'image', 'text-image']
  if (arr.includes(type)) {
    addComponent(type)
  }
  moduleList.value = moduleList.value.filter(item => item.type !== 'tip')
  console.log('moduleList', moduleList.value);
}

// 当拖动的元素离开有效的放置目标时, 触发
function dragleaves(e) {
  console.log('dragleaves', e)
  console.log('moduleList---', moduleList.value);
  if (moduleList.value.length == 1) {
    moduleList.value = moduleList.value.filter(item => item.type !== 'tip')
  }
}

// 添加新组件
function addComponent(type) {
  console.log('type', type);
  const newComponent = {
    id: uuidv4(),
    type,
    show: true,
    title: {
      content: '',
      styles: {
        fontSize: '16px',
        color: '#000000',
        textAlign: 'left',
        width: '100%',
        height: '100px',
        marginTop: "20px"
      },
    },
    text: {
      content: '',
      cStyles: {
        fontSize: '16px',
        color: '#000000',
        textAlign: 'left',
        width: '100%',
        height: '100px',
        marginTop: "20px"
      },
    },
    img: [{
      src: "",
      style: {
        with: "100%"
      }
    }],
    imgText: {
      dataType: "billboard",
      dataList: [{
        src: "",
        title: "",
        content: "",
        imgTextStyle: {
          with: "100%"
        },
        cStyles: {
          fontSize: '16px',
          color: '#000000',
          textAlign: 'left',
          width: '100%',
          height: '100px',
          marginTop: "20px"
        },
        styles: {
          fontSize: '16px',
          color: '#000000',
          textAlign: 'left',
          width: '100%',
          height: '100px',
          marginTop: "20px"
        },
      }]
    }
  }
  moduleList.value.push(newComponent)
  selectModule(moduleList.value.length - 1)
  activeId.value = newComponent.id

}

// 点击模块
const offsetTop = ref(0)
const activeModuleIndex = ref(0)
// 当前激活组件
const activeComponent = computed(() => {
  return moduleList.value[activeModuleIndex.value]
})

function selectModule(i, id = "") {
  activeModuleIndex.value = i
  console.log('activeModuleIndex', activeModuleIndex.value);

  activeId.value = id
}

/** 右侧 */
// 文字; 因为文字类型有两种类型, 需要特殊处理
const textDetail = ref({
  // 标题
  titleInfo: {
    text: '',
    style: {
      fontSize: 20,
      color: 'color1',
      align: 'left'
    }
  },
  // 正文
  bodyInfo: {
    text: '',
    style: {
      fontSize: 14,
      color: 'color1',
      align: 'left'
    }
  }
})
const sizeEnumObj = {
  '12px': "size1",
  '14px': "size2",
  '16px': "size3",
  '18px': "size4",
  '20px': "size5",
  '22px': "size6",
  '24px': "size7",
}
const colorEnumObj = {
  '12px': "color1",
  '14px': "color2",
  '16px': "color3",
  '18px': "color4",
}
const sizeOption = [
  {
    label: "尺码1",
    value: "12px"
  },
  {
    label: "尺码2",
    value: "14px"
  },
  {
    label: "尺码3",
    value: "16px"
  },
  {
    label: "尺码4",
    value: "18px"
  },
  {
    label: "尺码5",
    value: "20px"
  },
  {
    label: "尺码6",
    value: "22px"
  },
  {
    label: "尺码7",
    value: "24px"
  }
]


// 模块右侧的控制控制面板
function moduleUp() {
  const temp = { ...moduleList.value[activeModuleIndex.value] }
  moduleList.value[activeModuleIndex.value] = moduleList.value[activeModuleIndex.value - 1]
  moduleList.value[activeModuleIndex.value - 1] = temp
  // 更新当前选中的模块位置
  activeModuleIndex.value -= 1
  // 更新top位置
}
function moduleDown() {
  const temp = { ...moduleList.value[activeModuleIndex.value] }
  moduleList.value[activeModuleIndex.value] = moduleList.value[activeModuleIndex.value + 1]
  moduleList.value[activeModuleIndex.value + 1] = temp
  activeModuleIndex.value -= 1
}
function moduleCopy() {
  const moduleItem = {
    ...moduleList.value[activeModuleIndex.value],
    id: uuidv4()
  }
  moduleList.value.splice(activeModuleIndex.value, 0, moduleItem)
}
function moduleMore() { }
function moduleDel() {
  moduleList.value = moduleList.value.filter(item => {
    item.id == activeId
  })
  // moduleList.value.splice(activeModuleIndex.value, 1)
}


</script>

<style lang="less" scoped>
.mobile-detail-editor {
  position: relative;

  .preview {
    border: 1px solid #ccc;
    padding: 12px;
    width: 650px;
    height: 550px;

    .mask {
      display: none;
      background-color: rgba(0, 0, 0, 0.2);
      width: 650px;
      height: 550px;
      position: absolute;
      top: 0;
      left: 0;
      text-align: center;
    }

    &:hover {
      .mask {
        display: block;
      }
    }
  }

  .editor {
    background-color: #f0f2f5;
    width: 100%;
    height: 100%;
    z-index: 999;
    position: fixed;
    top: 0;
    left: 48px;

    .header {
      padding-top: 12px;
      padding-right: 160px;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 70px;
      background: #fff;
      margin-bottom: 20px;
      font-size: 18px;
    }

    .main {
      width: 1200px;
      height: calc(100vmin - 36px);
      margin: 0 auto;
      overflow: auto;
      display: flex;
      align-items: flex-start;
      // 隐藏滚动条
      -ms-overflow-style: none; // IE and Edge
      scrollbar-width: none; // Firefox

      &::-webkit-scrollbar {
        display: none;
      }

      .left {
        background-color: #fff;
        user-select: none;
        width: 260px;
        min-height: 300px;
        padding: 16px;

        .module {
          display: flex;
          flex-wrap: wrap;
          cursor: pointer;

          &-item {
            width: 50%;
            margin-bottom: 12px;
            display: flex;
            align-items: center;

            &-icon {
              width: 35px;
              height: 35px;
              margin-right: 8px;
              vertical-align: top;
            }

            @type: text, image, text-image;

            each(@type, {
              .@{value} {
                background: url('@/assets/images/common/@{value}.png') center / contain no-repeat;
              }
            });
        }
      }

      .active-module {
        &-item {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          padding: 4px 0;
          background-color: #f2f2f2;
          cursor: grab;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:last-child {
            margin-bottom: 0;
          }

          .optionBtn {
            margin-right: 10px;

            // display: none;
            .ant-space {
              background-color: #f2f2f2;

              .ant-btn-sm {
                padding: 0;
              }
            }
          }

          // &-item:hover {
          //   .optionBtn {
          //     display: block;
          //   }
          // }
        }

        .active-bar {
          background-color: #eff2f9;

          &::before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background-color: #00aaff;
          }
        }
      }
    }

    .content {
      user-select: none;
      display: inline-block;
      margin: 0 20px;
      // position: relative;
      // width: 760px;
      width: 640px;
      max-height: 1000px;
      min-height: 300px;
      overflow-y: auto;
      background-color: #fff;
      // 隐藏滚动条
      -ms-overflow-style: none; // IE and Edge
      scrollbar-width: none; // Firefox

      &::-webkit-scrollbar {
        display: none;
      }

      &-module-item {
        border: 1px solid #ddd;
        padding: 8px;
        cursor: pointer;

        &:last-child {
          margin-bottom: 0;
        }

        .textModule {
          padding: 15px;

          .titleAreas,
          .areas {
            border: none !important;
          }

          .titleAreas:focus,
          .areas:focus {
            box-shadow: none;
            border: 1px dotted #ccc !important;
            border-radius: 5px;
          }

          .titleAreas {
            height: 50px !important;
            border-radius: 5px !important;

            &:hover {
              border: 1px dotted #ccc !important;
              box-sizing: border-box;
            }
          }

          .areas {
            height: 100px !important;
            // 隐藏滚动条
            -ms-overflow-style: none; // IE and Edge
            scrollbar-width: none; // Firefox

            &::-webkit-scrollbar {
              display: none;
            }

            &:hover {
              border: 1px dotted #ccc !important;
              border-radius: 5px;
            }
          }
        }

        .imageModule {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 180px;

          span {
            color: #a0a3a6
          }
        }

        .textImageModule {

          .list {
            &>div {
              width: 100%;
            }
          }

          .top {
            .tip {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          }

          .textareas {

            .titleAreas,
            .areas {
              border: none !important;
            }

            .titleAreas:focus,
            .areas:focus {
              box-shadow: none;
              border: 1px dotted #ccc !important;
              border-radius: 5px;
            }

            .titleAreas {
              height: 50px !important;
              border-radius: 5px !important;

              &:hover {
                border: 1px dotted #ccc !important;
                box-sizing: border-box;
              }
            }

            .areas {
              height: 100px !important;
              // 隐藏滚动条
              -ms-overflow-style: none; // IE and Edge
              scrollbar-width: none; // Firefox

              &::-webkit-scrollbar {
                display: none;
              }

              &:hover {
                border: 1px dotted #ccc !important;
                border-radius: 5px;
              }
            }
          }

          .tileXLFlex {
            display: flex;

            &>div {
              width: calc((100% - 20px) / 2);
              margin: 10px 5px 0;

              .top {
                background: rgba(14, 50, 103, 0.04);
              }
            }
          }

          .tileLFlex {
            display: flex;

            &>div {
              width: calc((100% - 30px) / 3);
              margin: 10px 5px 0;

              .top {
                background: rgba(14, 50, 103, 0.04);
              }
            }
          }

          .chessList {
            .item:nth-child(odd) {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .top {
                background: rgba(14, 50, 103, 0.04);
                height: 250px;
                margin: 5px;
                display: flex;
                align-items: center;
              }

              .textareas {
                height: 250px;
                margin: 5px 5px 5px 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 300px;
              }
            }

            .item:nth-child(even) {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-direction: row-reverse;

              .top {
                background: rgba(14, 50, 103, 0.04);
                height: 250px;
                margin: 5px;
                display: flex;
                align-items: center;
              }

              .textareas {
                height: 250px;
                margin: 5px 5px 5px 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 300px;
              }
            }
          }
        }
      }

      .active {
        border: 1px solid #00aaff;
      }


      .placement-area {
        background-color: rgba(#00aaff, 0.1);
        color: #00aaff;
        width: 100%;
        height: 60px;
        text-align: center;
        line-height: 60px;
      }

    }

    .right-panel {
      width: 300px;
      padding: 20px;
      // margin-left: 40px;
      background-color: #fff;
      border-left: 1px solid #e8e8e8;

      :deep(.rightForm) {
        .ant-form-item-row .ant-form-item-control .ant-form-item-control-input {
          // text-align: right;
          display: flex;
          align-items: flex-end;
        }
      }

      .component-item {
        padding: 8px;
        margin: 8px 0;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        cursor: move;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .elementActive {
        background: #00aaff;
      }

      .canvas-component {
        margin-top: 10px;
        padding: 10px;
        /* border: 1px solid #00aaff; */
      }

      .titleAreas {
        height: 50px !important;
        margin-top: 5px;
      }

      .areas {
        height: 100px !important;
      }

      .canvas-component.active {
        /* border-color: #1890ff; 
        box-shadow: 0 0 8px rgba(24, 144, 255, 0.2); */
        border: 1px solid #00aaff;
      }
    }



  }
}
}
</style>
