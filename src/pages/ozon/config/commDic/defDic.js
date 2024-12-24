// 订单-状态
const orderStatus = [
    {
        label: "等待注册",
        value: "awaiting_registration",
    },
    {
        label: "正在验收",
        value: "acceptance_in_progress",
    },
    {
        label: "等待确认",
        value: "awaiting_approve",
    },
    {
        label: "等待包装",
        value: "awaiting_packaging",
    },
    {
        label: "等待装运",
        value: "awaiting_deliver",
    },
    {
        label: "仲裁",
        value: "arbitration",
    },
    {
        label: "快递客户仲裁",
        value: "client_arbitration",
    },
    {
        label: "运输中",
        value: "delivering",
    },
    {
        label: "司机处",
        value: "driver_pickup",
    },
    {
        label: "已送达",
        value: "delivered",
    },
    {
        label: "已取消",
        value: "cancelled",
    },
    {
        label: "分拣中心未接受",
        value: "not_accepted",
    },
    {
        label: "由卖家发送",
        value: "sent_by_seller",
    },
]

// 仓库-状态
const storeStatus = [
    {
        value: 'new',
        label: '正在激活'
    },
    {
        value: 'created',
        label: '已激活'
    },
    {
        value: 'disabled',
        label: '存档'
    },
    {
        value: 'blocked',
        label: '已封禁'
    },
    {
        value: 'disabled_due_to_limit',
        label: '暂停中'
    },
    {
        value: 'error',
        label: '错误'
    }

]

// 交易清单-状态
const tradStatus = [
    {
        value: "",
        label: "所有",
    },
    {
        value: "orders",
        label: "订单",
    },
    {
        value: "returns",
        label: "退货和取消订单",
    },
    {
        value: "services",
        label: "服务费",
    },
    {
        value: "compensation",
        label: "补贴",
    },
    {
        value: "transferDelivery",
        label: "快递价格",
    },
    {
        value: "other",
        label: "其他",
    },
]
export { orderStatus, storeStatus, tradStatus }