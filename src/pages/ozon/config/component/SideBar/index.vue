<template>
  <div>
    <a-card
      bordered
      style="margin: 0 auto; border-radius: 0px"
    >
      <div :class="active === 'draft' ? 'ozon-active' : 'default'">
        <div
          text-left
          pl-10px
          cursor-pointer
          @click="selectActive('draft')"
        >
          「ozon」采集箱(<span>{{ totalCount }}</span
          >)
        </div>
      </div>
    </a-card>
    <a-card
      :bordered="true"
      style="margin: 0 auto; border-radius: 0px"
    >
      <template #title>
        <div
          flex
          justify-between
          class="nav-title"
        >
          <div>待发布产品</div>
          <div>
            <a-button
              type="link"
              @click="typeManageOpen = true"
            >
              <SettingOutlined />
            </a-button>
          </div>
        </div>
      </template>
      <div
        py-10px
        px-5px
      >
        <ClassificationTree
          v-model:current-class="curWaitClass"
          platform="ozon"
          ref="waitClassificationTreeRef"
          @update:currentClass="waitCurrentClass"
        />
        <div :class="active === 'fail' ? 'ozon-active' : 'default'">
          <div
            text-left
            pl-10px
            cursor-pointer
            @click="selectActive('fail')"
          >
            发布失败(<span
              text-red-5
              font-bold
              >{{ publishFailedCount }}</span
            >)
          </div>
        </div>
      </div>
    </a-card>
    <a-card
      :bordered="true"
      style="margin: 0 auto; border-radius: 0px"
    >
      <template #title>
        <div
          flex
          justify-between
          class="nav-title"
        >
          <div>在线产品</div>
          <div>
            <a-button
              type="link"
              @click="typeManageOpen = true"
            >
              <SettingOutlined />
            </a-button>
          </div>
        </div>
      </template>
      <div
        py-10px
        px-5px
      >
        <ClassificationTree
          v-model:current-class="curOnlineClass"
          platform="ozon"
          @update:currentClass="onlineCurrentClass"
          ref="onlineClassificationTreeRef"
        />
      </div>
    </a-card>

    <!-- 在线产品分类管理 -->
    <typeManage
      v-model:modal-open="typeManageOpen"
      platform="ozon"
      @updateTree="updateTree"
    />
  </div>
</template>

<script setup>
  import { SettingOutlined } from '@ant-design/icons-vue'
  import ClassificationTree from './ClassificationTree.vue'
  import typeManage from '@/components/classificationTree/typeManage.vue'

  const props = defineProps({
    totalCount: {
      type: Number,
      default: 0
    },
    publishFailedCount: {
      type: Number,
      default: 0
    },
    pageType: {
      // 页面类型: draft-采集箱; waitPublish-待发布; online-店铺(在线)商品;
      type: String,
      default: ''
    },
    defaultActive: {
      type: String,
      default: ''
    }
  })
  const emits = defineEmits(['draftEmit', 'waitEmit', 'onlineEmit'])

  const waitClassificationTreeEl = useTemplateRef('waitClassificationTreeRef') // 待发布产品分类
  const onlineClassificationTreeEl = useTemplateRef('onlineClassificationTreeRef') // 在线产品分类
  const publishManageEl = useTemplateRef('publishManageRef')

  const curWaitClass = ref('') // 当前选中的待发布商品分类
  const curOnlineClass = ref('') // 当前选中的在线商品分类
  const typeManageOpen = ref(false)
  const active = ref('draft')

  watch(
    () => props.defaultActive,
    val => {
      if (!val) return

      if (['draft', 'fail'].includes(val)) {
        active.value = val
      } else {
        active.value = ''
        switch (props.pageType) {
          case 'waitPublish':
            curWaitClass.value = val
            break
          case 'online':
            curOnlineClass.value = val
            break

          default:
            break
        }
      }
    },
    { immediate: true }
  )

  //  更新在线产品信息
  const updateTree = () => {
    waitClassificationTreeEl.value.updateTree()
    onlineClassificationTreeEl.value.updateTree()
  }

  const selectActive = code => {
    active.value = code
    curWaitClass.value = ''
    curOnlineClass.value = ''
    switch (code) {
      case 'draft':
        emits('draftEmit')
        break
      case 'fail':
        emits('waitEmit', 'fail')
        break

      default:
        break
    }
  }

  const waitCurrentClass = value => {
    if (!value) return
    active.value = ''
    emits('waitEmit', value)
  }

  const onlineCurrentClass = value => {
    if (!value) return
    active.value = ''
    emits('onlineEmit', value)
  }
</script>

<style lang="less" scoped>
  :deep(.ant-card-body) {
    padding: 0px;
  }

  :deep(.ant-tree-node-selected) {
    color: #428bca;
    background: #eff2f9 !important;
  }

  :deep(.ant-card-head) {
    padding: 0px;
  }

  .nav-title {
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    padding-left: 12px;
    padding-right: 12px;
    height: 40px;
    line-height: 40px;
    color: #434649;
    font-weight: 600;
    background-color: #f2f2f2;
  }

  .ozon-active {
    border-left: 3px solid #428bca;
    color: #428bca;
    background: #eff2f9;
    padding: 8px;
  }

  .default {
    padding: 8px;
  }

  .text-color {
    color: #737679;
  }

  .node-name {
    font-size: 16px;
    font-weight: 500;
    width: 100%;
  }
</style>
