const publishHead = [
    {
        dataIndex: 'sellerSKU',
        title: 'SKU',
        show: true,
        align: 'center',
        width: 180
    },
    {
        dataIndex: 'price',
        title: '售价',
        show: true,
        align: 'center',
        width: 180
    },
    {
        dataIndex: 'oldPrice',
        title: '原价',
        show: true,
        align: 'center',
        width: 180
    },
    {
        dataIndex: 'quantity',
        title: '库存',
        show: true,
        align: 'center',
        width: 120
    },
    {
        dataIndex: 'packageLength',
        title: '尺寸',
        show: true,
        align: 'center',
        width: 600
    },
    {
        dataIndex: 'options',
        title: '操作',
        show: true,
        align: 'center',
        width: 100
    }
]

const editHead = [
    {
        dataIndex: 'sellerSKU',
        title: 'SKU',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'price',
        title: '售价',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'oldPrice',
        title: '原价',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'minPrice',
        title: '最低价',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'quantity',
        title: '库存',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'packageLength',
        title: '尺寸',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'options',
        title: '操作',
        show: true,
        align: 'center'
    }
]

const otherList = [
    'colorImg',
    'skuTitle',
    'secondName',
    'sellerSKU',
    'price',
    'oldPrice',
    'quantity',
    'packageLength',
    'options',
]

export { publishHead, editHead, otherList }