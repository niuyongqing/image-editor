<template>
<div id="dictionaryManagement_editModal" class="dictionaryManagement_editModal">
  <appModal 
    v-model:open-value="openValue" 
    width="600px"
    :title="title"
  >
    <template #appContent>
      <a-form 
        v-model:model="formData" 
        :label-col="{ span: 4 }"
        ref="formRef"
      >
        <a-form-item 
          label="年份" 
          name="year" 
          :rules="[{ required: true, message: '请输入年份!' }]"
        >
          <a-date-picker 
            v-model:value="formData.year" 
            picker="year" 
            value-format="YYYY"
          />
        </a-form-item>
        <a-form-item 
          label="月份" 
          name="month"
          :rules="[{ required: true, message: '请输入月份!' }]"
        >
          <a-select
            v-model:value="formData.month"
            :options="options.monthList"
            placeholder="请输入月份"
            allowClear
          ></a-select>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formData.remark" :rows="3"/>
        </a-form-item>
      </a-form>
    </template>
    <template #appFooter>
      <a-button @click="handleCustomCancel">取消</a-button>
      <a-button type="primary" @click="handleCustomOk" :loading="btnLoading">确定</a-button>
    </template>
  </appModal>
</div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { generateVersion } from '../js/api';
import dayjs from 'dayjs';
import appModal from '~@/components/common/appModal.vue'
import asyncIcon from '~@/layouts/components/menu/async-icon.vue';
import { Modal } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
defineOptions({ name: "dictionaryManagement_editModal" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:open', 'save'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: () => ({
      monthList: []
    })
  }
})
const openValue = ref(false);
const btnLoading = ref(false)
const formData = reactive({
  year: dayjs().year() + '',
  month: undefined,
  remark: ''
});
const resetData = {
  year: dayjs().year() + '',
  month: undefined,
  remark: ''
}
// const { open, rowInfo } = toRefs(props)
const title = '生成流水号';
watch(() => props.open, (val, oldVal) => {
  openValue.value = val;
});
watch(() => openValue.value, (val, oldVal) => {
  emit('update:open', val);
  !val && (Object.assign(formData, resetData))
});
function handleCustomCancel() {
  _this.$refs.formRef.resetFields()
  openValue.value = false
}
async function handleCustomOk() {
  try {
    await _this.$refs.formRef.validateFields()
    btnLoading.value = true;
    const customContent = h('p', { style: { color: '#ff4d4f' } }, '数据计算需要占用大量服务器资源，请确认数据已经完全确认过后再操作！');
    Modal.confirm({
      title: '确定要生成流水号吗？',
      content: customContent, // 插入自定义DOM节点
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          let params = {
            ...formData,
          }
          await generateVersion(params)
          emit('save')
          handleCustomCancel()
        } catch (error) {
          console.error(error);
        }
      } // 点击确认时触发
    });
  } catch (error) {
    console.error(error);
  }
  btnLoading.value = false;
}
</script>
<style lang="less" scoped>

</style>