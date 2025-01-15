<template>
  <!-- 修改库存弹窗; 从普通商品那 copy 来的 -->
  <div>
    <a-modal
      title="修改库存"
      :open="dialogVisible"
      width="50%"
      :confirm-loading="editStockSubmitLoading"
      @cancel="handleStockDialogClose"
      @ok="submitStock"
    >
      <a-table
        :loading="editStockLoading"
        :data-source="SKUList"
        :columns="editStockColumn"
        :scroll="{ y: 600 }"
        bordered
        :pagination="false"
      >
        <template #headerCell="{ column }">
          <span v-if="column.dataIndex === 'sellableQuantity'">
            库存
            <a-button
              type="link"
              @click="openBatchDialog('sellableQuantity')"
              >修改</a-button
            >
          </span>
        </template>
        <template #bodyCell="{ record, column }">
          <template v-if="!['skuCode', 'sellableQuantity'].includes(column.dataIndex)">
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
              :precision="0"
            />
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 批量修改库存弹窗 -->
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
              :precision="0"
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
              :precision="0"
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
  import { SKUInfoApi, updateStocksApi } from '../../apis/pop-choice-product'
  import { cloneDeep } from 'lodash'
  import { message } from 'ant-design-vue'

  export default {
    name: 'StockDialog',
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
        editStockLoading: false, // 加载 loading
        editStockSubmitLoading: false, // 提交 loading
        SKUList: [],
        editStockData: {},
        // 批量修改弹窗
        batchUpdateDialogVisible: false,
        keyCode: 'sellableQuantity', // 修改的字段编码: skuPrice-价格; sellableQuantity-库存;
        radio: '1',
        absoluteNum: undefined,
        addType: '1', // 添加方式类型: '1'-绝对值; '2'-百分比;
        addValue: undefined
      }
    },
    computed: {
      typeOptions() {
        return [
          { label: '库存', value: '1' },
          { label: '百分比', value: '2' }
        ]
      },
      // 表头
      editStockColumn() {
        let attrColumn = []
        if (this.SKUList.length) {
          attrColumn = this.SKUList[0].skuPropertyList.map(attr => {
            return { title: attr.skuPropertyName, dataIndex: attr.skuPropertyName }
          })
        }
        return [...attrColumn, { title: '商品编码', dataIndex: 'skuCode' }, { title: '库存', dataIndex: 'sellableQuantity', fixed: 'right' }]
      }
    },
    watch: {
      dialogVisible: {
        handler: function (val) {
          if (val) {
            this.editStockData = cloneDeep(this.rawData)
            this.getSKUList()
          }
        }
      }
    },
    methods: {
      // 半托管商品详情数据里没有 SKU 的属性名和属性值; 另外获取
      getSKUList() {
        this.editStockLoading = true
        SKUInfoApi({ productId: this.rawData.productId, sellerId: this.rawData.sellerId })
          .then(res => {
            const SKUList = res.data.result.popChoiceProduct.productSkuList || []
            SKUList.forEach(SKU => {
              const target = this.editStockData.aeopAeProductSKUs.find(item => item.skuId === SKU.skuId)
              SKU.sellableQuantity = target && target.ipmSkuStock
              SKU.warehouseCode = target && target.warehouseCode
            })
            this.SKUList = SKUList
          })
          .finally(() => {
            this.editStockLoading = false
          })
      },
      // 获取显示的 SKU 属性值
      getName(record, dataIndex) {
        let name = '--'
        const attr = record.skuPropertyList.find(attr => attr.skuPropertyName == dataIndex)
        if (attr) {
          name = attr.propertyValueDefinitionName ? `${attr.skuPropertyValue}(${attr.propertyValueDefinitionName})` : attr.skuPropertyValue
        }

        return name
      },
      // 获取 SKU 展示的图片
      getImageUrl(record, dataIndex) {
        const attr = record.skuPropertyList.find(attr => attr.skuPropertyName == dataIndex)
        if (attr && attr.skuImage) {
          return attr.skuImage
        } else {
          return ''
        }
      },
      // 修改价格和库存提交
      submitStock() {
        this.editStockSubmitLoading = true
        const popChoiceSkuStockList = this.SKUList.map(SKU => {
          return {
            skuId: SKU.skuId,
            popChoiceSkuWarehouseStockList: [
              {
                sellableQuantity: SKU.sellableQuantity,
                warehouseCode: SKU.warehouseCode
              }
            ]
          }
        })
        const params = {
          sellerId: this.rawData.sellerId,
          productId: this.rawData.productId,
          popChoiceSkuStockList
        }

        updateStocksApi(params)
          .then(_ => {
            this.$message.success('修改成功')
            this.$emit('refresh')
          })
          .finally(() => {
            this.editStockSubmitLoading = false
            this.handleStockDialogClose()
          })
      },
      // 关闭大弹窗
      handleStockDialogClose() {
        this.SKUList = []
        this.editStockData = {}
        this.$emit('close')
      },
      openBatchDialog(keyCode) {
        this.keyCode = keyCode
        this.batchUpdateDialogVisible = true
      },
      // 批量 确认
      handleBatchConfirm() {
        if (this.radio === '1') {
          // 直接修改
          this.SKUList.forEach(SKU => {
            SKU[this.keyCode] = this.absoluteNum
          })
        } else {
          // 相对 按数量或百分比增减
          if (this.addType === '1') {
            // 绝对值 (a-input-number 不会隐式转换绑定值为数值型)
            this.SKUList.forEach(SKU => {
              SKU[this.keyCode] = Number(SKU[this.keyCode]) + this.addValue
            })
          } else {
            // 百分比
            this.SKUList.forEach(SKU => {
              SKU[this.keyCode] = SKU[this.keyCode] * (1 + this.addValue / 100)
            })
          }
        }

        this.handleBatchClose()
      },
      handleBatchClose() {
        this.keyCode = 'sellableQuantity'
        this.radio = '1'
        this.absoluteNum = undefined
        this.addType = '1'
        this.addValue = undefined
        this.batchUpdateDialogVisible = false
      }
    }
  }
</script>
