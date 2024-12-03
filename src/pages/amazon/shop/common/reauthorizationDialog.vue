<template>
<div id="reauthorizationDialog">
  <el-dialog 
    v-dialog-drag 
    v-dialog-drag-width 
    v-dialog-drag-height 
    title="" 
    width="50%"
    id="reauthorization_dialog"
    :modal-append-to-body="false" 
    :modal="true" 
    :append-to-body="true" 
    :destroy-on-close="true" 
    :visible.sync="dialogVisible" 
    @close="handleClose" 
    @open="dialogOpen"
    >
    <template slot="title">
      <div class="custom_dialog_header">
        <span class="el_dialog_title">授权</span>
      </div>
    </template>

    <div class="dialog-box">
      <div class="box-content">
        <el-card>
          <el-form 
            class="reauthorization-ruleForm"
            ref="reauthorizationForm" 
            :inline="true" 
            :model="ruleForm" 
            :rules="rules" 
            label-width="100px" 
          >
            <el-form-item label="选择店铺：" prop="shopId">
              <el-select v-model="ruleForm.shopId" placeholder="请选择活动区域">
                <el-option 
                  v-for="item in shoplist"
                  :label="item.shopName" 
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button  class="bottom-button-cancel" @click="handleClose(false)">关 闭</el-button>
      <el-button type="primary" class="bottom-button-save" @click="save()">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { getAreaList } from '@/views/platform/amazon/js/api/shop';
import { shopList } from '@/views/platform/amazon/js/api/shopManage'
export default {
  name: 'reauthorizationDialog',
  components: {},
  data() {
    return {
      dialogVisible: false,
      areaList: [],
      shoplist: [],
      ruleForm: {
        shopId: '',
      },
      rules: {
        shopId: [
          { required: true, message: '请选择店铺', trigger: 'change' }
        ],
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.dialogVisible = val
      }
    },
  },
  props: {
    show: Boolean,
    dialogData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  mounted() {},
  methods: {
    async dialogOpen() {
      let load = this.$loading({
        target: '.reauthorization-ruleForm'
      })
      try {
        // 获取商店列表
        let data = {
          pageNum: 1,
          pageSize: 999,
          shopName: '',
          simpleName: ''
        }
        let shoplist = await shopList(data)
        this.shoplist = shoplist.data.rows
      } catch (error) {}
      load.close()
    },
    handleClose(val) {
      this.dialogVisible = false
      this.$refs.reauthorizationForm.resetFields();
      this.$emit('closeDetails')
      this.ruleForm = {
        shopId: '',
      }
    },
    save() {
      this.$refs.reauthorizationForm.validate((valid) => {
        if (valid) {
          let data = {...this.ruleForm}
          this.$emit('closeDetails', data)
          this.handleClose()
        } else {
          return false;
        }
      });
    }
  },
  created() {},
}
</script>
<style scoped lang='scss'>

</style>