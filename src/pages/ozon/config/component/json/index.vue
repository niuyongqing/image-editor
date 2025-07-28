<!-- 移动端详情编辑器 -->
<template>
  <div class="mobile-detail-editor">
    <!-- 外显的部分 jsonContent -->
    <div class="preview">
      <!-- <pre class="wrap" style="overflow: hidden;height: 530px;" v-if="Object.keys(finallyObj).length > 0">
        {{ finallyObj }}
      </pre> -->
      <pre class="wrap" style="overflow: hidden;height: 530px;" v-if="jsonContent && Object.keys(jsonContent).length > 0">
        {{ JSON.parse(jsonContent) }}
      </pre>
      <div class="mask">
        <!-- :disabled="!shop" -->
        <a-button type="primary" size="large" :disabled="!shop" class="mt-60 mb-4 w30" @click="openEditor">编辑</a-button>
        <br />
        <a-button size="large" class="w-30" :disabled="!shop" @click="clear">清空</a-button>
      </div>
    </div>

    <!-- 编辑器部分 -->
    <div v-if="show" class="editor">
      <div class="header">
        <div></div>
        <div>富内容编辑</div>
        <a-space>
          <a-button type="link" @click="showEdit = true">批量设置图片尺寸</a-button>
          <a-button @click="show = false">关闭</a-button>
          <a-button type="primary" @click="save">保存</a-button>
        </a-space>
      </div>
      <!-- 版心 -->
      <div class="main">
        <!-- 左侧 -->
        <div class="left">
          <div class="font-bold mb-2">添加模块</div>
          <div class="module">
            <div v-for="item in modules" :key="item.name" :data-name="item.name" class="module-item" draggable="true"
              @dragstart="handleDragStart" @dragend="dragends">
              <div :class="['module-item-icon', item.name]"></div>
              <div>
                <div>{{ item.text }}</div>
              </div>
            </div>
          </div>
          <div class="font-bold mb-2">使用中的模块</div>
          <a-empty v-if="moduleList.length === 0" :image="simpleImage" />
          <Draggable v-else class="active-module" :list="moduleList" item-key="id" group="left" animation="200">
            <template #item="{ element: item, index }">
              <div :class="['active-module-item', activeId === item.id && 'active-bar']"
                @click="selectModule(item, index)">
                <div>
                  <HolderOutlined class="mx-2" />
                  <span>{{ TEXT_ENUM[item.type] }}</span>
                </div>
                <div class="optionBtn">
                  <a-space class="text-xl">
                    <a-button type="text" title="复制" @click.stop="moduleCopy(index)">
                      <CopyOutlined />
                    </a-button>
                    <a-button type="text" title="删除" @click.stop="moduleDel">
                      <DeleteOutlined />
                    </a-button>
                  </a-space>
                </div>
              </div>
            </template>
          </Draggable>
        </div>

        <!-- 中间内容  @dragover="allowDrop"-->
        <div class="inline-block" @dragleave="dragleaves" @drop="handleDrop" @dragover="allowDrop">
          <div :class="['content', pointerEventsNone && 'pointer-events-none']">
            <template v-if="moduleList.length">
              <div v-for="(item, i) in moduleList" :key="i" @click="e => selectModule(item, i)"
                :class="['content-module-item', activeId === item.id && 'active']">
                <div v-if="item.type === 'text'" class="textModule">
                  <a-textarea v-model:value="item.title.content" placeholder="点击输入标题" :style="item.title.styles"
                    class="titleAreas" :auto-size="{ minRows: 1, maxRows: 3 }" />
                  <a-textarea v-model:value="item.text.content" :style="item.text.cStyles" placeholder="点击输入内容"
                    class="areas" :auto-size="{ minRows: 1 }" />
                </div>
                <div v-else-if="item.type === 'image'">
                  <div v-for="(imgs, i) in item.img" :key="i">
                    <div class="imageModule" v-if="!imgs.src.length">
                      <PictureOutlined :style="{ fontSize: '60px', color: '#a0a3a6' }" />
                      <span>文件格式为 JPEG、JPG、PNG，大小不能超过10MB</span>
                    </div>
                    <img v-else :src="imgs.src[0].url" alt="" :style="imgs.style">
                  </div>
                </div>
                <div v-else-if="item.type === 'text-image'" class="textImageModule">
                  <template v-if="item.imgText.dataType != 'chess'">
                    <div :class="getClassName(item.imgText.dataType)">
                      <div class="item" v-for="(imgItem, index) in item.imgText.dataList" :key="index">
                        <div class="top">
                          <div v-if="!imgItem.src.length" class="tip">
                            <PictureOutlined :style="{ fontSize: '60px', color: '#a0a3a6' }" />
                            <span style="color: #a0a3a6">文件格式为 JPEG、JPG、PNG，大小不能超过10MB</span>
                          </div>
                          <img v-if="imgItem.src.length" :src="imgItem.src[0].url" alt="" :style="imgItem.imgTextStyle">
                        </div>
                        <div class="textareas">
                          <a-textarea v-model:value="imgItem.title.content" placeholder="点击输入标题"
                            :style="imgItem.title.styles" class="titleAreas" :auto-size="{ minRows: 1, maxRows: 3 }" />
                          <a-textarea v-model:value="imgItem.text.content" :style="imgItem.text.cStyles"
                            placeholder="点击输入内容" class="areas" :auto-size="{ minRows: 1 }" />
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="chessList">
                      <div class="item" v-for="(imgItem, index) in item.imgText.dataList" :key="index">
                        <div class="top">
                          <div v-if="!imgItem.src.length" class="tip">
                            <PictureOutlined :style="{ fontSize: '60px', color: '#a0a3a6' }" />
                            <span style="color: #a0a3a6">文件格式为 JPEG、JPG、PNG，大小不能超过10MB</span>
                          </div>
                          <img v-if="imgItem.src.length" :src="imgItem.src[0].url" alt="" :style="imgItem.imgTextStyle">
                        </div>
                        <div class="textareas">
                          <a-textarea v-model:value="imgItem.title.content" placeholder="点击输入标题"
                            :style="imgItem.title.styles" class="titleAreas" :auto-size="{ minRows: 1, maxRows: 3 }" />
                          <a-textarea v-model:value="imgItem.text.content" :style="imgItem.text.cStyles"
                            placeholder="点击输入内容" class="areas" :auto-size="{ minRows: 1 }" />
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <!-- 提示模块 -->
                <div v-if="item.type === 'placement-area'" class="placement-area">可将模块放置到此区域</div>
              </div>
            </template>
          </div>
        </div>

        <!-- 右侧详情 -->
        <div class="right-panel" v-if="showRight">
          <a-form class="rightForm">
            <template v-if="activeModule.type === 'text'">
              <h2>标题</h2>
              <a-form-item label="文字大小:">
                <a-select v-model:value="activeModule.title.styles.fontSize" :options="sizeOption"></a-select>
              </a-form-item>
              <a-form-item label="文字颜色:">
                <div class="textColors">
                  <div v-for="(colorItem, i) in colorList" :class="activeModule.title.active == i ? 'cheacd' : ''"
                    :key="i" @click="handleTextColors(colorItem, i, activeModule.title.styles, activeModule.title)"
                    class="colorItems"></div>
                </div>
              </a-form-item>
              <a-form-item label="对齐方式" style="border-bottom: 1px dotted #ccc;padding-bottom: 20px;">
                <a-radio-group v-model:value="activeModule.title.styles.textAlign">
                  <a-radio-button value="left">左对齐</a-radio-button>
                  <a-radio-button value="center">居中</a-radio-button>
                  <a-radio-button value="right">右对齐</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <h2>内容文本</h2>
              <a-form-item label="文字大小:">
                <a-select v-model:value="activeModule.text.cStyles.fontSize" :options="sizeOption"></a-select>
              </a-form-item>
              <a-form-item label="文字颜色:">
                <div class="textColors">
                  <div v-for="(colorItem, i) in colorList" :class="activeModule.text.active == i ? 'cheacd' : ''"
                    :key="i" @click="handleTextColors(colorItem, i, activeModule.text.cStyles, activeModule.text)"
                    class="colorItems"></div>
                </div>
              </a-form-item>
              <a-form-item label="对齐方式">
                <a-radio-group v-model:value="activeModule.text.cStyles.textAlign">
                  <a-radio-button value="left">左对齐</a-radio-button>
                  <a-radio-button value="center">居中</a-radio-button>
                  <a-radio-button value="right">右对齐</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </template>
            <template v-if="activeModule.type === 'image'">
              <div class="flex items-center justify-between">
                <h2 style="margin-bottom: 0;">图片</h2>
                <jsonUpload @batchPicture="batchPicture"></jsonUpload>
              </div>
              <div v-for="(itemImgs, i) in activeModule.img" :key="i" style="margin-top: 24px;">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div @click="itemImgs.open = !itemImgs.open" style="cursor: pointer;">
                      <DownOutlined v-if="itemImgs.open" />
                      <RightOutlined v-else />
                    </div>
                    <span class="ml-2.5" style="user-select: none;">第{{ i + 1 }}组</span>
                  </div>
                  <div>
                    <a-tooltip>
                      <template #title>新增组</template>
                      <PlusOutlined @click="addImgs" />
                    </a-tooltip>
                    <a-tooltip>
                      <template #title>删除组</template>
                      <DeleteOutlined @click="delImgs(i)" v-if="activeModule.img.length > 1" class="ml-2.5" />
                    </a-tooltip>
                  </div>
                </div>
                <div :class="itemImgs.open ? 'showImgCont' : 'noneImgCont'">
                  <a-form-item label="添加图片:">
                    <a-image v-if="itemImgs.src.length" style="position: relative;" :width="100"
                      :src="itemImgs.src[0].url" />
                    <div v-if="itemImgs.src.length" style="position: absolute;top:-10px;left: 90px">
                      <AsyncIcon icon="CloseCircleOutlined" size="20px" color="black" @click="itemImgs.src = []" />
                    </div>
                    <a-upload name="file" v-if="!itemImgs.src.length" class="h-20 w-20 headerImg" :headers="headers"
                      accept=".jpg,.jpeg,.png" :action="uploadUrl" :showUploadList="false" list-type="picture-card"
                      @change="(e) => handleChangeColroImg(e, itemImgs)" :max-count="1">
                      <div>
                        <PlusOutlined />
                        <div>上传图片</div>
                      </div>
                    </a-upload>
                    <div style="margin-top: 30px;">图片尺寸要求：200*200~4320*7680</div>
                  </a-form-item>
                  <a-form-item label="跳转链接:">
                    <a-input v-model:value="itemImgs.jumpUrl" placeholder="请填写到ozon.ru的链接" />
                  </a-form-item>
                  <a-form-item label="图片放置:">
                    <a-radio-group v-model:value="itemImgs.style.width">
                      <a-radio-button :value="'100%'">全宽度</a-radio-button>
                      <a-radio-button :value="'50%'">1/2</a-radio-button>
                      <a-radio-button :value="'33.33%'">1/3</a-radio-button>
                      <a-radio-button :value="'25%'">1/4</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="文本描述:">
                    <a-input v-model:value="itemImgs.alt" placeholder="浏览器中图片加载时的文字" />
                  </a-form-item>
                </div>
              </div>
            </template>
            <template v-if="activeModule.type === 'text-image'">
              <div class="flex items-center justify-between mb-2.5">
                <h2 style="margin-bottom: 0;">图文</h2>
                <jsonUpload @batchPicture="batchPictureTimg"></jsonUpload>
              </div>
              <a-form-item label="图文类型:">
                <a-select v-model:value="activeModule.imgText.dataType"
                  @change="changeTextImg(activeModule.imgText.dataType)" :options="typeList"></a-select>
              </a-form-item>
              <!-- 图片 -->
              <div v-for="(itemImgs, i) in activeModule.imgText.dataList" :key="i" style="margin-top: 24px;">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div @click="itemImgs.open = !itemImgs.open" style="cursor: pointer;">
                      <DownOutlined v-if="itemImgs.open" />
                      <RightOutlined v-else />
                    </div>
                    <span class="ml-2.5" style="user-select: none;">第{{ i + 1 }}组</span>
                  </div>
                  <div>
                    <a-tooltip>
                      <template #title>一键应用字体大小、颜色、对齐至其余组</template>
                      <DiffOutlined @click="batchAssign(itemImgs)" />
                    </a-tooltip>
                    <a-tooltip>
                      <template #title>新增组</template>
                      <PlusOutlined @click="batchAddImgs" class="mx-2.5" />
                    </a-tooltip>
                    <a-tooltip>
                      <template #title>删除组</template>
                      <DeleteOutlined @click="batchDelImgs(i)" v-if="activeModule.imgText.dataList.length > 1" />
                    </a-tooltip>
                  </div>
                </div>
                <div :class="itemImgs.open ? 'showImgCont' : 'noneImgCont'">
                  <h3 style="font-weight: 700;">图片</h3>
                  <a-form-item label="添加图片:">
                    <a-image v-if="itemImgs.src.length" style="position: relative;" :width="100"
                      :src="itemImgs.src[0].url" />
                    <div v-if="itemImgs.src.length" style="position: absolute;top:-10px;left: 90px">
                      <AsyncIcon icon="CloseCircleOutlined" size="20px" color="black" @click="itemImgs.src = []" />
                    </div>
                    <a-upload name="file" v-if="!itemImgs.src.length" class="h-20 w-20 headerImg" :headers="headers"
                      accept=".jpg,.jpeg,.png" :action="uploadUrl" :showUploadList="false" list-type="picture-card"
                      @change="(e) => handleChangeColroImg(e, itemImgs)" :max-count="1">
                      <div>
                        <PlusOutlined />
                        <div>上传图片</div>
                      </div>
                    </a-upload>
                    <div style="margin-top: 30px;">图片尺寸要求：200*200~4320*7680</div>
                  </a-form-item>
                  <a-form-item label="跳转链接:">
                    <a-input v-model:value="itemImgs.jumpUrl" placeholder="请填写到ozon.ru的链接" />
                  </a-form-item>
                  <a-form-item label="图片放置:">
                    <a-radio-group v-model:value="itemImgs.imgTextStyle.width"
                      v-if="activeModule.imgText.dataType === 'billboard'">
                      <a-radio-button :value="'100%'">全宽度</a-radio-button>
                      <a-radio-button :value="'50%'">1/2</a-radio-button>
                      <a-radio-button :value="'33.33%'">1/3</a-radio-button>
                      <a-radio-button :value="'25%'">1/4</a-radio-button>
                    </a-radio-group>
                    <a-radio-group v-model:value="itemImgs.imgTextStyle.width"
                      @change="changeImgTextStyle($event, itemImgs.imgTextStyle)" v-else>
                      <a-radio-button :value="'100%'">铺满</a-radio-button>
                      <a-radio-button :value="'auto'">自适应</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="文本描述:">
                    <a-input v-model:value="itemImgs.alt" placeholder="浏览器中图片加载时的文字" />
                  </a-form-item>
                </div>
                <div :class="itemImgs.open ? 'showImgCont' : 'noneImgCont'">
                  <h3 style="font-weight: 700;">标题</h3>
                  <a-form-item label="文字大小:">
                    <a-select v-model:value="itemImgs.title.styles.fontSize" :options="sizeOption"></a-select>
                  </a-form-item>
                  <a-form-item label="文字颜色:">
                    <div class="textColors">
                      <div v-for="(colorItem, i) in colorList" :class="itemImgs.title.active == i ? 'cheacd' : ''"
                        :key="i" @click="handleTextColors(colorItem, i, itemImgs.title.styles, itemImgs.title)"
                        class="colorItems"></div>
                    </div>
                  </a-form-item>
                  <a-form-item label="对齐方式" style="border-bottom: 1px dotted #ccc;padding-bottom: 20px;">
                    <a-radio-group v-model:value="itemImgs.title.styles.textAlign">
                      <a-radio-button value="left">左对齐</a-radio-button>
                      <a-radio-button value="center">居中</a-radio-button>
                      <a-radio-button value="right">右对齐</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                  <h3 style="font-weight: 700;">内容文本</h3>
                  <a-form-item label="文字大小:">
                    <a-select v-model:value="itemImgs.text.cStyles.fontSize" :options="sizeOption"></a-select>
                  </a-form-item>
                  <a-form-item label="文字颜色:">
                    <div class="textColors">
                      <div v-for="(colorItem, i) in colorList" :class="itemImgs.text.active == i ? 'cheacd' : ''"
                        :key="i" @click="handleTextColors(colorItem, i, itemImgs.text.cStyles, itemImgs.text)"
                        class="colorItems"></div>
                    </div>
                  </a-form-item>
                  <a-form-item label="对齐方式">
                    <a-radio-group v-model:value="itemImgs.text.cStyles.textAlign">
                      <a-radio-button value="left">左对齐</a-radio-button>
                      <a-radio-button value="center">居中</a-radio-button>
                      <a-radio-button value="right">右对齐</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                </div>
              </div>
            </template>
          </a-form>
        </div>
      </div>
    </div>
    <batchModify :showEdit="showEdit" @handleBatchModifyClose="showEdit = false" :moduleList="moduleList"
      @rebackList="rebackList"></batchModify>
  </div>
