<template>
<div id="typeTree" class="typeTree">
  <!-- <a-input-search v-model:value="treeData.keyword" style="margin-bottom: 8px" placeholder="Search" /> -->
  <a-input-search
    v-model:value="treeData.keyword"
    placeholder="类别关键词"
    style="margin-bottom: 8px"
    @search="treeSearch(treeData.keyword)"
  />
  <div class="box-tree">
    <a-tree
      v-if="treeData.showTree.length > 0"
      key="classificationTree_typeTree"
      defaultExpandAll
      :tree-data="treeData.showTree"
      :selectedKeys="treeData.selectedKeys"
      :fieldNames="{
        children:'childList', 
        title:'name', 
        key:'id'
      }"
      :show-line="true"
      :show-icon="false"
      @select="selectNode"
    >
      <template #title="{ name }">
        <div class="node-name">{{ name }}</div>
      </template>
    </a-tree>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { cloneDeep } from 'lodash-es';
import { getClassList } from './api';
defineOptions({ name: "typeTree" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:currentClass', 'update:nodePath'])
const props = defineProps({
  currentClass: {
    type: String,
    default: '0'
  },
  platform: {
    type: String,
    default: ''
  },
  nodePath: {     // 节点路径  全部分类 > 下一级 > 下一级
    type: String,
    default: '全部分类',
  }
})
defineExpose({
  updateTree
})
const treeData = reactive({
  tree: [],
  selectedKeys: ['0'],
  currentClass: '',
  showTree: [],
  nodeList: [],
  keyword: '',        
})

onMounted(() => {
  getClassListFn()
  // treeData.showTree = cloneDeep(treeData.tree)
})
watch(() => treeData.keyword, value => {
  treeSearch(value) 
});
watch(() => treeData.currentClass, value => {
  emit('update:currentClass', value)
});
// 更新数据
function updateTree() {
  getClassListFn(treeData.currentClass)
}
// 获取树数据
async function getClassListFn(id = '0') {
  try {
    let params = {
      "platform": props.platform,//平台
      parentId: '0',
    }
    let res = await getClassList(params)
    let data = [
      {
        id: '0',
        name: '全部分类',
        parentId: '',
        childList: [...res.data]
      }
    ]
    data = setNodeKey(data)
    treeData.tree = data
    treeData.showTree = cloneDeep(data)
    treeData.nodeList = getNodeList(data)
    let node = treeData.nodeList.find(i => i.id === id)
    nextTick(() => {
      selectNode([id], { expanded: undefined, node })
    })
  } catch (error) {
    console.error(error)
  }
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
  // console.log({expandedKeys,bool,node});
  treeData.selectedKeys = [node.id]
  treeData.currentClass = node.id
  let path = getNodePath(node)
  // console.log({path});
  emit('update:nodePath', path)
}
// 生成节点路径
function getNodePath(node) {
  let pathArr = node._key.split('-');
  let nameList = []
  for (let index = 0; index < pathArr.length; index++) {
    let arr = [...pathArr].slice(0, (index + 1))
    // console.log(arr);
    let key = arr.join('-')
    let val = treeData.nodeList.find(i => i._key === key)
    nameList.push(val.name)
  }
  let path = nameList.join(' > ');
  return path;
}
</script>
<style lang="less" scoped>
.typeTree {
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
      font-size: 16px;
      font-weight: 500;
      width: 100%;
    }
  }
}
</style>