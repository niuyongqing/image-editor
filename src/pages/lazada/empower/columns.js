export const columns = [
  {
    title: "账号Code",
    dataIndex: "shortCode",
    key: "shortCode",
  },
  {
    title: "授权地区",
    dataIndex: "country",
    key: "country",
    slot: "country",
  },

  {
    title: "授权平台",
    dataIndex: "accountPlatform",
    key: "accountPlatform",
  },

  {
    title: "品类",
    dataIndex: "classify",
    key: "classify",
    slot: "classify",
  },
  {
    title: "禁售属性",
    dataIndex: "forbidSale",
    key: "forbidSale",
    slot: "forbidSale",
  },

  {
    title: "是否推送库存",
    dataIndex: "isPushStock",
    align: "center",
    key: "isPushStock",
    slot: "isPushStock",
  },
  {
    title: "库存推送比例",
    dataIndex: "stockPushRatio",
    align: "center",
    key: "stockPushRatio",
    slot: "stockPushRatio",
  },

  {
    title: "自动刊登",
    dataIndex: "autoPublish",
    key: "autoPublish",
    slot: "autoPublish",
    align: "center",
  },

  {
    title: "账号",
    dataIndex: "account",
    key: "account",
  },

  {
    title: "是否填充账号密码",
    dataIndex: "isFillPassword",
    key: "isFillPassword",
    slot: "isFillPassword",
  },
  {
    title: "仓库",
    dataIndex: "store",
    key: "store",
    slot: "store",
  },
  {
    title: "简称",
    dataIndex: "simpleName",
    key: "simpleName",
    slot: "simpleName",
  },

  {
    title: "别名",
    dataIndex: "alias",
    key: "alias",
    slot: "alias",
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
    slot: "remark",
  },

  {
    title: "最后同步时间",
    dataIndex: "updateTime",
    key: "updateTime",
  },
  {
    title: "首次同步时间",
    dataIndex: "createTime",
    key: "createTime",
  },
];
