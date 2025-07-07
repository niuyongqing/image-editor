<template>
<div id="bacthVariantStringEdit" class="bacthVariantStringEdit">
  <a-modal 
    v-model:open="modalOpen" 
    :title="'变种字符设置'"
    :maskClosable="false" 
    :width="600"
  >
    <div class="bacthVariantStringEdit-modal-box">
      <div class="modal-box-item">
        <div class="item-label">选择修改项：</div>
        <div class="item content">
          <a-checkbox-group v-model:value="modified.state" name="modified" :options="modified.options" />
        </div>
      </div>
      <div class="modal-box-item">
        <div class="item-label">
          <a-checkbox v-model:checked="prefix.enable">前缀：</a-checkbox>
        </div>
        <div class="item-content">
          <a-select
            ref="prefixSelect"
            v-model:value="prefix.prefixType"
            style="width: 120px"
            :disabled="!prefix.enable"
          >
            <a-select-option 
              v-for="item in selectOptions"
              :key="item.val"
              :value="item.val"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <div class="item-content-input">
            <a-input 
              v-model:value="prefix.str" 
              placeholder="请输入"
              :disabled="!prefix.enable" 
              allowClear
              v-show="prefix.prefixType === 1"
            />
            <a-input-number 
              v-model:value="prefix.num" 
              placeholder="请输入起始值" 
              :disabled="!prefix.enable"
              v-show="prefix.prefixType === 2"
            />
          </div>
        </div>
      </div>
      <div class="modal-box-item">
        <div class="item-label">
          <a-checkbox v-model:checked="suffix.enable">后缀：</a-checkbox>
        </div>
        <div class="item-content">
          <a-select
            ref="suffixSelect"
            v-model:value="suffix.suffixType"
            style="width: 120px"
            :disabled="!suffix.enable"
          >
            <a-select-option 
              v-for="item in selectOptions"
              :key="item.val"
              :value="item.val"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <div class="item-content-input">
            <a-input 
              v-model:value="suffix.str" 
              placeholder="请输入" 
              :disabled="!suffix.enable"
              allowClear
              v-show="suffix.suffixType === 1"
            />
            <a-input-number 
              v-model:value="suffix.num" 
              placeholder="请输入起始值" 
              :disabled="!suffix.enable"
              v-show="suffix.suffixType === 2"
            />
          </div>
        </div>
      </div>
      <div class="modal-box-item">
        <div class="item-label">
          <a-checkbox v-model:checked="replaceString.isReplace">替换字符：</a-checkbox>
        </div>
        <div class="item-content">
          <span>变种中的</span>
          <a-input 
            v-model:value="replaceString.oldVal" 
            placeholder="" 
            :disabled="!replaceString.isReplace"
            style="width: 110px; margin: 0 6px;"
          />
          <span>替换为</span>
          <a-input 
            v-model:value="replaceString.newVal" 
            placeholder="" 
            :disabled="!replaceString.isReplace"
            style="width: 110px; margin: 0 6px;"
          />
        </div>
      </div>
      <div class="modal-box-item textarea">
        <div class="item-label">
          <a-checkbox v-model:checked="replaceString.isRemove">移除字符：</a-checkbox>
        </div>
        <div class="item-content">
          <a-textarea 
            v-model:value="replaceString.removeVal" 
            placeholder="变种有多个字符需要移除时，请用“Enter”换行" 
            :disabled="!replaceString.isRemove"
            :rows="4"
            allowClear
            style="width: 300px;"
          />
        </div>
      </div>
      <div class="modal-box-item">
        <div class="item-label">
          <a-checkbox v-model:checked="replaceString.isRemoveChinese">移除中文字符</a-checkbox>
        </div>
      </div>
    </div>
    <template #footer>
      <a-button 
        key="submit" 
        type="primary" 
        @click="modalOk" 
      >确定</a-button>
      <a-button key="submit" @click="modalCloseFn">关闭</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "bacthVariantStringEdit" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'confirm'])
