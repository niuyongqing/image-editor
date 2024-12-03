<template>
  <div>
    <el-dialog 
      v-dialog-drag 
      v-dialog-drag-width 
      v-dialog-drag-height  
      title="新增" 
      :modal-append-to-body="false" 
      :append-to-body="false"
      :visible.sync="dialogVisible" 
      :close="handleClose" 
      :before-close="handleClose" 
      :fullscreen="fullscreen"
    >
      <template slot="title">
        <div class="custom_dialog_header">
          <span class="el_dialog_title">新增</span>
        </div>
      </template>


      <el-form ref="ruleForm" :model="form" label-width="120px" :rules="rules">

        <el-form-item label="区域：" prop="areaEnName">
          <el-select 
            v-model="form.areaEnName" 
            placeholder="请选择区域"
            @change="areaChange"
          >
            <el-option
              v-for="item in areaList"
              :key="item.areaEnName"
              :label="item.areaName"
              :value="item.areaEnName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="站点：" prop="marketplaces">
          <el-checkbox-group v-model="form.marketplaces">
            <el-checkbox 
              v-for="item in marketList"
              :key="item.id"
              :label="item.id"
            >{{ item.countryZhName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="店铺名称：" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item label="简称：" prop="simpleName">
          <el-input v-model="form.simpleName" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')" :loading="okType">确定</el-button>
          <el-button @click="handleClose('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAreaList, getMarketList } from '@/views/platform/amazon/js/api/shop'
import { addShop } from '@/views/platform/amazon/js/api/shopManage'
export default {
  name: 'addAccountConfig',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getAreaListFn()
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields();
        })
      }
    }
  },
  data() {
    return {
      loading: false,
      okType: false,
      fullscreen: false,
      areaList: [],         // 区域列表
      marketList: [],       // 站点列表
      form: {
        shopName: '',
        areaEnName: '',
        simpleName: '',
        marketplaces: [],
      },
      rules: {
        areaEnName: [{required: true, message: '请选择区域', trigger: 'change'}],
        marketplaces: [{required: true, message: '请选择站点', trigger: ['change', 'blur']}],
        shopName: [{required: true, message: '请输入店铺名称', trigger: 'blur'}],
        simpleName: [{required: true, message: '请输入简称', trigger: 'blur'}]
      }
    }
  },
  mounted() {},
  methods: {
    // 获取区域
    getAreaListFn() {
      getAreaList().then(res => {
        this.areaList = res.data
        this.form.areaEnName = this.areaList[0].areaEnName
        this.getMarketListFn(this.areaList[0].areaEnName)
      })
    },
    // 选择区域
    areaChange(val) {
      this.marketList = []
      this.form.marketplaces = []
      this.getMarketListFn(val)
    },
    // 获取站点
    getMarketListFn(val) {
      let params = {
        areaEnName: val
      }
      getMarketList(params).then(res => {
        this.marketList = res.data
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.okType = true
          let data = {
            shopName: this.form.shopName,
            areaEnName: this.form.areaEnName,
            simpleName: this.form.simpleName,
            marketplaces: this.form.marketplaces.join(),
          }
          addShop(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              // this.$emit("update:dialogVisible", false);
            }
          }).finally(() => {
            this.handleClose()
            this.$parent.getList()
            this.okType = false
          })
        } else {
          return false;
        }
      });
    },

    handleClose(formName) {
      this.form = {
        shopName: '',
        areaEnName: '',
        marketplaces: [],
        simpleName: '',
      }
      this.areaList = [],         // 区域列表
      this.marketList = [],       // 站点列表
      this.$emit("update:dialogVisible", false);
    },
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  ::v-deep .el-dialog {
    width: 100%;
  }
}

.no_fullscreen {
  ::v-deep .el-dialog {
    width: 40%;
  }
}
</style>
