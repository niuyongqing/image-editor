<template>
<div id="typeTree" class="typeTree">
  <!-- <a-input-search v-model:value="treeData.keyword" style="margin-bottom: 8px" placeholder="Search" /> -->
  <a-input-search
    v-model:value="treeData.keyword"
    placeholder="input search text"
    style="margin-bottom: 8px"
    @search="treeSearch(treeData.keyword)"
  />
  <div class="box-tree">
    <a-tree
      v-if="treeData.showTree.length > 0"
      defaultExpandAll
      :tree-data="treeData.showTree"
      :selectedKeys="treeData.selectedKeys"
      :fieldNames="{
        children:'children', 
        title:'name', 
        key:'id'
      }"
      :show-line="true"
      :show-icon="false"
      @select="selectNode"
    >
      <template #name="{ name }">
        <span>{{ name }}</span>
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
const emit = defineEmits(['update:currentClass'])
const props = defineProps({
  currentClass: {
    type: String,
    default: ''
  },
  platform: {
    type: String,
    default: ''
  }
})
const treeData = reactive({
  tree: [
    {
      id: '0',
      name: 'sfdggas' + '0',
      parentId: '0',
      platform: 'onze',
      isDeleted: false,
      children: [
        {
          id: '0-1',
          name: 'fdytgjhcv' + '0-1',
          parentId: '0',
          platform: 'onze',
          isDeleted: false,
          children: [
            {
              id: '0-1-1',
              name: 'sdgsgsdfsd' + '0-1-1',
              parentId: '0-1',
              platform: 'onze',
              isDeleted: false,
              children: []
            },
            {
              id: '0-1-2',
              name: 'ghkgffg' + '0-1-2',
              parentId: '0-1',
              platform: 'onze',
              isDeleted: false,
              children: []
            }
          ]
        },
        {
          id: '0-2',
          name: 'egjfgfbsdz' + '0-2',
          parentId: '0',
          platform: 'onze',
          isDeleted: false,
          children: [
            {
              id: '0-2-1',
              name: 'sdgsgsdfsd' + '0-2-1',
              parentId: '0-2',
              platform: 'onze',
              isDeleted: false,
              children: []
            },
            {
              id: '0-2-2',
              name: 'ghkgffg' + '0-2-2',
              parentId: '0-2',
              platform: 'onze',
              isDeleted: false,
              children: []
            }
          ]
        }
      ]
    }
  ],
  selectedKeys: ['0'],
  currentClass: '',
  showTree: [],
  keyword: ''
})

onMounted(() => {
  // getClassListFn()
  treeData.showTree = cloneDeep(treeData.tree)
})
// 获取树数据
async function getClassListFn(params) {
  try {
    let params = {
      "platform": props.platform,//平台
    }
    let res = await getClassList(params)
    treeData.tree = res.data
    treeData.showTree = cloneDeep(res.data)
  } catch (error) {
    console.error(error)
  }
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
    } else if (item.children && item.children.length > 0) {
      item.children = filterTreeNode(item.children, keyword)
      return item.children.length > 0
    } 
  })
  return list
}
// 树节点点击
function selectNode(expandedKeys, { expanded: bool, node }) {
  // console.log({expandedKeys,bool,node});
  treeData.selectedKeys = [node.id]
  treeData.currentClass = node.id
}
watch(() => treeData.keyword, value => {
  treeSearch(value) 
});
watch(() => treeData.currentClass, value => {
  emit('update:currentClass', value)
});
</script>
<style lang="less" scoped>
.typeTree {
  width: 100%;
  height: 100%;
  .box-tree {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
}
</style>