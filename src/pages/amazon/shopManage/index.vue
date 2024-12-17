<template>
  <div id="shopManageCont">
    <a-card class="cards">
      <a-form :model="formState" layout="inline" ref="formRef">
        <a-form-item label="店铺名称：" name="shopName">
          <a-input
            v-model:value="formState.shopName"
            placeholder="请输入店铺名称"
          />
        </a-form-item>
        <a-form-item label="简称：" name="simpleName">
          <a-input
            v-model:value="formState.simpleName"
            placeholder="请输入简称"
          />
        </a-form-item>
        <a-form-item style="display: flex">
          <a-button type="primary" @click="onSubmit">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px;height:100vh">
      <a-row style="margin-bottom: 10px">
        <a-col :span="1.5" style="padding: 0 10px">
          <a-button
            type="primary"
            @click="showAddModal = true"
            v-has-permi="['system:platform:amazon:account:add']"
          >
            新增
          </a-button>
        </a-col>
        <a-col :span="1.5" style="padding: 0 10px">
          <a-button
            @click="showEditModal = true"
            v-has-permi="['system:platform:amazon:account:edit']"
            :disabled="selectedRowKeys.length != 1"
            >修改
          </a-button>
        </a-col>
        <a-col :span="1.5" style="padding: 0 10px">
          <a-popconfirm
            class="popconfirm-del"
            ok-text="是"
            cancel-text="否"
            title="确定删除选中账号吗？"
            @confirm="del"
            :disabled="selectedRowKeys.length != 1"
          >
            <!-- v-has-permi="['system:platform:amazon:account:del']" -->
            <a-button
              type="primary"
              danger
              :disabled="selectedRowKeys.length != 1"
              >删除</a-button
            >
            <!-- style="background-color: red; color: #fff" -->
          </a-popconfirm>
        </a-col>
      </a-row>
      <a-table
        bordered
        :rowKey="(record) => record"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        :default-expand-all-rows="true"
        :row-selection="{
          selectedRowKeys,
          onChange,
        }"
      >
      <template #bodyCell="{ column, text, record }">
          <div v-if="column.key == 'classify'">
            <a-select
              v-model:value="record.classify"
              style="width: 100%"
              :options="classifyList"
              @change="editSimpleName(record)"
            ></a-select>
          </div>
          <div v-if="column.key == 'forbidSale'">
            <a-select
              mode="multiple"
              show-search
              style="width: 100%"
              :max-tag-count="2"
              v-model:value="record.forbidSale"
              :options="forbidSaleList"
              :filter-option="filterOption"
              @change="editSimpleName(record)"
            ></a-select>
          </div>
          <div v-if="column.key == 'autoPublish'">
            <a-switch
              v-model:checked="record.autoPublish"
              checked-children="开"
              un-checked-children="关"
              :checkedValue="1"
              :unCheckedValue="0"
              @change="editSimpleName(record)"
            />
          </div>
        </template>
      </a-table>
      <a-pagination
        style="margin-top: 20px;text-align: right"
        :show-total="total => `共 ${total} 条`"
        v-model:current="paginations.pageNum"
        v-model:pageSize="paginations.pageSize"
        :total="paginations.total"
        class="pages"
        :show-quick-jumper="true"
        :showSizeChanger="true"
        :pageSizeOptions="[50,100,200]"
        @change="getList"
      />
    </a-card>
    <shopManageAdd
      v-model:showAddModal="showAddModal"
      :getList="getList"
    ></shopManageAdd>
    <shopManageEdit
      v-model:showEditModal="showEditModal"
      :getList="getList"
      :selectedRowKeys="selectedRowKeys"
    ></shopManageEdit>
  </div>
</template>

<script setup name="shopManage">
import { ref, reactive, onMounted, onUnmounted, watchPostEffect } from "vue";
import { shopList, delShop,meansAttribute,editShop } from "@/pages/amazon/js/api/shopManage.js";
import tableHead from "@/pages/amazon/js/tableHead/shopManage";
import shopManageAdd from "@/pages/amazon/shopManage/common/shopManageAdd.vue";
import shopManageEdit from "@/pages/amazon/shopManage/common/shopManageEdit.vue";
import commodityType from "~/pages/amazon/config/commodityType.js";
import { message } from "ant-design-vue";
const formRef = ref();
const formState = reactive({
  shopName: "",
  simpleName: "",
});
const classifyList = commodityType;
const forbidSaleList = ref([]);
const columns = tableHead;
const loading = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total:0
});
const selectedRowKeys = ref([]);
const tableData = ref([]);
const onChange = (selecteds) => {
  console.log("selectedRows: ", selecteds);
  selectedRowKeys.value = selecteds;
};

const onSubmit = () => {
  getList();
};
// 获取列表
const getList = () => {
  let params = {
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
    shopName: formState.shopName,
    simpleName: formState.simpleName,
  };
  loading.value = true;
  shopList(params)
    .then((res) => {
      tableData.value = res?.data?.rows.map(item =>{
            item.forbidSale = item.forbidSale ? item.forbidSale.split(',').map((value) => { return Number(value) }) : []
            return item
          }) || [];
      paginations.total = res?.data?.total ? res.data.total : 0;
    })
    .finally(() => {
      loading.value = false;
      selectedRowKeys.value = [];
    });
};
// 删除
const del = () => {
  let id = selectedRowKeys.value[0].id;
  delShop(id)
    .then((res) => {
      if (res.code == 200) {
        message.success(res.msg);
        selectedRowKeys.value = [];
      }
    })
    .finally(() => {
      getList();
    });
};
const resetForm = () => {
  formRef.value.resetFields();
  onSubmit();
};
// 获取品类
const getMeansAttribute = () => {
  meansAttribute().then((res) => {
    forbidSaleList.value =
      res?.data.map((item) => {
        return {
          label: item.attributes,
          value: item.id,
        };
      }) || [];
  });
};
// 修改简称、别名、备注
const editSimpleName = (row) => {
  console.log("row", row);

  if (row.classify || row.forbidSale || row.autoPublish) {
    const { id, classify, forbidSale, autoPublish,shopName,areaEnName,marketplaces,simpleName} = row;
    const params = {
      id,
      classify,
      forbidSale: forbidSale ? forbidSale.join(",") : "",
      autoPublish,
      shopName,
      areaEnName,
      marketplaces,
      simpleName
    };
    editShop(params).then((res) => {
      message.success(res.msg);
    }).finally(() => {
      getList();
    });
  }
};

const filterOption = (input, option) => {
  return option.label.indexOf(input) >= 0;
};
onMounted(() => {
  getList();
  getMeansAttribute();
});
</script>
<style lang="less" scoped>
:deep(.pages) {
  .ant-pagination-options .ant-select {
    width: 100px;
  }
}
</style>