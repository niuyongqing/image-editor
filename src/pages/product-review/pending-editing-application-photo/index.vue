<!-- 待编辑申请照片页面 -->
<template>
  <div class="pending-editing-container ml-16">
      <!-- 表单区域 -->
      <div class="form-wrapper">
        <a-form :model="formData" :label-col="labelCol" class="submit-form" :rules="formRules" ref="formRef"
          layout="inline" autocomplete="off">
          <!-- 产品基本信息行 -->
          <a-form-item label="产品名称:" class="w24">
            <a-input v-model:value="formData.productName" disabled allow-clear placeholder="请输入产品名称" />
          </a-form-item>
          <a-form-item label="产品分类:" class="w24">
            <a-cascader disabled placeholder="请选择产品分类" allowClear v-model:value="formData.productCategory"
              :options="commodityTypeList" :allow-clear="true"
              :field-names="{ label: 'label', value: 'value', children: 'children' }" />
          </a-form-item>
          <a-form-item label="产品SKU:" class="w24">
            <a-input v-model:value="formData.productSku" disabled allow-clear placeholder="请输入产品SKU" />
          </a-form-item>

          <!-- 竞品参考链接 -->
          <div class="form-row mt-16">
            <div class="form-item full-width">
              <a-form-item label="竞品参考链接:">
                <div class="reference-links">
                  <div v-for="(link, index) in formData.referenceLinks" :key="index" class="link-item">
                    <span class="link-number">{{ index + 1 }}</span>
                    <a-input v-model:value="formData.referenceLinks[index]" placeholder="请输入网址" allow-clear
                      class="link-input" />
                    <a-button type="text" @click="copyLink(index)" class="link-btn">复制</a-button>
                    <a-button type="text" @click="visitLink(index)" class="link-btn">访问</a-button>
                    <PlusCircleOutlined @click="addLink" class="link-btn ml-8 fz18 fz-16 color-1890ff" />
                    <MinusCircleOutlined @click="removeLink(index)" class="link-btn ml-8 fz-16"
                      :class="{ 'color-1890ff': formData.referenceLinks.length > 1 }" />
                  </div>
                </div>
              </a-form-item>
            </div>
          </div>

          <!-- 任务类型 -->
          <div class="form-row mt-16">
            <div class="form-item">
              <a-form-item label="任务类型:" name="taskType" :required-mark="false">
                <div class="task-type-container">
                  <a-select v-model:value="formData.taskType" :options="taskTypeOptions" placeholder="请选择任务类型"
                    @change="handleTaskTypeChange" allow-clear class="form-input">
                  </a-select>
                </div>
              </a-form-item>
            </div>
          </div>

          <!-- 处理要求 -->
          <div class="form-row mt-16">
            <div class="form-item full-width">
              <a-form-item label="处理要求:" name="processingRequirements">
                <div class="editor-container">
                  <wang-editor-plus v-model="formData.processingRequirements" style="text-align: left;" :height="300"
                    platform="pending-editing-application-photo" />
                </div>
              </a-form-item>
            </div>
          </div>

          <!-- 参考图 -->
          <div class="form-row mt-16">
            <div class="form-item">
              <a-form-item label="参考图:">
                <div class="imageList" v-if="formData.referenceImage.length > 0">
                  <div class="backImg" v-for="(value, index) in formData.referenceImage" :key="index">
                    <div style="position: relative; display: inline-block;">
                      <a-image style="position: relative;" :height="120" :src="value.url" />

                      <div class="flex justify-between postop3">
                        <a-dropdown>
                          <a-button type="link">
                            <BulbOutlined class="text-base" />
                            <CaretDownOutlined />
                          </a-button>
                          <template #overlay>
                            <a-menu @click="imgModifySingleMenuClick($event, value)">
                              <a-menu-item key="ps">在线p图</a-menu-item>
                              <a-menu-item key="translate">图片翻译</a-menu-item>
                            </a-menu>
                          </template>
                        </a-dropdown>
                        <a-button type="link" title="删除">
                          <DeleteOutlined class="text-base" @click="removeImage(index)" />
                        </a-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="formData.referenceImage.length > 0" style="position: absolute; top: 5px; right: 5px">
                  <AsyncIcon icon="CloseCircleOutlined" size="20px" color="black" @click="removeImage('all')" />
                </div>
                <a-upload name="file" class="headerImg" :headers="headers" accept=".jpg,.jpeg,.png" :action="uploadUrl"
                  :showUploadList="false" list-type="picture-card" @change="e => handleChangeColroImg(e, formData)"
                  :max-count="100">
                  <div>
                    <AsyncIcon icon="PlusOutlined" />
                    <div>上传图片</div>
                  </div>
                </a-upload>
              </a-form-item>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions mt-24">
            <a-button @click="handleClose" class="close-btn">关闭</a-button>
            <a-button type="primary" @click="handleSubmit" class="submit-btn">提交</a-button>
          </div>
        </a-form>
      </div>
      <!-- 图片翻译弹窗 -->
    <ImageTranslation
      ref="img_trans"
      @emitImages="handleEmitImages"
    />
    </div>
    
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, PlusCircleOutlined, MinusCircleOutlined, DeleteOutlined, BulbOutlined, CaretDownOutlined } from '@ant-design/icons-vue';
import WangEditorPlus from '@/components/wang-editor-plus/index.vue';
import DragUpload from '@/components/dragUpload/index.vue';
import { imageUpload } from '@/pages/sample/acquisitionEdit/js/api.js';
import commodityTypeList from "@/utils/commodityType";
import { watermarkList } from '@/pages/lazada/product/api';
import { useClipboard } from '@v-c/utils';
import EventBus from "~/utils/event-bus";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import ImageTranslation from '@/components/skuDragUpload/imageTranslation.vue'
import { v4 as uuidv4 } from 'uuid';
import { encryptString } from '@/utils/tools.js';

