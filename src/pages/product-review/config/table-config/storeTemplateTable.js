// 初始选品审核发布列表
export default [
{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 80,
    fixed: 'left',
    resizable: true,
  },
  {
    title: '模板名称',
    dataIndex: 'shopTemplateName',
    key: 'shopTemplateName',
    align: 'center',
    width: 300,
    minWidth: 300,
    resizable: true,
  },
  {
    title: '所属店铺',
    dataIndex: 'simpleName',
    key: 'account',
    align: 'center',
    width: 300,
    minWidth: 300,
    show: true,
    filter: true,
    resizable: true,
  },
  {
    title: "创建人",
    dataIndex: "createUserName",
    key: "createUserName",
    align: 'center',
    width:188,
    minWidth: 188,
    show: true,
    filter: true,
    resizable: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    width: 200,
    minWidth: 200,
    show: true,
    filter: true,
    resizable: true,
  },
  {
    title: '状态',
    dataIndex: 'status_name',
    key: 'status',
    align: 'center',
    type: 'tag',
    tagColor: {
      '默认': '#108ee9',
      '备选': '#87d068',
    },
    width: 200,
    minWidth: 200,
    show: true,
    filter: true,
    resizable: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
    minWidth: 500,
    width: 500,
    show: true,
    filter: true,
    resizable: true,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 300,
    fixed: 'right',
    resizable: false,
    actions: [
      {
        label: '编辑',
        eventName: 'edit',
        danger: false
      },
      {
        label: '查看',
        eventName: 'view',
        danger: false
      },

      {
        label: '复制',
        eventName: 'copy',
        danger: false
      },
      {
        label: '设为默认',
        eventName: 'used',
        danger: false,
        popconfirm: {
          title: '确定要将这条模板设为默认吗？',
          okText: '确定',
          cancelText: '取消'
        }
      }
    ]
  },
]
