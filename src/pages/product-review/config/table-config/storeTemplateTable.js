// 初始选品审核发布列表
export default [
{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 50,
    fixed: 'left',
  },
  {
    title: '模板名称',
    dataIndex: 'temName',
    key: 'temName',
    align: 'center',
    width: 120,
  },
  {
    title: '所属店铺',
    dataIndex: 'storeAccount',
    key: 'storeAccount',
    align: 'center',
    width: 150,
    show: true,
    filter: true
  },
  {
    title: "创建人",
    dataIndex: "createUser",
    key: "createUser",
    align: "center",
    width: 200,
    show: true,
    filter: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    width: 200,
    show: true,
    filter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 188,
    show: true,
    filter: true
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
    width: 188,
    show: true,
    filter: true
  },
  {
    title: '提交人',
    dataIndex: 'selectUserName',
    key: 'selectUserName',
    align: 'center',
    width: 120,
    show: true,
    filter: true
  },
  {
    title: '审核人',
    dataIndex: 'firstAuditName',
    key: 'firstAuditName',
    align: 'center',
    width: 120,
    show: true,
    filter: true
  },
  {
    title: '审核时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    align: 'center',
    width: 180,
    show: true,
    filter: true,
    sortable: true
  },
  {
    title: '驳回备注',
    dataIndex: 'firstAuditReason',
    key: 'firstAuditReason',
    align: 'center',
    width: 300,
    show: true,
  },
]
