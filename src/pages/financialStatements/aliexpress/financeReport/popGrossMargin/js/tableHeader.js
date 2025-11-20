// tableHeader.js
export default  [
    // 利润分组
    {
        title: '净毛利',
        key: 'netProfit',
        dataIndex: 'netProfit',
        width: 300,
        group: '利润', // 添加分组标识
        sorter: true,
        groupShow: true,
    },
    {
        title: '普源利润',
        key: 'sourceProfit',
        dataIndex: 'sourceProfit',
        width: 100,
        group: '利润', // 添加分组标识
    },
    {
        title: '店铺利润率',
        key: 'shopProfitRate',
        dataIndex: 'shopProfitRate',
        width: 100,
        group: '利润', // 添加分组标识
    },
    {
        title: '实际利润',
        key: 'actualProfit',
        dataIndex: 'actualProfit',
        width: 100,
        group: '利润', // 添加分组标识
    },

    // 收入分组
    {
        title: '订单金额',
        key: 'orderAmount',
        dataIndex: 'orderAmount',
        width: 300,
        group: '收入', // 添加分组标识
        groupShow: true,
    },
    {
        title: '退款金额',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '收入', // 添加分组标识
    },

    // 成本分组
    {
        title: '商品成本',
        key: 'orderAmount',
        dataIndex: 'orderAmount',
        width: 300,
        group: '成本', // 添加分组标识
        groupShow: true,
    },
    {
        title: '包装成本',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '成本', // 添加分组标识
    },
    {
        title: 'ERP包装成本',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 150,
        group: '成本', // 添加分组标识
    },

    // 支出分组
    {
        title: '快递费',
        key: 'orderAmount',
        dataIndex: 'orderAmount',
        width: 300,
        group: '支出', // 添加分组标识
        groupShow: true,
    },
    {
        title: '运费',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '揽收运费',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '平台运费',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '联盟佣金',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '直通车',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '平台手续费',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '退货服务费',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: 'JIT退包扣款',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '退包运费',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '退包扣款',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '侵权罚款',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '罚款',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '墨西哥普源漏算金额',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 180,
        group: '支出', // 添加分组标识
    },
    {
        title: '税费',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '其他税费',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '其他赔偿',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },
    {
        title: '其他费用',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '支出', // 添加分组标识
    },

    // 其他分组
    {
        title: '外包装成本为0订单数',
        key: 'orderAmount',
        dataIndex: 'orderAmount',
        width: 400,
        group: '其他', // 添加分组标识
        groupShow: true,
    },
    {
        title: '库存盘亏',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '其他', // 添加分组标识
    },
    {
        title: '退款率',
        key: 'refundAmount',
        dataIndex: 'refundAmount',
        width: 100,
        group: '其他', // 添加分组标识
    },
];