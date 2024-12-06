// import Sortable from 'sortablejs'
// import toLowerLine from '@/utils/toLowerLine'
// import { settingList, settingTableEdit } from '@/api/systemSetting/setting'

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
      settingList({ menu: this.tableCode }).then(res => {
        if (res.data && res.data.table) {
          this.tableHeader = JSON.parse(res.data.table)
        } else {
          this.tableHeader = this.DEFAULT_TABLE_COLUMN
        }
      })
    },
    // 设置表头
    /* setTableHeader(isReset = false) {
      this.tableSettingFlag = false
      this.tableSettingLoading = true
      const params = {
        menu: this.tableCode,
        table: isReset ? null : JSON.stringify(this.tableHeader)
      }
      settingTableEdit(params)
        .then(() => {
          this.$message.success('已保存')
          this.getTableHeader()
          this.getList()
        })
        .finally(() => {
          this.tableSettingLoading = false
        })
    }, */
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
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },
    // 点击开始表格设置
    startSetting() {
      this.tableSettingFlag = true
      this.columnDrag()
    },
    // 列宽度拖动事件
    /* settingHeaderDragend(nw, ow, cow, evt) {
      this.tableHeader.forEach((v, i) => {
        if (v.prop == cow.property) {
          this.tableHeader[i].minWidth = nw
        }
      })
    }, */
    //列拖拽
    /* columnDrag() {
      const _this = this
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 300,
        delay: 0,
        onEnd: evt => {
          const oldItem = _this.tableHeader[evt.oldIndex]
          this.tableHeader.splice(evt.oldIndex, 1)
          this.tableHeader.splice(evt.newIndex, 0, oldItem)
          // _this.update = false
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          _this.$nextTick(() => {
            // _this.update = true
            setTimeout(() => {
              _this.columnDrag() // 重新加载这个方法，否则刷新后无法使用
            }, 200)
          })
        }
      })
    } */
  }
}
