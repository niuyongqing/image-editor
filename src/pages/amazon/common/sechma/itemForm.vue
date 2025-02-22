<template>
<div class="item-form">
  <div
    v-if="itemData.noLeaf.length"
  >
    <div
      v-for="item in itemData.noLeaf" 
      :key="item._key" 
    > 
      <div class="title">
        <span>{{ item.title }}</span>
      </div>
      <itemForm 
        ref="itemFormRef" 
        :children="item.children" 
        :paramsKey="item._key" 
        @itemParams="itemParams"
      ></itemForm>
    </div>
  </div>
  <a-form
    :model="itemData.formState"
    ref="formRef"
    v-if="showIsLeaf.length"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
  >
    <a-form-item
      :label="item.title"
      :key="item.title"
      v-for="item in showIsLeaf"
      :name="item._key"
      :tooltip="item.description ? item.description : ''"
      :rules="item.rules"
    >
      <div class="item-content" v-if="['inputNumber'].includes(item.itemType)">
        <!-- 数字输入框 -->
        <a-input-number 
          v-model:value="itemData.formState[item._key]" 
          :min="item.minimum ? item.minimum:0" 
          :max="item.maximum ? item.maximum:99999999" 
          @blur="proactivelyChange"
        />
      </div>
      <div class="item-content" v-if="['input'].includes(item.itemType)">
        <!-- 文字输入框 -->
        <a-input 
          v-model:value="itemData.formState[item._key]"
          @blur="proactivelyChange"
        />
      </div>
      <div class="item-content" v-if="['date'].includes(item.itemType)">
        <!-- 日期 -->
        <a-date-picker 
          valueFormat="YYYY-MM-DD" 
          v-model:value="itemData.formState[item._key]"
          @openChange="val => val ? '' : proactivelyChange()" 
        />
      </div>
      <div class="item-content" v-if="['checkbox'].includes(item.itemType)">
        <!-- 多选框 -->
        <div style="max-height: 200px; overflow-y: auto;">
          <a-checkbox-group 
            v-model:value="itemData.formState[item._key]" 
            style="width: 100%"
          >
            <a-checkbox 
              :value="i.val"
              v-for="i in item.valueList"
              :key="i.val"
              @focus="proactivelyChange"
            >{{ i.label }}</a-checkbox>
          </a-checkbox-group>
        </div>
        <a-form-item-rest v-if="item.editable">
          <div class="edit-input">
            <a-input v-model:value="itemData.addValue"></a-input>
            <a-button type="primary" @click="addValItem(item)">添加</a-button>
          </div>
        </a-form-item-rest>
      </div>
      <div class="item-content" v-if="['radioEdit'].includes(item.itemType)">
        <!-- 单选框 -->
        <div style="max-height: 200px; overflow-y: auto;">
          <a-radio-group v-model:value="itemData.formState[item._key]">
            <a-radio 
              :value="i.val"
              :key="i.label"
              @focus="proactivelyChange"
              v-for="i in item.valueList"
            >{{ i.label }}</a-radio>
          </a-radio-group>
          <br />
        </div>
        <a-form-item-rest>
          <div class="edit-input">
            <a-input v-model:value="itemData.addValue"></a-input>
            <a-button type="primary" @click="addValItem(item)">添加</a-button>
          </div>
        </a-form-item-rest>
      </div>
      <div class="item-content" v-if="['radio'].includes(item.itemType)">
        <!-- 单选框 -->
        <div>
          <a-radio-group v-model:value="itemData.formState[item._key]">
            <a-radio 
              :value="i.val"
              :key="i.label"
              @focus="proactivelyChange"
              v-for="i in item.valueList"
            >{{ i.label }}</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="item-content" v-if="['select'].includes(item.itemType)">
        <!-- 下拉框 -->
        <div>
          <a-select
            v-model:value="itemData.formState[item._key]"
            show-search
            placeholder="Select a person"
            style="width: 200px"
            :filter-option="filterOption"
            @select="proactivelyChange"
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
import { ref, reactive, onMounted, computed, watch, watchPostEffect, getCurrentInstance, inject } from 'vue'
defineOptions({
  name: "itemForm"
})
const { proxy: _this } = getCurrentInstance();
const emit = defineEmits(['itemParams'])
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
  },

})
const showIsLeaf = computed(() => {
  return itemData.isLeaf.filter(i => !['marketplace_id', 'language_tag'].includes(i._key))
})
const itemData = reactive({
  noLeaf: [],     // 还有子节点的数据
  isLeaf: [],     // 最终节点
  data: [],       // 当前渲染数据
  addValue: '',
  formState: {},
})
onBeforeMount(() => { })
watch(() => props.children, (val) => {
  let data = JSON.parse(JSON.stringify(props.children))
  // console.log({ isLeaf, noLeaf });
  nextTick(() => {
    let { isLeaf, noLeaf } = setNodeData(data);
    updateFormData(isLeaf, itemData.isLeaf, itemData.formState)
    updateFormData(noLeaf, itemData.noLeaf)
  })
}, {
  deep: true,
  immediate: true
})
/**
 * 处理现有数据
 * @param val 新数据
 * @param oldVal 原有数据，在此基础上更新
 * @param form 表单参数对象
 */
