<template>
<div id="numberEditModal">
  <a-modal 
    v-model:open="modalOpen" 
    :title="currentData.title" 
    :closable="false"
    width="700px"
  >
    <div class="dialog-box">
      <a-radio-group v-model:value="currentData.radio">
        <a-radio :value="1">直接修改为</a-radio>
        <a-radio :value="2">{{ `按现有${props.modalData.title}` }}</a-radio>
      </a-radio-group>
      <div class="">
        <div class="radio-item">
          <a-input type="number" :disabled="currentData.radio!==1" :min="0" v-model:value="currentData.setNum" placeholder="示例：1"/>
        </div>
        <div class="radio-item count">
          <a-select v-model:value="currentData.countRule" placeholder="请选择" :disabled="currentData.radio!==2">
            <a-select-option
              v-for="item in select"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</a-select-option>
          </a-select>
          <a-input type="number" :disabled="currentData.radio!==2" :min="0" v-model:value="currentData.countNum" placeholder="示例：1"/>
          <a-select 
            v-model:value="currentData.resultRule" 
            placeholder="请选择" 
            :disabled="currentData.radio!==2"
            style="margin-left: 10px;"
            v-if="props.modalData.prop !== 'inventory'"
          >
            <a-select-option
              v-for="item in resultRuleSelect"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="save">确定</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "numberEditModal" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'confirm']);
const props = defineProps({
  modalOpen: Boolean,
  modalData: {
    type: Object,
    default: () => {}
  }
})
const modalOpen = ref(false)
const currentData = reactive({
  title: '',
  type: '',
  prop: '',

  radio: 1,
  setNum: '',           // 直接修改
  countNum: '',         // 计算修改
  countRule: '+',
  resultRule: 'toFixed2',

  // conditionTypeList: [],
  tableData: []
})
const select = [
  {
    label: '加',
    value: '+'
  },
  {
    label: '减',
    value: '-'
  },
  {
    label: '乘',
    value: '*'
  },
  {
    label: '百分比增加',
    value: '%+'
  },
  {
    label: '百分比减少',
    value: '%-'
  }
];
const resultRuleSelect = [
  {
    label: '保留两位小数',
    value: 'toFixed2'
  },
  {
    label: '四舍五入',
    value: 'round'
  },
  {
    label: '进位(取整)',
    value: 'ceil'
  },
];
let a = 2
a.toFixed
watch(() => props.modalOpen, (val) => {
  if (val) {
    modalOpen.value = val
    modalOpenFn()
  }
})
watch(() => modalOpen.value, (val, oldVal) => {
  !val && emit('update:modalOpen', false)
})
watch(() => currentData.radio, () => {
  currentData.setNum = ''           // 直接修改
  currentData.countNum = ''         // 计算修改
  currentData.countRule = '+'
})
function modalOpenFn() {
  currentData.tableData = JSON.parse(JSON.stringify(props.modalData.variantInfo))
  currentData.title = `修改${props.modalData.title}`
}
function handleCancel() {
  let defaultData = {
    title: '',
    type: '',
    prop: '',

    radio: 1,
    setNum: '',           // 直接修改
    countNum: '',         // 计算修改
    countRule: '+',
    resultRule: 'toFixed2',
    // conditionTypeList: [],
    tableData: []
  }
  Object.keys(defaultData).forEach(key => {
    currentData[key] = defaultData[key]
  })
  modalOpen.value = false
}
function save(params) {
  let prop = props.modalData.prop
  currentData.tableData.forEach(item => {
    if (currentData.radio === 1) {
      item[prop] = currentData.setNum
    } else if (currentData.radio === 2) {
      // console.log(currentData.countRule)
      switch (currentData.countRule) {
        case '+':
          item[prop] = (Number(item[prop])) + (Number(currentData.countNum))
          break;
        case '-':
          item[prop] = (Number(item[prop])) - (Number(currentData.countNum))
          break;
        case '*':
          item[prop] = (Number(item[prop])) * (Number(currentData.countNum))
          break;
        case '%+':
          item[prop] = (Number(item[prop])) * (1 + (Number(currentData.countNum)/100))
          break;
        case '%-':
          item[prop] = (Number(item[prop])) * (1 - (Number(currentData.countNum)/100))
          break;
        default:
          break;
      };
      if (props.modalData.prop !== 'inventory') {
        switch (currentData.resultRule) {
          case 'toFixed2':
            item[prop] = Number(item[prop].toFixed(2))
            break;
          case 'round':
            item[prop] = Math.round(item[prop])
            break;
          case 'ceil':
            item[prop] = Math.ceil(item[prop])
            break;
          default:
            break;
        }
      }
    }
  })
  let obj = {
    component: 'numberEditModal',
    variantInfo: currentData.tableData
  }
  emit('confirm', obj)
  handleCancel()
}
</script>
<style lang="less" scoped>
.dialog-box {
  display: flex;
  :deep(.ant-radio-wrapper) {
    display: flex;
    // min-width: 120px;
    height: 18px;
    // line-height: 22px;
    margin-bottom: 30px;
    align-items: center;
  }
}
.radio-item {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.count {
  :deep(.ant-input) {
    width: 180px;
    margin-left: 10px;
  }
  :deep(.ant-select) {
    width: 120px;
  }
}
</style>