/**
 * 表单引用
 */
const formRef = ref();
const img_trans = ref();
const labelCol = { style: { width: '90px' } };


/**
 * 复制链接到剪贴板
 */
const { copy } = useClipboard();

/**
 * 任务类型选项
 */
const taskTypeOptions = reactive([
  {
    label: '运营提交',
    value: '0',
  },
  {
    label: 'shein提交',
    value: '1',
  },
  {
    label: '服务部提交',
    value: '2',
  },
  {
    label: 'OZON智能化刊登提交',
    value: '3',
  },
]);

/**
 * 表单数据模型
 */
const formData = reactive({
  productName: '',
  productCategory: '',
  productSku: '',
  referenceLinks: [''], // 初始化为空字符串数组，确保至少有一个链接输入框
  taskType: '',
  processingRequirements: '',
  referenceImage: [],
});
const headers = {
  Authorization: 'Bearer ' + useAuthorization().value
}
const uploadUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/img'
const apiParams = ref({});
const router = useRouter();
/**
 * 表单验证规则
 */
const formRules = {
  taskType: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ],
  processingRequirements: [
    { required: true, message: '请输入处理要求', trigger: 'blur' }
  ],
};

/**
 * 添加新的链接输入框
 */
const addLink = () => {
  // 确保 referenceLinks 是数组类型
  if (!Array.isArray(formData.referenceLinks)) {
    formData.referenceLinks = [];
  }
  formData.referenceLinks.push('');
};

/**
 * 删除链接输入框
 * @param index 要删除的链接索引
 */
const removeLink = (index) => {
  // 确保至少保留一个链接输入框
  if (Array.isArray(formData.referenceLinks) && formData.referenceLinks.length > 1) {
    formData.referenceLinks.splice(index, 1);
  } else {
    message.warning('至少需要保留一个竞品参考链接');
  }
};

/**
 * 复制链接到剪贴板
 */
const copyLink = (index) => {
  const link = formData.referenceLinks[index];
  if (!link) {
    message.warning('链接为空，无法复制');
    return;
  }
  copy(link)
  message.success(`复制成功：${link}`);
};

/**
 * 访问链接
 */
const visitLink = (index) => {
  const link = formData.referenceLinks[index];
  if (!link) {
    message.warning('链接为空，无法访问');
    return;
  }
  window.open(link, '_blank');
};

/**
 * 处理任务类型变化
 */
const handleTaskTypeChange = (value) => {
  formData.taskType = value;
}

/**
 * 处理图片上传
 * @param info 上传信息
 * @param formData 表单数据
 */
const handleChangeColroImg = (info, formData) => {
  console.log(info.file);

  if (info.file.status === 'done') {
    if (info.file.response.code === 200) {
      formData.referenceImage.push({
        name: info.file.response.originalFilename,
        // url: '/prod-api' + info.file.response.url,
        url: import.meta.env.VITE_APP_BASE_API + info.file.response.url,
        checked: false,
        id: uuidv4(),
        width: info.file.response.width,
        height: info.file.response.height
      })
    } else {
      message.error('图片上传有误！')
    }
  }
}

