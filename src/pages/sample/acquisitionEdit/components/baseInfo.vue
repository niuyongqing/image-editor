<template>
<div id="acquisitionEdit_baseInfo" class="acquisitionEdit_baseInfo">
  <a-card style="text-align: left;">
    <template #title>
      ERP信息 <span style="color: #9fa0a2">（注：下列信息，仅在本系统生效）</span>
    </template>
    <a-form :model="formData" ref="ERPformRef" :label-col="{ span: 3 }">
      <a-form-item label="ERP分类" name="erpProductId">
        <a-dropdown 
          :trigger="['click']"
          overlayClassName="baseInfo-typeTree_overlay"
          v-model:open="typeTreeDropdown"
        >
          <a-button style="width: 300px; text-align: left;">
            {{ formData.productCategoryName ? formData.productCategoryName : '请选择分类' }}
          </a-button>
          <template #overlay>
            <typeTree 
              :platform="props.productData.classPlatform" 
              v-model:current-class="formData.productCategoryId"
              v-model:nodePath="formData.nodePath"
              ref="typeTreeRef"
              @update:nodePath="updateNodePath"
              default-class
            ></typeTree>
          </template>
        </a-dropdown>
        <a-button type="link" @click="showCategoryModal"> + 管理分类 </a-button>
      </a-form-item>
      <a-form-item label="来源URL" name="sourceUrl">
        <a-input 
          v-model:value="formData.sourceUrl" 
          placeholder="" 
          disabled
          style="width: 60%;"
        >
          <template #addonBefore>1</template>
          <template #addonAfter>
            <a-button type="link" @click="visitUrl(formData.sourceUrl)"
              style="height: 20px; line-height: 20px;">
              访问
            </a-button>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
  </a-card>
  <br>
  <a-card style="text-align: left;">
    <template #title>
      产品信息 
    </template>
    <a-form :model="formData" ref="productFormRef" :label-col="{ span: 3 }">
      <a-form-item label="SPU" name="spu">
        <a-input 
          v-model:value="formData.spu" 
          placeholder="可自定义填写内容，方便卖家在后台识别是什么产品，该内容不在平台商城展示" 
          style="width: 60%;"
        />
        <a-tooltip>
          <template #title>
            <p>SKU:卖家自己自定义，方便卖家识别具体型号/规格/颜色1大小等具体产品</p>
            <p>SPU:卖家自己自定义，方便商家识别是什么产品，不包含具体型号/规格颜色/大小等信息</p>
            <p>举例:华为P60手机壳 有红色 黑色那么SKU可写为:HuaweiP60-red HuaweiP60-black其中SPU就是HuaweiP60</p>
          </template>
          <span style="color: #1677ff; margin-left: 8px; cursor: pointer;">详细说明</span>
        </a-tooltip>
      </a-form-item>
      <a-form-item label="产品标题" name="productTitle">
        <a-input 
          v-model:value="formData.productTitle" 
          placeholder="" 
          show-count
          style="width: 60%;"
        >
          <template #addonAfter>
            <a-tooltip>
              <template #title>把单词首字母转为大写(点击生效)</template>
              <AsyncIcon 
                icon="FontSizeOutlined"
                style="color: #1677ff; cursor: pointer;"
                @click="titleCase5(formData.productTitle)"
              ></AsyncIcon>
            </a-tooltip>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
  </a-card>
  <!-- 分类管理 -->
  <typeManage 
    v-model:modal-open="typeManageOpen" 
    :platform="props.productData?.classPlatform" 
    @updateTree="updateTree"
  ></typeManage>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import typeTree from '@/components/classificationTree/typeTree.vue'
import typeManage from '@/components/classificationTree/typeManage.vue';
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'
defineOptions({ name: "acquisitionEdit_baseInfo" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:baseInfoData'])
const props = defineProps({
  baseInfoData: {
    type: Object,
    default: () => {}
  },
  productData: {
    type: Object,
    default: () => {}
  }
})
const typeTreeDropdown = ref(false)
const typeManageOpen = ref(false);
//  管理分类-弹窗
const showCategoryModal = () => {
  typeManageOpen.value = true;
};


const formData = reactive({
  productCategoryId: '', // 产品分类
  spu: '', // 产品信息-SPU
  productTitle: '', // 产品标题
  sourceUrl: '',// 来源URL

  productCategoryName: '',
  nodePath: '',
})
watch(() => props.productData?.id, (val) => {
  // console.log(111);
  openFn()
})
watch(() => formData, (val) => {
  // console.log({ val });
  let obj = {
    productCategoryId: val.productCategoryId,
    spu: val.spu,
    productTitle: val.productTitle,
  }
  emit('update:baseInfoData', obj)
}, {
  deep: true
})
// 页面赋值
function openFn() {
  formData.productCategoryId = props.productData.productCategoryId
  formData.spu = props.productData.spu
  formData.productTitle = props.productData.productTitle
  formData.sourceUrl = props.productData.originUrl
  // 加载下拉框中的树组件
  typeTreeDropdown.value = true
  nextTick(() => {
    typeTreeDropdown.value = false
  })
}
// 节点变化
function updateNodePath(val) {
  // console.log(val);
  let nameList = val.split('>')
  formData.productCategoryName = nameList[nameList.length - 1]
  typeTreeDropdown.value = false
}
// 更新树数据
async function updateTree() {
  try {
    await _this.$refs.typeTreeRef?.updateTree()
  } catch (error) {
    console.error(error)
  }
}
function visitUrl(url) {
  window.open(url)
}
// 首字母大写
function titleCase5(val) {
  formData.productTitle = val.toLowerCase().split(/\s+/).reduce((prev, item, array) => {  
    return prev + (prev.trim() && ' ') + item.slice(0, 1).toUpperCase() + item.slice(1);  
  }, '');
}
</script>
<style lang="less" scoped>

</style>
<style lang="less">
.baseInfo-typeTree_overlay {
  max-width: 300px;
  height: 300px;
  background: #fff;
  padding: 10px;
}
</style>