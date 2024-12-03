<template>
  <div>
    <el-card style="margin: 10px;" v-if="update">
      <div style="width: 100%;height: 38px;">
        <el-button type="primary" icon="el-icon-s-tools" @click="Reauthorization" style="margin-right: 20px"
                   v-has-permi="[`system:platform:amazon:auth:url`]">授权
        </el-button>
        <!-- <el-popconfirm
          style="margin-right: 5px"
          confirmButtonText='是'
          cancelButtonText='否'
          icon="el-icon-info"
          iconColor="success"
          title="确定要全部刷新授权吗？"
          @confirm="refreshAllToken"
          v-has-permi="[`system:platform:tiktok:shop:refreshAll`]"
        >
          <el-button slot="reference" type="success" icon="el-icon-refresh" :loading="refreshLoading">刷新全部授权</el-button>
        </el-popconfirm> -->

        <!-- <el-button v-has-permi="[`system:platform:tiktok:shop:simple`]" type="primary" icon="el-icon-edit-outline" @click="editnName" v-if="isEdit('system:platform:tiktok:shop:simple')">批量修改简称</el-button>

        <el-button v-has-permi="[`system:platform:tiktok:shop:store`]" type="primary" icon="el-icon-edit" @click="editnWarehouse" v-if="isEdit('system:platform:tiktok:shop:store')">批量修改仓库</el-button>

        <el-button v-has-permi="[`system:platform:tiktok:shop:export`]" type="warning" icon="el-icon-download" @click="exportInfo" v-if="isEdit('system:platform:tiktok:shop:export')">导出</el-button> -->

        <el-button-group style="position: absolute;right: 30px">
          <el-button @click="startSetting" type="primary" icon="el-icon-s-tools" :loading="saveSettingLoading" v-if="settingTable">表格设置</el-button>
          <el-button @click="saveSetting" type="primary" icon="el-icon-s-tools" :loading="saveSettingLoading" v-else>
            保存表格设置
          </el-button>
          <el-popover placement="bottom" width="800" trigger="click">
            <el-row>
              <div v-for="(item,index) in dropCol" :key="index">
                <el-col :span="3" style="margin-top: 5px"><div> {{ item.label }}</div></el-col>
                <el-col :span="3" style="margin-top: 5px"><div><el-switch style="display: block" :key="index" v-model="item.show" @change="saveSetting"></el-switch></div></el-col>
              </div>
            </el-row>
            <el-button type="primary" icon="el-icon-view" slot="reference">隐藏/显示列</el-button>
          </el-popover>
          <el-popconfirm
            confirmButtonText='是'
            cancelButtonText='否'
            icon="el-icon-error"
            iconColor="danger"
            title="确定要重置当前页面表格的所有设置吗？"
            @confirm="resetSetting"
          >
            <el-button type="danger" icon="el-icon-refresh-left" slot="reference" :loading="resetTableSettingLoading">
              重置表格设置
            </el-button>
          </el-popconfirm>
        </el-button-group>
      </div>
      <el-table
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        border
        stripe
        fit
        class="table-fixed"
        ref="financialApply"
        :key="resetSetMenu"
        row-key="commodityId"
        :header-cell-style="{'text-align':'center'}" fsimpleName
        :height='tableH'
        style="width: 100%;font-weight: bold"
      >
        <el-table-column
          type="selection"
          align="center"
          width="55"
          v-if="settingTable"
        >
        </el-table-column>
        <el-table-column 
          align="center" 
          v-for="(item,index) in dropCol" 
          :key="`col_${index}`"
          :prop="dropCol[index].prop" 
          :label="item.label" 
          :fixed="item.fixed" 
          :min-width="item.width"
          v-if="item.show === true"
        >
          <template slot="header" slot-scope="{column}">
            <span>{{ column.label }}<i class="co-icon-filter"/></span>
          </template>
          <template slot-scope="{row}">
            <div>{{ row[item.prop] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 授权弹窗 -->
    <reauthorization-dialog :show="authorizeDialogData.show" @closeDetails="reauthorizationClose"></reauthorization-dialog>
  </div>
</template>

<script>
import toLowerLine from "@/utils/toLowerLine";
import Sortable from 'sortablejs'
import { getUrl, saveCode, refreshToken } from '@/views/platform/amazon/js/api/shop'
import reauthorizationDialog from './reauthorizationDialog.vue';
export default {
  components: { reauthorizationDialog },
  name: "Tables",
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    dropCol: {
      type: Array,
      default() {
        return [];
      },
    },
    tableParams: {
      type: Object,
      default() {
        return {};
      },
    },
    tableHeardD: {
      type: Array,
      default() {
        return [];
      },
    },
    resetSetMenu: {
      type: String,
      default() {
        return 'amazonShop';
      },
    },
  },
  created() {
    if (!this.$route.query) return;
    // 页面获取code
    let params = {...this.$route.query}
    if (!params.spapi_oauth_code && params.redirect) {
      let arr = params.redirect.split('?')
      params.redirect = arr[0]
      params.spapi_oauth_code = arr[1].split('=')[1]
    }
    // console.log({ params });
    // return

    // this.routerCode = this.$route.query.code
    // 根据参数选择接口授权
    if (params.spapi_oauth_code) {
      let data = {
        state: params.state,
        sellingPartnerId: params.selling_partner_id,
        spapiOauthCode: params.spapi_oauth_code,
        redirectUri: params.redirect,
      }
      this.loading =true
      this.loadingText = "授权进行中，请勿刷新页面..."
      saveCode(data).then(res => {
        this.$message.success(res.msg)
        delete this.$router.push({query:{}})
      }).finally(()=>{
        this.loading = false
        this.loadingText = "加载中..."
        this.pagination()
      })
    }
  },
  data() {
    return {
      loadingText:"加载中...",
      update: true,
      saveSettingLoading: false,
      dialogTableVisible: false,
      resetTableSettingLoading: false,
      loading: false,
      refreshLoading: false,
      settingTable: true,
      tableH: `${window.innerHeight}` - 210,
      authorizeDialogData: {
        show: false,
      }
    }
  },
  methods: {
    // 重新授权
    Reauthorization() {
      this.authorizeDialogData.show = true
    },
    // 授权弹窗关闭
    reauthorizationClose(val) {
      this.authorizeDialogData.show = false
      if (!val) return;
      getUrl(val).then(res => {
        // console.log(res.msg);
        // return
        window.location.href = res.msg;
      })
    },
    // 点击开始表格设置
    startSetting() {
      this.settingTable = false;
      this.columnDrop()
    },
    // 重置表格设置
    resetSetting() {
      this.$emit("getDropCol", null)
      this.$nextTick(() => {
        setTimeout(() => {
          this.columnDrop()
          this.resetTableSettingLoading = false
        }, 1000)
      })
    },
    // 保存设置
    saveSetting() {
      this.saveSettingLoading = true;
      this.$emit("getDropCol", this.dropCol)
      setTimeout(() => {
        this.saveSettingLoading = false
        this.settingTable = true
      }, 1000)
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
    //列拖拽
    columnDrop() {
      const _this = this;
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 300,
        delay: 0,
        onEnd: evt => {
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
    // 排序
    sortChange(column, prop, order) {
      this.$emit('sortChange', {prop: toLowerLine(column), order: prop})
    },
    pagination() {
      this.$emit('paginationF', this.tableParams)
    },
    //点击全选重新计算高度
    getTableHeight() {
      this.tableH = `${window.innerHeight}`;
      this.$emit('ejectionTableH', this.tableH)

    }
  }
}
</script>


<style scoped lang="scss">
.table-fixed {
  ::v-deep .el-table_fixed-right {
    height: 100% !important;
  }

  ::v-deep .el-table_fixed {
    height: 100% !important;
  }
}

::v-deep .el-input__inner {
  border: none;
}

</style>
