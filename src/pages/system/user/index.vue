<script setup lang="js">

import { ref, unref } from 'vue'
import { format } from 'date-fns';
import { changeStatusApi, delUserApi, getUserListApi, deptTreeSelect } from '~/api/common/user.js'
import { message } from 'ant-design-vue';
import { Table } from 'ant-design-vue';
import AddOrEdit from "~/pages/system/user/component/addOrEdit.vue";
import { checkPermi } from "~/utils/permission/component/permission.js";
import man1 from '@/assets/images/userPhoto/man1.png'
import man2 from '@/assets/images/userPhoto/man2.png'
import man3 from '@/assets/images/userPhoto/man3.png'
import man4 from '@/assets/images/userPhoto/man4.png'
import woman1 from '@/assets/images/userPhoto/woman1.png'
import woman2 from '@/assets/images/userPhoto/woman2.png'
import woman3 from '@/assets/images/userPhoto/woman3.png'
import woman4 from '@/assets/images/userPhoto/woman4.png'
// 随机下面的头像
const randomAvatar = (sex) => {
  // 过滤出符合性别要求的头像
  const filteredPhotos = userPhoto.filter(photo => photo.sex === sex);
  if (filteredPhotos.length === 0) {
    // 如果没有符合性别要求的头像，返回默认头像
    return man1;
  }
  const randomIndex = Math.floor(Math.random() * filteredPhotos.length);
  return filteredPhotos[randomIndex].value;
}
const userPhoto = [
  {
    label: '默认头像',
    value: man1,
    sex: '0',
  },
  {
    label: '男头像2',
    value: man2,
    sex: '0',
  },
  {
    label: '男头像3',
    value: man3,
    sex: '0',
  },
  {
    label: '男头像4',
    value: man4,
    sex: '0',
  },
  {
    label: '女头像1',
    value: woman1,
    sex: '1',
  },
  {
    label: '女头像2',
    value: woman2,
    sex: '1',
  },
  {
    label: '女头像3',
    value: woman3,
    sex: '1',
  },
  {
    label: '女头像4',
    value: woman4,
    sex: '1',
  },
]


// 定义分页配置
const pagination = ref({
  current: 1,
  pageSize: 50,
  total: 0, // 例如，总条目数为50
  pageSizeOptions: ['50', '100', '200'],
});
const tableHeight = ref(0);
const tableContainer = ref(null);
const columns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 50,
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  }, {
    title: '别名',
    dataIndex: 'nickName',
    key: 'nickName',
  }, {
    title: '电话号码',
    dataIndex: 'phonenumber',
    key: 'phonenumber',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 50,
  }, {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  }, {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    width: 100,
  },
]
const open = ref(false);
const title = ref("");
const editData = ref({})
const dept = ref([])
const tableLoading = ref(false);

const formState = ref({
  userName: "",
  phonenumber: "",
  picker: [],
  pageNum: 1,
  pageSize: 50
})
const setTableHeight = () => {
  if (tableContainer.value) {
    tableHeight.value = window.innerHeight - tableContainer.value.getBoundingClientRect().top - 140; // 偏移量可根据需求调整
  }
};

