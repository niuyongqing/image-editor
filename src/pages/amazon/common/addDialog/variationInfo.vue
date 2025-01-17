<template>
<div id="variationInfo" class="variationInfo">
  <div class="title">
    <span>变种信息</span>
  </div>
  <div class="content">
    <a-form 
      :model="formState" 
      :rules="rules"
    >
      <a-form-item
        label="变种主题："
        name="username"
      >
        <a-select
          ref="select"
          v-model:value="formState.theme"
          @change="themeChange"
        >
          <a-select-option 
            :value="item.label"
            :key="item.label"
            v-for="item in props.variationThemeData.theme"
          >{{ item.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item 
        v-for="item in formState.variationList"
        :name="item.name"
        :label="item.name"
        :key="item.name"
      >
        <a-form-item-rest>
          <div class="theme-box">
            <div class="box-item-content">
              <span class="box-item-checkbox" v-for="themeItem in item.values" :key="themeItem.key">
                <a-checkbox 
                  v-model:checked="themeItem.checked"
                  v-if="!themeItem.isEdit"
                  @change="checkboxChage(themeItem, item)"
                >{{ themeItem.label }}</a-checkbox>
                <div v-if="themeItem.type === 'add'" class="box-item-input">
                  <EditOutlined class="edit-icon" v-if="!themeItem.isEdit" @click="iconClick('edit', themeItem, item)" />
                  <div class="input-box" v-else>
                    <a-input v-model:value="themeItem.editText" />
                    <UndoOutlined class="edit-icon" @click="iconClick('undo', themeItem, item)" />
                    <CheckOutlined class="edit-icon" @click="iconClick('ok', themeItem, item)" />
                  </div>
                </div>
              </span>
            </div>
            <div class="box-addInput-content">
              <a-input-search
                style="width: 200px;"
                v-model:value="item.addValue"
                enter-button="添加"
                @search="addThemeItem(item)"
              />
            </div>
          </div>

        </a-form-item-rest>
      </a-form-item>
    </a-form>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { EditOutlined, UndoOutlined, CheckOutlined } from '@ant-design/icons-vue';
defineOptions({ name: "variationInfo" })
const { proxy: _this } = getCurrentInstance();
const props = defineProps({
  variationThemeData: {
    type: Object,
    default() {
      return {
        data: {},             // 变种数据
        theme: [],            // 变种
        themeAttribute: [],   // 变种标题
      }
    }
  }
})
const formState = reactive({
  theme: '',
  variationList: []
})
const rules = reactive({

})
function themeChange(val) {
  let { value } = props.variationThemeData.theme.find(i => i.label === val)
  let obj = {}
  value.forEach(item => {
    obj[item] = props.variationThemeData.data[item]
  })
  setVariation(obj, value)
}
// 创建变种
function setVariation(data, val) {
  console.log({ val, data });
  let list = val.map(i => {
    let item = data[i]
    let obj = {
      name: item.title,
      values: [],
      params: [],
      addValue: ''
    }
    if (item.items.properties.value.enumNames) {
      obj.values = item.items.properties.value.enumNames.map((i, index) => {
        return {
          key: createRandom(),
          label: i,
          value: item.items.properties.value.enum[index],
          type: 'default',
          checked: false,
          editText: '',
          isEdit: false
        }
      })
    }
    return obj
  })
  formState.variationList = list
}
// 添加变种属性
function addThemeItem(variationItem) {
  console.log({variationItem});
  let obj = {
    key: createRandom(),
    label: variationItem.addValue,
    value: variationItem.addValue,
    type: 'add',
    checked: true,
    editText: '',
    isEdit: false
  }
  variationItem.values.push(obj)
  variationItem.params.push(obj)
  variationItem.addValue = ''
}
// 变种属性名称编辑
function iconClick(type, themeItem, variationItem) {
  if (type === 'edit') {
    themeItem.editText = themeItem.label
  } else if (type === 'undo') {
    themeItem.editText = ''
  } else if (type === 'ok') {
    themeItem.label = themeItem.editText
    themeItem.value = themeItem.editText
    variationItem.params.forEach(item => {
      if (item.key === themeItem.key) {
        item.label = themeItem.label
        item.value = themeItem.label
      }
    })
  }
  themeItem.isEdit = !themeItem.isEdit
}
// 变种属性勾选
function checkboxChage(themeItem, variationItem) {
  console.log({themeItem, variationItem});
  if (themeItem.checked) {
    variationItem.params.push(themeItem)
  } else if (!themeItem.checked) {
    variationItem.params = variationItem.params.filter(i => i.key !== themeItem.key)
  }
}
// 生成一个随机数
function createRandom() {
  return Math.floor(Math.random() * 100000000000) + ''
}
</script>
<style lang="less" scoped>
::v-deep(.ant-form-item-control-input-content) {
  display: flex;
  text-align: left;
}
.theme-box {
  .box-item-content {
    width: 100%;
    max-height: 200px;
    min-height: 20px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .box-item-checkbox {
      display: flex;
      margin-right: 14px;
      .box-item-input {
        display: flex;
        .edit-icon {
          cursor: pointer;
          margin-right: 6px;
        }
        .input-box {
          display: flex;
          input {
            width: 100px;
            margin-right: 6px;
          }
        }
      }
    }
  }
  .box-addInput-content {
    margin-top: 10px;
  }
}
</style>