</template>

<script setup>
import { cloneDeep } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import Draggable from 'vuedraggable'
import {
  HolderOutlined, CloseOutlined, UpOutlined,
  DownOutlined, ArrowUpOutlined, ArrowDownOutlined,
  LinkOutlined, DeleteOutlined, RightSquareOutlined, DiffOutlined,
  CopyOutlined, PictureOutlined, RightOutlined, PlusOutlined
} from '@ant-design/icons-vue'
import { Empty, Modal } from 'ant-design-vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message } from "ant-design-vue";
import { deepClone } from '~@/utils'
import jsonUpload from "../jsonUpload/index.vue"
import batchModify from "../batchModify/index.vue"
import { processImageSource } from "~/pages/ozon/config/commJs/index"
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

defineOptions({ name: 'MobileDetailEditor' })

const emits = defineEmits(['backResult', 'clear'])
const props = defineProps({
  shop: String,
  jsonContent: String
});
const headers = {
  'Authorization': 'Bearer ' + useAuthorization().value,
}
const uploadUrl =
  import.meta.env.VITE_APP_BASE_API +
  "/platform-ozon/platform/ozon/file/upload/img"



function getKeyByValue(object, value) {
  for (let key in object) {
    if (object[key] === value) {
      return key;
    }
  }
  return null;
}


