<template>
<div id="numberEditModal">
  <a-modal 
    v-model:open="props.open" 
    :title="currentData.title" 
    @ok="handleOk"
    :closable="false"
    style="width: 600px;"
  >
    <div class="dialog-box">
      <a-radio-group v-model:value="currentData.radio">
        <a-radio :value="1">直接修改为</a-radio>
        <a-radio :value="2">{{ `按现有${props.modalData.title === 2 ? '数量':'价格'}` }}</a-radio>
      </a-radio-group>
      <div class="">
        <div class="radio-item">
          <a-input :disabled="currentData.radio!==1" type="number" :min="0" v-model:value="currentData.setNum" placeholder="示例：1"></a-input>
        </div>
        <div class="radio-item count">
          <a-select v-model:value="currentData.countRule" placeholder="请选择" :disabled="currentData.radio!==2">
            <a-select-option
              v-for="item in select"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</a-select-option>
          </a-select>
          <a-input type="number" :disabled="currentData.radio!==2" :min="0" v-model:value="currentData.countNum" placeholder="示例：1"></a-input>
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
const emit = defineEmits(['update:open', 'editDone', 'generate']);
const props = defineProps({
  open: Boolean,
  modalData: {
    type: Object,
    default: () => {}
  }
})
const currentData = reactive({
  title: '',
  type: '',
  prop: '',

  radio: 1,
  setNum: '',           // 直接修改
  countNum: '',         // 计算修改
  countRule: '+',

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
  }
]
watch(() => props.open, (val) => {
  if (val) {
    currentData.tableData = JSON.parse(JSON.stringify(props.modalData.variantInfo))
    switch (props.modalData.title) {
      case 1:
        currentData.title = '修改价格'
        break;
      case 2:
        currentData.title = '修改数量'
        break;
      case 3:
        currentData.title = '修改促销价'
        break;
      default:
        break;
    }
  } else {
    let defaultData = {
      title: '',
      type: '',
      prop: '',

      radio: 1,
      setNum: '',           // 直接修改
      countNum: '',         // 计算修改
      countRule: '+',
      // conditionTypeList: [],
      tableData: []
    }
    Object.keys(defaultData).forEach(key => {
      currentData[key] = defaultData[key]
    })
  }
})
watch(() => currentData.radio, () => {
  currentData.setNum = ''           // 直接修改
  currentData.countNum = ''         // 计算修改
  currentData.countRule = '+'
})
function handleCancel() {
  emit('update:open', false)
}
function handleOk() {
  emit('editDone')
}
function save(params) {
  let prop = props.modalData.prop
  currentData.tableData.forEach(item => {
    if (currentData.radio === 1) {
      item[prop] = currentData.setNum
    } else if (currentData.radio === 2) {
      console.log(currentData.countRule)
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
        default:
          break;
      }
    }
  })
  emit('generate', currentData.tableData)
  handleCancel()
}
</script>
<style lang="less" scoped>
.dialog-box {
  display: flex;
  :deep(.ant-radio-wrapper) {
    display: flex;
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
  :deep(.ant-select) {
    width: 80px;
  }
}
</style>