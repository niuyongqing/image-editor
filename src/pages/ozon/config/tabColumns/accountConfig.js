
export default [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 60,
    fixed: 'left',
  },
  {
    title: '用户',
    dataIndex:"userId",
    key: 'userId',
    align:"center",
    sortable:false,
    show:true,
    width: 100,
    filter:false,
  },
  {
    title: '账号',
    dataIndex:"account",
    key: 'account',
    align:"left",
    width: 1500
  },
  {
    title: '部门信息',
    dataIndex:"depId",
    key: 'depId',
    align:"center",
    sortable:false,
    show:true,
    filter:false,
  }
]
