<template>
  <div class="national-quote">
    <a-card title="区域调价信息">
      <a-form :label-col="{ style: { width: '180px' } }">
        <a-form-item label="调价方式：">
          <div class="mb-3 w-[63%]">
            <a-select
              v-model:value="configurationType"
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
            <div class="my-3 text-right">
              <a-button
                type="primary"
                class="mr-3"
                @click="batchFillCol"
                >批量填充</a-button
              >
            </div>
            <a-table
              :data-source="regionalPriceTable"
              :columns="tableHeader"
              :scroll="{ x: 'max-content', y: 800 }"
              ref="regionalPriceTable"
              bordered
              :pagination="false"
            >
              <template #headerCell="{ column }">
                <template v-if="checkList.includes(column.key)">
                  <a-input-number
                    v-model:value="batchFillColValue[column.key]"
                    :min="-50"
                    :max="9999"
                    :precision="2"
                    :controls="false"
                    :placeholder="column.title"
                  ></a-input-number>
                  <div class="ml-1">{{ column.title }}</div>
                </template>
                <template v-else>
                  <div class="h-6"></div>
                  <div class="ml-1">{{ column.title }}</div>
                </template>
              </template>

              <template #bodyCell="{ column, record }">
                <template v-if="SKUProps.includes(column.key)">{{ record[column.key] }}</template>
                <template v-else-if="column.key === 'batchFillRow'">
                  <a-popover>
                    <template #content>
                      <div>
                        <a-input-number
                          v-model:value="batchFillRowValue"
                          :min="-50"
                          :max="9999"
                          :precision="2"
                          :controls="false"
                        ></a-input-number>
                        <a-button
                          type="primary"
                          class="ml-2"
                          @click="batchFillRow(record)"
                          >填充</a-button
                        >
                      </div>
                    </template>
                    <a-button
                      type="link"
                      title="应用到所有国家"
                      ><CopyOutlined
                    /></a-button>
                  </a-popover>
                </template>
                <template v-else>
                  <a-input-number
                    v-model:value="record[column.key]"
                    :min="-50"
                    :max="9999"
                    :precision="2"
                    :controls="false"
                    @blur="getAdjustmentPrice(column.key, record)"
                  ></a-input-number>
                  <span v-if="configurationType === 'percentage'"> %</span>
                  <!-- TODO: 在下方显示计算后的价格 -->
                  <!-- <div
                        v-if="configurationType !== 'absolute'"
                        class="ml-4"
                      >
                        {{ record[`${column.key}Price`] }}
                      </div> -->
                </template>
              </template>
            </a-table>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
  import { areaListApi } from '../../apis/product'
  import { useAliexpressPopProductStore } from '@/stores/aliexpress-pop-product'
  import { Modal } from 'ant-design-vue'
  import { CopyOutlined } from '@ant-design/icons-vue'

  export default {
    name: 'NationalQuote',
    components: { CopyOutlined },
    data() {
      return {
        store: useAliexpressPopProductStore(),
        countries: [],
        configurationType: 'absolute', // 还有一个类型: delete-删除分国家报价;
        options: [
          { label: '直接报价', value: 'absolute' },
          { label: '按比例', value: 'percentage' },
          { label: '按金额', value: 'relative' }
        ],
        checkAll: false,
        isIndeterminate: true, // 只负责控制老大的样式
        checkList: [],
        regionalPriceTable: [],
        SKUCols: [], // 变种表头
        batchFillRowValue: undefined, // 批量填充行的值
        batchFillColValue: {},
        isEdit: false,
        configurationData: []
      }
    },
    computed: {
      currencyCode() {
        return this.store.currencyCode
      },
      SKUTableData() {
        return this.store.SKUTableData
      },
      SKUAttributesCache() {
        return this.store.SKUAttributesCache
      },
      productDetail() {
        return this.store.productDetail
      },
      checkedCountries() {
        return this.countries.filter(item => this.checkList.includes(item.areaCode))
      },
      SKUProps() {
        return this.SKUCols.map(col => col.key)
      },
      tableHeader() {
        const cols = [...this.SKUCols]
        cols.push({
          title: '批量',
          key: 'batchFillRow',
          width: 50
        })
        this.checkedCountries.forEach(country => {
          cols.push({
            title: this.currencyCode ? `${country.areaName} (${this.currencyCode})` : country.areaName,
            key: country.areaCode,
            width: 134
          })
        })

        return cols
      }
    },
    watch: {
      SKUTableData: {
        handler: function (SKUTableData) {
          if (SKUTableData.length) {
            this.SKUCols = SKUTableData[0].aeopSKUProperty.map(SKU => {
              return {
                title: SKU.label,
                key: SKU.code,
                width: 80
              }
            })
            // SKU数据当骨架, 融合已填写数据
            this.regionalPriceTable = SKUTableData.map(item => {
              const cacheObj = this.regionalPriceTable.find(el => el.SKUKey === item.SKUKey)
              const row = { ...item }
              this.checkedCountries.forEach(country => {
                row[country.areaCode] = cacheObj && cacheObj[country.areaCode]
                row[`${country.areaCode}Price`] = cacheObj && cacheObj[country.areaCode]
              })

              return row
            })
          } else {
            this.SKUCols = []
            const record = {}
            this.checkList.forEach(country => {
              record[country] = undefined
              record[`${country}Price`] = undefined
            })
            this.regionalPriceTable = [record]
          }
          // 编辑时赋值
          if (this.isEdit) {
            this.configurationData.forEach(item => {
              for (const key in item.absoluteQuoteMap) {
                if (key) {
                  // const tableItem = this.regionalPriceTable.find(tableItem => tableItem.uniqueId === key)
                  // 因为速卖通这个 key 的生成顺序混乱, 只能再麻烦点曲线救国
                  const tableItem = this.regionalPriceTable.find(tableItem => key.split(';').every(keyItem => tableItem.uniqueId.includes(keyItem)))
                  if (tableItem) {
                    tableItem[item.shiptoCountry] = item.absoluteQuoteMap[key]
                  } else {
                    Modal.warning('区域调价数据匹配失败, 请联系IT部检查')
                  }
                } else {
                  // key 为空, 即无 SKU 属性
                  this.regionalPriceTable[0][item.shiptoCountry] = item.absoluteQuoteMap[key]
                }
              }
            })
            this.isEdit = false
          }
        },
        deep: true
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
                item[`${addItem}Price`] = undefined // 计算出的价格
              })
            })
          } else {
            // 移除
            const removeCheck = oldVal.filter(item => !newVal.includes(item))
            removeCheck.forEach(removeItem => {
              this.regionalPriceTable.forEach(item => {
                delete item[removeItem]
                delete item[`${removeItem}Price`]
              })
            })
          }
        }
      },
      // 详情数据(编辑)
      productDetail: {
        handler: function (detail) {
          if (Object.keys(detail).length === 0) return

          if (detail.aeopNationalQuoteConfiguration) {
            this.isEdit = true
            this.configurationType = detail.aeopNationalQuoteConfiguration.configurationType
            this.configurationData = JSON.parse(detail.aeopNationalQuoteConfiguration.configurationData)
            this.checkList = this.configurationData.map(item => item.shiptoCountry)
          }
        },
        immediate: true
      }
    },
    mounted() {
      // 获取区域数据
      this.getAreaList()
    },
    methods: {
      getAreaList() {
        areaListApi().then(res => {
          if (res && res.code === 200) {
            this.countries = res.data || []
            this.countries.forEach(item => {
              this.batchFillColValue[item.areaCode] = undefined
            })
          }
        })
      },
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
            country[`${item}Price`] = undefined
          })
        })
      },
      getAdjustmentPrice(key, record) {
        if (record[key] === undefined) return

        if (this.configurationType === 'percentage') {
          record[`${key}Price`] = (record.skuPrice * (1 + record[key] / 100)).toFixed(2)
        } else if (this.configurationType === 'relative') {
          record[`${key}Price`] = record.skuPrice + record[key]
        }
      },
      // 批量填充 列
      batchFillCol() {
        this.checkList.forEach(country => {
          if (this.batchFillColValue[country] !== undefined) {
            this.regionalPriceTable.forEach(item => {
              item[country] = this.batchFillColValue[country]
            })
          }
        })
        this.countries.forEach(item => {
          this.batchFillColValue[item.areaCode] = undefined
        })
      },
      batchFillRow(SKUItem) {
        // 批量填充 行
        if (this.batchFillRowValue !== undefined) {
          this.checkList.forEach(item => {
            SKUItem[item] = this.batchFillRowValue
          })

          this.batchFillRowValue = undefined
        }
      },
      emitData({ looseValidate = false }) {
        const configurationData = this.checkList.map(country => {
          const absoluteQuoteMap = {}
          this.regionalPriceTable.forEach(item => {
            const label = item.aeopSKUProperty ? item.aeopSKUProperty.map(attr => attr.attributeId + ':' + attr.id).join(';') : ''
            absoluteQuoteMap[label] = item[country]
          })
          return {
            absoluteQuoteMap,
            shiptoCountry: country
          }
        })

        const aeopNationalQuoteConfiguration = {
          configurationData: JSON.stringify(configurationData),
          configurationType: this.configurationType
        }

        return { aeopNationalQuoteConfiguration }
      }
    }
  }
</script>
