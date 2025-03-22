<!-- 账号管理 -->
<template>
  <div class="account text-left">
    <!-- 搜索区 -->
    <a-card>
      <a-form
        ref="searchFormRef"
        layout="inline"
        :model="searchForm"
      >
        <a-form-item
          label="用户"
          name="userId"
        >
          <a-select
            v-model:value="searchForm.userId"
            show-search
            placeholder="请输入用户名搜索"
            :options="userList"
            :field-names="{ label: 'userName', value: 'userId' }"
            option-filter-prop="userName"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item
          label="部门"
          name="depId"
        >
          <a-cascader
            v-model:value="searchForm.depId"
            :options="depOptions"
            :field-names="{ label: 'deptName', value: 'deptId' }"
            placeholder="请选择"
            style="width: 280px"
            change-on-select
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            :loading="loading"
            @click="search"
            >查询</a-button
          >
          <a-button
            class="ml-[10px]"
            :loading="loading"
            @click="reset"
            >重置</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>

    <!-- v-has-permi="['system:platform:tiktok:accredit']" -->
    <a-space class="my-4">
      <a-button
        type="primary"
        @click="add"
        >新增</a-button
      >
    </a-space>

    <!-- table 区 -->
    <a-card>
      <a-pagination
        v-model:current="pageParams.pageNum"
        v-model:pageSize="pageParams.pageSize"
        class="text-right mb-2"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />
      <a-table
        :data-source="tableData"
        :columns="DEFAULT_TABLE_COLUMN"
        :loading="loading"
        stripe
        bordered
        row-key="id"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '用户'">
            <span>{{ getUserName(record.userId) }}</span>
          </template>
          <template v-if="column.title === '账号'">
            <a-tag
              v-for="account in record.accountName"
              :key="account"
              color="green"
              class="mb-2"
              >{{ account }}</a-tag
            >
          </template>
          <template v-if="column.title === '部门信息'">
            <span>{{ getDeptInfo(record.depId) }}</span>
          </template>
          <template v-if="column.title === '操作'">
            <a-button
              type="link"
              @click="edit(record)"
              >编辑</a-button
            >
            <a-popconfirm
              title="确认删除吗?"
              @confirm="del(record.id)"
            >
              <a-button
                type="text"
                danger
                >删除</a-button
              >
            </a-popconfirm>
          </template>
        </template>
      </a-table>
      <a-pagination
        v-model:current="pageParams.pageNum"
        v-model:pageSize="pageParams.pageSize"
        class="text-right mt-2"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />
    </a-card>

    <!-- 新增/编辑 弹窗 -->
    <a-modal
      :title="modalForm.id ? '编辑' : '新增'"
      v-model:open="open"
      width="30%"
      :mask-closable="false"
      :after-close="handleClose"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <a-form
        ref="modalFormRef"
        :model="modalForm"
      >
        <a-form-item
          label="用户"
          name="userIds"
          required
        >
          <a-select
            v-model:value="modalForm.userIds"
            mode="multiple"
            placeholder="请输入用户名搜索"
            :options="userList"
            :field-names="{ label: 'userName', value: 'userId' }"
            option-filter-prop="userName"
          />
        </a-form-item>
        <a-form-item
          label="账号"
          name="accounts"
          required
        >
          <a-cascader
            v-model:value="modalForm.accounts"
            :options="accountList"
            multiple
            :fieldNames="{ label: 'simpleName', value: 'code' }"
            show-checked-strategy="SHOW_CHILD"
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item
          label="部门"
          name="depIds"
          required
        >
          <a-cascader
            v-model:value="modalForm.depIds"
            :options="depOptions"
            :field-names="{ label: 'deptName', value: 'deptId' }"
            placeholder="请选择"
            change-on-select
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { checkPermi, checkRole } from '~/utils/permission/component/permission.js'
  import { accountListApi, userListApi, tiktokAccountApi, userDepApi, addAccountApi, editAccountApi, delAccountApi } from '../apis/account.js'
  import { DEFAULT_TABLE_COLUMN } from './config.js'
  import dayjs from 'dayjs'
  import { message } from 'ant-design-vue'

  const hasPermi = computed(() => true || checkPermi(['system:platform:tiktok:account']) || checkRole('admin'))

  const searchFormRef = ref()
  const searchForm = ref({
    userId: undefined,
    depId: []
  })
  const pageParams = ref({
    pageNum: 1,
    pageSize: 50
  })
  function search() {
    pageParams.value.pageNum = 1
    getList()
  }
  function reset() {
    pageParams.value.pageNum = 1
    searchFormRef.value.resetFields()
    getList()
  }

  // 列表数据
  const tableData = ref([])
  const total = ref(0)
  const loading = ref(false)
  getList()
  function getList() {
    loading.value = true
    const depIdList = searchForm.value.depId
    const params = {
      ...searchForm.value,
      ...pageParams.value,
      depId: depIdList.length ? depIdList[depIdList.length - 1] : undefined
    }
    accountListApi(params)
      .then(res => {
        tableData.value = res.data.rows || []
        total.value = res.data.total
      })
      .finally(() => {
        loading.value = false
      })
  }

  /** 搜索用户 */
  const userList = ref([])
  fetchUser()
  function fetchUser() {
    userListApi({ userName: '' }).then(res => {
      userList.value = res.data || []
    })
  }

  /** 部门 */
  const depOptions = ref([])
  getDepOptions()
  function getDepOptions() {
    userDepApi().then(res => {
      depOptions.value = res.data || []
    })
  }

  /** 枚举出用户名 */
  function getUserName(userId) {
    let text = '--'
    if (userId) {
      const idList = userId.split(',').map(id => Number(id))
      const list = userList.value.filter(item => idList.includes(item.userId))
      if (list.length) {
        const nameList = list.map(item => item.userName)
        text = nameList.join(', ')
      }
    }

    return text
  }

  // 获取账号列表信息
  const accountList = ref([])
  getAccountList()
  function getAccountList() {
    tiktokAccountApi({ pageNum: 1, pageSize: 999 }).then(res => {
      accountList.value = res.rows || []
    })
  }

  /** 部门信息 */
  function getDeptInfo(depId) {
    const list = findParents(depOptions.value, depId)
    const text = list.map(item => item.deptName).join('/')
    return text
  }
  // 找给定子 Id 的所有父级 Id, 以数组形式返回(含子 Id)
  function findParents(tree, id, parents = []) {
    for (const node of tree) {
      if (node.deptId === id) {
        parents.push(node)
        return parents
      }
      if (node.children && node.children.length > 0) {
        const result = findParents(node.children, id, [...parents, node])
        if (result.length > 0) {
          return result
        }
      }
    }
    return []
  }

  /** 删除 */
  function del(id) {
    delAccountApi({ id }).then(res => {
      message.success('删除成功')
      getList()
    })
  }

  /** 新增/编辑 */
  const open = ref(false)
  const confirmLoading = ref(false)
  const modalForm = ref({
    id: undefined,
    userIds: [],
    accounts: [],
    depIds: []
  })
  const modalFormRef = ref()

  function add() {
    open.value = true
  }
  function edit(record) {
    open.value = true
    const list = findParents(depOptions.value, record.depId)
    const depIds = list.map(item => item.deptId)

    modalForm.value = {
      id: record.id,
      userIds: record.userId.split(',').map(id => Number(id)),
      accounts: record.account.split(','),
      depIds
    }
  }
  // 提交
  async function handleOk() {
    let valid = true
    await modalFormRef.value.validate().catch(_ => {
      valid = false
    })
    if (!valid) return

    confirmLoading.value = true
    const params = {
      id: modalForm.value.id,
      platform: 'Tiktok',
      userId: modalForm.value.userIds.join(','),
      account: modalForm.value.accounts.join(','),
      depId: modalForm.value.depIds.slice(-1)[0]
    }
    const requestApi = modalForm.value.id ? editAccountApi : addAccountApi
    requestApi(params)
      .then(res => {
        const msg = modalForm.value.id ? '编辑成功' : '新增成功'
        message.success(msg)
        getList()
        handleClose()
      })
      .finally(() => {
        confirmLoading.value = false
      })
  }
  function handleClose() {
    open.value = false
    modalFormRef.value.resetFields()
    modalForm.value = {
      id: undefined,
      userIds: [],
      accounts: [],
      depIds: []
    }
  }
</script>