const showEdit = ref(false)
// 单个传图
const handleChangeColroImg = (info, record) => {
  if (info.file.status === 'done') {
    record.src.push(
      {
        id: uuidv4(),
        name: info.file.response.originalFilename,
        url: '/prod-api' + info.file.response.url,
        checked: true,
        width: info.file.response.width,
        height: info.file.response.height,
      }
    )
  }
  if (info.file.status === 'error') {
    message.error('图片上传有误！');
  }
}

// 批量传图
function batchPicture(list) {
  let arr = processArrays(activeModule.value.img, list);
  moduleList.value[activeModuleIndex.value].img = arr
}

function batchPictureTimg(list) {
  let arr = tImgProcessArrays(activeModule.value.imgText.dataList, list);
  moduleList.value[activeModuleIndex.value].imgText.dataList = arr
}

function processArrays(a, b) {
  const result = [];
  a.forEach(aItem => {
    if (aItem.src.length === 0) {
      // src为空，添加b数组转换后的元素
      b.forEach(bItem => {
        const newItem = convertBToA(bItem, aItem);
        result.push(newItem);
      });
    } else {
      // src不为空，保留原元素并添加b数组转换后的元素
      result.push(aItem);
      b.forEach(bItem => {
        const newItem = convertBToA(bItem, aItem);
        result.push(newItem);
      });
    }
  });
  return result;
}

