<template>
  <a-modal
    :open="props.open"
    :title="title"
    :confirm-loading="loading"
    @cancel="close"
  >
    <a-card>
      <a-form
        :model="formData"
        :label-col="labelCol"
      >
        <a-form-item
          label="角色名"
          name="roleName"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="formData.roleName"></a-input>
        </a-form-item>
        <a-form-item
          label="排序"
          name="sort"
          :rules="[{ required: true }]"
        >
          <a-input-number
            v-model:value="formData.sort"
            style="width: 100%"
          ></a-input-number>
        </a-form-item>
        <a-form-item
          label="状态"
          name="status"
        >
          <a-switch
            v-model:checked="formData.status"
            checked-value="0"
            un-checked-value="1"
          ></a-switch>
        </a-form-item>
        <a-form-item
          label="备注"
          name="status"
        >
          <a-textarea
            v-model:value="formData.remark"
            :rows="2"
          ></a-textarea>
        </a-form-item>
        <a-form-item
          label="菜单权限"
          name="menuId"
        >
          <div style="text-align: right">
            <a-checkbox
              v-model:checked="selectAll"
              @change="checkAll"
              >全选</a-checkbox
            >
          </div>
          <a-card style="height: 500px">
            <a-tree
              v-model:checkedKeys="checkedKeys"
              :tree-data="menu"
              checkable
              :height="500"
            ></a-tree>
          </a-card>
        </a-form-item>
      </a-form>
    </a-card>

    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        >确定</a-button
      >
    </template>
  </a-modal>
</template>

<script setup>
  import { message } from 'ant-design-vue'
  import { addRoleApi, getRoleByIdApi, editRoleApi } from '~/api/common/role'

  const emit = defineEmits(['close'])
  const props = defineProps({
    open: { type: Boolean, required: true, default: false },
    title: { type: String, required: true, default: '' },
    data: { type: Object, required: false, default: {} },
    menu: { type: Array, required: true, default: [] }
  })

  const checkedKeys = ref([]) // 已选择
  const loading = ref(false)
  const formData = ref({ status: '0', menuId: [] })
  const selectAll = ref(false)

  watchEffect(() => {
    // 找到仪表页面的id和下面的所有菜单id
    const dashboardItem = props.menu.find(item => item.path === '/platform/dashboard')
    let dashboardId = null
    let dashboardChildrenIds = []
    if (dashboardItem) {
      dashboardId = dashboardItem.id
      const dashboardChildren = dashboardItem.children || []
      dashboardChildrenIds = dashboardChildren.map(item => item.id) || []
    }

    if (props.data.roleId) {
      getRoleByIdApi({ roleId: props.data.roleId }).then(res => {
        formData.value = res.data
        checkedKeys.value = props.data.menuIdList || [dashboardId, ...dashboardChildrenIds]
      })
    } else {
      checkedKeys.value = [dashboardId, ...dashboardChildrenIds]
    }
  })

  const checkAll = () => {
    // 找到仪表页面的id和下面的所有菜单id
    const dashboardItem = props.menu.find(item => item.path === '/platform/dashboard')
    let dashboardId = null
    let dashboardChildrenIds = []
    if (dashboardItem) {
      dashboardId = dashboardItem.id
      const dashboardChildren = dashboardItem.children || []
      dashboardChildrenIds = dashboardChildren.map(item => item.id) || []
    }
    if (selectAll.value) {
      checkedKeys.value = getAllIds(props.menu)
    } else {
      checkedKeys.value = [dashboardId, ...dashboardChildrenIds]
    }
  }

  const labelCol = {
    style: {
      width: '80px'
    }
  }

  function handleOk() {
    loading.value = true
    const params = {
      ...formData.value,
      menuId: checkedKeys.value,
      menuIdList: checkedKeys.value
    }
    if (props.title === '新增角色') {
      addRoleApi(params).then(res => {
        resFunc(res)
      })
    }
    if (props.title === '编辑角色') {
      editRoleApi(params).then(res => {
        resFunc(res)
      })
    }
  }

  function resFunc(res) {
    if (res.code == 200) {
      message.success(res.msg)
      formData.value = { status: '0', menuId: [] }
      checkedKeys.value = []
      close()
    } else {
      message.error(res.msg)
    }
  }

  function getAllIds(data) {
    const ids = []
    function collectIds(node) {
      if (node.id) {
        ids.push(node.id)
      }
      if (node.children && node.children.length > 0) {
        node.children.forEach(collectIds)
      }
    }
    data.forEach(collectIds)
    return ids
  }

  function close() {
    formData.value = { status: '0', menuId: [] }
    checkedKeys.value = []
    selectAll.value = false
    emit('close', false)
  }
</script>
