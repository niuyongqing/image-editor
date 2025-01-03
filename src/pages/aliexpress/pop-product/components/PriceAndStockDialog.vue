<template>
  <!-- 修改价格和库存弹窗 -->
  <div>
    <a-modal
      title="修改价格和库存"
      :open="dialogVisible"
      width="50%"
      :confirm-loading="editPriceAndStockSubmitLoading"
      @cancel="handlePriceAndStockDialogClose"
      @ok="submitPriceAndStock"
    >
      <a-table
        :loading="editPriceAndStockLoading"
        :data-source="editPriceAndStockData.aeopAeProductSKUs"
        :columns="editPriceAndStockColumn"
        :scroll="{ y: 600 }"
        bordered
        :pagination="false"
      >
        <template #headerCell="{ column }">
          <span v-if="column.dataIndex === 'skuPrice'">
            价格
            <a-button
              type="link"
              @click="openBatchDialog('skuPrice')"
              >修改</a-button
            >
          </span>
          <span v-else-if="column.dataIndex === 'ipmSkuStock'">
            库存
            <a-button
              type="link"
              @click="openBatchDialog('ipmSkuStock')"
              >修改</a-button
            >
          </span>
        </template>
        <template #bodyCell="{ record, column }">
          <template v-if="!['skuCode', 'skuPrice', 'ipmSkuStock'].includes(column.dataIndex)">
            <span>
              <a-popover
                v-if="getImageUrl(record, column.dataIndex)"
                placement="right"
              >
                <template #content>
                  <img
                    :src="getImageUrl(record, column.dataIndex)"
                    style="height: 400px; width: 400px"
                  />
                </template>
                <span>
                  <a-image
                    width="56px"
                    height="56px"
                    :src="getImageUrl(record, column.dataIndex)"
                  />
                </span>
              </a-popover>
              <span class="ml-1">{{ getName(record, column.dataIndex) }}</span>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'skuCode'">
            <span>{{ record[column.dataIndex] || '--' }}</span>
          </template>
          <template v-else>
            <a-input-number
              v-model:value="record[column.dataIndex]"
              :controls="false"
              :min="0"
              :max="999999"
              :precision="{ skuPrice: 2, ipmSkuStock: 0 }[column.dataIndex]"
            />
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 批量修改价格和库存弹窗 -->
    <a-modal
      title="批量修改"
      v-model:open="batchUpdateDialogVisible"
      width="20%"
      :after-close="handleBatchClose"
      @cancel="handleBatchClose"
      @ok="handleBatchConfirm"
    >
      <a-radio-group v-model:value="radio">
        <div class="mb-3">
          <a-radio value="1">
            <a-input-number
              v-model:value="absoluteNum"
              :controls="false"
              :min="0"
              :max="999999"
              :precision="keyCode === 'skuPrice' ? 2 : 0"
              :disabled="radio !== '1'"
            ></a-input-number>
            <span> (直接修改)</span>
          </a-radio>
        </div>
        <div class="mb-3">
          <a-radio value="2">
            <span>按 </span>
            <!-- antd 里的陈年遗害; 在 radio 中的 select 下拉框会自动收起, 需要阻止默认点击事件 -->
            <a-select
              v-model:value="addType"
              :disabled="radio !== '2'"
              :options="typeOptions"
              class="w-25"
              @click="e => e.preventDefault()"
            ></a-select>
            <span class="mx-1.5">增加</span>
            <a-input-number
              v-model:value="addValue"
              :controls="false"
              :min="-999999"
              :max="999999"
              :precision="keyCode === 'skuPrice' ? 2 : 0"
              :disabled="radio !== '2'"
            ></a-input-number>
            <span v-if="addType === '2'"> %</span>
          </a-radio>
        </div>
      </a-radio-group>
      <div>提示: 如果减少, 可以输入负数</div>
    </a-modal>
  </div>
</template>

