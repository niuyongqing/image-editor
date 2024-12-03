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
        <el-form-item label="应用ID" prop="appId">
          <el-input v-model="form.appId" placeholder="请输入ID"></el-input>
        </el-form-item>
        <el-form-item label="应用名称" prop="appId">
          <el-input v-model="form.appName" placeholder="请输入名称"></el-input>
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
import { edit } from "@/views/platform/amazon/js/api/applicationManagement";

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
        this.$nextTick(() => {
          let {appId, appName} = this.selectRow[0]
          this.form = {
            appId,
            appName
          }
        })
      }
    }
  },
  data() {
    return {
      loading: false,
      okType: false,
      fullscreen: false,
      depOptions: [],
      accountOptions: [],
      form: {
        appId: '',
        appName: '',
      },
      rules: {
        appId: [{required: true, message: '请选择平台', trigger: 'blur'}],
        appName: [{required: true, message: '请选择用户', trigger: 'blur'}],
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.okType = true
          edit(this.form).then(res => {
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
      this.form.appId = ''
      this.form.appName = ''
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

