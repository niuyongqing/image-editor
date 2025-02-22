<template>
<div id="sechmaFormIndex">
  <div class="itemForm-index">
    <!-- <a-form
      :model="form"
      ref="formRef"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <itemForm 
        :children="data" 
        :params-key="'_params_'"
        ref="itemFormRef"
        @item-params="setJsonParams"
      ></itemForm>
      <a-form-item>
        <a-button @click="save" type="primary" html-type="submit">Submit</a-button>
        <a-button @click="resetFieldsFn">取消</a-button>
      </a-form-item>
    </a-form> -->
    <itemForm 
      v-if="sechmaData.data.length > 0"
      :children="sechmaData.data" 
      :params-key="'_params_'"
      ref="itemFormRef"
      @item-params="setJsonParams"
    ></itemForm>
  </div>
</div>
</template>

<script setup>
// import TrainSets from './TrainSets.json'
// import sechmaData from './TrainSets - 副本.json'
import itemForm from './itemForm.vue'
import { ref, onMounted, computed, watchPostEffect, provide } from 'vue';
defineOptions({ name: "sechmaFormIndex" })
const emit = defineEmits(['update:formState', 'proactivelyChange'])
const { proxy: _this } = getCurrentInstance();
const props = defineProps({
  sechma: {
    type: Object,
    default: () => {}
  },
  formState: {
    type: Object,
    default: () => {}
  }
})
const sechmaData = reactive({
  data: [],       //渲染数据
  form: {},       // 表单数据,
  sechmaDefs: {}
})
provide('valueChange', valueChange)
// 更新数据
watch(() => props.sechma, (val, oldVal) => {
  nextTick(() => {
    sechmaData.sechmaDefs.marketplace_id = val.$defs.marketplace_id
    sechmaData.sechmaDefs.language_tag = val.$defs.language_tag

    let newData = handleFormItem(val.properties, val.required)
    updateFormData(newData, sechmaData.data, sechmaData.form)
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
function updateFormData(val, oldVal, form) {
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
      let newForm = handleFormData(extraValues, {})
      Object.keys(newForm).forEach(key => {
        form[key] = newForm[key]
      })
    } else {
      extraValues.forEach(item => {
        let index = oldVal.findIndex(i => i._key === item._key)
        oldVal.splice(index, 1)
        // 更新表单参数
        delete form[item._key]
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
      delete form[item._key]
    })
    oldVal.push(...addValue)
    // 更新表单参数
    let newForm = handleFormData(addValue, {})
    Object.keys(newForm).forEach(key => {
      form[key] = newForm[key]
    })
    if (addValue.length < 1 && delValue.length < 1) {
      // 如果属性没有改变，深度对比子属性
      val.forEach(item => {
        let obj = oldVal.find(i => i._key === item._key)
        if (obj.children && item.children) {
          // if (!form[obj._key]) {
            
          //   console.log('form[obj._key]', form[obj._key], obj._key, {item, obj} );
          // }
          let formObj = Array.isArray(form[obj._key]) ? form[obj._key][0] : form[obj._key]
          updateFormData(item.children, obj.children, formObj)
        }
      })
    }
  }
  emit('update:formState', sechmaData.form)
}
// 处理表单数据
/**
 * 
 * @param data 属性对象
 * @param requiredList 必填字段数组
 * @param maxUniqueItems 最大选项数
 */
function handleFormItem(data, requiredList, maxUniqueItems = 1) {
  // console.log(11);
  let list = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const item = data[key];
      let obj = {
        _key: key,
        isRequired: requiredList.includes(key), // 判断是否是必填项
        maxUniqueItems: maxUniqueItems,
        ...item
      }
      if (['marketplace_id', 'language_tag'].includes(obj._key)) {
        // console.log(JSON.parse(JSON.stringify(sechmaDefs[item._key])));
        obj = {
          ...sechmaData.sechmaDefs[obj._key],
          ...obj
        }
      }
      if (obj.type) {
        if (obj.type === 'integer' || obj.type === 'number') {
          obj.itemType = 'inputNumber'
        } else if (obj.type === 'string') {
          // string类型的先赋值为input类型，后续再根据具体条件改
          obj.itemType = 'input'
        } else if (obj.type === 'array' && !obj.enum) {
          obj.itemType = 'checkbox'
          obj.valueList = []
        }
      }
      if (obj.anyOf && obj.anyOf[1] && obj.anyOf[1].type === 'string') {
        let anyItem = obj.anyOf[1]
        if (anyItem.format) {
          obj.itemType = 'date'
        } else if (anyItem.enum) {
          obj.valueList = []
          anyItem.enum.forEach((i, ind) => {
            obj.valueList.push({
              label: anyItem.enumNames[ind],
              val: i
            })
          })
          // 通过是否可以编辑判断是否是多选框，
          obj.itemType = (obj.editable && obj.maxUniqueItems > 1) ? 'checkbox':'radioEdit'
        }
      }
      if (obj.oneOf && obj.oneOf[1] && obj.oneOf[1].type === 'string') {
        let anyItem = obj.oneOf[1]
        if (anyItem.format) {
          obj.itemType = 'date'
        } else if (anyItem.enum) {
          obj.valueList = []
          anyItem.enum.forEach((i, ind) => {
            obj.valueList.push({
              label: anyItem.enumNames[ind],
              val: i
            })
          })
          // 通过是否可以编辑判断是否是多选框，
          obj.itemType = (obj.editable && obj.maxUniqueItems > 1) ? 'checkbox':'radioEdit'
        }
      }
      if (obj.enum) {
        obj.valueList = []
        obj.enum.forEach((i, ind) => {
          obj.valueList.push({
            label: obj.enumNames[ind],
            val: i
          })
        })
        // 通过type字段判断是否使用下拉框
        obj.itemType = obj.type === 'string' ? 'select':'radio'
      }
      
      if ((obj.items && obj.items.properties) || obj.properties) {
        let properties = obj.items?.properties || obj.properties
        let required = obj.items?.required || []
        let maxUniqueItems = obj?.maxUniqueItems || 1
        obj.children = handleFormItem(properties, required, maxUniqueItems)
      }
      list.push(obj)
    }
  }
  return list
}
// 处理表单参数
function handleFormData(data, fromD) {
  data.forEach(item => {
    if (item.examples && item.examples.length && !(item.children && item.children.length)) {
      fromD[item._key] = item.examples[0]
    } else if (item.type === 'integer' || item.type === 'number') {
      fromD[item._key] = 0
    } else if (item.type === 'string') {
      fromD[item._key] = ''
    } else if (item.type === 'boolean') {
      fromD[item._key] = false
    } else if (item.type === 'array') {
      fromD[item._key] = []
      if (item.children && item.children.length) {
        // 将子项提取出来
        let obj = handleFormData(item.children, {})
        fromD[item._key].push(obj)
      }
    } else if (item.type === 'object') {
      let obj = handleFormData(item.children, {})
      fromD[item._key] = obj
    }
  })
  return fromD
}
// 处理参数
function setJsonParams(val) {
  for (const key in val.params) {
    // if (Object.prototype.hasOwnProperty.call(val.params, key)) {
      // console.log({ val }, '_params_', sechmaData.form[key], val.params[key]);
      merge(sechmaData.form[key], val.params[key])
    // }
  }
  emit('update:formState', sechmaData.form)
}
// 更新参数
function merge(oldVal, newVal) {
  for (const key in newVal) {
    if (Object.prototype.hasOwnProperty.call(newVal, key)) {
      let item = newVal[key];
      if (typeof item === 'object') {
        if (Array.isArray(item)) {
          merge(oldVal[key][0], item[0])
        } else {
          merge(oldVal[key], item)
        }
      } else {
        oldVal[key] = item
      }
    }
  }
}
// 主动改变表单数据
function valueChange(val) {
  console.log('1321', val);
  
  emit('proactivelyChange')
}
// 校验全部必填项
function validateFieldsFn() {
  return _this.$refs.itemFormRef.validateFieldsFn()
}
async function resetFieldsFn() {
  let result = await _this.$refs.itemFormRef.resetFieldsFn()
  return result
}
defineExpose({
  validateFieldsFn,
  resetFieldsFn
})
</script>
<style lang="less" scoped>
#sechmaFormIndex {
  width: 100%;
  display: flex;
  justify-content: center;
}
.itemForm-index {
  width: 100%;
}
</style>