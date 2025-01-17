<template>
<div id="dataRelocation" class="dataRelocation">
  <a-card>
    <div class="dataRelocation-steps">
      <a-steps
        :current="0"
        :items="[
          {
            title: '同步产品',
          },
          {
            title: '认领产品',
          },
          {
            title: '选择店铺',
          },
          {
            title: '进入采集箱',
          },
        ]"
      ></a-steps>
    </div>
  </a-card>
  <dataTable></dataTable>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import dataTable from './dataTable.vue';
defineOptions({ name: "dataRelocation" })
const { proxy: _this } = getCurrentInstance()
</script>
<style lang="less" scoped>
::v-deep(.ant-card) {
  margin-bottom: 10px;
}
.dataRelocation-steps {
  width: 100%;
  padding: 0 20px;
}
</style>