<template>
  <div id="promotionCont">
    <AppTableForm
      v-model:formData="formState"
      reset-set-menu="promotion"
      @on-submit="getList"
    >
      <template #formItemRow>
        <a-form-item
          label="店铺账号"
          name="account"
        >
          <AppCardSelect
            v-model:account="formState.account"
            :options="shopAccount"
            :field-obj="{ label: 'simpleName', value: 'account' }"
          />
        </a-form-item>
        <a-form-item
          label="活动名称"
          name="title"
        >
          <a-input
            v-model:value="formState.title"
            placeholder="请输入活动名称"
            clearable
          ></a-input>
        </a-form-item>
      </template>
    </AppTableForm>

    <AppTableBox
      :loading="loading"
      :table-header="columns"
      :data-source="tableData"
      stripe
      row-key="waitId"
      :scroll="{ x: 'max-content' }"
      reset-set-menu="promotion"
    >
      <template #leftTool>
        <a-button
          type="primary"
          @click="syncOrder"
          :loading="syncLoading"
          v-has-permi="[`platform:ozon:activity:sync`]"
        >同步全部活动</a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'state'">
          <div>{{ statusObj[record.state] }}</div>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <div>
            <div><span>开始: </span>{{ record.dateStart }}</div>
            <div><span>结束：</span>{{ record.dateEnd }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'option'">
          <a-button
            v-if="record.state !== '2'"
            type="text"
            v-has-permi="[`platform:ozon:activity:list`]"
            @click="mActivity(record)"
          >管理活动</a-button>
          <a-button
            @click.stop="syncOne(record)"
            type="text"
            v-has-permi="[`platform:ozon:activity:sync:action:product`]"
            style="color: #67c23a; margin-left: 10px"
            v-if="record.state !== '2'"
          >同步</a-button>
        </template>
      </template>

      <template #pagination>
        <AppTablePagination
          v-model:current="paginations.pageNum"
          v-model:pageSize="paginations.pageSize"
          :total="paginations.total"
          @change="getList"
        />
      </template>
    </AppTableBox>
  </div>
</template>

<script setup name='promotion'>
  import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
  import { accountCache } from "../config/api/product";
  import tableHead from "../config/tabColumns/promotion"
  import { syncActivity, list, syncOneProduct } from "../config/api/promotion"
  import { message } from 'ant-design-vue';

  const formState = reactive({
    account: "",
    title: ""
  })
  const formRef = ref(null)
  const shopAccount = ref([])
  const tableData = ref([])
  const columns = tableHead
  const loading = ref(false)
  const syncLoading = ref(false)
  const showOpen = ref(false)
  const percentage = ref(0)
  const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
  })
  const statusObj = {
    0: "未开始",
    1: "进行中",
    2: "已结束",
  }

  // 获取店铺列表
  const getAccount = () => {
    accountCache().then((res) => {
      if (res.data) {
        shopAccount.value = res?.data ?? [];
        getList();
      }
    });
  }

  const mActivity = (row) => {
    window.open("activityList" + `?id=${row.id}&account=${row.sellerId}`, '_blank');
  }

  const syncOne = (row) => {
    syncOneProduct({
      account: row.sellerId,
      activityId: row.id,
    }).then((res) => {
      message.success("同步成功");
    });
  }

  const syncOrder = () => {
    syncLoading.value = true;
    showOpen.value = true
    let params = {
      startDate: formState.startDate,
      endDate: formState.endDate,
    };
    syncActivity(params)
      .then((res) => {

        message.success(res.msg)
      })
      .finally(() => {
        syncLoading.value = false;
      });
    message.success("数据开始同步请稍后查看！")
  }
  const getList = () => {
    loading.value = true;
    let params = {
      ...formState,
      pageNum: paginations.pageNum,
      pageSize: paginations.pageSize,
    }
    list(params).then((res) => {
      tableData.value = res?.rows || [];
      paginations.total = res?.total || 0;
    }).finally(() => {
      loading.value = false;
    });
  }
  onMounted(() => {
    getAccount()
  })
</script>
