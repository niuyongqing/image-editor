<template>
  <div id="exportModalCont">
    <a-modal :open="props.openExModal" title="导出订单" @ok="handleOk" @cancel="handleCancel" :width="'40%'"
      :maskClosable="false" :keyboard="false">
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
    </a-modal>
  </div>
</template>

<script setup name='exportModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
// import { orderExport } from "../../js/api/order"
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
const formRef = ref();
const formState = reactive({
  orderStatus: "",
  exportType: 1,
  timeType: "orderDate",
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
    name: "未付款",
    status: 1,
  },
  {
    name: "风控中",
    status: 2,
  },
  {
    name: "待审核",
    status: 3,
  },
  {
    name: "待处理",
    status: 4,
  },
  {
    name: "待打单（有货）",
    status: 5,
  },
  {
    name: "待打单（缺货）",
    status: 6,
  },
  {
    name: "待打单（异常）",
    status: 7,
  },
  {
    name: "已发货",
    status: 8,
  },
  {
    name: "已退款",
    status: 9,
  },
  {
    name: "已忽略",
    status: 10,
  },
]);
const timeOptions = ref([
  {
    label: "下单时间",
    value: "orderDate"
  },
  {
    label: "付款时间",
    value: "orderPostedDate"
  },
  {
    label: "发货时间",
    value: "3"
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
  console.log("1");
};
const orderSelectItem = (val) => {
  console.log("2", val);
  //   formState.shopId = account;
};
// 时间切换
const onRangeChange = (value, dateString) => {
  formState.sTime = dateString[0];
  formState.endTime = dateString[1];
};

const handleOk = () => {
  console.log('props', props);
  console.log('formState', formState);
  const { exportWay, incomingForm: { account }, selectedRowKeys } = props;
  const { orderStatus, timeType, sTime, endTime, exportFileType } = formState;
  if(!sTime && !endTime) {
    message.error("请先选择时间！")
    return
  }
  let params = {
    type: exportWay,
    account,
    orderStatus: "当type等于时需要使用,订单状态", //后续知道状态后补充
    // orderIds: exportWay == 2 ? selectedRowKeys : [],
    timeField: exportWay == 1 ? timeType : "",
    startDate:  dayjs(sTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate:  dayjs(endTime).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    // exportType,
    exportFileType
  }
  console.log('params', params);

  orderExport(params).then(res => {
    download.name(res.msg);
  }).finally(() => {
    formRef.value.resetFields();
    emit("update:openExModal", false);
    emit("backRefresh")
  })
}
const handleCancel = () => {
  emit("update:openExModal", false);
  formRef.value.resetFields();
}
</script>
<style lang="less" scoped></style>