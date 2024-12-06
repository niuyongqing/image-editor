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
      <el-form ref="ruleForm" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="平台：" prop="platform">
          <el-select v-model="form.platform" placeholder="请选择平台" disabled>
            <el-option label="Ozon" value="Ozon"></el-option>
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
            :remote-method="remoteMethod"
            :loading="loading"
            multiple
          >
            <el-option
              v-for="item in options"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
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
            clearable
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="账号：" prop="account">
          <el-select
            style="width: 100%"
            v-model="form.account"
            filterable
            remote
            reserve-keyword
            placeholder="请输入账号"
            :loading="loading"
            multiple
          >
            <el-option
              v-for="item in accountOptions"
              :key="item.account"
              :label="item.simpleName"
              :value="item.account"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit('ruleForm')"
            :loading="okType"
            >确定</el-button
          >
          <el-button @click="handleClose('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAccountUser,
  userDep,
  addAccount,
} from "@/views/platform/ozon/api/accountConfig";

export default {
  name: "addAccountConfig",
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    accountOptions: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.userDep();
      }
    },
  },
  data() {
    return {
      options: [],
      loading: false,
      okType: false,
      fullscreen: false,
      optionProps: {
        value: "deptId",
        label: "deptName",
        children: "children",
        checkStrictly: true,
      },
      depOptions: [],
      form: {
        platform: "Ozon", //平台
        userId: [], //用户id
        depId: [], //部门id
        account: [], //账号多选
      },
      rules: {
        platform: [
          { required: true, message: "请选择平台", trigger: "change" },
        ],
        userId: [{ required: true, message: "请选择用户", trigger: "change" }],
        depId: [{ required: true, message: "请选择部门", trigger: "change" }],
        account: [{ required: true, message: "请选择账号", trigger: "change" }],
      },
    };
  },
  mounted() {
    // this.accountRemoteMethod()
  },
  methods: {
    //部门列表
    userDep() {
      userDep().then((res) => {
        this.depOptions = res.data;
      });
    },
    // 用户下拉框 方法
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let data = {
          userName: query,
        };
        getAccountUser(data).then((res) => {
          this.loading = false;
          this.options = res.data;
        });
      } else {
        this.options = [];
      }
    },
    // 账号列表
    // accountRemoteMethod() {
    //   ozonAccount().then(res => {
    //     this.loading = false;
    //     this.accountOptions = res.data;
    //   })
    // },

    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.okType = true;
          let data = {
            platform: this.form.platform,
            userId: this.form.userId.join(),
            account: this.form.account.join(),
            depId: this.form.depId[this.form.depId.length - 1],
          };
          addAccount(data)
            .then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.$emit("update:dialogVisible", false);
              }
            })
            .finally(() => {
              this.$parent.getList();
              this.okType = false;
            });
        } else {
          return false;
        }
      });
    },

    handleClose(formName) {
      this.$refs.ruleForm.resetFields(); // 只清除清除验证
      this.form = {
        platform: "Ozon", //平台
        userId: [], //用户id
        depId: [], //部门id
        account: [], //账号多选
      };
      this.$emit("update:dialogVisible", false);
    },
  },
};
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
