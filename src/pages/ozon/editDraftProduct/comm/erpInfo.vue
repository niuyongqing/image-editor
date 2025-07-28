<template>
  <div mb-15px>
    <a-card style="text-align: left">
      <template #title> ERP信息 <span style="color: #9fa0a2">（注：下列信息，仅在本系统生效）</span> </template>
      <a-form
        :model="formData"
        :label-col="{ span: 3 }"
        class="shopForm"
      >
        <!-- <a-form-item label="ERP分类">
          <a-dropdown
            trigger="click"
            v-model:open="openDropdown"
          >
            <a-button style="width: 300px; height: 32px">
              <div flex>
                <div
                  w-280px
                  text-left
                >
                  {{ nodeName ? nodeName : '请选择分类' }}
                </div>
                <DownOutlined />
              </div>
            </a-button>
            <template #overlay>
              <a-menu>
                <typeTree
                  v-model:current-class="currentClass"
                  v-model:node-path="nodePath"
                  :classifyTreeData="treeData"
                  ref="typeTreeRef"
                  @update:nodePath="updateNodePath"
                  default-class
                  platform="public"
                >
                </typeTree>
              </a-menu>
            </template>
          </a-dropdown>
          <a-button
            type="link"
            @click="showCategoryModal"
          >
            + 管理分类
          </a-button>
        </a-form-item> -->

        <a-form-item label="来源URL">
          <div
            v-for="(item, index) in sourceUrlList"
            :key="item.id"
            mb-12px
          >
            <a-input
              v-model:value="item.sourceUrl"
              placeholder="用于记录供货渠道URL，方便采购。仅在店小秘显示，不会同步到Ozon平台！"
              style="width: 90%"
            >
              <template #addonBefore>
                {{ index + 1 }}
              </template>
              <template #addonAfter>
                <a-button
                  type="link"
                  @click="visitUrl(item.sourceUrl)"
                  style="height: 20px; line-height: 20px"
                >
                  访问
                </a-button>
              </template>
            </a-input>
            <a-button
              type="link"
              @click="handlePlus"
              v-if="index === 0"
            >
              <PlusOutlined></PlusOutlined>
            </a-button>
            <a-button
              type="link"
              @click="handleMinus(item.id)"
              v-else
            >
              <CloseOutlined></CloseOutlined>
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>

    <typeManage
      v-model:modal-open="typeManageOpen"
      platform="public"
      @updateTree="updateTree"
    >
    </typeManage>
  </div>
</template>

<script setup>
  import { message } from 'ant-design-vue'
  import { DownOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue'
  import typeTree from './typeTree.vue'
  import typeManage from '@/components/classificationTree/typeManage.vue'
  import { getClassList } from '@/components/classificationTree/api.js'
  import { v4 as uuidv4 } from 'uuid'

  const props = defineProps({
    productDetail: {
      type: Object,
      default: () => {}
    }
  })

  const updateNodePath = nodePath => {
    const nodePaths = nodePath.split(' > ')
    nodeName.value = nodePaths[nodePaths.length - 1]
    openDropdown.value = false
  }

  const formData = reactive({
    erpProductId: '',
    sourceUrl: ''
  })
  const sourceUrlList = ref([{ sourceUrl: '', id: uuidv4() }]) // 来源URL列表
  const openDropdown = ref(false) // 下拉框是否打开

  const typeTreeEl = useTemplateRef('typeTreeRef')
  const currentClass = ref('')
  const treeData = ref([])
  const nodePath = ref('')
  const typeManageOpen = ref(false)
  const nodeName = ref('')
  const selectedKeys = ref([])

  watch(
    () => props.productDetail,
    val => {
      if (val) {
        currentClass.value = val?.customCategoryId ?? ''
        const list = val.sourceUrlList ?? []
        if (list.length === 0) {
          sourceUrlList.value = [{ sourceUrl: '', id: uuidv4() }]
        } else {
          sourceUrlList.value = list.map(item => {
            return { sourceUrl: item, id: uuidv4() }
          })
        }
      }
    }
  )

  defineExpose({
    currentClass,
    sourceUrlList
  })

  // 更新当前选中节点
  const updateTree = async () => {
    getTreeData()
  }

  function filterTreeWithParents(nodes, predicate) {
    return nodes
      .map(node => ({ ...node }))
      .filter(node => {
        if (node.children) {
          node.children = filterTreeWithParents(node.children, predicate)
        }
        return predicate(node) || (node.children && node.children.length > 0)
      })
  }

  const visitUrl = sourceUrl => {
    if (!sourceUrl) {
      message.info('请先输入来源URL')
      return
    }
    window.open(sourceUrl)
  }

  //  新增
  const handlePlus = () => {
    sourceUrlList.value.push({ id: uuidv4() })
  }
  const handleMinus = id => {
    sourceUrlList.value = sourceUrlList.value.filter(item => item.id !== id)
  }

  //  管理分类-弹窗
  const showCategoryModal = () => {
    typeManageOpen.value = true
  }
  // 获取tree数据
  const getTreeData = () => {
    let params = {
      platform: 'public', //平台
      parentId: '0'
    }
    getClassList(params).then(res => {
      const dataRes = res.data || []
      treeData.value = dataRes
      const findItemById = (id, tree) => {
        for (let item of tree) {
          if (item.id === id) {
            return item
          }
          if (item.childList && item.childList.length > 0) {
            const found = findItemById(id, item.childList)
            if (found) {
              return found
            }
          }
        }
        return null
      }
      const item = findItemById(currentClass.value, treeData.value)
      nodeName.value = item?.name ?? ''
      currentClass.value = item?.id ?? ''
    })
  }
  onMounted(() => {
    getTreeData()
  })
</script>
<style lang="less" scoped>
  :deep(.shopForm) {
    .ant-form-item {
      .ant-row {
        .ant-form-item-label > label {
          font-size: 20px !important;
        }
      }
    }
  }
</style>
