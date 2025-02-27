export const columns = [
  {
    title: "优惠券名称",
    dataIndex: "name",
    key: "name",
    align: "center",
    width: 200,
  },

  {
    title: "活动时间（从领取开始计算）",
    dataIndex: "time",
    key: "time",
    slot: "time",
    align: "center",
    width: 500,
  },

  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    align: "center",
    slot: "status",
  },

  {
    title: "适用范围",
    dataIndex: "apply",
    key: "apply",
    slot: "apply",
    align: "center",
  },

  {
    title: "优惠券类型",
    dataIndex: "discountType",
    key: "discountType",
    align: "center",
    // slot: "special_price",
  },
  {
    title: "同步时间",
    dataIndex: "syncTime",
    key: "syncTime",
    slot: "syncTime",
    align: "center",
  },
];
