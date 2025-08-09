<template>
  <div class="classification-tree">
    <a-input-search
      v-model:value="treeData.keyword"
      placeholder="类别关键词"
      class="mb-2"
      @search="treeSearch(treeData.keyword)"
    />
    <div class="box-tree">
      <a-spin :spinning="treeData.loading">
        <a-tree
          v-if="treeData.showTree.length > 0"
          key="classification_tree"
          defaultExpandAll
          :tree-data="treeData.showTree"
          :selectedKeys="treeData.selectedKeys"
          :fieldNames="{
            children: 'childList',
            title: 'name',
            key: 'id'
          }"
          :show-line="true"
          :show-icon="false"
          @select="selectNode"
        >
          <template #title="{ name }">
            <div class="node-name">{{ name }}</div>
          </template>
        </a-tree>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
  import { cloneDeep } from 'lodash-es'
  import { getClassList } from '@/components/classificationTree/api'

  defineOptions({ name: 'ClassificationTree' })
  const { proxy: _this } = getCurrentInstance()
  const emit = defineEmits(['update:currentClass', 'update:nodePath', 'nodeClick'])
  const props = defineProps({
    currentClass: {
      // 类型
      type: String,
      default: '0'
    },
    platform: {
      type: String,
      default: ''
    },
    nodePath: {
      // 节点路径  全部分类 > 下一级 > 下一级
      type: String,
      default: '全部分类'
    },
    defaultClass: {
      // 更新数据后默认选中节点
      type: Boolean,
      default: true
    }
  })
  defineExpose({
    updateTree // 更新数据方法
  })

  const treeData = reactive({
    tree: [],
    selectedKeys: [],
    currentClass: '',
    showTree: [],
    nodeList: [],
    keyword: '',

    loading: false
  })

  watch(
    () => props.currentClass,
    val => {
      if (!val) {
        treeData.selectedKeys = []
      }
    }
  )

  onMounted(() => {
    nextTick(() => {
      getClassListFn(props.currentClass, true)
    })
  })
  watch(
    () => treeData.keyword,
    value => {
      treeSearch(value)
    }
  )
  /**
   * // 更新数据
   * @param val 入参为 ‘all’ 更新后重置勾选状态为全部分类， 不入参或其他参数更新后保持选中状态， props.defaultCLass属性为true的时候生效
   */
  async function updateTree(val) {
    if (val === 'all') {
      await getClassListFn()
    } else {
      await getClassListFn(treeData.currentClass)
    }
  }
  // 获取树数据
  async function getClassListFn(id = '0', initFlag = false) {
    treeData.loading = true
    try {
      let params = {
        platform: props.platform, //平台
        parentId: '0'
      }
      let res = await getClassList(params)
      let data = [
        {
          id: '0',
          name: '全部分类',
          parentId: '',
          childList: [...(res.data || [])]
        }
      ]
      data = setNodeKey(data)
      treeData.tree = data
      treeSearch(treeData.keyword)
      treeData.nodeList = getNodeList(data)
      if (props.defaultClass) {
        // 如果是删除当前节点后更新树数据，那么默认选择全部分类
        let node = treeData.nodeList.find(i => i.id === id) || treeData.tree[0]
        nextTick(() => {
          // 初始化时, 不走下面的流程
          if (!(initFlag && !id)) {
            treeData.selectedKeys = [node.id]
            treeData.currentClass = node.id
            let path = getNodePath(node)
          }
        })
      } else {
        treeData.selectedKeys = []
        treeData.currentClass = ''
      }
    } catch (error) {
      console.error(error)
    }
    treeData.loading = false
  }
  // 树节点属性处理
  function setNodeKey(list, pNode = null) {
    list.forEach((item, index) => {
      if (!pNode) {
        item.level = 0
        item._key = index + ''
      } else {
        item.level = pNode.level + 1
        item._key = `${pNode._key}-${index}`
      }
      item.isLeaf = !(item.childList && item.childList.length > 0)
      if (!item.isLeaf) {
        item.childList = setNodeKey(item.childList, item)
      }
    })
    return list
  }
  // 将数据扁平化
  function getNodeList(data) {
    let list = [...data]
    data.forEach(item => {
      if (item.childList && item.childList.length > 0) {
        let childList = getNodeList(item.childList)
        list = [...list, ...childList]
      }
    })
    return list
  }
  // 树搜索
  function treeSearch(val) {
    let data = cloneDeep(treeData.tree)
    treeData.showTree = filterTreeNode(data, val)
  }
  // 树节点搜索
  function filterTreeNode(data, keyword) {
    let list = data.filter(item => {
      if (item.name.includes(keyword)) {
        return true
      } else if (item.childList && item.childList.length > 0) {
        item.childList = filterTreeNode(item.childList, keyword)
        return item.childList.length > 0
      }
    })
    return list
  }
  // 树节点点击
  function selectNode(expandedKeys, { expanded: bool, node }) {
    treeData.selectedKeys = [node.id]
    treeData.currentClass = node.id
    let path = getNodePath(node)
    emit('update:currentClass', node.id)
    emit('update:nodePath', path)
    emit('nodeClick', { ...node })
  }
  // 生成节点路径
  function getNodePath(node) {
    let pathArr = node._key.split('-')
    let nameList = []
    for (let index = 0; index < pathArr.length; index++) {
      let arr = [...pathArr].slice(0, index + 1)
      let key = arr.join('-')
      let val = treeData.nodeList.find(i => i._key === key)
      nameList.push(val.name)
    }
    let path = nameList.join(' > ')
    return path
  }
</script>

<style lang="less" scoped>
  .classification-tree {
    width: 100%;
    height: 100%;
    .box-tree {
      width: 100%;
      height: calc(100% - 40px);
      overflow-y: auto;
      :deep(.ant-tree-treenode) {
        width: 100%;
        .ant-tree-node-content-wrapper {
          display: inline-block;
          flex: 1;
          .ant-tree-title {
            display: inline-block;
            width: 100%;
            text-align: left;
          }
        }
      }
      .node-name {
        font-weight: 500;
        width: 100%;
      }
    }
  }
</style>
