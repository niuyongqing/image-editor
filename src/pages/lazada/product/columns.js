export const columns = [
  {
    title: "图片",
    dataIndex: "Images",
    key: "Images",
    slot: "Images",
    width: 90,
  },

  {
    title: "标题/产品ID",
    dataIndex: "attrs",
    key: "attrs",
    slot: "attrs",
    width: 500,
  },

  {
    title: "SKU",
    dataIndex: "skus",
    key: "skus",
    slot: "skus",
  },

  {
    title: "价格",
    dataIndex: "price",
    key: "price",
    slot: "price",
    width: 200,
  },

  {
    title: "促销价",
    dataIndex: "special_price",
    key: "special_price",
    slot: "special_price",
    width: 200,
  },
  // {
  //   title: "不含邮价格",
  //   dataIndex: "shortCode",
  //   key: "shortCode",
  // },
  {
    title: "库存",
    dataIndex: "quantity",
    key: "quantity",
    slot: "quantity",
    width: 200,
  },
  {
    title: "时间",
    dataIndex: "date",
    key: "date",
    slot: "date",
    width: 300,
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    slot: "action",
    width: 120,
  },
];
