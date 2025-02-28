<template>
  <div>
    <a-modal v-model:open="dialogVisible" :maskClosable="false" width="30%" @cancel="close" :footer="null">
      <div flex justify-center items-center>
        <a-progress type="circle" :percent="percentageRes" :stroke-width="20" stroke-color="#f56c6c" />
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { syncProductGPPropress } from '@/pages/lazada/globalplus/api';
import { Modal } from 'ant-design-vue';
const dialogVisible = ref(false);
const percentageRes = ref(0);// 进度条
const timer = ref(null);
const schedule = async (e) => {
  try {
    let computeCount = await syncProductGPPropress(e);
    let percentage = parseInt(computeCount.data);
    percentageRes.value = percentage;
    if (percentageRes.value === 100) {
      await Modal.success({
        title: '同步',
        content: '同步成功',
      });
      // 调用表格上传进度列表
      close();
    } else if (percentageRes.value === null) {
      await Modal.info({
        title: '同步',
        content: '同步尚未完成，请稍后再试',
      });
      close();
    } else {
      timer.valuer = setTimeout(async () => {
        await schedule(e);
      }, 3000);
    }
  } catch (error) {
    await Modal.error({
      title: '同步',
      content: '同步过程中出现错误：' + error.message,
    });
    close();
  }
};

const open = (e) => {
  schedule(e);
  dialogVisible.value = true;
};

defineExpose({
  open,
});

const close = () => {
  clearTimeout(timer.value);
}
</script>

<style lang="less" scoped></style>
