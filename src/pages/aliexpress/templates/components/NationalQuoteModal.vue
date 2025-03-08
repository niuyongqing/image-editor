<template>
  <a-modal
    :open="open"
    title="调价模版"
    width="40%"
    :confirm-loading="confirmLoading"
    @cancel="cancel"
    @ok="handleOk"
  >
    <a-card title="模板信息">
      <a-form
        :model="form"
        ref="formRef"
        :label-col="{ style: { width: '100px' } }"
      >
        <a-form-item
          label="模板名称"
          name="name"
          required
        >
          <a-input
            v-model:value="form.name"
            placeholder="请输入"
            :maxlength="128"
            show-count
          />
        </a-form-item>
        <a-form-item label="调价方式：">
          <div class="mb-3">
            <a-select
              v-model:value="form.configurationType"
              :options="options"
              @change="configurationChange"
            />
            <span class="text-gray"> 商品零售价作为基准价，开放部分"Ship to"区域，可以在基准价基础上进行调整但降价不得高于50%。</span>
          </div>
          <a-checkbox
            :indeterminate="isIndeterminate"
            v-model:checked="checkAll"
            @change="handleCheckAllChange"
            >全选</a-checkbox
          >
          <a-checkbox-group
            v-model:value="checkList"
            @change="handleCheckedCountriesChange"
          >
            <a-checkbox
              v-for="item in countries"
              :key="item.areaCode"
              :value="item.areaCode"
              ><span
                :title="item.areaName"
                class="inline-block w-30 align-middle truncate"
                >{{ item.areaName }}</span
              ></a-checkbox
            >
          </a-checkbox-group>
          <div v-if="checkList.length && regionalPriceTable.length">
            <a-table
              :data-source="regionalPriceTable"
              :columns="tableHeader"
              :scroll="{ x: 'max-content' }"
              bordered
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <div>{{ column.key }}</div>
                <a-input-number
                  v-model:value="record[column.key]"
                  :min="-50"
                  :max="9999"
                  :precision="2"
                  :controls="false"
                ></a-input-number>
                <span v-if="form.configurationType === 'percentage'"> %</span>
              </template>
            </a-table>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script>
  import { getProductClassificationApi, resultByPostCateIdAndPathApi } from '../../apis/product'
  import { templateAddApi, templateUpdateApi } from '../../apis/templates'
  import { message, Modal } from 'ant-design-vue'

  export default {
    name: 'NationalQuoteModal',
    props: {
      open: {
        type: Boolean,
        default: false
      },
      countries: {
        type: Array,
        default: () => []
      },
      detail: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        form: {
          name: '',
          configurationType: 'absolute' // 还有一个类型: delete-删除分国家报价;
        },
        options: [
          { label: '直接报价', value: 'absolute' },
          { label: '按比例', value: 'percentage' },
          { label: '按金额', value: 'relative' }
        ],
        checkAll: false,
        isIndeterminate: true, // 只负责控制老大的样式
        checkList: [],
        regionalPriceTable: [],
        configurationData: [],
        confirmLoading: false
      }
    },
    computed: {
      checkedCountries() {
        return this.countries.filter(item => this.checkList.includes(item.areaCode))
      },
      tableHeader() {
        const cols = this.checkedCountries.map(country => {
          return {
            title: country.areaName,
            key: country.areaCode,
            width: 134
          }
        })

        return cols
      }
    },
    watch: {
      open: {
        handler: function (open) {
          if (open && Object.keys(this.detail).length) {
            this.form.name = this.detail.templateName
            const templateValue = JSON.parse(this.detail.templateValue)
            this.form.configurationType = templateValue.configurationType
            this.checkList = Object.keys(templateValue.regionalPriceTable[0])
            this.regionalPriceTable = templateValue.regionalPriceTable
          }
        },
        immediate: true
      },
      checkList: {
        handler: function (newVal, oldVal) {
          // 首次添加调价区域(regionalPriceTable为空)
          if (!this.regionalPriceTable.length) {
            this.regionalPriceTable = [{}]
          }
          // 加上区域属性
          if (newVal.length > oldVal.length) {
            // 增加
            const addCheck = newVal.filter(item => !oldVal.includes(item))
            // 给区域价格表中每个变种添加地区属性
            addCheck.forEach(addItem => {
              this.regionalPriceTable.forEach(item => {
                item[addItem] = undefined // 填写的内容
              })
            })
          } else {
            // 移除
            const removeCheck = oldVal.filter(item => !newVal.includes(item))
            removeCheck.forEach(removeItem => {
              this.regionalPriceTable.forEach(item => {
                delete item[removeItem]
              })
            })
          }
        }
      }
    },
    methods: {
      handleCheckAllChange(e) {
        this.checkList = e.target.checked ? this.countries.map(item => item.areaCode) : []
        this.isIndeterminate = false
      },
      handleCheckedCountriesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.countries.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.countries.length
      },
      // 切换调价方式, 清空已填写数据
      configurationChange() {
        this.checkList.forEach(item => {
          this.regionalPriceTable.forEach(country => {
            country[item] = undefined
          })
        })
      },

      /** footer 按钮 */
      cancel() {
        this.$emit('update:open', false)
      },
      async handleOk() {
        let valid = true
        await this.$refs.formRef.validate().catch(err => {
          valid = false
        })
        if (!valid) return

        const templateValue = {
          configurationType: this.form.configurationType,
          regionalPriceTable: this.regionalPriceTable
        }
        const params = {
          id: this.detail.id,
          templateName: this.form.name,
          templateType: 3,
          templateValue: JSON.stringify(templateValue)
        }
        const requestApi = this.detail.id ? templateUpdateApi : templateAddApi
        requestApi(params)
          .then(res => {
            this.cancel()
            this.$emit('refresh')
          })
          .finally(() => {
            this.confirmLoading = false
          })
      }
    }
  }
</script>