const props = defineProps({
  modalOpen: Boolean,
  modalData: {
    type: Object,
    default: () => {},
  }
})
const modalOpen = ref(false)
const modified = reactive({
  state: [],
  variantList: [],
  options: [
    {
      label: '变种主题',
      value: 'variant',
    },
    {
      label: '变种值',
      value: 'variantItem',
    },
  ],
})
// 前缀
const prefix = reactive({
  enable: false,
  prefixType: 1,
  str: '',
  num: 0,
  currentNum: 0
})
// 后缀
const suffix = reactive({
  enable: false,
  suffixType: 1,
  str: '',
  num: 0,
  currentNum: 0
})
const replaceString = reactive({
  isReplace: false,
  isRemove: false,
  isRemoveChinese: false,

  oldVal: '',
  newVal: '',
  removeVal: '',
})
const selectOptions = [
  {
    val: 1,
    label: '手动输入'
  },
  {
    val: 2,
    label: '自增长数字'
  }
]

watch(() => props.modalOpen, (val, oldVal) => {
  if (val) {
    modalOpen.value = val
    modalOpenFn()
  }
})
watch(() => modalOpen.value, (val, oldVal) => {
  !val && emit('update:modalOpen', false)
})
function modalOpenFn() {
  modified.state = []
  modified.variantList = cloneDeep(props.modalData.variantList)
}
async function modalOk() {
  if (modified.state.length < 1) {
    return message.warning('请选择修改项！')
  } 
  modified.variantList.forEach(variantItem => {
    variantItem.showInput = !variantItem.showInput
    variantItem.values.forEach(item => {
      item.isEdit = !item.isEdit
    })
  })
  if (modified.state.includes('variant')) {
    prefix.currentNum = prefix.num
    suffix.currentNum = suffix.num
    modified.variantList.forEach(item => {
      item.name = strEditFn(item.name)
    })
  }
  if (modified.state.includes('variantItem')) {
    prefix.currentNum = prefix.num
    suffix.currentNum = suffix.num
    modified.variantList.forEach(variantItem => {
      variantItem.values.forEach(item => {
        item.name = strEditFn(item.name)
      })
    })
  }
  let obj = {
    component: 'bacthVariantStringEdit',
    variantList: modified.variantList
  }
  emit('confirm', obj)
  modalCloseFn()
}
function strEditFn(val) {
  let name = val
  // 去除中文
  if (replaceString.isRemoveChinese) {
    const regex = new RegExp('[\\u4e00-\\u9fa5\\u3000-\\u303f\\uff00-\\uffef]', 'g');
    name = name.replaceAll(regex, '')
  }
  if (replaceString.isRemove) {
    name = name.replaceAll(replaceString.removeVal, '')
  }
  if (replaceString.isReplace) {
    name = name.replaceAll(replaceString.oldVal, replaceString.newVal)
  }
  // 前缀
  if (prefix.enable) {
    if (prefix.prefixType === 1) {
      name = prefix.str + name
    } else if (prefix.prefixType === 2) {
      name = prefix.currentNum + name
      prefix.currentNum++
    }
  }
  if (suffix.enable) {
    if (suffix.suffixType === 1) {
      name = name + suffix.str
    } else if (suffix.suffixType === 2) {
      name =  name + suffix.currentNum
      suffix.currentNum++
    }
  }
  return name;
}
function modalCloseFn() {
  let obj = {
    enable: false,
    prefixType: 1,
    suffixType: 1,
    str: '',
    num: 0,
    currentNum: 0,
    isReplace: false,
    isRemove: false,
    isRemoveChinese: false,

    oldVal: '',
    newVal: '',
    removeVal: '',
  }
  let arr = [prefix, suffix, replaceString]
  arr.forEach(item => {
    Object.keys(item).forEach(key => {
      item[key] = obj[key]
    })
  })
  modalOpen.value = false
}
</script>
<style lang="less" scoped>
.bacthVariantStringEdit-modal-box {
  display: flex;
  flex-direction: column;
  .modal-box-item {
    width: 100%;
    min-height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    &.textarea {
      align-items: flex-start;
    }
    .item-label {
      width: 150px;
      display: flex;
      align-items: center;
      padding-left: 20px;
    }
    .item-content {
      // flex: 1;
      display: flex;
      align-items: center;
      .item-content-input {
        padding-left: 10px;
        :deep(.ant-input-number) {
          width: 175px;
        }
      }
    }
  }
}
</style>