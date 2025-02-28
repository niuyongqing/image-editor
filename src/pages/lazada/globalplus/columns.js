export const columns = [
  {
    title: "店铺",
    dataIndex: "simpleName",
    key: "simpleName",
    sorter: true,
    sortField: "simple_name",
    align: "center",
  },
  {
    title: "SKU信息",
    dataIndex: "skus",
    key: "skus",
    slot: "skus",
    width: 1000,
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    sorter: true,
    sortField: "type",
    align: "center",
  },

  {
    title: "同步时间",
    dataIndex: "createTime",
    sorter: true,
    slot: "createTime",
    sortField: "create_time",
    key: "createTime",
    align: "center",
    width: 400,
  },
];

export const skuColumns = [
  {
    title: "SKU",
    dataIndex: "sellerSku",
    key: "sellerSku",
    align: "center",
  },
  {
    title: "长",
    dataIndex: "packageLength",
    key: "packageLength",
    align: "center",
  },
  {
    title: "宽",
    dataIndex: "packageWidth",
    key: "packageWidth",
    align: "center",
  },
  {
    title: "高",
    dataIndex: "packageHeight",
    key: "packageHeight",
    align: "center",
  },
  {
    title: "重量",
    dataIndex: "packageWeight",
    key: "packageWeight",
    align: "center",
  },
];
export const innerColumns = [
  {
    title: "国家",
    dataIndex: "currency",
    key: "currency",
    align: "center",
  },
  {
    title: "原价",
    dataIndex: "price",
    key: "price",
    align: "center",
  },
  {
    title: "促销价",
    dataIndex: "specialPrice",
    key: "specialPrice",
    align: "center",
  },
];
