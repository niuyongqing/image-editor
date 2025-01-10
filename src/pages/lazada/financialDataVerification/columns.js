export const columns = [
  {
    title: "结算账单金额与订单金额核算表 ",
    align: "center",
    children: [
      {
        title: "普源数据 (导入)",
        align: "center",
        children: [
          {
            title: "店铺名称",
            dataIndex: "accountName",
            key: "accountName",
            align: "center",
          },
          {
            title: "店铺单号",
            dataIndex: "puyuanOrderNo",
            key: "puyuanOrderNo",
            align: "center",
          },
          {
            title: "交易时间",
            dataIndex: "puyuanTransactionDateCn",
            key: "puyuanTransactionDateCn",
            align: "center",
          },
          {
            title: "币种",
            dataIndex: "puyuanCurrency",
            key: "puyuanCurrency",
            align: "center",
          },
          {
            title: "订单金额",
            dataIndex: "puyuanOrderAmount",
            key: "puyuanOrderAmount",
            align: "center",
          },
          {
            title: "快递费",
            dataIndex: "puyuanExpressFeeRmb",
            key: "puyuanExpressFeeRmb",
            align: "center",
          },
          {
            title: "汇率",
            dataIndex: "puyuanExchangeRate",
            key: "puyuanExchangeRate",
            align: "center",
          },
          {
            title: "佣金",
            dataIndex: "puyuanCommission",
            key: "puyuanCommission",
            align: "center",
          },
          {
            title: "手续费",
            dataIndex: "puyuanServiceFee",
            key: "puyuanServiceFee",
            align: "center",
          },
          {
            title: "订单状态",
            dataIndex: "puyuanShopStatus",
            key: "puyuanShopStatus",
            align: "center",
          },
        ],
      },
      {
        title: "店铺后台金额数据",
        align: "center",
        children: [
          {
            title: "实际打款金额(原币种)",
            dataIndex: "orderAmount",
            key: "orderAmount",
            align: "center",
          },
          {
            title: "币种",
            dataIndex: "currency",
            key: "currency",
            align: "center",
          },
          {
            title: "订单商品金额",
            dataIndex: "orderItemAmount",
            key: "orderItemAmount",
            align: "center",
          },
          {
            title: "佣金 + 手续费",
            dataIndex: "orderCommissionServiceFee",
            key: "orderCommissionServiceFee",
            align: "center",
          },
          {
            title: "快递费",
            dataIndex: "expressFee",
            key: "expressFee",
            align: "center",
          },
          {
            title: "退款金额",
            dataIndex: "refundFee",
            key: "refundFee",
            align: "center",
          },
          {
            title: "其他费用",
            dataIndex: "otherFee",
            key: "otherFee",
            align: "center",
          },
          {
            title: "理论打款金额(原币种)",
            dataIndex: "puyuanShouldOrderAmount",
            key: "puyuanShouldOrderAmount",
            align: "center",
          },
          {
            title: "打款差额",
            dataIndex: "resultOrderAmount",
            key: "resultOrderAmount",
            align: "center",
          },
          {
            title: "结算状态",
            dataIndex: "settleOrNot",
            key: "settleOrNot",
            align: "center",
          },
        ],
      },
    ],
  },
];