function updateFormData(val, oldVal, form = null) {
  // 通过新数据对比更新旧数据
  if (val.length !== oldVal.length) {
    let isAdd = val.length > oldVal.length
    let longArr = isAdd ? val : oldVal
    let shortArr = isAdd ? oldVal : val
    // 找出不同的项，在原数据中添加或减少项
    let extraValues = longArr.filter(item => {
      return !shortArr.some(i => i._key === item._key)
    })
    if (isAdd) {
      oldVal.push(...extraValues)
      // 更新表单参数
      if (form) {
        let newForm = handleFormData(extraValues, {})
        Object.keys(newForm).forEach(key => {
          form[key] = newForm[key]
        })
      }
    } else {
      extraValues.forEach(item => {
        let index = oldVal.findIndex(i => i._key === item._key);
        oldVal.splice(index, 1);
        // 更新表单参数
        form && delete form[item._key];
      })
    }
  } else {
    // 如果属性个数相等，找出差别的属性添加或删除
    let addValue = val.filter(item => {
      return !oldVal.some(i => i._key === item._key)
    })
    let delValue = oldVal.filter(item => {
      return !val.some(i => i._key === item._key)
    })
    delValue.forEach(item => {
      let index = oldVal.findIndex(i => i._key === item._key)
      oldVal.splice(index, 1)
      // 更新表单参数
      form && delete form[item._key];
    })
    oldVal.push(...addValue)
    // 更新表单参数
    if (form) {
      let newForm = handleFormData(addValue, {})
      Object.keys(newForm).forEach(key => {
        form[key] = newForm[key]
      })
    }
    if (addValue.length < 1 && delValue.length < 1) {
      // 如果属性没有改变，深度对比子属性
      val.forEach(item => {
        let obj = oldVal.find(i => i._key === item._key)
        if (obj.children && item.children) {
          updateFormData(item.children, obj.children, form[obj._key][0])
        }
      })
    }
  }
}
// 找出需要继续递归渲染的节点和表单节点
function setNodeData(data) {
  let isLeaf = data.filter(i => {
    return !(i.children && i.children.length)
    // return !(i.children && i.children.length) && !['marketplace_id', 'language_tag'].includes(i._key);
  })
  let noLeaf = data.filter(i => (i.children && i.children.length))
  return { isLeaf, noLeaf };
}
// 表单参数
function handleFormData(data, form) {
  // 处理表单节点
  data.forEach(item => {
    // console.log({item}, item._key);

    // inputNumber
    // input
    // date
    // checkbox
    // radioEdit
    // select
    // radio
    let value = ''
    let valueItem = null
    if (item.examples && item.examples.length > 0) {
      value = item.examples[0];
      item.valueList && (valueItem = item.valueList.find(val => val.label === value));
    }
    switch (item.itemType) {
      case 'inputNumber':
        form[item._key] = value || 0
        break;
      case 'input': 
        form[item._key] = value
        break;
      case 'date': 
        form[item._key] = value
        break;
      case 'checkbox': 
        form[item._key] = []
        value.split(',').forEach(i => {
          let valueItem = item.valueList.find(val => val.label === i)
          valueItem && form[item._key].push(valueItem.val)
        })
        break;
      case 'radioEdit': 
        form[item._key] = valueItem?.val || ''
        break;
      case 'select': 
        form[item._key] = valueItem?.val || ''
        break;
      case 'radio': 
        form[item._key] = valueItem?.val || ''
        break;
      default:
        break;
    }
    if (item.isRequired) {
      item.rules = []
      let isBlur = ['input', 'inputNumber'].includes(item.itemType)
      let obj = {
        required: true,
        message: isBlur ? `请填写${item.title}！` : `请选择或添加${item.title}！`,
        trigger: isBlur ? 'blur':'change',
      }
      if (item.itemType === 'checkbox') {
        obj.type = 'array'
      }
      item.rules.push(obj)
    }
  })
  return form
}
// 添加选项
function addValItem(val) {
  // console.log({'itemData.addValue': itemData.addValue, addValue});
  let obj = {
    label: itemData.addValue,
    val: itemData.addValue
  }
  val.valueList.push(obj)
  // console.log({val}, itemData.formState[val._key]);
  if (Array.isArray(itemData.formState[val._key])) {
    itemData.formState[val._key].push(itemData.addValue)
  } else {
    itemData.formState[val._key] = itemData.addValue
  }
  itemData.addValue = ''
  _this.$refs.formRef.clearValidate(val._key)
  proactivelyChange()
}
const filterOption = (input, option) => {
  return option.value.indexOf(input) >= 0;
}
// 获取最顶层值变化的处理方法
const valueChange = inject('valueChange')
// 主动变更值
function proactivelyChange(val) {
  // nextTick(() => valueChange())
  setTimeout(() => {
    valueChange(val)
  }, 50);
}
// 向外界暴露参数
function itemParams(val) {
  // console.log({val}, '参数');
  let obj = props.children.find(i => i._key === val.paramsKey)
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
watch(() => itemData.formState, (val) => {
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
function resetFieldsFn() {
  if (itemData.noLeaf.length > 0) {
    _this.$refs.itemFormRef.forEach(item => item.resetFieldsFn())
  } else {
    _this.$refs.formRef.resetFields()
  }
}
// 校验方法
async function validateFieldsFn() {
  // console.log(itemData.noLeaf.length > 0, _this.$refs);
  let result = false
  if (itemData.noLeaf.length > 0) {
    let list = []
    for (let index = 0; index < _this.$refs.itemFormRef.length; index++) {
      const item = _this.$refs.itemFormRef[index];
      let res = await item.validateFieldsFn()
      list.push(res)
    }
    result = list.every(i => i)
  } else {
    try {
      let res = await _this.$refs.formRef.validateFields()
      // console.log({res})
      result = true
    } catch (error) {}
  }
  return result
}
defineExpose({
  // 暴露校验方法，在父组件中调用
  validateFieldsFn,
  resetFieldsFn,
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
  ::v-deep(.ant-select-selector) {
    text-align: left;
  }
}
</style>