<template>
<div id="publication_sequence" class="publication_sequence">
  <test></test>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { message } from 'ant-design-vue';
import test from './test.vue';
defineOptions({ name: "publication_sequence" })
const { proxy: _this } = getCurrentInstance();
</script>

<style lang="less" scoped>
.publication_sequence {
  text-align: left;
}
</style>