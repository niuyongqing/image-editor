<template>
  <div>
    <div flex gap-10px>
      <SideBar v-model:activeId="activeId" @search="getList" />
      <div style="width: calc(100% - 250px)">
        <appTableForm
          ref="formRef"
          @onSubmit="onSubmit()"
          resetSetMenu="userTemplate"
          v-model:formData="formData"
        >
          <template #formItemRow>
            <a-form-item label="店铺账号" name="account" v-if="activeId !== 4">
                 <appCardSelect
            :multiple="false"
            :options="shopAccount"
            :fieldObj="shopObj"
            @selectItem="onSubmit()"
            v-model:account="formData.account"
          ></appCardSelect>
              <!-- <selectComm
                :options="shopAccount"
                :fieldObj="shopObj"
                @backSelectAll="selectAll"
                @backSelectItem="selectItem"
              ></selectComm> -->
            </a-form-item>

            <!-- <a-form-item label="搜索类型:" name="search_type">
              <div class="fBox flex align-start gap-10px">
                <a-button type="primary"> 模板名称 </a-button>
              </div>
            </a-form-item> -->
            <a-form-item label="模板名称：" name="search_content">
              <div class="flex">
                <div class="flex align-start">
                  <a-input
                    style="width: 400px"
                    v-model:value="formData.name"
                    allowClear
                    placeholder="请输入模板名称"
                  ></a-input>
                </div>
              </div>
            </a-form-item>
          </template>
        </appTableForm>     
          <app-table-box
            v-model:filter-columns="columns"
            :data-source="tableData"
            :table-header="columns"
            reset-set-menu="userTemplate"
            rowKey="id"
            :row-selection="rowSelection"
            :loading="loading"
            :scroll="{ y: 980 }"
          >
          <template #otherCount>
             <div flex justify-between items-center>
            <div flex text-left p-10px>
              <div><a-tag color="success"> 说明! </a-tag></div>
              <div >
                <span class="text-#999">
                  1、修改/删除模板不会对现有产品产生影响 </span
                ><br />
                <span class="text-#999"> 2、只能引用已开启状态的模板 </span>
              </div>
            </div>
            <a-pagination
              style="margin-right: 10px;"
              size="small"
              v-model:current="paginations.pageNum"
              v-model:pageSize="paginations.pageSize"
              :total="paginations.total"
              show-size-changer
              show-quick-jumper
              :show-total="(total) => `共${total}条`"
              @change="handleChangePagination"
            />
          </div>
          </template>
          
            <template #leftTool>
              <a-button
                type="primary"
                @click="handleDelete"
                :disabled="selectedRowList.length === 0"
                >批量删除</a-button
              >
              <a-button type="primary" @click="navToCreateTemplate"
                >创建模板</a-button
              >
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'account'">
                {{ getAccountDisplayName(record.account) }}
              </template>
              <template v-if="column.dataIndex === 'state'">
                <a-switch :checked="record.state === 1" disabled></a-switch>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <a-button type="link" @click="handleEdit(record)"
                  >编辑</a-button
                >
                <a-button type="link" @click="handleCopy(record)"
                  >复制</a-button
                >
                <a-button type="link" @click="handleDelete(record)"
                  >删除</a-button
                >
              </template>
            </template>
            <template #pagination>
              <appTablePagination
                @pageNumChange="handlePageChange"
                @pageSizeChange="handlePageSizeChange"
                v-model:current="paginations.pageNum"
                v-model:pageSize="paginations.pageSize"
                :total="paginations.total"
              />
            </template>
          </app-table-box>
        <!-- </div> -->
      </div>
      <jsonTemplate
        :showTemp="showTemp"
        :jsonName="jsonName"
        :jsonContent="jsonContent"
        @backResult="backResult"
        @closeTempModal="closeTempModal"
      >
      </jsonTemplate>
    </div>
  </div>
</template>

<script setup>
import SideBar from "./components/sideBar.vue";
import { accountCache } from "../config/api/product";
import { templateList, templateDelete } from "../config/api/userTemplate";
import { Modal, message } from "ant-design-vue";
import jsonTemplate from "./components/jsonTemplate.vue";
import { templateSaveOrUpdate } from "~/pages/ozon/config/api/userTemplate";
import appTableForm from "@/components/common/appTableForm.vue";
import AppTableBox from "@/components/common/appTableBox.vue";
import appTablePagination from "@/components/common/appTablePagination.vue";

