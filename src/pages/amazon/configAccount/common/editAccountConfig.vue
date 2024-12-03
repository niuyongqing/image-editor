<template>
  <div>
    <el-dialog v-dialog-drag v-dialog-drag-width v-dialog-drag-height  title="修改" :modal-append-to-body="false" :append-to-body="false"
               :visible.sync="dialogVisible" :close="handleClose" :before-close="handleClose" :fullscreen="fullscreen">
      <template slot="title">
        <div class="custom_dialog_header">
          <span class="el_dialog_title">修改</span>
        </div>
      </template>


      <el-form ref="ruleForm" :model="form" label-width="80px" :rules="rules">

        <el-form-item label="店铺：" prop="shopId">
          <el-select v-model="form.shopId" placeholder="请选择店铺">
            <el-option
              v-for="item in shopArr"
              :key="item.id"
              :label="item.shopName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户：" prop="userId">
          <el-select
            style="width: 100%"
            v-model="form.userId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入用户"
            :loading="loading"
            multiple
          >
            <el-option
              v-for="item in options"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门：" prop="depId">
          <el-cascader
            style="width: 100%"
            v-model="form.depId"
            :options="depOptions"
            :props="optionProps"
            placeholder="请选择部门"
            clearable>
          </el-cascader>
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
import {getAccountUser, userDep, editAccount} from "@/views/platform/amazon/js/api/configAccount.js";
import {shopList} from "@/views/platform/amazon/js/api/shopManage.js";

export default {
  name: 'editAccountConfig',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.form.shopId = ''//平台
        this.form.userId = []//用户id
        this.form.depId = []//部门id
        this.userDep()
        this.getAccountUser()
        this.getShopList()

        this.selectRow.forEach(val => {
          this.form.shopId = val.shopId
          if (val.userId.indexOf(',') !== -1) {
            val.userId.split(',').forEach(value => {
              this.form.userId.push(parseFloat(value))
            })
          } else {
            this.form.userId.push(parseFloat(val.userId))
          }
          this.form.depId = val.depId
        })

      }
    }
  },
  data() {
    return {
      options: [],
      loading: false,
      okType: false,
      fullscreen: false,
      optionProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        checkStrictly: true,
      },
      depOptions: [],
      shopArr: [],
      form: {
        shopId: '',
        userId: [],//用户id
        depId: [],//部门id
      },
      rules: {
        shopId: [{required: true, message: '请选择店铺', trigger: 'change'}],
        userId: [{required: true, message: '请选择用户', trigger: 'change'}],
        depId: [{required: true, message: '请选择部门', trigger: 'change'}],
      }
    }
  },
  methods: {
    getShopList() {
      let data = {
        "pageNum":1,
        "pageSize":999,
        "shopName":"",
        "simpleName":""
      }
      shopList(data).then(res => {
        this.shopArr = res.data.rows
      })
    },
    getAccountUser() {
      getAccountUser({userName: ''}).then(res => {
        this.options = res.data
      })
    },
    //部门列表
    userDep() {
      userDep().then(res => {
        this.depOptions = res.data;
      })
    },
    // 用户下拉框 方法
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        let data = {
          userName: query
        }
        getAccountUser(data).then(res => {
          this.loading = false;
          this.options = res.data
        })
      } else {
        this.options = [];
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.okType = true
          let data = {
            id: this.selectRow[0].id,
            shopId: this.form.shopId,
            userIds: this.form.userId,
            depId: this.form.depId.length > 0 ? this.form.depId[this.form.depId.length - 1] : this.form.depId
          }
          editAccount(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$emit("update:dialogVisible", false);
            }
          }).finally(() => {
            this.okType = false
            this.$parent.getList()
          })
        } else {
          return false;
        }
      });
    },

    handleClose(formName) {
      this.form.shopId = ''//平台
      this.form.userId = []//用户id
      this.form.depId = []//部门id
      this.$refs['ruleForm'].resetFields();
      this.$refs['ruleForm'].clearValidate();
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