/**
 * 美图设计室图片处理
 * @param {Object} params - 处理参数
 * @param {string} params.imageData - 图片数据的base64编码
 */
const mtImageEBaseUrl = ref("");
const channel = new BroadcastChannel('mtImageEditor');
channel.onmessage = (event) => {
  // console.log('接收到美图设计室回传图片数据:', event.data);

  // 数据有效性检查
  if (!event.data || !event.data.base64) {
    console.error('美图设计室回传数据不完整或无效');
    message.error('图片数据处理失败，请重试');
    return;
  }

  MtImageEBaseUrl({ imageData: event.data.base64 }).then((res) => {
    // console.log('上传处理结果:', res);

    if (res.code === 200 && res.msg) {
      mtImageEBaseUrl.value = res.msg;


      // 更新对应ID的图片数据，同时保存编辑记录ID用于二次编辑
      if (event.data.imageId) {
        updateImageById(event.data.imageId, mtImageEBaseUrl);
      }
    } else {
      console.error('图片上传处理失败:', res);
      message.error(res.msg || '图片处理失败，请重试');
    }
  }).catch((error) => {
    console.error('美图设计室图片处理异常:', error);
    message.error('图片处理过程中发生错误');
  });
};

/**
 * 根据图片ID更新组件内的图片数据
 * @param {string} imageId - 图片ID
 * @param {string} newImageUrl - 新的图片URL
 */
function updateImageById(imageId, newImageUrl) {
  // 遍历所有的图片列表
  const targetImage = formData.referenceImage.find((img) => img.id === imageId);
  if (targetImage) {
    // 更新目标图片URL - 确保使用ref.value获取实际URL值
    targetImage.url = newImageUrl.value;
    message.success('图片修改成功！');
  }
}

/**
 * 编辑单张图片
 * @param {Object} params - 编辑参数
 * @param {string} params.key - 编辑操作类型
 * @param {Object} params.item - 要编辑的图片对象
 */
function imgModifySingleMenuClick({ key }, item) {
  switch (key) {
    case 'translate':
      translateImageList.value = [item];
      imgTransRef.value.showModal([item]);
      break;
    case 'ps':
      // 调用findRecordIdByUrl函数
      // const foundRecordId = findRecordIdByUrl(item.url);
      console.log('item', item);

      const urlData = router.resolve({
        path: '/platform/ozon/editPsImage',
        query: { imageUrl: item.url, imageId: item.id }
      });
      // 对整个URL进行加密
      try {
        const encryptedUrl = encryptString(urlData.href);
        window.open(`/platform/ozon/editPsImage?encryptedData=${encodeURIComponent(encryptedUrl)}`, '_blank');
      } catch (error) {
        console.error('URL加密失败:', error);
        // 加密失败时使用原始URL作为备用方案
        window.open(urlData.href, '_blank');
      }
      break;
    default:
      break;
  }
}


/**
 * 删除图片
 * @param index 图片索引
 */
const removeImage = (index) => {
  if (index === 'all') {
    formData.referenceImage = [];
    return;
  }
  formData.referenceImage.splice(index, 1);
}

/** 图片翻译 */
  const translateImageList = ref([])
  const imgTransRef = useTemplateRef('img_trans')
  function handleEmitImages(list) {
    list.forEach(item => {
      translateImageList.value.forEach(image => {
        if (image.url === item.oldUrl) {
          image.url = processImageSource(item.newUrl)
        }
      })
    })
  }

/**
 * 处理关闭操作
 */
const handleClose = () => {
  // 这里可以添加关闭前的确认逻辑
  window.close();
};

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    // 提交表单数据的逻辑
    console.log('提交的表单数据:', formData);
    message.success('提交成功');
  } catch (error) {
    console.log('表单验证失败:', error);
  }
};

/**
 * 水印列表 - 用于dragUpload组件
 */
const waterList = ref([]);
const getWatermark = () => {
  watermarkList().then((res) => {
    if (res.code === 200) {
      waterList.value = res.data || [];
    }
  });
};
/**
 * 页面加载时获取水印列表
 */
onMounted(() => {
  getWatermark();
});

/**
 * 组件卸载时关闭 BroadcastChannel 避免内存泄漏
 */
onUnmounted(() => {
  channel.close();
});

</script>

<style scoped lang="less">
@import '@/assets/styles/com-detail.less';
</style>