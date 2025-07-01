<template>
<div id="acquisitionEdit_variantInfo" class="acquisitionEdit_variantInfo">
  <a-card style="text-align: left;">
    <template #title>
      变种属性
    </template>
    <a-form :model="formData" ref="ERPformRef" :label-col="{ span: 3 }">
      <a-form-item 
        label="变种主题" 
        name="image_list"
      >
        <div class="box" style="width: 100%; display: flex; flex-direction: column;">
          <a-button style="width: 120px;" type="primary">添加变种属性</a-button>
          
          <div class="addVariant-btn" v-if="dialogType === 'globalAdd'">
            <a-button @click="variantTheme.isAddVariant = !variantTheme.isAddVariant" type="primary">添加自定义属性</a-button>
            <div class="addVariant-btn-input" v-show="variantTheme.isAddVariant">
              <a-input 
                style="width: 200px;"  
                v-model="variantTheme.addVariantTitle" 
                placeholder="请输入内容"
                @blur="AddVariant('check')"
              ></a-input>
              <i class="a-icon-check" @click="AddVariant('check')"></i>
              <i class="a-icon-refresh-left" @click="AddVariant('refresh')"></i>
            </div> 
          </div>

        </div>
      </a-form-item>
    </a-form>
  </a-card>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "acquisitionEdit_variantInfo" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:variantInfoData'])
const props = defineProps({
  variantInfoData: {
    type: Object,
    default: () => {}
  },
  productData: {
    type: Object,
    default: () => {}
  }
})
const formData = reactive({
  variantList: [],
  tableData: [],
})
const variantTheme = reactive({
  addVariantTitle: '',
  isAddVariant: false,
})
watch(() => props.productData?.id, (val) => {
  // console.log(111);
  openFn()
  getWatermarkList()
})
function openFn() {

}
// 添加主题
function AddVariant(key, val = {}) {
  switch (key) {
    case 'check':
      let obj = {
        id: (val && val.id) || variantTheme.addVariantTitle + '_add_xinZhan',
        name: (val && val.name) || variantTheme.addVariantTitle,
        values: (val && val.values) || [],
        isRequried: val.isRequried || false,
        addItemValue: '',
        addTitleValue: '',
        showInput: false,
      }
      formData.variantList.push(obj)
      // let formItem = {
      //   id: obj.id,
      //   name: obj.name,
      //   params: []
      // }
      // variantTheme.$set(this.form, obj.id, formItem)
      break;
    case 'refresh':
      break;
    default:
      break;
  }
  variantTheme.addVariantTitle = ''
  variantTheme.isAddVariant = false
}
</script>
<style lang="less" scoped>

</style>