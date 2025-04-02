<template>
  <div id="exportModalCont">
    <a-modal :open="props.openExModal" title="导出订单" @cancel="handleCancel" :width="'30%'" :maskClosable="false" :keyboard="false">
      <a-form :model="formState" ref="formRef">
        <a-form-item label="订单状态：" v-if="props.isTimes">
          <selectComm :options="orderTypeList" :fieldObj="orderObj" @backSelectAll="orderSelectAll"
            @backSelectItem="orderSelectItem"></selectComm>
        </a-form-item>
        <a-form-item label="时间类型：" v-if="props.isTimes">
          <a-form-item-rest>
            <a-select v-model:value="formState.timeType" style="width: 120px;margin-right:20px"
              :options="timeOptions"></a-select>
          </a-form-item-rest>
          <a-form-item-rest>
            <a-range-picker v-model:value="formState.times" @change="onRangeChange" />
          </a-form-item-rest>
        </a-form-item>
        <!-- <a-form-item label="导出方式：">
          <a-radio-group v-model:value="formState.exportType" :options="exportOptions" />
        </a-form-item> -->
        <a-form-item label="导出格式：">
          <a-select v-model:value="formState.exportFileType" style="width: 120px">
            <a-select-option :value="0">.excel</a-select-option>
            <a-select-option :value="1">.csv</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button :loading="loading" @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup name='exportModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import { orderExport } from "../../config/api/order"
import download from "@/api/common/download";
import { message } from "ant-design-vue";
import dayjs from 'dayjs'

const props = defineProps({
  openExModal: Boolean,
  isTimes: Boolean,
  selectedRowKeys: Array,
  exportWay: Number,
  incomingForm: Object
});
// 使用defineEmits获取emit函数
const emit = defineEmits(["update:openExModal", "backRefresh"]);
const loading = ref(false);
const formRef = ref();
const formState = reactive({
  orderStatus: "",
  exportType: 1,
  timeType: "inProcessAt",
  times: [],
  sTime: "",
  endTime: "",
  exportFileType: 1
});
const orderObj = ref({
  fieldKey: "status",
  fieldLabel: "name",
});
const orderTypeList = ref([
  {
    name: "待打包",
    status: "awaiting_packaging",
  },
  {
    name: "已取消",
    status: "cancelled",
  },
  {
    name: "配送中",
    status: "delivering",
  },
  {
    name: "即将送达",
    status: "last-mile",
  },
  {
    name: "已送达",
    status: "delivered",
  },
  {
    name: "待配送",
    status: "awaiting_deliver",
  },
  {
    name: "卖家已发货",
    status: "sent_by_seller",
  }
]);
const timeOptions = ref([
  {
    label: "下单时间",
    value: "inProcessAt"
  },
  {
    label: "付款时间",
    value: "paymentDate"
  },
  {
    label: "发货时间",
    value: "deliveryDateBegin"
  }
])
const exportOptions = ref([
  {
    label: "按包裹导出（每个包裹导出一行）",
    value: 1,
  },
  {
    label: "按订单导出（每个订单导出一行）",
    value: 2,
  },
  {
    label: "按产品导出（每个产品导出一行）",
    value: 3,
  },
]);

// 订单全选和单选
const orderSelectAll = () => {
  formState.orderStatus = "";
};
const orderSelectItem = (val) => {
  formState.orderStatus = val;
};
// 时间切换
const onRangeChange = (value, dateString) => {
  formState.sTime = dateString[0];
  formState.endTime = dateString[1];
};

const handleOk = () => {
  const { exportWay, incomingForm: { account }, selectedRowKeys } = props;
  const { orderStatus, timeType, sTime, endTime, exportFileType } = formState;
  // 定义不同 exportWay 对应的验证规则和错误信息
  const validationRules = {
    1: {
      condition: () => !sTime && !endTime,
      errorMessage: "请先选择时间！"
    },
    2: {
      condition: () => selectedRowKeys.length === 0,
      errorMessage: "请勾选数据！"
    }
  };

  // 根据 exportWay 进行验证
  const validationResult = validationRules[exportWay];
  if (validationResult && validationResult.condition()) {
    message.error(validationResult.errorMessage);
    return;
  }

  loading.value = true
  let params = {
    type: exportWay,
    account,
    orderStatus, //后续知道状态后补充
    orderIds: exportWay == 2 ? selectedRowKeys.map(item => item) : [],
    timeField: exportWay == 1 ? timeType : "",
    startDate: exportWay == 1 ? dayjs(sTime).startOf('day').format('YYYY-MM-DD HH:mm:ss') : "",
    endDate: exportWay == 1 ? dayjs(endTime).endOf('day').format('YYYY-MM-DD HH:mm:ss') : "",
    // exportType,
    exportFileType
  }
  console.log('params', params);

  orderExport(params).then(res => {
    download.name(res.msg);
  }).finally(() => {
    loading.value = false
    formRef.value.resetFields();
    clearForm();
    emit("update:openExModal", false);
    emit("backRefresh")
  })
}
const clearForm = () => {
  formState.orderStatus = "";
  formState.exportType = 1
  formState.timeType = "inProcessAt"
  formState.times = []
  formState.sTime = ""
  formState.endTime = ""
  formState.exportFileType = 1
}
const handleCancel = () => {
  emit("update:openExModal", false);
  formRef.value.resetFields();
  clearForm();
}
</script>
<style lang="less" scoped></style>