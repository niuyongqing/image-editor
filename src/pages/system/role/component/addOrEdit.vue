<template>
  <a-modal :open="props.open" :title="title" :confirm-loading="loading" html-type="submit" :footer="null"
    :closable="false" :destroyOnClose="true">
    <a-card>
      <a-form :model="formData" label-align="right" @finish="handleOk" :label-col="labelCol">
        <a-form-item label="角色名" name="roleName" :rules="[{ required: true }]">
          <a-input v-model:value="formData.roleName"></a-input>
        </a-form-item>
        <a-form-item label="排序" name="sort" :rules="[{ required: true }]">
          <a-input-number v-model:value="formData.sort" style="width: 100%"></a-input-number>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-switch v-model:checked="formData.status" checked-value="0" un-checked-value="1"></a-switch>
        </a-form-item>
        <a-form-item label="备注" name="status">
          <a-textarea v-model:value="formData.remark" :rows="2"></a-textarea>
        </a-form-item>
        <a-form-item label="菜单权限" name="menuId">
          <div style="text-align: right"><a-checkbox v-model:checked="selectAll" @change="checkAll">全选</a-checkbox>
          </div>
          <a-card style="height: 500px">
            <a-tree :height="500" v-model:checkedKeys="checkedKeys" checkable checkStrictly :tree-data="menu"
              :field-names="{ title: 'title', key: 'id', children: 'children' }" @check="checkTree"></a-tree>
          </a-card>

        </a-form-item>
        <a-form-item style="display: flex; text-align: right">
          <a-button @click="close" style="margin-right: 10px">取消</a-button>
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>
<script setup lang="js">
import { ref } from "vue";
import { message } from 'ant-design-vue';
import { addRoleApi, getRoleByIdApi, editRoleApi } from "~/api/common/role";
const emit = defineEmits(['close']);
const props = defineProps({
  open: { type: Boolean, required: true, default: false },
  title: { type: String, required: true, default: '' },
  data: { type: Object, required: false, default: {} },
  menu: { type: Array, required: true, default: [] },
})
const checkedKeys = ref([]) // 已选择
const loading = ref(false);
const formData = ref({ status: '0', menuId: [] });
const menuIds = ref([])
const selectAll = ref(false)

watchEffect(() => {
  // 找到仪表页面的id和下面的所有菜单id
  const dashboardItem = props.menu.find((item) => item.path === '/platform/dashboard');
  let dashboardId = null;
  let dashboardChildrenIds = [];
  if (dashboardItem) {
    dashboardId = dashboardItem.id;
    const dashboardChildren = dashboardItem.children || [];
    dashboardChildrenIds = dashboardChildren.map((item) => item.id) || [];
  }

  if (props.data.roleId) {
    getRoleByIdApi({ roleId: props.data.roleId }).then(res => {
      formData.value = res.data
      checkedKeys.value = props.data.menuId ? {
        checked: props.data.menuId,
        halfChecked: []
      } : {
        checked: [dashboardId, ...dashboardChildrenIds],
        halfChecked: []
      }
    })
  } else {
    checkedKeys.value = {
      checked: [dashboardId, ...dashboardChildrenIds],
      halfChecked: []
    }
  }
  if (props.open && props.menu) {
    menuIds.value = getAllIds(props.menu)
  }
});

const checkAll = () => {
  // 找到仪表页面的id和下面的所有菜单id
  const dashboardItem = props.menu.find((item) => item.path === '/platform/dashboard');
  let dashboardId = null;
  let dashboardChildrenIds = [];
  if (dashboardItem) {
    dashboardId = dashboardItem.id;
    const dashboardChildren = dashboardItem.children || [];
    dashboardChildrenIds = dashboardChildren.map((item) => item.id) || [];
  }
  if (selectAll.value) {
    checkedKeys.value = {
      checked: menuIds.value,
      halfChecked: []
    }
  } else {
    checkedKeys.value = {
      checked: [dashboardId, ...dashboardChildrenIds],
      halfChecked: []
    }
  }
}

const labelCol = {
  style: {
    width: '80px',
  },
};

function handleOk() {
  loading.value = true;
  formData.value.menuId = checkedKeys.value.checked
  if (props.title === '新增角色') {
    addRoleApi(formData.value).then(res => {
      resFunc(res)
    })
  }
  if (props.title === '编辑角色') {
    editRoleApi(formData.value).then(res => {
      resFunc(res)
    })
  }
}

function resFunc(res) {
  if (res.code == 200) {
    message.success(res.msg);
    formData.value = { status: '0', menuId: [] }
    checkedKeys.value = []
    close()
  } else {
    message.error(res.msg);
  }
}

function getAllIds(data) {
  const ids = [];
  function collectIds(node) {
    if (node.id) {
      ids.push(node.id);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(collectIds);
    }
  }
  data.forEach(collectIds);
  return ids;
}

function close() {
  formData.value = { status: '0', menuId: [] };
  menuIds.value = []
  checkedKeys.value = []
  selectAll.value = false
  emit('close', false);
}


const checkTree = (keys, { checked, checkedNodes, node, event }) => {
  //   是父节点
  if (!node.parent) {
    if (checked) {
      const ids = node.children.map((item) => item.id);
      checkedKeys.value.checked = Array.from(new Set([...checkedKeys.value.checked, ...ids]));
    } else {
      checkedKeys.value.checked = checkedKeys.value.checked.filter((item) => !node.children.some((child) => child.id === item));
    }
  } else {
    //  非父节点
    const currentNodeIds = node.parent.children.map((item) => item.key);
    if (currentNodeIds.every((id) => checkedKeys.value.checked.includes(id))) {
      checkedKeys.value.checked.push(node.parent.key);
    } else {
      checkedKeys.value.checked = checkedKeys.value.checked.filter((id) => id !== node.parent.key);
    }
  }
}

</script>
<style scoped lang="less"></style>