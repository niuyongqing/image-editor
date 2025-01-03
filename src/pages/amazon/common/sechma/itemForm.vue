<template>
<div class="item-form">
  <div
    v-if="noLeaf.length"
  >
    <div
      v-for="item in noLeaf" 
      :key="item._key" 
    > 
      <div class="title">
        <span>{{ item.title }}</span>
      </div>
      <itemForm :children="item.children" :paramsKey="item._key" @itemParams="itemParams"></itemForm>
    </div>
  </div>
  <a-form
    :model="formState"
    ref="formRef"
    v-if="isLeaf.length"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    :rules="rules"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      :label="item.title"
      :key="item.title"
      v-for="item in isLeaf"
      :name="item._key"
      :tooltip="item.description ? item.description : ''"
    >
      <!-- <span slot="label" >自定义label</span> -->
      <div class="item-content" v-if="['inputNumber'].includes(item.itemType)">
        <!-- 数字输入框 -->
        <a-input-number v-model:value="formState[item._key]" :min="item.minimum ? item.minimum:0" :max="item.maximum ? item.maximum:99999999" />
      </div>
      <div class="item-content" v-if="['input'].includes(item.itemType)">
        <!-- 文字输入框 -->
        <a-input v-model:value="formState[item._key]"></a-input>
      </div>
      <div class="item-content" v-if="['date'].includes(item.itemType)">
        <!-- 日期 -->
        <a-date-picker valueFormat="YYYY-MM-DD" v-model:value="formState[item._key]" />
      </div>
      <div class="item-content" v-if="['checkbox'].includes(item.itemType)">
        <!-- 多选框 -->
         <div style="max-height: 200px; overflow-y: auto;">
           <a-checkbox-group 
            v-model:value="formState[item._key]" 
            style="width: 100%"
           >
             <a-checkbox 
               :value="i.val"
               v-for="i in item.valueList"
               :key="i.val"
             >{{ i.label }}</a-checkbox>
           </a-checkbox-group>
         </div>
        <a-form-item-rest v-if="item.editable">
          <div class="edit-input">
            <a-input v-model:value="addValue"></a-input>
            <a-button type="primary" @click="addValItem(item)">添加</a-button>
          </div>
        </a-form-item-rest>
      </div>
      <div class="item-content" v-if="['radioEdit'].includes(item.itemType)">
        <!-- 单选框 -->
        <div>
          <a-radio-group v-model:value="formState[item._key]">
            <a-radio 
              :value="i.val"
              :key="i.label"
              v-for="i in item.valueList"
            >{{ i.label }}</a-radio>
          </a-radio-group>
          <br />
          <a-form-item-rest>
            <div class="edit-input">
              <a-input v-model:value="addValue"></a-input>
              <a-button type="primary" @click="addValItem(item)">添加</a-button>
            </div>
          </a-form-item-rest>
        </div>
      </div>
      <div class="item-content" v-if="['radio'].includes(item.itemType)">
        <!-- 单选框 -->
        <div>
          <a-radio-group v-model:value="formState[item._key]">
            <a-radio 
              :value="i.val"
              :key="i.label"
              v-for="i in item.valueList"
            >{{ i.label }}</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="item-content" v-if="['select'].includes(item.itemType)">
        <!-- 下拉框 -->
        <div>
          <a-select
            v-model:value="formState[item._key]"
            show-search
            placeholder="Select a person"
            style="width: 200px"
            :filter-option="filterOption"
          >
            <a-select-option 
              :value="i.val"
              v-for="i in item.valueList"
              :key="i.label"
            >{{ i.label }}</a-select-option>
          </a-select>
        </div>
      </div>
    </a-form-item>
  </a-form>
</div>
</template>

