<template>
  <div id="amazonShop">
    <!-- <search :resetSetMenu="resetSetMenu"  @requestParams="requestParams"   @changeSingle="changeSingle"></search> -->
    <tables
      :resetSetMenu="resetSetMenu"
      :isShowAdd="true"
      @getDropCol="getDropCol"
      @paginationF = "paginationF"
      @sortChange = "sortChange"
      :loading="loading"
      :tableData="tableData"
      :tableParams="tableParams"
      :tableHeardD = "tableHeardD"
      :dropCol="dropCol">
    </tables>
  </div>
</template>

<script>
import Tables from "@/views/platform/amazon/shop/common/tables.vue";
// import Search from "@/views/platform/amazon/shop/common/search.vue";
import {settingList, settingSearchEdit, settingTableEdit} from "@/api/systemSetting/setting";
import tableHeard from "@/views/platform/amazon/js/tableHead/shopManage";
import { list } from '@/views/platform/amazon/js/api/shop'
export default {
  name: "amazonShop",
  components: {Tables},
  data(){
    return{
      resetSetMenu:"amazonShop",
      searchData:{
        pageNum: 1,
        pageSize: 50,
        prop: "create_time",
        order: "desc",
        createUserId:undefined,
        shopId: undefined,
        voucherName: "",
        voucherCode: "",
        simpleName: '',
        shopName: ''
      },
      dropCol:[],
      tableHeardD:[],
      tableParams:{
        total:0,
        pageNum:1,
        pageSize:50
      },
      tableData:[],
      loading:false,
    }
  },
  created() {
    this.getList()
    this.getShaixuan()
  },
  methods:{
    getShaixuan(){
      settingList({ menu: this.resetSetMenu }).then((res) => {
        if(res.data){
          this.checkedCities = res.data.search?res.data.search.split(","):this.checkedCitiesTemp
          this.dropCol = res.data.table?JSON.parse(res.data.table):tableHeard
          //  console.log('表头配置',this.dropCol)
        }else{
          this.checkedCities = this.checkedCitiesTemp
          this.dropCol = tableHeard
        }
      });

    },
    getList(){
      this.loading = true;
      let data = {
        pageNum: 1,
        pageSize: 999,
        shopName: '',
        simpleName: ''
      }
      list(data).then(res=>{
        this.tableData = res.data.rows
      }).finally(()=>{
        this.loading = false
      })
    },
    getDropCol(val){
      if(!val){
        settingTableEdit({menu:this.resetSetMenu,table:null}).then(res=>{
          this.$message.success("已保存")
          this.getShaixuan()
          this.getList()

        })
        return
      }
      this.dropCol = val
      // console.log('保存表头',this.dropCol)
      // return
      settingTableEdit({menu:this.resetSetMenu,table:JSON.stringify(this.dropCol)}).then(res=>{
        this.$message.success("已保存")
        this.getShaixuan()
        this.getList()

      })
    },
    paginationF(val){
      this.searchData.pageNum = val.pageNum
      this.searchData.pageSize = val.pageSize
      this.getList()
    },
    sortChange(val){
      this.searchData.order = val.order
      this.searchData.prop = val.prop
      this.getList()
    },
  },
}
</script>

<style scoped>

</style>
