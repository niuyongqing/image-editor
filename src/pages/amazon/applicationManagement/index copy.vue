<template>
  <div id="amazonApplicationManagement">
    <div style="padding: 3px 5px 3px 5px">
      <el-card>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" @click="add()"
              v-has-permi="['system:platform:amazon:app:add']" v-waves>新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" @click="Edit()" :disabled="selectRow.length !== 1 || selectRow.some(i => i.status === 1)" v-waves
              v-has-permi="['system:platform:amazon:app:edit']">修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-popconfirm class="popconfirm-del" confirmButtonText='是' cancelButtonText='否' icon="el-icon-info"
              iconColor="success" title="确定删除选中应用吗？" v-has-permi="['system:platform:amazon:app:del']"
              @confirm="del()">
              <el-button slot="reference" type="danger" icon="el-icon-delete" v-waves
                :disabled="selectRow.length !== 1 || selectRow.some(i => i.status === 1)">删除</el-button>
            </el-popconfirm>
          </el-col>

          <!-- 表格设置 -->
          <el-button-group style="float: right">
            <el-button @click="startSetting" type="primary" icon="el-icon-s-tools" :loading="saveSettingLoading"
              v-if="settingTable" v-waves>表格设置
            </el-button>
            <el-button @click="saveSetting" type="primary" icon="el-icon-s-tools" :loading="saveSettingLoading" v-else
              v-waves>保存表格设置
            </el-button>
            <el-popover placement="bottom" width="800" trigger="click">
              <el-row>
                <div v-for="(item, index) in dropCol" :key="index">
                  <el-col :span="3" style="margin-top: 5px">
                    <div> {{ item.label }}</div>
                  </el-col>
                  <el-col :span="3" style="margin-top: 5px">
                    <div>
                      <el-switch style="display: block" :key="index" v-model="item.show"
                        @change="saveSetting"></el-switch>
                    </div>
                  </el-col>
                </div>
              </el-row>
              <el-button type="primary" icon="el-icon-view" slot="reference" v-waves>隐藏/显示列</el-button>
            </el-popover>
            <el-popconfirm confirmButtonText='是' cancelButtonText='否' icon="el-icon-error" iconColor="danger"
              title="确定要重置当前页面表格的所有设置吗？" @confirm="resetSetting">
              <el-button type="danger" icon="el-icon-refresh-left" slot="reference"
                :loading="resetTableSettingLoading">重置表格设置
              </el-button>
            </el-popconfirm>
          </el-button-group>
        </el-row>
        <div style="padding: 3px 0">

          <el-table :data="tableData" ref="multipleTable" :height='tableH' style="width: 100%;" fit
            element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading" v-loading="loading"
            class="tabClass" @selection-change="handleCurrentChange" border>
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column 
              align="center" v-for="(item, index) in dropCol" 
              :key="`col_${index}`"
              :prop="dropCol[index].prop" 
              :label="item.label" :fixed="item.fixed" 
              :width="item.width"
              v-if="item.show === true" 
              :header-label-style="item.color"
            >
              <template slot-scope="{row}">
                <div v-if="item.prop ==='status'">
                  <div>{{ row.status ? '已关闭':'已生效' }}</div>
                </div>
                <div v-else>
                  <div>{{ row[item.prop] }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column 
              align="center" 
              prop="option" 
              label="操作" 
              width="100"
            >
              <template slot-scope="{row}">
                <div>
                  <el-popconfirm 
                    class="popconfirm-del" 
                    confirmButtonText='是' 
                    cancelButtonText='否' 
                    icon="el-icon-info"
                    iconColor="success" 
                    title="确定删除应用吗？"
                    v-has-permi="['system:platform:amazon:app:del']"
                    @confirm="del(row)"
                    v-if="row.status !== 1"
                  >
                    <el-button slot="reference" style="color: red" type="text">删除</el-button>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <!-- <pagination 
          :total="total" 
          :page.sync="tableParams.pageNum" 
          :limit.sync="tableParams.pageSize"
          @pagination="getList"
        ></pagination> -->

        </div>
      </el-card>
    </div>
    <!--    新增-->
    <add-application :dialogVisible.sync="addAccountConfigType"></add-application>

    <!--    修改-->
    <edit-application :dialogVisible.sync="editAccountConfigType" :selectRow="selectRow"></edit-application>
  </div>
</template>

<script>
import {settingList, settingTableEdit} from "@/api/systemSetting/setting";
import {getList, del} from "@/views/platform/amazon/js/api/applicationManagement";

import tableHeard from "@/views/platform/amazon/js/tableHead/applicationManagement";
import Sortable from "sortablejs";

import addApplication from "@/views/platform/amazon/applicationManagement/common/addApplication.vue";
import editApplication from "@/views/platform/amazon/applicationManagement/common/editApplication.vue";
export default {
  name: 'amazonApplicationManagement',
  components: {
    addApplication,
    editApplication
  },
  data() {
    return {
      tableData: [],
      loading: false,
      tableParams: {
        page: 1,
        pageSize: 50
      },
      total: 0,
      resetSetMenu: 'amazonApplicationManagement',
      saveSettingLoading: false,
      resetTableSettingLoading: false,
      settingTable: true,   // 是否显示表格设置
      dropCol: [],          // 修改表头下拉框数据
      tableHeard: [],
      tableH: `${window.innerHeight}` - 190,
      selectRow:[],//选择的行 row
      addAccountConfigType: false,//新增组件状态
      editAccountConfigType: false,//修改组件状态
    }
  },
  mounted() {
    this.getList()
    this.getShaixuan()
  },
  methods: { 
    //获取列表
    getList() {
      this.loading = true
      getList().then(res => {
        res.data && (this.tableData = res.data);
      }).finally(()=>{
        this.loading = false
      })
    },
    // 新增
    add() {
      this.addAccountConfigType = true;
    },
    Edit(){
      this.editAccountConfigType = true
    },
    //删除
    del(row = null) {
      let id = row ? row.id : this.selectRow[0].id
      del(id).then(res=>{
        if (res.code == 200){
          this.$message.success(res.msg)
        }
      }).finally(()=>{
        this.getList()
      })
    },
    // 列宽度拖动事件
    settingHeaderDragend(nw, ow, cow, evt) {
      const _this = this;
      _this.dropCol.forEach((v, i) => {
        if (v.prop == cow.property) {
          _this.dropCol[i].width = nw
        }
      })
    },
    handleCurrentChange(row){
      this.selectRow = row;
    },
    //列拖拽
    columnDrop() {
      const _this = this;
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 300,
        delay: 0,
        onEnd: evt => {
          // const oldItem = _this.dropCol[evt.oldIndex - 1]
          // this.dropCol.splice(evt.oldIndex - 1, 1)
          // this.dropCol.splice(evt.newIndex - 1, 0, oldItem)
          const oldItem = _this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
          _this.update = false
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          _this.$nextTick(() => {
            _this.update = true
            setTimeout(() => {
              _this.columnDrop() // 重新加载这个方法，否则刷新后无法使用
            }, 200)
          });
        }
      })
    },
    getShaixuan() {
      settingList({menu: this.resetSetMenu}).then((res) => {
        if (res.data) {
          this.dropCol = res.data.table ? JSON.parse(res.data.table) : tableHeard
        } else {
          this.dropCol = tableHeard
        }
      });
    },
    // 点击表格设置
    startSetting() {
      this.settingTable = !this.settingTable
      this.columnDrop()
    },
    // 保存表格设置
    saveSetting() {
      this.settingTable = !this.settingTable
      settingTableEdit({menu: this.resetSetMenu, table: JSON.stringify(this.dropCol)}).then(res => {
        this.$message.success("已保存")
        this.getShaixuan()
        this.getList()

      })
      setTimeout(() => {
        this.saveSettingLoading = false
        this.settingTable = true
      }, 1000)
    },
    // 重置表格设置
    resetSetting() {
      settingTableEdit({menu: this.resetSetMenu, table: JSON.stringify(tableHeard)}).then(res => {
        this.$message.success("已保存")
        this.getShaixuan()
        this.getList()

      })
      this.$nextTick(() => {
        setTimeout(() => {
          this.columnDrop()
          this.resetTableSettingLoading = false
        }, 1000)
      })
    },
    //点击全选重新计算高度
    getTableHeight() {
      this.tableH = `${window.innerHeight}`;
      this.$emit('ejectionTableH', this.tableH)

    },
  },
  created() {},
}
</script>
<style scoped lang='scss'>
#tiktokConfigAccount {
  width: 100%;
  height: 100%;
}
</style>