<!-- 变种图片 弹窗 -->
<template>
  <a-modal
    :open="open"
    title="图片信息"
    width="45%"
    @cancel="cancel"
  >
    <a-tag
      color="blue"
      class="h-fit"
      >说明</a-tag
    >
    <span>第一张图片默认为主图，点击图片拖动，即可调整图片顺序！</span>
    <div class="text-#999">
      单张不超过2M，只支持.jpg,.png,.jpeg格式；普通分类图片尺寸为200*200-4320*7680，服装、鞋靴和饰品类目-最低分辨率为900*1200，建议纵横比为3:4；服装、鞋靴和配饰类目，背景应为灰色(#f2f3f5)
    </div>

    <div class="flex justify-between">
      <a-dropdown>
        <a-button>选择图片 <DownOutlined /></a-button>
        <template #overlay>
          <a-menu @click="imgAddMenuClick">
            <a-menu-item key="imgLocal">本地图片</a-menu-item>
            <a-menu-item key="imgBank">空间图片</a-menu-item>
            <a-menu-item key="imgFromNet">网络图片</a-menu-item>
            <a-menu-item key="imgQuote">引用采集图片</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-dropdown>
        <a-button type="link"><FormOutlined /> 编辑图片 <DownOutlined /></a-button>
        <template #overlay>
          <a-menu @click="imgModifyMenuClick">
            <a-menu-item key="modifySize">批量改图片尺寸</a-menu-item>
            <a-menu-item key="translate">图片翻译</a-menu-item>
            <a-menu-item key="whiteBg">图片白底</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <div>
      <div
        v-for="item in variantImages"
        :key="item"
      ></div>
    </div>

    <template #footer>
      <a-button
        class="mr-2"
        @click="cancel"
        >取消</a-button
      >
      <a-dropdown>
        <a-button type="primary">确定 <DownOutlined /></a-button>
        <template #overlay>
          <a-menu @click="confirmMenuClick">
            <a-menu-item key="applyAll">应用到全部</a-menu-item>
            <a-menu-item key="applySelf">应用到当前变种</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-modal>
</template>

<script setup>
  import { FormOutlined, DownOutlined } from '@ant-design/icons-vue'
  import { cloneDeep } from 'lodash'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    rawVariantImages: {
      type: Array,
      default: () => []
    }
  })
  const emits = defineEmits(['update:open', 'ok'])

  const variantImages = ref(cloneDeep(props.rawVariantImages))

  // 添加图片
  function imgAddMenuClick({ key }) {
    console.log(key)
  }

  // 编辑图片
  function imgModifyMenuClick({ key }) {
    console.log(key)
  }

  function confirmMenuClick({ key }) {
    console.log(key)
  }

  function cancel() {
    emits('update:open', false)
  }

  function ok() {
    emits('ok')
    cancel()
  }
</script>