onMounted(() => {
  handleFinish()
  setTableHeight();
  window.addEventListener('resize', setTableHeight);
  deptTreeSelect().then(res => {
    dept.value = res.data
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', setTableHeight);
});
const tableData = ref([])

function handleFinish() {
  const [startDate, endDate] = formState.value.picker || [];
  let data = {
    userName: formState.value.userName,
    phonenumber: formState.value.phonenumber,
    beginTime: startDate ? format(new Date(startDate), 'yyyy-MM-dd') : "",
    endTime: endDate ? format(new Date(endDate), 'yyyy-MM-dd') : "",
    pageNum: formState.value.pageNum,
    pageSize: formState.value.pageSize
  }
  tableLoading.value = true;
  getUserListApi(data).then(res => {
    tableData.value = res.rows
    pagination.value.total = res.total
  }).finally(() => {
    tableLoading.value = false;
  })
}


// 处理表格变化（如分页、排序等）
function handleTableChange(pageNum, pageSize) {
  formState.value.pageNum = pageNum
  formState.value.pageSize = pageSize
  pagination.value.pageSize = pageSize
  pagination.value.current = pageNum
  handleFinish();
}



function handleFinishFailed() {

}


function setStatus(item) {
  changeStatusApi(item).then(res => {
    message.success(res.msg)
  })
}

function edit(item) {
  title.value = "编辑用户"
  editData.value = item
  open.value = true
}

function addUser() {
  title.value = "新增用户"
  editData.value = {}
  open.value = true
}

function del(item) {
  delUserApi(item).then(res => {
    message.success(res.msg)
    handleFinish();
  })
}


const resetForm = () => {
  formState.value = {
    userName: "",
    phonenumber: "",
    picker: [],
    pageNum: 1,
    pageSize: pagination.value.pageSize
  };
  handleFinish()
}
const close = () => {
  open.value = false
  title.value = ""
  editData.value = {}
  handleFinish()
}

const showTotal = (total, range) => {
  return `总共${total}条`;
};
</script>

<template>
  <div>
    <a-form
      layout="inline"
      :model="formState"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
      style="margin-top: 10px"
    >
      <a-form-item>
        <a-input
          v-model:value="formState.userName"
          placeholder="姓名"
        ></a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="formState.phonenumber"
          placeholder="手机号码"
        ></a-input>
      </a-form-item>
      <a-form-item>
        <a-range-picker
          v-model:value="formState.picker"
          :placeholder="['创建开始', '创建结束']"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">查询</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
    <a-card style="margin-top: 10px; padding: 0">
      <div
        class="table-container"
        ref="tableContainer"
        style="text-align: left"
      >
        <a-button
          type="primary"
          style="margin-bottom: 10px"
          @click="addUser"
          v-has-permi="['system:user:add']"
          >新增</a-button
        >
        <a-table
          bordered
          :dataSource="tableData"
          :columns="columns"
          :pagination="false"
          :scroll="{ y: tableHeight, x: '100%', virtual: true }"
          :loading="tableLoading"
        >
          <template #bodyCell="{ column, record }">
            <div v-if="column.dataIndex === 'avatar'">
              <a-avatar v-if="record.avatar" :src="record.avatar"></a-avatar>
              <a-image
              v-else
              size="small"
              :src="randomAvatar(record.sex)"
            ></a-image>
            </div>
            <div v-if="column.dataIndex === 'status'">
              <a-switch
                v-if="record.userName !== 'admin'"
                v-model:checked="record.status"
                checkedValue="0"
                unCheckedValue="1"
                @change="setStatus(record)"
                :disabled="!checkPermi(['system:user:edit'])"
              />
            </div>
            <div v-if="column.dataIndex === 'option'">
              <a-button
                @click="edit(record)"
                type="text"
                color="blue"
                v-if="
                  record.userName !== 'admin' &&
                  checkPermi(['system:user:edit'])
                "
                >编辑</a-button
              >
              <a-popconfirm
                title="确定删除吗？"
                ok-text="Yes"
                cancel-text="No"
                @confirm="del(record)"
                v-if="
                  record.userName !== 'admin' &&
                  checkPermi(['system:user:remove'])
                "
                ><a color="red">删除</a></a-popconfirm
              >
            </div>
          </template>
        </a-table>
        <a-pagination
          style="text-align: right; margin-top: 10px"
          :current="pagination.pageNum"
          :page-size="pagination.pageSize"
          :page-size-options="pagination.pageSizeOptions"
          :show-quick-jumper="true"
          :show-less-items="true"
          :show-title="true"
          :show-total="showTotal"
          :total="pagination.total"
          @change="handleTableChange"
        />
      </div>
    </a-card>
    <add-or-edit
      :title="title"
      :open="open"
      :data="editData"
      @close="close"
      :dept="dept"
    ></add-or-edit>
  </div>
</template>

<style scoped lang="less">
.table-container {
  padding: 0;
  background-color: #fff;
}

body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}
::v-deep(.ant-image .ant-image-img) {
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
}
</style>