function convertBToA(bItem, aTemplate) {
  return {
    src: [{
      id: uuidv4(),
      name: bItem.originalFilename,
      url: bItem.url,
      checked: true,
      width: bItem.width,
      height: bItem.height
    }],
    open: aTemplate.open,
    jumpUrl: aTemplate.jumpUrl,
    alt: aTemplate.alt,
    style: { ...aTemplate.style } // 拷贝原样式对象
  };
}

function tImgProcessArrays(a, b) {
  let allSrcEmpty = a.every(item => item.src.length === 0);
  const result = [];
  if (allSrcEmpty) {
    b.forEach(bItem => {
      const newItem = tImgConvertBToA(bItem, a[0]);
      result.push(deepClone(newItem));
    })
  } else {
    a.forEach((aItem, index) => {
      if (aItem.src.length === 0) {
        // src为空，添加b数组中对应索引的元素转换后的结果
        const bItem = b[index];
        if (bItem) {
          const newItem = tImgConvertBToA(bItem, aItem);
          result.push(deepClone(newItem));
        }
      } else {
        // src不为空，保留原元素并添加b数组中对应索引的元素转换后的结果
        result.push(aItem);
        const bItem = b[index];
        if (bItem) {
          const newItem = tImgConvertBToA(bItem, aItem);
          result.push(deepClone(newItem));
        }
      }
    });
  }
  return result;
}

function tImgConvertBToA(bItem, aTemplate) {
  return {
    src: [
      {
        id: uuidv4(),
        name: bItem.originalFilename,
        url: bItem.url,
        checked: true,
        width: bItem.width,
        height: bItem.height
      }
    ],
    open: aTemplate.open,
    imgTextStyle: aTemplate.imgTextStyle,
    title: aTemplate.title,
    text: aTemplate.text,
  };
}

function addImgs() {
  let obj = {
    src: [],
    open: true,
    jumpUrl: "",
    alt: "",
    style: {
      width: "100%",
      select: 0,
      margin: "0 auto",
      display: "block"
    }
  }
  activeModule.value.img.push(deepClone(obj))
}

function delImgs(index) {
  activeModule.value.img.splice(index, 1)
}

function batchAddImgs() {
  let obj = {
    src: [],
    open: true,
    imgTextStyle: {
      width: "100%",
      height: "100%",
      select: 0,
      margin: "0 auto",
      display: "block"
    },
    title: {
      content: '',
      active: "",
      styles: {
        fontSize: '20px',
        color: '#263c53',
        textAlign: 'left',
        width: '100%',
        height: '100px',
        marginTop: "20px"
      },
    },
    text: {
      content: '',
      active: "",
      cStyles: {
        fontSize: '14px',
        color: '#263c53',
        textAlign: 'left',
        width: '100%',
        height: '100px',
        marginTop: "20px"
      },
    },
  }
  activeModule.value.imgText.dataList.push(deepClone(obj))
}

function batchDelImgs(index) {
  activeModule.value.imgText.dataList.splice(index, 1)
}

function batchAssign(e) {
  activeModule.value.imgText.dataList.forEach(item => {
    item.title.styles.fontSize = e.title.styles.fontSize
    item.title.styles.textAlign = e.title.styles.textAlign
    item.title.styles.color = e.title.styles.color
    item.text.cStyles.fontSize = e.text.cStyles.fontSize
    item.text.cStyles.textAlign = e.text.cStyles.textAlign
    item.text.cStyles.color = e.text.cStyles.color
  })
}

function changeImgTextStyle(e, itemStyle) {
  if (e.target.value === '100%') {
    itemStyle.width = "100%"
    itemStyle.height = "100%"
    itemStyle['object-fit'] = "cover"
  } else {
    itemStyle.width = "auto"
    itemStyle.height = "auto"
    itemStyle['object-fit'] = "contain"
  }
}
const show = ref(false)
const moduleList = ref([])
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

const picPosition = {
  "100%": "width_full",
  "50%": "width_half",
  "33.33%": "width_one_third",
  "25%": "width_one_fourth"
}

function clear() {
  Modal.confirm({
    title: '确定清空吗？',
    onOk: () => {
      emits('clear')
      moduleList.value = []
      finallyObj.value = {}
    }
  })
}

const typeConfig = {
  billboard: { count: 1, dataType: 'billboard' },
  tileXL: { count: 2, dataType: 'tileXL' },
  tileL: { count: 3, dataType: 'tileL' },
  tileM: { count: 4, dataType: 'tileM' },
  chess: { count: 3, dataType: 'chess' }
};

const getBaseObj = (type) => ({
  src: [],
  open: true,
  jumpUrl: "",
  alt: "",
  imgTextStyle: {
    width: type === "billboard" ? "100%" : "auto",
    height: type === "billboard" ? "100%" : "auto",
    select: 0,
    margin: "0 auto",
    display: "block",
  },
  title: {
    content: '',
    active: "",
    styles: {
      fontSize: '20px',
      color: '#263c53',
      textAlign: 'left',
      width: '100%',
      height: '100px',
      marginTop: "20px"
    }
  },
  text: {
    content: '',
    active: "",
    cStyles: {
      fontSize: '14px',
      color: '#263c53',
      textAlign: 'left',
      width: '100%',
      height: '100px',
      marginTop: "20px"
    }
  }
});

