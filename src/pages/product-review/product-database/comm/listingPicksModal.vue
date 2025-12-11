<template>
    <a-modal
    v-model:open="visible"
    title="智能刊登选品"
    :width="520"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="modal-content">
      <div class="form-item">
        <div class="label">选品理由:</div>
        <a-textarea
          v-model:value="reasonText"
          placeholder="请输入选品理由，最多255个字符"
          :maxlength="255"
          show-count
          :auto-size="{ minRows: 4, maxRows: 6 }"
          class="reason-textarea"
        />
      </div>
      <div class="modal-footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleConfirm">确定</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Modal, Button, Input, message } from 'ant-design-vue';
import { commdity } from "@/api/common/selectProduct";

const { Textarea } = Input;

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  onSubmit: {
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(['update:open', 'success', 'changeTableLoading']);

const visible = ref(props.open);
const reasonText = ref('');

// 监听open变化
watch(() => props.open, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    reasonText.value = ''; // 重置输入内容
  }
});

// 监听visible变化，同步到父组件
watch(visible, (newVal) => {
  emit('update:open', newVal);
});

// 处理取消
const handleCancel = () => {
  visible.value = false;
  message.info("取消输入");
};

// 处理确认
const handleConfirm = () => {
  const value = reasonText.value.trim();
  
  const queryData = {
    commodityId: props.selectedIds.join(','),
    remark: value,
  };

  commdity(queryData).then((res) => {
    emit('changeTableLoading', true);
    if (res.code === 200) {
      message.success("执行选品申请成功,勿重复操作");
      props.onSubmit();
      emit('success');
      visible.value = false;
    } else {
      message.error(res.msg);
    }
  }).finally(() => {
    emit('changeTableLoading', false);
  });
};
</script>

<style lang="less" scoped>
.modal-content {
  padding: 16px 0;
  
  .form-item {
    margin-bottom: 20px;
    
    .label {
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .reason-textarea {
      width: 100%;
      box-sizing: border-box;
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
  }
}
</style>