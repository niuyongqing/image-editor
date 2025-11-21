<template>
  <div id="logModal">
    <appModal v-model:open-value="openValue" width="700px" :title="'日志'" :footer="null">
      <template #appContent>
        <a-timeline class="mt-5" v-if="logData.length > 0">
          <a-timeline-item v-for="item in logData" :key="item.id">
            <div>
              <div style="font-family: bold">{{ item.userName }}</div>
              <div style="color: #888888">
                {{ item.track }}
                <span style="font-size: 12px">({{ item.action }})</span>
              </div>
              <div style="color: #888888">{{ item.content }}</div>
              <div>
                <a-tooltip placement="top" effect="light" :overlayInnerStyle="{ width: '350px', padding: '3px' }">
                  <template #title>
                    <json-viewer :value="item.newContent"></json-viewer>
                  </template>
                  <a-button type="text">新详细参数</a-button>
                </a-tooltip>
              </div>
              <div>
                <a-tooltip placement="top" effect="light" :overlayInnerStyle="{ width: '350px', padding: '3px' }">
                  <template #title>
                    <json-viewer :value="item.oldContent"></json-viewer>
                  </template>
                  <a-button type="text">旧详细参数</a-button>
                </a-tooltip>
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
        <a-empty v-else style="margin-top: 20px" />
      </template>
    </appModal>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { te } from 'date-fns/locale';
import { template } from 'xe-utils';

const appModal = defineAsyncComponent(() => import('@/components/common/appModal.vue'));
// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  logData: {
    type: Array,
    default: () => []
  }
})
// 定义emit事件
const emit = defineEmits(['update:visible'])

const openValue = ref(props.visible)

// 监听外部 visible 的变化
watch(() => props.visible, (newVal) => {
  openValue.value = newVal
})

watch(openValue, (newVal) => {
  emit('update:visible', newVal)
})

watch(() => props.logData, (newVal) => {
  if (newVal.length > 0) {
    // 解析 oldContent 和 newContent 为对象
    newVal.forEach(item => {
      try {
        // 检查是否为 JSON 字符串，如果是则进行解析
        if (typeof item.newContent === 'string') {
          try {
            // 尝试解析字符串，如果解析成功则替换原内容
            item.newContent = JSON.parse(item.newContent);
          } catch (e) {
            // 如果不是合法的 JSON 字符串，则不做转换
            console.log('newContent 不是合法的 JSON 字符串，不做转换');
          }
        }
        if (typeof item.oldContent === 'string') {
          try {
            // 尝试解析字符串，如果解析成功则替换原内容
            item.oldContent = JSON.parse(item.oldContent);
          } catch (e) {
            // 如果不是合法的 JSON 字符串，则不做转换
            console.log('oldContent 不是合法的 JSON 字符串，不做转换');
          }
        }
      } catch (error) {
        console.log('解析 JSON 数据时出错:', item, error);

      }
    });
  }
})
</script>
<style lang="less" scoped>

</style>