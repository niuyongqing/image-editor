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
        <typeTree
          v-model:current-class="currentClass"
          platform="ozon"
          ref="waitTypeTreeRef"
          @update:currentClass="waitCurrentClass"
        >
        </typeTree>
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
        <typeTree
          v-model:current-class="currentClass"
          platform="ozon"
          @update:currentClass="onlineCurrentClass"
          ref="onlineTypeTreeRef"
        >
        </typeTree>
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
  import typeTree from '@/components/classificationTree/typeTree.vue'
  import typeManage from '@/components/classificationTree/typeManage.vue'
  defineProps({
    totalCount: {
      type: Number,
      default: 0
    },
    publishFailedCount: {
      type: Number,
      default: 0
    },
    activeCode: {
      type: String,
      default: ''
    }
  })
  const emits = defineEmits(['draftEmit', 'waitEmit', 'onlineEmit'])

  const waitTypeTreeEl = useTemplateRef('waitTypeTreeRef') // 待发布产品分类
  const onlineTypeTreeEl = useTemplateRef('onlineTypeTreeRef') // 在线产品分类
  const publishManageEl = useTemplateRef('publishManageRef')

  const currentClass = ref('0')
  const typeManageOpen = ref(false)
  const active = ref('draft')

  //  更新在线产品信息
  const updateTree = () => {
    waitTypeTreeEl.value.updateTree()
    onlineTypeTreeEl.value.updateTree()
  }

  const selectActive = code => {
    active.value = code
    currentClass.value = ''
    switch (code) {
      case 'draft':
        emits('draftEmit')
        break;
      case 'fail':
        emits('waitEmit')
        break;
    
      default:
        break;
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
