<template>
<div id="typeManage" class="typeManage">
  <a-modal 
    v-model:open="modalOpen" 
    title="分类管理"
    :width="500"
    :keyboard="true"
    :maskClosable="false"
  >
    <a-input-search
      v-model:value="treeData.keyword"
      placeholder="类别关键词"
      style="margin-bottom: 8px"
      @search="treeSearch(treeData.keyword)"
    />
    <div id="box-tree" class="box-tree">
      <a-tree
        v-if="treeData.showTree.length > 0"
        key="classificationTree_typeManage"
        defaultExpandAll
        v-model:expanded-keys="treeData.expandedKeys"
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
        <template #title="{ id, name, parentId, level }">
          <div 
            class="node-template-box" 
            @mouseenter="nodeMouseenter(id)" 
            @mouseleave="nodeMouseleave(id)"
          >
            <div class="title-content">
              <a-input 
                v-if="treeData.editNode && id === treeData.editNode.id"
                v-model:value="treeData.editNode.name" 
                style="width: 70%;"
                placeholder="" 
                ref="inputRef"
                allowClear
                @blur="editFn"
              />
              <div class="node-name" v-else>{{ name }}</div>
            </div>
            <div class="btn-content" v-show="treeData.hoverId === id">
              <CheckOutlined 
                v-if="treeData.editNode && id === treeData.editNode.id" 
                @click="editFn"
                class="typeManage-btn-icon"
              />
              <a-space v-else>
                <PlusOutlined 
                  class="typeManage-btn-icon" 
                  @click="addIcon({ id, name, parentId })" 
                  v-if="level < 3"
                />
                <FormOutlined 
                  class="typeManage-btn-icon" 
                  @click="editIcon({ id, name, parentId })" 
                  v-if="id !== '0'"
                />
                <a-popconfirm
                  v-if="id !== '0'"
                  title="是否删除该节点？"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="delIcon({ id, name, parentId })"
                >
                  <DeleteOutlined 
                    class="typeManage-btn-icon" 
                  />
                </a-popconfirm>
              </a-space>
            </div>
          </div>
        </template>
      </a-tree>
    </div>
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { cloneDeep } from 'lodash-es';
import { addClass, delClass, editClass, getClassList } from './api';
import { PlusOutlined, FormOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
defineOptions({ name: "typeManage" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'updateTree'])
const props = defineProps({
  modalOpen: Boolean,
  platform: {
    type: String,
    default: ''
  }
})
const modalOpen = ref(false)
const treeData = reactive({
  tree: [
    {
      id: '0',
      name: 'sfdggas' + '0',
      parentId: '0',
      platform: 'onze',
      isDeleted: false,
      childList: []
    }
  ],
  selectedKeys: [],
  expandedKeys: ['0'],
  showTree: [],         // 用于展示的树的数据
  nodeList: [],         // 所有节点的数据，用于
  keyword: '',          // 搜索关键词

  hoverId: '',
  editNode: null,       // 正在编辑的
})

onMounted(() => {})
// 搜索
watch(() => treeData.keyword, value => {
  treeSearch(value) 
});
// 打开弹窗
watch(() => props.modalOpen, val => {
  // console.log({val});
  modalOpen.value = val
  val && modalOpenFn()
});
// 关闭弹窗
watch(() => modalOpen.value, val => {
  if (!val) {
    emit('update:modalOpen', false);
    emit('updateTree')
  }
});
// 打开弹窗
async function modalOpenFn() {
  await getAllData()
  let noLeaf = treeData.nodeList.filter(i => (i.childList && i.childList.length > 0));
  treeData.expandedKeys = noLeaf.map(i => i.id)
}
// 关闭弹窗
function handleOk() {
  modalOpen.value = false
}
// 获取整个树
async function getAllData() {
  try {
    let res = await getClassListFn('0')
    let data = [
      {
        id: '0',
        name: '全部分类',
        parentId: '',
        childList: [...res.data || []]
      }
    ]
    treeData.tree = data
    data = setNodeKey(data)
    treeSearch(treeData.keyword)
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
// 获取树数据
async function getClassListFn(parentId) {
  try {
    let params = {
      "parentId": parentId,
      "platform": props.platform,//平台
    }
    let res = await getClassList(params);
    return res;
  } catch (error) {
    console.error(error);
  }
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
  treeData.nodeList = getNodeList(treeData.showTree)
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
  treeData.selectedKeys = []
}
function nodeMouseenter(id) {
  treeData.hoverId = id
}
function nodeMouseleave(id) {
  treeData.hoverId = ''
}
// 新增节点
async function addIcon({ id, name, parentId }) {
  try {
    let params = {
      name: '新分类',
      parentId: id,
      platform: props.platform
    }
    let { data: { data: editNode } } = await addClass(params);
    await getAllData();
    let expanded = treeData.expandedKeys.includes(id)
    // 节点生成之后要自行编辑节点名称
    if (expanded) {
      editIcon(editNode)
    } else {
      treeData.expandedKeys.push(id)
      setTimeout(() => {
        editIcon(editNode)
      }, 500);
    }
  } catch (error) {
    console.error(error)
  }
}
// 修改节点
function editIcon({ id, name, parentId }) {
  let obj = { id, name, parentId, platform: props.platform }
  treeData.editNode = obj
  nextTick(() => {
    _this.$refs.inputRef.focus()
  })
}
// 修改节点方法
async function editFn() {
  try {
    await editClass(treeData.editNode)
    await getAllData();
    // message.success('修改成功！')
  } catch (error) {
    console.error(error)
  }
  treeData.editNode = null
}
// 删除节点
async function delIcon({ id, name, parentId }) {
  try {
    await delClass(id)
    await getAllData()
    let val = treeData.nodeList.find(i => i.id === parentId)
    if (!(val.childList && val.childList.length > 0)) {
      treeData.expandedKeys = treeData.expandedKeys.filter(i => i !== val.id)
    }
    message.success('删除成功！')
  } catch (error) {
    console.error(error)
  }
}

</script>
<style lang="less" scoped>
.box-tree {
  width: 100%;
  max-height: 350px;
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
  .node-template-box {
    display: flex;
    // justify-content: space-between;
    width: 100%;
    .title-content {
      // width: calc(100% - 80px);
      .node-name {
        font-weight: 500;
        font-size: 16px;
      }
    }
    .btn-content {
      margin-left: 28px;
      .typeManage-btn-icon {
        cursor: pointer;
        font-size: 16px;
        :hover {
          color: rgb(84, 103, 248);
        }
      }
      // background: red;
      padding: 0;
    }
  }
}
</style>
<style lang="less">
.typeManage-popover {
  .ant-popover-content .ant-popover-inner {
    padding: 4px 8px !important;
    border-radius: 1px;
  }
}

</style>