const changeTextImg = (type) => {
  const config = typeConfig[type];
  if (!config) return; // 无效类型直接返回

  const baseObj = getBaseObj(type);

  moduleList.value.forEach(item => {
    if (item.type === 'text-image') {
      // 清空数组的更优写法
      item.imgText.dataList.length = 0;
      // 批量添加深拷贝对象
      item.imgText.dataList.push(
        ...Array.from({ length: config.count }, () => deepClone(baseObj))
      );
      item.imgText.dataType = config.dataType;
    }
  });
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
// 拖拽方法
const pointerEventsNone = ref(false)

function handleDragStart(e) {
  pointerEventsNone.value = true
  e.dataTransfer.setData('componentName', e.target.dataset.name)
}
function dragends(e) {
  pointerEventsNone.value = false
}

// 释放方法
let offsetY = 0;
function removePlacementArea() {
  moduleList.value = moduleList.value.filter(item => item.type !== 'placement-area');
}

// 当将元素拖动到有效放置目标（每几百毫秒）上时, 触发
function allowDrop(e) {
  e.preventDefault();
  if (!pointerEventsNone.value) return
  /* 获取鼠标高度 */
  let eventoffset = e.offsetY;
  /* 如果没有移动不触发事件减少损耗 */
  if (offsetY === eventoffset) return;
  else offsetY = eventoffset;

  /* 获取组件 */
  const childrenObject = e.target.children[0];
  if (!childrenObject) return;

  // 如果当前模块数大于一个
  if (moduleList.value.length) {
    // 如果只有一个模块并且第一个是提示模块直接返回
    if (moduleList.value.length === 1 && moduleList.value[0].type === 'placement-area') return;

    /* 如果鼠标的高度小于第一个的一半直接放到第一个 */
    if (childrenObject.children.length > 0 && eventoffset < childrenObject.children[0].clientHeight / 2) {
      /* 如果第一个是提示组件直接返回 */
      if (moduleList.value[0].type === 'placement-area') return;
      /* 删除提示组件(如果存在) */
      removePlacementArea();
      /* 最上面添加提示组件 */
      moduleList.value.unshift({ type: 'placement-area' });
      return;
    }

    /* 记录距离父元素高度 */
    const childOff = childrenObject.offsetTop;

    /* 鼠标在所有组件下面 */
    if (eventoffset > childrenObject.clientHeight ||
      (childrenObject.lastElementChild.offsetTop - childOff + childrenObject.lastElementChild.clientHeight / 2 < eventoffset)) {
      /* 最后一个组件是提示组件返回 */
      if (moduleList.value[moduleList.value.length - 1].type === 'placement-area') return;
      /* 清除提示组件 */
      removePlacementArea();
      /* 最后一个不是提示组件添加 */
      moduleList.value.push({ type: 'placement-area' });
      return;
    }

    /* 在两个组件中间，插入 */
    const childrens = childrenObject.children;
    for (let i = 0, l = childrens.length; i < l; i++) {
      const childoffset = childrens[i].offsetTop - childOff;

      if (childoffset + childrens[i].clientHeight / 2 > e.offsetY) {
        /* 如果是提示组件直接返回 */
        if (moduleList.value[i].type === 'placement-area') break;
        if (i > 0 && moduleList.value[i - 1].type === 'placement-area') break;

        /* 清除提示组件 */
        removePlacementArea();
        moduleList.value.splice(i, 0, { type: 'placement-area' });
        break;
      } else if (childoffset + childrens[i].clientHeight > e.offsetY) {
        if (moduleList.value[i].type === 'placement-area') break;
        if (i < moduleList.value.length - 1 && moduleList.value[i + 1].type === 'placement-area') break;

        /* 清除提示组件 */
        removePlacementArea();
        moduleList.value.splice(i, 0, { type: 'placement-area' });
        break;
      }
    }
  } else {
    // 空白时直接 push 提示模块
    moduleList.value.push({ type: 'placement-area' });
  }
}

const textDefault = {
  title: {
    content: '',
    active: "",
    styles: {
      fontSize: '20px',
      color: '#263c53',
      textAlign: 'left',
      width: '100%',
      height: '100px',
      marginTop: "20px"
    },
  },
  text: {
    content: '',
    active: "",
    cStyles: {
      fontSize: '14px',
      color: '#263c53',
      textAlign: 'left',
      width: '100%',
      height: '100px',
      marginTop: "20px"
    },
  },
}

const imgDefaulet = {
  img: [{
    src: [],
    open: true,
    jumpUrl: "",
    alt: "",
    style: {
      width: "100%",
      select: 0,
      margin: "0 auto",
      display: "block"
    }
  }],
}

const imgTextDefaulet = {
  imgText: {
    dataType: "billboard",
    dataList: [{
      src: [],
      open: true,
      imgTextStyle: {
        width: "100%",
        height: "100%",
        select: 0,
        margin: "0 auto",
        display: "block"
      },
      title: {
        content: '',
        active: "",
        styles: {
          fontSize: '20px',
          color: '#263c53',
          textAlign: 'left',
          width: '100%',
          height: '100px',
          marginTop: "20px"
        },
      },
      text: {
        content: '',
        active: "",
        cStyles: {
          fontSize: '14px',
          color: '#263c53',
          textAlign: 'left',
          width: '100%',
          height: '100px',
          marginTop: "20px"
        },
      },
    }]
  }
}

// 当在有效放置目标上放置元素时触发此事件
function handleDrop(e) {
  if (!pointerEventsNone.value) return
  
  const type = e.dataTransfer.getData('componentName')
  let moduleItem = { type, id: uuidv4() }
  if (type == 'text') {
    moduleItem = { ...moduleItem, ...deepClone(textDefault) }
  } else if (type == 'image') {
    moduleItem = { ...moduleItem, ...deepClone(imgDefaulet) }
  } else if (type == 'text-image') {
    moduleItem = { ...moduleItem, ...deepClone(imgTextDefaulet) }
  }
  // 插入拖过来的模块(即为替换掉提示模块)
  const index = moduleList.value.findIndex(item => item.type === 'placement-area')
  moduleList.value.splice(index, 1, moduleItem)
  selectModule(moduleItem, index)
}

// 当拖动的元素离开有效的放置目标时, 触发
function dragleaves(e) {
  moduleList.value = moduleList.value.filter(item => item.type !== 'placement-area')
}

// 点击模块
const offsetTop = ref(0)
const activeModuleIndex = ref(0)
const activeModule = ref({})
const showRight = ref(false)
const finallyObj = ref({})

function selectModule(item, i) {
  activeModuleIndex.value = i
  activeModule.value = item
  showRight.value = true
  activeId.value = item.id
}

/** 右侧 */
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
  '#263c53': "color1",
  '#57697b': "color2",
  '#8e9ba6': "color3",
  '#fff': "color4",
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

const colorList = [
  {
    color: '#263c53'
  },
  {
    color: '#57697b'
  },
  {
    color: '#8e9ba6'
  },
  {
    color: '#fff'
  }
]

function handleTextColors(item, index, style, modules) {
  style.color = item.color
  modules.active = index
}

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
function moduleCopy(i) {
  let index = i === undefined ? activeModuleIndex.value : i
  const item = {
    ...moduleList.value[index],
    id: uuidv4()
  }
  const moduleItem = cloneDeep(item)
  index += 1
  moduleList.value.splice(index, 0, moduleItem)
  selectModule(moduleItem, index)
}

function moduleDel() {
  moduleList.value.splice(activeModuleIndex.value, 1)
  closeModule()
}

// 关闭选中的模块
function closeModule() {
  activeModuleIndex.value = 0
  activeId.value = ''
  showRight.value = false
  activeModule.value = {}
}
// ozon文字模板
let ozonText = {
  "widgetName": "raTextBlock",
  "theme": "default",
  "gapSize": "m",
  "padding": "type2",
  "title": {
    "size": "size5",
    "color": "color1",
    "align": "left",
    "content": [""]
  },
  "text": {
    "size": "size2",
    "color": "color1",
    "align": "left",
    "content": [""]
  }
}
// ozon图片模板
let ozonPic = {
  "widgetName": "raShowcase",
  "type": "roll",
  "blocks": [{
    "imgLink": "",
    "img": {
      "src": "",
      "srcMobile": "",
      "alt": "",
      "position": "width_full",
      "positionMobile": "width_full",
      "widthMobile": 800,
      "heightMobile": 800
    }
  }]
}
// ozon图文模板
let ozonTImg = {
  "widgetName": "raShowcase",
  "type": "billboard",
  "blocks": [{
    "imgLink": "",
    "img": {
      "src": "",
      "srcMobile": "",
      "alt": "",
      "position": "width_full",
      "positionMobile": "width_full",
      "widthMobile": 1000,
      "heightMobile": 1000
    },
    "title": {
      "size": "size4",
      "color": "color1",
      "align": "left",
      "content": [""]
    },
    "text": {
      "size": "size2",
      "color": "color1",
      "align": "left",
      "content": ["dsfgsdfgfd"]
    }
  }, {
    "imgLink": "",
    "img": {
      "src": "",
      "srcMobile": "",
      "alt": "",
      "position": "width_full",
      "positionMobile": "width_full",
      "widthMobile": 1000,
      "heightMobile": 1000
    },
    "title": {
      "size": "size4",
      "color": "color1",
      "align": "left",
      "content": [""]
    },
    "text": {
      "size": "size2",
      "color": "color1",
      "align": "left",
      "content": ["111"]
    }
  }]
}
let tImgMenu = {
  "auto": "to_the_edge",
  "100%": "fill"
}

function rebackList(list) {
  const aMap = list.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  // 遍历数组b，替换匹配的项
  moduleList.value.forEach((item) => {
    if (item.type === 'text-image') {
      // 处理text-image类型中的src
      item.imgText.dataList.forEach((dataItem) => {
        dataItem.src.forEach((srcItem) => {
          const matchedA = aMap[srcItem.id];
          if (matchedA) {
            srcItem.url = matchedA.url;
            srcItem.width = matchedA.width;
            srcItem.height = matchedA.height;
          }
        });
      });
    } else if (item.type === 'image') {
      // 处理image类型中的src
      item.img.forEach((imgItem) => {
        imgItem.src.forEach((srcItem) => {
          const matchedA = aMap[srcItem.id];
          if (matchedA) {
            srcItem.url = matchedA.url;
            srcItem.width = matchedA.width;
            srcItem.height = matchedA.height;
          }
        });
      });
    }
  });
}

// 保存
function save() {
  if (moduleList.value.length === 0) {
    message.error("至少添加一个模块信息");
    return
  }
  let res = []
  let obj = {}
  moduleList.value.forEach(item => {
    switch (item.type) {
      case 'text':
        obj = deepClone(ozonText)
        obj.title = {
          size: sizeEnumObj[item.title.styles.fontSize],
          ocolor: colorEnumObj[item.title.styles.color],
          align: item.title.styles.textAlign,
          content: item.title.content.split(/\r?\n/)
        }
        obj.text = {
          size: sizeEnumObj[item.text.cStyles.fontSize],
          color: colorEnumObj[item.text.cStyles.color],
          align: item.text.cStyles.textAlign,
          content: item.text.content.split(/\r?\n/)
        }
        res.push(obj)
        break;
      case 'image':
        obj = deepClone(ozonPic)
        obj.blocks = item.img.map(el => {
          return {
            imgLink: el.jumpUrl,
            img: {
              src: el.src[0].url,
              srcMobile: el.src[0].url,
              alt: el.alt,
              position: picPosition[el.style.width],
              positionMobile: picPosition[el.style.width],
              widthMobile: el.src[0].width,
              heightMobile: el.src[0].height
            }
          }
        })
        res.push(obj)
        break;
      case 'text-image':
        obj = deepClone(ozonTImg)
        const commonMapper = (e) => ({
          imgLink: e.jumpUrl ?? "",
          img: {
            src: e.src[0].url,
            srcMobile: e.src[0].url,
            alt: e.alt ?? "",
            widthMobile: e.src[0].width,
            heightMobile: e.src[0].height
          },
          title: {
            size: sizeEnumObj[e.title.styles.fontSize],
            color: colorEnumObj[e.title.styles.color],
            align: e.title.styles.textAlign,
            content: e.title.content.split(/\r?\n/)
          },
          text: {
            size: sizeEnumObj[e.text.cStyles.fontSize],
            color: colorEnumObj[e.text.cStyles.color],
            align: e.text.cStyles.textAlign,
            content: e.text.content.split(/\r?\n/)
          }
        });

        if (item.imgText.dataType !== "chess") {
          obj.blocks = item.imgText.dataList.map(e => {
            const base = commonMapper(e);
            base.img.position = item.imgText.dataType === "billboard" ?
              picPosition[e.imgTextStyle.width] : tImgMenu[e.imgTextStyle.width];
            base.img.positionMobile = base.img.position;
            return base;
          });
        } else {
          obj.blocks = item.imgText.dataList.map((e, index) => {
            const base = commonMapper(e);
            base.img.position = tImgMenu[e.imgTextStyle.width];
            base.img.positionMobile = base.img.position;
            base.reverse = index % 2 === 0 ? false : true;
            return base;
          });
        }

        obj.type = item.imgText.dataType;
        res.push(obj)
        break;
      default:
        break;
    }
  })

  const newData = res.map(item => {
    return {
      ...item,
      blocks: item?.blocks?.map(block => {
        return {
          ...block,
          img: {
            ...block.img,
            src: block.img.src.replace('/prod-api', ''),
            srcMobile: block.img.srcMobile.replace('/prod-api', '')
            // src: "https://www.xzerp.com/file/wish/upload/2025-06-24/2025/06/24/7017600413_20250624134545A024.jpg",
            // srcMobile: "https://www.xzerp.com/file/wish/upload/2025-06-24/2025/06/24/7017600413_20250624134545A024.jpg"
          }
        };
      })
    };
  });
  // console.log('newData', newData);
  finallyObj.value = {
    content: newData,
    version: 0.3
  }
  show.value = false
  emits("backResult", finallyObj.value)
  closeTemp();
}



const closeTemp = () => {
  finallyObj.value = {}
  moduleList.value = []
}

function openEditor() {
  show.value = true
  if (!props.jsonContent) return
  const val = props.jsonContent
  const { content } = JSON.parse(val) || [];
  content.forEach(item => {
    if (item.widgetName === 'raTextBlock') {
      let textObj = deepClone(textDefault)
      item.title.content.join('\n')
      // console.log('content', typeof item.title.content.join('\n'));
      if (item.title.content.join('\n').length > 0) {
        textObj.title.content = item.title.content.join('\n')
        textObj.title.styles.fontSize = getKeyByValue(sizeEnumObj, item.title.size)
        textObj.title.styles.color = getKeyByValue(colorEnumObj, item.title.color)
        textObj.title.styles.textAlign = item.title.align
      }
      if (item.text.content.join('\n').length > 0) {
        textObj.text.content = item.text.content.join('\n')
        textObj.text.cStyles.fontSize = getKeyByValue(sizeEnumObj, item.text.size)
        textObj.text.cStyles.color = getKeyByValue(colorEnumObj, item.text.color)
        textObj.text.cStyles.textAlign = item.text.align
      }
      textObj.id = uuidv4()
      textObj.type = 'text'
      moduleList.value.push(textObj)
    } else if (item.widgetName === 'raShowcase') {
      let imgObj = deepClone(imgDefaulet)
      if (item.type === 'roll') {
        imgObj.img = item.blocks.map(blockItem => {
          return {
            src: [
              {
                url: processImageSource(blockItem.img.src),
                checked: true,
                id: uuidv4(),
                width: blockItem.img.widthMobile,
                height: blockItem.img.heightMobile,
              }
            ],
            open: true,
            jumpUrl: blockItem.imgLink,
            alt: blockItem.img.alt,
            style: {
              width: getKeyByValue(picPosition, blockItem.img.position),
              select: 0,
              margin: "0 auto",
              display: "block"
            }
          }
        })
        imgObj.id = uuidv4()
        imgObj.type = 'image'
        moduleList.value.push(imgObj)
      } else {
        let imgTextObj = deepClone(imgTextDefaulet)
        imgObj.id = uuidv4()
        imgObj.type = 'text-image'
        imgTextObj.imgText.dataType = item.type
        imgTextObj.imgText.dataList = item.blocks.map(e => {
          return {
            src: [
              {
                url: processImageSource(e.img.src),
                checked: true,
                id: uuidv4(),
                width: e.img.widthMobile,
                height: e.img.heightMobile,
              }
            ],
            open: true,
            imgTextStyle: {
              width: getKeyByValue(picPosition, e.img.position),
              height: "100%",
              select: 0,
              margin: "0 auto",
              display: "block"
            },
            title: {
              content: e.title.content.join('\n').length > 0 ? e.title.content.join('\n') : "",
              active: "",
              styles: {
                fontSize: getKeyByValue(sizeEnumObj, e.title.size),
                color: getKeyByValue(colorEnumObj, e.title.color),
                textAlign: e.title.align,
                width: '100%',
                height: '100px',
                marginTop: "20px"
              },
            },
            text: {
              content: e.text.content.join('\n').length > 0 ? e.text.content.join('\n') : "",
              active: "",
              cStyles: {
                fontSize: getKeyByValue(sizeEnumObj, e.text.size),
                color: getKeyByValue(colorEnumObj, e.text.color),
                textAlign: e.text.align,
                width: '100%',
                height: '100px',
                marginTop: "20px"
              },
            }
          }
        })
        moduleList.value.push(imgTextObj)
      }
    }
  })

}

// watch(() => props.jsonContent, val => {
//   if (val) {
//     console.log('val', val);
//     finallyObj.value = JSON.parse(val)
//     const { content } = JSON.parse(val)
//     console.log('content', content);
//     content?.forEach(item => {
//       if (item.widgetName === 'raTextBlock') {
//         let textObj = deepClone(textDefault)
//         item.title.content.join('\n')
//         // console.log('content', typeof item.title.content.join('\n'));
//         if (item.title.content.join('\n').length > 0) {
//           textObj.title.content = item.title.content.join('\n')
//           textObj.title.styles.fontSize = getKeyByValue(sizeEnumObj, item.title.size)
//           textObj.title.styles.color = getKeyByValue(colorEnumObj, item.title.color)
//           textObj.title.styles.textAlign = item.title.align
//         }
//         if (item.text.content.join('\n').length > 0) {
//           textObj.text.content = item.text.content.join('\n')
//           textObj.text.cStyles.fontSize = getKeyByValue(sizeEnumObj, item.text.size)
//           textObj.text.cStyles.color = getKeyByValue(colorEnumObj, item.text.color)
//           textObj.text.cStyles.textAlign = item.text.align
//         }
//         textObj.id = uuidv4()
//         textObj.type = 'text'
//         moduleList.value.push(textObj)
//       } else if (item.widgetName === 'raShowcase') {
//         let imgObj = deepClone(imgDefaulet)
//         if (item.type === 'roll') {
//           imgObj.img = item.blocks.map(blockItem => {
//             return {
//               src: [
//                 {
//                   url: processImageSource(blockItem.img.src),
//                   checked: true,
//                   id: uuidv4(),
//                   width: blockItem.img.widthMobile,
//                   height: blockItem.img.heightMobile,
//                 }
//               ],
//               open: true,
//               jumpUrl: blockItem.imgLink,
//               alt: blockItem.img.alt,
//               style: {
//                 width: getKeyByValue(picPosition, blockItem.img.position),
//                 select: 0,
//                 margin: "0 auto",
//                 display: "block"
//               }
//             }
//           })
//           imgObj.id = uuidv4()
//           imgObj.type = 'image'
//           moduleList.value.push(imgObj)
//         } else {
//           let imgTextObj = deepClone(imgTextDefaulet)
//           imgObj.id = uuidv4()
//           imgObj.type = 'text-image'
//           imgTextObj.imgText.dataType = item.type
//           imgTextObj.imgText.dataList = item.blocks.map(e => {
//             return {
//               src: [
//                 {
//                   url: processImageSource(e.img.src),
//                   checked: true,
//                   id: uuidv4(),
//                   width: e.img.widthMobile,
//                   height: e.img.heightMobile,
//                 }
//               ],
//               open: true,
//               imgTextStyle: {
//                 width: getKeyByValue(picPosition, e.img.position),
//                 height: "100%",
//                 select: 0,
//                 margin: "0 auto",
//                 display: "block"
//               },
//               title: {
//                 content: e.title.content.join('\n').length > 0 ? e.title.content.join('\n') : "",
//                 active: "",
//                 styles: {
//                   fontSize: getKeyByValue(sizeEnumObj, e.title.size),
//                   color: getKeyByValue(colorEnumObj, e.title.color),
//                   textAlign: e.title.align,
//                   width: '100%',
//                   height: '100px',
//                   marginTop: "20px"
//                 },
//               },
//               text: {
//                 content: e.text.content.join('\n').length > 0 ? e.text.content.join('\n') : "",
//                 active: "",
//                 cStyles: {
//                   fontSize: getKeyByValue(sizeEnumObj, e.text.size),
//                   color: getKeyByValue(colorEnumObj, e.text.color),
//                   textAlign: e.text.align,
//                   width: '100%',
//                   height: '100px',
//                   marginTop: "20px"
//                 },
//               }
//             }
//           })
//           moduleList.value.push(imgTextObj)
//         }
//       }
//     })

//   }
// }, {
//   immediate: true
// })



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
      width: 1400px;
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
        min-height: 330px;
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
      width: 760px;
      // width: 640px;
      max-height: 1000px;
      min-height: 330px;
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
            flex-wrap: wrap;

            &>div {
              width: calc((100% - 20px) / 2);
              margin: 10px 5px 0;

              .top {
                background: rgba(14, 50, 103, 0.04);
                height: 160px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                overflow: hidden;
                flex-direction: column;

                img {
                  max-width: 100%;
                  max-height: 100%;
                }

                .tip {
                  span {
                    &:last-child {
                      text-align: center;
                    }
                  }
                }
              }
            }
          }

          .tileLFlex {
            display: flex;
            flex-wrap: wrap;

            &>div {
              width: calc((100% - 30px) / 3);
              margin: 10px 5px 0;

              .top {
                background: rgba(14, 50, 103, 0.04);
                width: 100%;
                height: 160px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                flex-direction: column;

                img {
                  max-width: 100%;
                  max-height: 100%;
                }

                span {
                  &:last-child {
                    text-align: center;
                  }
                }
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
                justify-content: center;
                width: 50%;

                img {
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: cover;
                }
              }

              .textareas {
                height: 250px;
                margin: 5px 5px 5px 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 50%;
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
                justify-content: center;
                width: 50%;

                img {
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: cover;
                }
              }

              .textareas {
                height: 250px;
                margin: 5px 5px 5px 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 300px;
                width: 50%;
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
      width: 350px;
      padding: 20px;
      background-color: #fff;
      border-left: 1px solid #e8e8e8;
      max-height: 1000px;
      overflow-y: auto;

      :deep(.rightForm) {
        .ant-form-item-row .ant-form-item-control .ant-form-item-control-input {
          // text-align: right;
          display: flex;
          align-items: flex-end;
        }

        .textColors {
          display: flex;
          margin-bottom: 5px;
          justify-content: flex-start;

          .colorItems {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin: 0 5px;
            box-sizing: border-box;
            cursor: pointer;

            &:nth-child(1)::before {
              content: '';
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              margin: 1px;
              background-color: #263c53;
            }

            &:nth-child(2)::after {
              content: '';
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              margin: 1px;
              background-color: #57697b;
            }

            &:nth-child(3)::after {
              content: '';
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              margin: 1px;
              background-color: #8e9ba6;
            }

            &:last-child::after {
              content: '';
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              margin: 1px;
              border: 1px solid #ccc;
              background-color: #fff;
            }
          }

          .cheacd {
            width: 20px;
            height: 20px;
            border: 1px solid #1677ff;
            border-radius: 50%;
            cursor: pointer;
            box-sizing: border-box;
          }
        }

        .showImgCont {
          display: block;
          margin-top: 20px;

          .picPosition {
            .item {
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              margin: 0 8px;
              cursor: pointer;

              span {
                margin-top: 5px;
              }

              .itemActive {
                border: 1px solid #1677ff;
                padding: 0 2px;
              }
            }
          }
        }

        .noneImgCont {
          display: none;
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
      }

      .titleAreas {
        height: 50px !important;
        margin-top: 5px;
      }

      .areas {
        height: 100px !important;
      }

      .canvas-component.active {
        border: 1px solid #00aaff;
      }
    }
  }
}
}
</style>