<script setup>
import itemForm from '@/pages/amazon/common/sechma/itemForm.vue'
import { ref, reactive, onMounted, computed, watch, watchPostEffect, getCurrentInstance } from 'vue'
defineOptions({
  name: "itemForm"
})
const emit = defineEmits(['itemParams'])
onMounted(() => {
  
})
const props = defineProps({
  children: {
    type: Array,
    required: true,
    default: () => []
  },
  paramsKey: {
    type: String,
    required: true,
    default: () => ""
  }
})
const formRef = ref();
const children = ref(props.children);
const _noLeaf = children.value.filter(i => (i.children && i.children.length));
const _isLeaf = children.value.filter(i => {
  return !(i.children && i.children.length) && !['marketplace_id', 'language_tag'].includes(i._key);
})
const _rules = {};
_isLeaf.forEach(item => {
  // console.log({'item.isRequired': item.isRequired, item});
  
  if (item.isRequired) {
    let isBlur = ['input', 'inputNumber'].includes(item.itemType)
    _rules[item._key] = []
    let obj = {
      required: true,
      message: '请选择或填写内容！',
      trigger: isBlur ? 'blur':'change',
    }
    if (item.itemType === 'checkbox') {
      obj.type = 'array'
    }
    _rules[item._key].push(obj)
  }
})
const noLeaf = ref(_noLeaf)       // 继续向下展示
const isLeaf = ref(_isLeaf)       // 表单展示
const rules = ref(_rules)         // 校验规则
const formState = reactive({
  // username: '',
  // password: '',
  // remember: true,
});
const addValue = ref('')
const form = ref({});
if (isLeaf.value.length > 0) {
  isLeaf.value.forEach(item => {
    console.log({item}, item._key);
    
    // inputNumber
    // input
    // date
    // checkbox
    // radioEdit
    // select
    // radio
    switch (item.itemType) {
      case 'inputNumber':
        formState[item._key] = 0
        break;
      case 'input': 
        formState[item._key] = ''
        break;
      case 'date': 
        formState[item._key] = ''
        break;
      case 'checkbox': 
        formState[item._key] = []
        break;
      case 'radioEdit': 
        formState[item._key] = ''
        break;
      case 'select': 
        formState[item._key] = ''
        break;
      case 'radio': 
        formState[item._key] = ''
        break;
      default:
        break;
    }
  })
}
const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const addValItem = (val) => {
  // console.log({'addValue.value': addValue.value, addValue});
  
  let obj = {
    label: addValue.value,
    val: addValue.value
  }
  val.valueList.push(obj)
  // console.log({val}, formState[val._key]);
  if (Array.isArray(formState[val._key])) {
    formState[val._key].push(addValue.value)
  } else {
    formState[val._key] = addValue.value
  }
  addValue.value = ''
  formRef.value.clearValidate(val._key)
}
const filterOption = (input, option) => {
  return option.value.indexOf(input) >= 0;
}
const itemParams = (val) => {
  // console.log({val}, '参数');
  let obj = children.value.find(i => i._key === val.paramsKey)
  // console.log({obj}, props.paramsKey, val.paramsKey);
  let params = {
    params: {},
    paramsKey: props.paramsKey
  }
  if (obj.type === 'object') {
    params[obj._key] = { ...val.params }

  } else if (obj.type === 'array') {
    params.params[obj._key] = [{...val.params}]
  }
  emit('itemParams', params)
}
watch(formState, (val) => {
  // console.log(111, {val});
  let obj = {}
  for (const key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) {
      const element = val[key];
      if (Array.isArray(element)) {
        obj[key] = element.join()
      } else {
        obj[key] = element
      }
    }
  }
  let params = {
    params: obj, 
    paramsKey: props.paramsKey
  }
  emit('itemParams', params)
}, {
  deep: true
})
</script>
<style lang="less" scoped>
.item-form {
  padding: 5px;
  .title {
    display: flex;
    justify-content: flex-start;
    span {
      margin-left: 20px;
      font-size: 16px;
      font-weight: 500;
    }
  }
  ::v-deep(.ant-form-item-label) {
    word-wrap:break-word; 
    word-break:break-all; 
    .ant-form-item-required {
      height: auto;
      overflow: auto;
      white-space: pre-wrap;
    }
  }
  ::v-deep(.ant-form-item-explain-error) {
    text-align: left;
  }
}
.item-content {
  display: flex;
  // justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  .edit-input {
    margin-top: 16px;
    display: flex;
  }
  ::v-deep(.ant-input) {
    width: 200px;
  }
}
</style>