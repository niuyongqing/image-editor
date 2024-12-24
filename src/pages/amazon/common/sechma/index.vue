<template>
<div id="sdgsdfgsdgfsdfs">
  <!-- 1111
  <a-switch v-model:checked="checked" /> -->
  <div class="itemForm-index">
    <!-- <itemForm 
      :children="data" 
      :params-key="'_params_'"
      @item-params="setJsonParams"
    ></itemForm> -->
  </div>
</div>
</template>

<script setup>
import sechmaData from './TrainSets.json'
// import sechmaData from './TrainSets - 副本.json'
// import itemForm from '~/pages/dashboard/sechma/common/itemForm.vue'
import { ref, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({
  name: "sdgsdfgsdgfsdfs"
})
const checked = ref(false)
let form = {}             // 取值对象
let formData = JSON.parse(JSON.stringify(sechmaData))
let _data = handleFormItem(formData.properties, [])
// _data.forEach(item => {
//   if (item.children && item.children.length) {
//     item.children = parseArr(item.children)
//     item.children = item.children.filter(i => !i.children)
//   }
// })
const data = ref(_data)

function parseArr(arr) {
  let list = []
  arr.forEach(item => {
    if (item.children && item.children.length) {
      item.children = parseArr(item.children)
      list = [...list, ...item.children]
    }
  })
  return [...arr, ...list]
}

// 处理表单数据
function handleFormItem(data, requiredList) {
  // console.log(11);
  let list = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const item = data[key];
      let obj = {
        _key: key,
        isRequired: requiredList.includes(key), // 判断是否是必填项
        ...item
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
          obj.itemType = obj.editable ? 'checkbox':'radioEdit'
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
          obj.itemType = obj.editable ? 'checkbox':'radioEdit'
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
        obj.children = handleFormItem(properties, required)
      }
      list.push(obj)
    }
  }
  return list
}
form = handleFormData(handleFormItem(formData.properties, formData.required), form)
// let formParams = ref(form)
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
    }
  })
  return fromD
}
// 处理参数
const setJsonParams = (val) => {
  for (const key in val.params) {
    // if (Object.prototype.hasOwnProperty.call(val.params, key)) {
      console.log({ val }, '_params_', form[key], val.params[key]);
      merge(form[key], val.params[key])
    // }
  }
  // merge()
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
</script>
<style lang="less" scoped>
#sdgsdfgsdgfsdfs {
  width: 100%;
  display: flex;
  justify-content: center;
}
.itemForm-index {
  width: 50%;
}
</style>