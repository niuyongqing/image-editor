<template>
  <div>
    <a-form :model="formData" ref="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <div style="display: flex">
        <a-form-item label="总件数" name="criteriaValue">
          <a-input-number v-model:value="formData.criteriaValue" :min="2" placeholder="购买数量：例如: 3" />
        </a-form-item>
        <a-form-item label="总价" name="discountValue">
          <a-input-number v-model:value="formData.discountValue" placeholder="0" />
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const { state: formData, reset } = useResetReactive({
  criteriaValue: '',
  discountValue: '',
});
</script>

<style lang="scss" scoped></style>