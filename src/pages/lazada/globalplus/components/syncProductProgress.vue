<template>
  <div>
    <a-modal v-model:open="dialogVisible" :maskClosable="false" width="30%">
      <a-progress type="circle" :percent="percentageRes" :stroke-width="26" stroke-color="#f56c6c" />
    </a-modal>
  </div>
</template>

<script setup>
import { syncProductGPPropress } from '@/pages/lazada/globalplus/api';
const dialogVisible = ref(false);
const percentageRes = ref(0);// 进度条

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
      setTimeout(async () => {
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
</script>

<style lang="less" scoped></style>
