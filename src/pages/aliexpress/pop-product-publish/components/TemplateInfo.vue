<template>
  <div class="template-info mb-4">
    <a-card title="模板信息">
      <a-form
        :model="form"
        :rules="rules"
        ref="form"
        :label-col="{ style: { width: '180px' } }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item
          label="运费模板："
          name="freightTemplateId"
        >
          <div class="flex">
            <a-select
              v-model:value="form.freightTemplateId"
              :options="freightOptions"
              :field-names="{ label: 'templateName', value: 'templateId' }"
              placeholder="请选择"
            />
            <a-button
              type="link"
              class="ml-3"
              @click="syncFreightTemplateList"
              >同步</a-button
            >
          </div>
        </a-form-item>
        <a-form-item
          label="服务模板："
          name="promiseTemplateId"
        >
          <div class="flex">
            <a-select
              v-model:value="form.promiseTemplateId"
              :options="serviceOptions"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择"
            />
            <a-button
              type="link"
              class="ml-3"
              @click="syncServiceTemplateList"
              >同步</a-button
            >
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
  import { getListFreightTemplateApi, syncGetListFreightTemplateApi, queryPromiseTemplateByIdApi, syncPromiseTemplateByIdApi } from '../../apis/product'
  import { useAliexpressPopProductStore } from '~@/stores/aliexpress-pop-product'
  import { message } from 'ant-design-vue'

  export default {
    name: 'TemplateInfo',
    data() {
      return {
        store: useAliexpressPopProductStore(),
        form: {
          freightTemplateId: undefined,
          promiseTemplateId: undefined
        },
        rules: {
          freightTemplateId: [{ required: true, message: '请选择运费模板', trigger: 'change' }],
          promiseTemplateId: [{ required: true, message: '请选择服务模板', trigger: 'change' }]
        },
        freightOptions: [],
        serviceOptions: [],
        stopOnce: false
      }
    },
    computed: {
      sellerId() {
        return this.store.sellerId
      },
      productDetail() {
        return this.store.productDetail
      }
    },
    watch: {
      sellerId: {
        handler: function () {
          this.form.freightTemplateId = undefined
          this.form.promiseTemplateId = undefined
          this.getFreightTemplateList()
          this.getServiceTemplateList()
        }
      },
      productDetail: {
        handler: function (detail) {
          if (Object.keys(detail).length === 0) return

          this.form.freightTemplateId = detail.freightTemplateId
          this.form.promiseTemplateId = detail.promiseTemplateId
          this.stopOnce = true
        },
        immediate: true
      }
    },
    methods: {
      getFreightTemplateList() {
        // 获取运费模版
        getListFreightTemplateApi({ channelSellerId: this.sellerId }).then(res => {
          if (res && res.code === 200) {
            this.freightOptions = res.data || []
          }
        })
      },
      // 同步运费
      syncFreightTemplateList() {
        syncGetListFreightTemplateApi({ channelSellerId: this.sellerId }).then(res => {
          if (res && res.code === 200) {
            this.getFreightTemplateList()
            message.success('运费模版同步成功')
          }
        })
      },
      // 获取服务模版
      getServiceTemplateList() {
        queryPromiseTemplateByIdApi({ sellerId: this.sellerId, templateId: '-1' }).then(res => {
          if (res && res.code === 200) {
            this.serviceOptions = res.data || []
            if (!this.stopOnce) {
              // 设默认值 'Service Template for New Sellers'
              const target = this.serviceOptions.find(item => item.id === 0)
              target && (this.form.promiseTemplateId = target.id)
            } else {
              this.stopOnce = false
            }
          }
        })
      },
      // 同步服务
      syncServiceTemplateList() {
        syncPromiseTemplateByIdApi({ sellerId: this.sellerId, templateId: '-1' }).then(res => {
          if (res && res.code === 200) {
            this.getServiceTemplateList()
            message.success('服务模版同步成功')
          }
        })
      },
      async emitData({ looseValidate = false }) {
        let valid = true
        await this.$refs.form.validate().catch(err => {
          valid = false
        })
        if (!valid) return

        return this.form
      }
    }
  }
</script>