<script>
  import { resultByPostCateIdAndPathApi, editProductApi } from '../../apis/product'
  import { cloneDeep } from 'lodash'
  import { message } from 'ant-design-vue'

  export default {
    name: 'PriceAndStockDialog',
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      rawData: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        editPriceAndStockLoading: false, // 加载 loading
        editPriceAndStockSubmitLoading: false, // 提交 loading
        SKUList: [],
        editPriceAndStockData: {},
        // 批量修改弹窗
        batchUpdateDialogVisible: false,
        keyCode: 'skuPrice', // 修改的字段编码: skuPrice-价格; ipmSkuStock-库存;
        radio: '1',
        absoluteNum: undefined,
        addType: '1', // 添加方式类型: '1'-绝对值; '2'-百分比;
        addValue: undefined
      }
    },
    computed: {
      typeOptions() {
        return [
          { label: this.keyCode === 'skuPrice' ? '金额' : '库存', value: '1' },
          { label: '百分比', value: '2' }
        ]
      },
      // 价格和库存表头
      editPriceAndStockColumn() {
        let attrColumn = []
        if (this.editPriceAndStockData?.aeopAeProductSKUs?.[0]?.aeopSKUPropertyList && this.SKUList.length) {
          attrColumn = this.editPriceAndStockData.aeopAeProductSKUs[0].aeopSKUPropertyList.map(attr => {
            const target = this.SKUList.find(SKU => SKU.attributeId == attr.skuPropertyId)
            if (target) {
              // return { title: target.zh, dataIndex: target.en }
              // 商品详情里没有属性名字段, 缺东少西的; dataIndex 只能用 attributeId 来匹配
              return { title: target.zh, dataIndex: String(target.attributeId) }
            } else {
              return { title: 'ERROR', dataIndex: 'ERROR' }
            }
          })
        }
        return [...attrColumn, { title: '商品编码', dataIndex: 'skuCode' }, { title: '价格', dataIndex: 'skuPrice', fixed: 'right' }, { title: '库存', dataIndex: 'ipmSkuStock', fixed: 'right' }]
      }
    },
    watch: {
      dialogVisible: {
        handler: function (val) {
          if (val) {
            this.editPriceAndStockData = cloneDeep(this.rawData)
            this.getSKUList()
          }
        }
      }
    },
    methods: {
      // 商品详情数据里没有 SKU 的属性名和属性值; 另外获取
      getSKUList() {
        this.editPriceAndStockLoading = true
        resultByPostCateIdAndPathApi({ categoryId: this.rawData.categoryId, channelSellerId: this.rawData.sellerId })
          .then(res => {
            const tempList = res.data.result.attributes || []
            const SKUList = tempList.filter(item => item.visible && item.sku)
            SKUList.forEach(item => {
              item.zh = JSON.parse(item.names).zh
              item.en = JSON.parse(item.names).en
              item.values.forEach(value => {
                value.zh = JSON.parse(value.names).zh
                value.en = JSON.parse(value.names).en
                value.name = JSON.parse(value.names).zh + '(' + JSON.parse(value.names).en + ')'
                value.valueTagsObj = JSON.parse(value.valueTags)
              })
            })
            this.SKUList = SKUList
          })
          .finally(() => {
            this.editPriceAndStockLoading = false
          })
      },
      // 获取显示的 SKU 属性值
      getName(record, dataIndex) {
        let name = '--'
        const target = this.SKUList.find(SKU => SKU.attributeId == dataIndex)
        const attr = record.aeopSKUPropertyList.find(attr => attr.skuPropertyId == dataIndex)
        if (target) {
          const valueTarget = target.values.find(value => value.attributeValueId == attr.propertyValueId)
          valueTarget && (name = valueTarget.name)
        }

        return name
      },
      // 获取 SKU 展示的图片
      getImageUrl(record, dataIndex) {
        const attr = record.aeopSKUPropertyList.find(attr => attr.skuPropertyId == dataIndex)
        if (attr && attr.skuImage) {
          return attr.skuImage
        } else {
          return ''
        }
      },
      // 修改价格和库存提交
      submitPriceAndStock() {
        this.editPriceAndStockSubmitLoading = true
        const params = {
          ...this.editPriceAndStockData,
          groupId: this.editPriceAndStockData.groupIds.join(',')
        }
        params.aeopAeProductSKUs.forEach(SKU => {
          SKU.aeopSKUProperty = SKU.aeopSKUPropertyList
        })
        delete params.SKUExpand
        delete params.images

        editProductApi(params)
          .then(_ => {
            message.success('修改成功')
            this.$emit('refresh')
          })
          .finally(() => {
            this.editPriceAndStockSubmitLoading = false
            this.handlePriceAndStockDialogClose()
          })
      },
      // 关闭大弹窗
      handlePriceAndStockDialogClose() {
        this.SKUList = []
        this.editPriceAndStockData = {}
        this.$emit('priceAndStockDialogClose')
      },
      openBatchDialog(keyCode) {
        this.keyCode = keyCode
        this.batchUpdateDialogVisible = true
      },
      // 批量 确认
      handleBatchConfirm() {
        if (this.radio === '1') {
          // 直接修改
          this.editPriceAndStockData.aeopAeProductSKUs.forEach(SKU => {
            SKU[this.keyCode] = this.absoluteNum
          })
        } else {
          // 相对 按数量或百分比增减
          if (this.addType === '1') {
            // 绝对值 (a-input-number 不会隐式转换绑定值为数值型)
            this.editPriceAndStockData.aeopAeProductSKUs.forEach(SKU => {
              SKU[this.keyCode] = Number(SKU[this.keyCode]) + this.addValue
            })
          } else {
            // 百分比
            // const precision = this.keyCode === 'skuPrice' ? 2 : 0
            this.editPriceAndStockData.aeopAeProductSKUs.forEach(SKU => {
              SKU[this.keyCode] = SKU[this.keyCode] * (1 + this.addValue / 100)
            })
          }
        }

        this.handleBatchClose()
      },
      handleBatchClose() {
        this.keyCode = 'skuPrice'
        this.radio = '1'
        this.absoluteNum = undefined
        this.addType = '1'
        this.addValue = undefined
        this.batchUpdateDialogVisible = false
      }
    }
  }
</script>
