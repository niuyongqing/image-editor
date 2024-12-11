export default {
  data() {
    return {
      tableParams: {
        pageNum: 1,
        pageSize: 50
      },
      total: 0,
      tableHeader: [],
      tableSettingFlag: false, // 表格设置状态 Boolean
      tableSettingLoading: false
    }
  },
  computed: {
    displayHeader() {
      return this.tableHeader.filter(column => column.show)
    }
  },
  mounted() {
    this.getTableHeader()
  },
  methods: {
    // 获取表头
    getTableHeader() {
      this.tableHeader = this.DEFAULT_TABLE_COLUMN
    },
    // 排序
    sortChange({ prop, order }) {
      if (order) {
        this.searchForm.prop = toLowerLine(prop)
        this.searchForm.order = order === 'ascending' ? 'asc' : 'desc'
        this.getList()
      } else {
        this.searchForm.prop = undefined
        this.searchForm.order = undefined
      }
    },
    onSelectChange (keys, rows) {
      this.selectedRowKeys = keys
      this.selectedRows = rows
    },
    // 点击开始表格设置
    startSetting() {
      this.tableSettingFlag = true
      this.columnDrag()
    },
    onPaginationChange() {
      this.getList()
    },
  }
}