const shopObj = {
  value: "account",
  label: "simpleName",
};
const selectedRowKeys = ref([]);
const selectedRowList = ref([]);
const showTemp = ref(false);
const jsonContent = ref("");
const jsonName = ref("");
const rowId = ref("");
const isCopy = ref(false);
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (rowKeys, rows) => {
      selectedRowKeys.value = rowKeys; //只接收ID
      selectedRowList.value = rows; //接收每一行
    },
  };
});
const tableHead = ref([
  {
    title: "模板名称",
    dataIndex: "name",
    key: "name",
    active: 0,
    width: 300,
    show: [1, 3, 4],
  },
  {
    title: "归属店铺",
    dataIndex: "account",
    key: "account",
    align: "left",
    active: 0,
    width: 300,
    show: [1, 3],
  },
  {
    title: "引用模块",
    dataIndex: "fieldValue",
    key: "fieldValue",
    active: 1,
    align: "center",
    width: 300,
    show: [1, 3],
  },
  {
    title: "时间",
    dataIndex: "gmtCreate",
    key: "gmtCreate",
    active: 0,
    align: "center",
    width: 300,
    show: [1, 3, 4],
  },
  {
    title: "开启和关闭",
    dataIndex: "state",
    align: "center",
    key: "state",
    active: 0,
    width: 100,
    show: [1, 3, 4],
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 200,
    active: 0,
    show: [1, 3, 4],
  },
]);
const columns = computed(() => {
  return tableHead.value.filter((item) => item.show.includes(activeId.value));
});

const shopAccount = ref([]);
const formData = reactive({
  account: "",
  name: "",
});
const tableData = ref([]);
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const loading = ref(false);
const activeId = ref(1);

const selectItem = (e) => {
  formData.account = e;
  getList();
};

// 处理页码和条数变化
const handlePageChange = (page) => {
  paginations.pageNum = page;
  getList();
};

/**
 * 处理每页条数变化
 */
const handlePageSizeChange = (val) => {
  // 确保pageSize是数字类型
  paginations.pageSize = Number(val);
  getList();
};

const getList = () => {
  selectedRowKeys.value = [];
  loading.value = true;
  templateList({
    ...formData,
    type: activeId.value,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
  })
    .then((res) => {
      tableData.value =
        res?.rows.map((item) => {
          item.show = false;
          return item;
        }) || [];
      paginations.total = res?.total || 0;
    })
    .finally(() => {
      loading.value = false;
    });
};

const selectAll = () => {
  formData.account = "";
  getList();
};

const handleChange = (pagination) => {
  loading.value = true;
  paginations.pageNum = pagination.current;
  paginations.pageSize = pagination.pageSize;
  getList();
};

const handleChangePagination = (page, pageSize) => {
  paginations.pageNum = page;
  paginations.pageSize = pageSize;
  getList();
};

const handleEdit = (record) => {
  if (activeId.value === 4) {
    showTemp.value = true;
    jsonContent.value = record.content.jsonRich;
    jsonName.value = record.name;
    rowId.value = record.id;
    return;
  }
  window.open(
    `/platform/ozon/editTemplate?type=${activeId.value}&id=${record.id}`,
    "_blank"
  );
  console.log(record);
};

const handleCopy = (record) => {
  if (activeId.value === 4) {
    showTemp.value = true;
    jsonContent.value = record.content.jsonRich;
    jsonName.value = record.name;
    rowId.value = record.id;
    isCopy.value = true;
    return;
  }
  window.open(
    `/platform/ozon/editTemplate?type=${activeId.value}&id=${
      record.id
    }&copy=${true}`,
    "_blank"
  );
  console.log(record);
};

const handleDelete = (record) => {
  Modal.confirm({
    title: "提示",
    content: "确定要删除吗？",
    onOk: () => {
      const params = record.id ? [record.id] : selectedRowKeys.value;
      templateDelete(params).then(() => {
        message.success("删除成功");
        selectedRowKeys.value = [];
        selectedRowList.value = [];
        getList();
      });
    },
    onCancel: () => {
      console.log("cancel");
    },
  });
};

const navToCreateTemplate = () => {
  if (activeId.value === 4) {
    // 富文本模板创建
    showTemp.value = true;
    jsonContent.value = "";
    jsonName.value = "";
    rowId.value = "";
    return;
  }
  window.open(`/platform/ozon/addTemplate?type=${activeId.value}`, "_blank");
};

const closeTempModal = () => {
  showTemp.value = false;
  activeId.value = 4;
};

const backResult = (res, name) => {
  let params = {
    id: isCopy.value ? null : rowId.value,
    type: 4, //模板类型 1-产品模板  2-尺码模板 3-变种模板 4-富内容模板
    name, // 模板名称
    state: 1, // 状态是否生效  0-不生效 1-生效
    account: "",
    content: {
      jsonRich: JSON.stringify(res),
    },
  };
  templateSaveOrUpdate(params)
    .then((res) => {
      message.success(res.msg);
    })
    .finally(() => {
      activeId.value = 4;
      showTemp.value = false;
      getList();
    });
};

// 表单搜索
const onSubmit = () => {
  getList();
};

// 店铺数据
const getAccount = () => {
  accountCache().then((res) => {
    if (res.data) {
      shopAccount.value = res?.data ?? [];
      getList();
    }
  });
};

const getAccountDisplayName = (account) => {
  const shop = shopAccount.value.find((item) => item.account === account);
  return shop?.simpleName;
};

watch(
  () => activeId.value,
  (val) => {
    if (val) {
      paginations.pageNum = 1;
      paginations.pageSize = 50;
      getList();
    }
  }
);

onMounted(() => {
  getAccount();
  window.addEventListener("message", (event) => {
    if (event.data === "pageClosed") {
      getList();
    }
  });
});
</script>
<style lang="less" scoped></style>
