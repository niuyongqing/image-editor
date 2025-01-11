export const columns = [
  {
    title: "优惠券名称",
    dataIndex: "voucherName",
    key: "voucherName",
    align: "center",
  },
  {
    title: "活动时间（从领取开始计算）",
    dataIndex: "periodStartTime",
    key: "periodStartTime",
    slot: "periodStartTime",
    align: "center",
  },

  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    slot: "status",
    align: "center",
  },

  {
    title: "优惠券类型",
    dataIndex: "voucherType",
    key: "voucherType",
    align: "center",
  },

  {
    title: "同步时间",
    dataIndex: "syncTime",
    key: "syncTime",
    slot: "syncTime",
    align: "center",
  },
];
