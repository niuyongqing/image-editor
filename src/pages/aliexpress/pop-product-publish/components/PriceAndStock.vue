<template>
  <div class="price-and-stock">
    <a-card
      title="价格与库存"
      class="mb-4"
    >
      <a-form
        :model="form"
        :rules="rules"
        ref="form"
        :label-col="{ style: { width: '180px' } }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item
          label="计件单位"
          name="productUnit"
        >
          <a-select
            v-model:value="form.productUnit"
            filterable
            placeholder="请选择计件单位"
            :options="UNIT_OPTIONS"
          />
        </a-form-item>
        <a-form-item
          label="销售方式"
          name="saleMode"
        >
          <a-select
            v-model:value="form.saleMode"
            placeholder="请选择销售方式"
            :options="saleModeOptions"
          />
        </a-form-item>
        <a-form-item
          v-if="form.saleMode === '2'"
          label="每包"
          name="lotNum"
        >
          <a-input-number
            v-model:value="form.lotNum"
            :min="1"
            :max="9999"
            :controls="false"
            placeholder="件/个"
          ></a-input-number>
        </a-form-item>

        <div class="wholesale-wrap">
          <a-form-item
            label="批发"
            name="wholesale_check"
          >
            <a-checkbox
              v-model:checked="form.wholesale_check"
              @change="toggleWholesale"
            ></a-checkbox>
          </a-form-item>
          <template v-if="form.wholesale_check">
            <span class="wholesale-text">购买</span>
            <a-form-item
              name="wholesale_amount"
              :label-col="{ style: { width: '0' } }"
            >
              <a-input-number
                v-model:value="form.wholesale_amount"
                :min="2"
                :max="100000"
                :controls="false"
                placeholder="2 ~ 100,000"
              ></a-input-number>
            </a-form-item>
            <span class="wholesale-text">件/个以上时减免</span>
            <a-form-item
              name="wholesale_discount"
              :label-col="{ style: { width: '0' } }"
            >
              <a-input-number
                v-model:value="form.wholesale_discount"
                :min="1"
                :max="99"
                :controls="false"
                placeholder="1% ~ 99%"
                @change="toggleWholesale"
              ></a-input-number>
            </a-form-item>
            <span class="wholesale-text">%, 即{{ form.wholesale_discount ? ((100 - form.wholesale_discount) / 10).toFixed(2) : '--' }}折</span>
          </template>
        </div>

        <a-form-item
          label="扣减方式"
          name="reduceStrategy"
        >
          <a-radio-group v-model:value="form.reduceStrategy">
            <a-radio value="payment_success_deduct">付款减库存</a-radio>
            <a-radio value="place_order_withhold">下单减库存</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- SKU 变种属性 -->
        <a-form
          ref="SKUAttributesForm"
          :model="SKUAttributesForm"
          :label-col="{ style: { width: '180px' } }"
          class="mt-4"
        >
          <template
            v-for="item in SKUAttributeList"
            :key="item.attributeId"
          >
            <a-form-item
              :required="item.required"
              :label="item.zh + ''"
              :name="item.en"
            >
              <template v-if="item.attributeShowTypeValue === 'check_box'">
                <!-- 多选框内有不同的属性, 各自处理 -->
                <a-checkbox-group
                  v-if="item.en.includes('Color')"
                  v-model:value="SKUAttributesForm[item.en]"
                  @change="values => checkboxChange(item, values)"
                >
                  <a-checkbox
                    v-for="checkbox in item.values"
                    :key="checkbox.attributeValueId"
                    :value="checkbox.attributeValueId"
                  >
                    <span
                      class="color-box"
                      :style="{ background: checkbox.en }"
                    ></span>
                    <span
                      class="inline-block w-30 align-middle truncate"
                      :title="checkbox.zh"
                      >{{ checkbox.zh }}</span
                    >
                  </a-checkbox>
                </a-checkbox-group>
                <a-checkbox-group
                  v-else-if="item.en === 'Size'"
                  v-model:value="SKUAttributesForm[item.en]"
                  @change="values => checkboxChange(item, values)"
                >
                  <a-checkbox
                    v-for="checkbox in item.values"
                    :key="checkbox.attributeValueId"
                    :value="checkbox.attributeValueId"
                  >
                    <span
                      :title="getAttrLabel(checkbox)"
                      class="inline-block w-30 align-middle truncate"
                      >{{ getAttrLabel(checkbox) }}</span
                    >
                  </a-checkbox>
                </a-checkbox-group>
                <!-- 发货地 默认不展开 -->
                <template v-else-if="item.en === 'Ships From'">
                  <span>(<span style="color: #ec4339">非海外仓用户请勿勾选</span>) </span>
                  <a-button
                    type="link"
                    @click="shipsFromExpand = !shipsFromExpand"
                    >{{ shipsFromExpand ? '- 收起' : '+ 展开' }}</a-button
                  >
                  <a-checkbox-group
                    v-show="shipsFromExpand"
                    v-model:value="SKUAttributesForm[item.en]"
                    @change="values => checkboxChange(item, values)"
                  >
                    <a-checkbox
                      v-for="checkbox in item.values"
                      :key="checkbox.attributeValueId"
                      :value="checkbox.attributeValueId"
                    >
                      <span
                        :title="checkbox.name"
                        class="inline-block w-30 align-middle truncate"
                        >{{ checkbox.name }}</span
                      >
                    </a-checkbox>
                  </a-checkbox-group>
                </template>
                <a-checkbox-group
                  v-else
                  v-model:value="SKUAttributesForm[item.en]"
                  @change="values => checkboxChange(item, values)"
                >
                  <a-checkbox
                    v-for="checkbox in item.values"
                    :key="checkbox.attributeValueId"
                    :value="checkbox.attributeValueId"
                  >
                    <span
                      :title="checkbox.zh"
                      class="inline-block w-30 align-middle truncate"
                      >{{ checkbox.zh }}</span
                    >
                  </a-checkbox>
                </a-checkbox-group>
              </template>
              <a-input
                v-else
                v-model:value="item.attributeShowTypeValue"
                disabled
              ></a-input>
            </a-form-item>
            <!-- 可自定义名称或可自定义图片的, 展示编辑模块(表格) -->
            <a-table
              :key="'table-' + item.attributeId"
              v-if="SKUAttributesForm[item.en].length && (item.customizedName || item.customizedPic)"
              :ref="'table_' + item.en"
              bordered
              :data-source="SKUAttributesCache[item.en]"
              :columns="generateAttrTableColumns(item)"
              :pagination="false"
              class="ml-45 mb-4 w-fit"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.title === '自定义名称'">
                  <a-input
                    v-model:value="record.propertyValueDefinitionName"
                    @blur="setCustomizedName(record)"
                  ></a-input>
                </template>
                <template v-if="column.title === '自定义图片'">
                  <div
                    v-if="record.skuImage"
                    class="image"
                  >
                    <a-image
                      :src="record.skuImage"
                      width="60px"
                      height="60px"
                    />
                    <div class="image-panel">
                      <a-button
                        type="link"
                        danger
                        @click="remove(record)"
                        ><DeleteOutlined
                      /></a-button>
                    </div>
                  </div>
                  <DropdownOfImage
                    v-else
                    :account="sellerId"
                    :img-group-list="imgGroupList"
                    @submit="imgData => fillImgData(imgData, record)"
                  >
                    <a-button
                      type="link"
                      size="medium"
                      style="padding: 0 0 4px"
                      >选择图片<DownOutlined
                    /></a-button>
                  </DropdownOfImage>
                </template>
              </template>
            </a-table>
          </template>
        </a-form>
        <!-- 如果没选SKU属性 -->
        <template v-if="!SKUTableData.length">
          <a-form-item
            label="零售价格"
            name="productPrice"
          >
            <a-input-number
              v-model:value="form.productPrice"
              :min="0"
              :max="100000"
              :controls="false"
              :placeholder="currencyCode"
              class="w-30"
            ></a-input-number>
          </a-form-item>
          <a-form-item
            label="库存数量"
            name="skuStock"
          >
            <a-input-number
              v-model:value="form.skuStock"
              :min="0"
              :max="100000"
              :controls="false"
              class="w-30"
            ></a-input-number>
          </a-form-item>
          <a-form-item
            label="商品编码"
            name="skuCode"
          >
            <a-input
              v-model:value="form.skuCode"
              class="w-30"
            ></a-input>
          </a-form-item>
        </template>
      </a-form>

      <div
        v-if="SKUTableData.length"
        class="ml-45 w-2/3 text-end"
      >
        <!-- 批量填充按钮 -->
        <a-button
          type="primary"
          class="mb-2"
          @click="batchFillCol"
          >批量填充</a-button
        >
        <!-- SKU表 -->
        <a-table
          :data-source="SKUTableData"
          :columns="SKUTableColumns"
          :scroll="{ y: 800 }"
          ref="SKUTable"
          bordered
          :pagination="false"
        >
          <template #headerCell="{ column }">
            <template v-if="['skuPrice', 'ipmSkuStock', 'skuCode'].includes(column.key)">
              <template v-if="column.key === 'skuCode'">
                <a-input
                  v-model:value.trim="batchValue.skuCode"
                  :placeholder="column.title"
                ></a-input>
                <span class="ml-1">{{ column.title }}</span>
              </template>
              <template v-else>
                <a-input-number
                  v-model:value="batchValue[column.key]"
                  :min="0"
                  :max="99999"
                  :precision="column.key === 'ipmSkuStock' ? 0 : 2"
                  :controls="false"
                  :placeholder="column.title"
                  class="w-full"
                ></a-input-number>
                <span class="ml-1">{{ column.title }}</span>
              </template>
            </template>
            <template v-else>
              <div class="h-6"></div>
              <span class="ml-1">{{ column.title }}</span>
            </template>
          </template>

          <template #bodyCell="{ text, record, column }">
            <template v-if="!['skuPrice', 'ipmSkuStock', 'skuCode'].includes(column.key)">
              <a-popover v-if="getImageUrl(record, column.key)">
                <template #content>
                  <img
                    :src="getImageUrl(record, column.key)"
                    class="w-100 h-100"
                  />
                </template>
                <div class="attr-img">
                  <a-image
                    width="56px"
                    height="56px"
                    :src="getImageUrl(record, column.key)"
                  />
                </div>
              </a-popover>
              <span>{{ text || '--' }}</span>
            </template>
            <a-input-number
              v-else-if="column.key === 'skuPrice'"
              v-model:value="record[column.key]"
              :controls="false"
              :min="0.001"
              :max="70"
              :precision="3"
              @blur="toggleWholesale"
            ></a-input-number>
            <a-input
              v-else
              v-model:value="record[column.key]"
            ></a-input>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import DropdownOfImage from '@/components/dropdown-of-image/index.vue'
  import { listGroupApi } from '../../apis/media'
  import { UNIT_OPTIONS } from './config'
  import { useAliexpressPopProductStore } from '@/stores/aliexpress-pop-product'
  import { message, Modal } from 'ant-design-vue'
  import { DownOutlined, DeleteOutlined } from '@ant-design/icons-vue'

  export default {
    name: 'PriceAndStock',
    components: { DownOutlined, DeleteOutlined },
    data() {
      return {
        store: useAliexpressPopProductStore(),
        imgGroupList: [],
        UNIT_OPTIONS,
        SKUAttributeList: [],
        form: {
          productUnit: undefined,
          saleMode: '1', // 默认按件出售
          lotNum: undefined, // 按件: lotNum = 1; 打包: lotNum > 1;
          productPrice: undefined, // 商品零售价(默认价格)
          skuStock: 20000, // 库存
          skuCode: '', // SKU编码
          wholesale_check: false,
          wholesale_amount: undefined,
          wholesale_discount: undefined,
          reduceStrategy: 'payment_success_deduct'
        },
        SKUAttributesForm: {},
        SKUAttributesCache: {}, // 对选中的SKU变种值的tableData缓存 { key: [{}] }
        shipsFromExpand: false,
        rules: {
          productUnit: [{ required: true, message: '请选择计件单位', trigger: 'change' }],
          lotNum: [{ required: true, message: '请输入每包数量', trigger: 'blur' }],
          wholesale_amount: [{ required: true, message: '请输入购买数量', trigger: 'blur' }],
          wholesale_discount: [{ required: true, message: '请输入减免额度', trigger: 'blur' }],
          productPrice: [{ required: true, message: '请输入零售价', trigger: 'blur' }],
          skuStock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }]
        },
        saleModeOptions: [
          { label: '按件出售', value: '1' }, // packageType: false
          { label: '打包出售(价格按照包计算)', value: '2' } // packageType: true
        ],
        batchValue: {
          skuPrice: undefined,
          ipmSkuStock: undefined,
          skuCode: ''
        },
        SKUTableData: [], // SKU表数据
        isEdit: false,
        editCache: {}
      }
    },
    computed: {
      sellerId() {
        return this.store.sellerId
      },
      currencyCode() {
        return this.store.currencyCode
      },
      SKUList() {
        return this.store.SKUList
      },
      productDetail() {
        return this.store.productDetail
      },
      SKUTableColumns() {
        const columns = []
        for (const key in this.SKUAttributesCache) {
          if (this.SKUAttributesCache[key].length) {
            columns.push({ title: this.SKUAttributesCache[key][0].label, dataIndex: key, key })
          }
        }
        columns.push(
          ...[
            { title: `零售价 (${this.currencyCode})`, key: 'skuPrice' },
            { title: '批发价', key: 'skuDiscountPrice', dataIndex: 'skuDiscountPrice' },
            { title: '库存', key: 'ipmSkuStock' },
            { title: 'SKU编码', key: 'skuCode' }
          ]
        )

        return columns
      }
    },
    watch: {
      sellerId: {
        handler: function () {
          this.getImgGroup()
        }
      },
      SKUList: {
        handler: function (SKUList) {
          // 重置初始状态
          this.SKUAttributeList = []
          this.SKUTableData = []
          this.SKUAttributesForm = {}
          this.SKUAttributesCache = {}
          this.batchValue = {
            skuPrice: undefined,
            ipmSkuStock: undefined,
            skuCode: ''
          }

          SKUList.sort((a, b) => a.spec - b.spec)
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

          const checkboxList = SKUList.filter(item => item.attributeShowTypeValue === 'check_box')
          checkboxList.forEach(item => {
            this.SKUAttributesForm[item.en] = []
            this.SKUAttributesCache[item.en] = []
          })
          if (this.isEdit && this.editCache.SKUAttributesFormById) {
            checkboxList.forEach(item => {
              this.SKUAttributesForm[item.en] = this.editCache.SKUAttributesFormById[item.attributeId] || []

              if (this.editCache.SKUAttributesCacheById[item.attributeId]) {
                this.editCache.SKUAttributesCacheById[item.attributeId].forEach(obj => {
                  const val = item.values.find(val => val.attributeValueId === obj.propertyValueId)
                  this.SKUAttributesCache[item.en].push({
                    label: item.zh,
                    code: item.en,
                    value: val.zh,
                    propertyValueDefinitionName: obj.propertyValueDefinitionName,
                    skuImage: obj.skuImage,
                    attributeId: item.attributeId, // 属性id
                    id: val.attributeValueId // 属性值id
                  })
                })
              }
            })

            this.generateSKUTableData()
            this.SKUTableData.forEach(item => {
              // const SKUData = this.productDetail.aeopAeProductSKUs.find(SKU => SKU.id === item.uniqueId)
              const SKUData = this.productDetail.aeopAeProductSKUs.find(SKU => SKU.id.split(';').every(keyItem => item.uniqueId.includes(keyItem)) || SKU.id === '<none>')
              if (SKUData) {
                item.skuPrice = SKUData.skuPrice
                item.skuDiscountPrice = SKUData.skuDiscountPrice
                item.ipmSkuStock = SKUData.ipmSkuStock
                item.skuCode = SKUData.skuCode
                item.skuId = SKUData.skuId
                // item.barcode = SKUData.barcode
                // item.currencyCode = SKUData.currencyCode
                // item.eanCode = SKUData.eanCode
                // item.extParam = SKUData.extParam
                // item.grossWeight = SKUData.grossWeight
              } else {
                Modal.warning({ title: 'SKU 数据匹配失败, 请联系IT部检查' })
              }
            })

            // 编辑的赋值只作用一次, 避免影响可能存在的修改品类操作
            this.isEdit = false
          } else {
            // 在没有 SKU 属性时, 手动触发一下区域调价更新
            this.store.$patch(state => {
              state.SKUAttributesCache = this.SKUAttributesCache
              state.SKUTableData = this.SKUTableData
            })
          }
          this.SKUAttributeList = SKUList
        }
      },
      productDetail: {
        handler: function (detail) {
          if (Object.keys(detail).length === 0) return

          this.isEdit = true
          this.form.productUnit = String(detail.productUnit)
          this.form.saleMode = detail.lotNum === 1 ? '1' : '2'
          this.form.lotNum = detail.lotNum
          this.form.wholesale_check = Boolean(detail.bulkOrder && detail.bulkDiscount)
          this.form.wholesale_amount = detail.bulkOrder
          this.form.wholesale_discount = detail.bulkDiscount
          this.form.reduceStrategy = detail.reduceStrategy
          // 如果没有SKU
          if (detail.aeopAeProductSKUs.length === 1 && !detail.aeopAeProductSKUs[0].aeopSKUPropertyList) {
            this.form.productPrice = detail.aeopAeProductSKUs[0].skuPrice
            this.form.skuStock = detail.aeopAeProductSKUs[0].ipmSkuStock
            this.form.skuCode = detail.aeopAeProductSKUs[0].skuCode
          } else {
            // 如果填写了 SKU
            /**
             * SKUAttributesForm 和 SKUAttributesCache 不在 watch 里赋值, 避免被 mounted 覆盖
             * 以 skuPropertyId 为 key 组装成对象
             */
            const SKUAttributesFormById = {}
            const SKUAttributesCacheById = {}
            const skuPropertyIdList = detail.aeopAeProductSKUs[0].aeopSKUPropertyList.map(item => item.skuPropertyId)
            skuPropertyIdList.forEach(skuPropertyId => {
              detail.aeopAeProductSKUs.forEach(item => {
                const aeopSKUPropertyObj = item.aeopSKUPropertyList.find(attr => attr.skuPropertyId === skuPropertyId)
                if (SKUAttributesFormById[skuPropertyId]) {
                  if (!SKUAttributesFormById[skuPropertyId].includes(aeopSKUPropertyObj.propertyValueId)) {
                    SKUAttributesFormById[skuPropertyId].push(aeopSKUPropertyObj.propertyValueId)
                    SKUAttributesCacheById[skuPropertyId].push(aeopSKUPropertyObj)
                  }
                } else {
                  SKUAttributesFormById[skuPropertyId] = [aeopSKUPropertyObj.propertyValueId]
                  SKUAttributesCacheById[skuPropertyId] = [aeopSKUPropertyObj]
                }
              })
            })

            this.editCache = { SKUAttributesFormById, SKUAttributesCacheById }
          }
        },
        immediate: true
      }
    },
    methods: {
      // checkbox sku 尺寸属性显示的名称
      getAttrLabel(colorCheckbox) {
        if (colorCheckbox.valueTagsObj.size_model_value) {
          return `${colorCheckbox.zh} (${colorCheckbox.valueTagsObj.size_model_value})`
        } else {
          return colorCheckbox.zh
        }
      },
      getImgGroup() {
        listGroupApi({ sellerId: this.sellerId }).then(res => {
          if (res && res.code === 200) {
            this.imgGroupList = res.data.result.photoBankImageGroupList || []
          }
        })
      },
      // 生成已勾选属性表头
      generateAttrTableColumns(item) {
        const columns = [{ title: item.zh, dataIndex: 'value', width: 170 }]
        item.customizedName && columns.push({ title: '自定义名称', dataIndex: 'propertyValueDefinitionName', width: 170 })
        item.customizedPic && columns.push({ title: '自定义图片', dataIndex: 'skuImage', width: 170 })

        return columns
      },
      // 多选框变动响应
      checkboxChange(item, values) {
        if (values.length > this.SKUAttributesCache[item.en].length) {
          // 增加
          const oldVal = this.SKUAttributesCache[item.en].map(val => val.id)
          const addCheck = values.filter(id => !oldVal.includes(id))
          addCheck.forEach(id => {
            const val = item.values.find(val => val.attributeValueId === id)
            this.SKUAttributesCache[item.en].push({
              label: item.zh,
              code: item.en,
              value: val.zh,
              propertyValueDefinitionName: '',
              skuImage: '',
              attributeId: item.attributeId, // 属性id
              id: val.attributeValueId // 属性值id
            })
          })
        } else {
          // 移除
          this.SKUAttributesCache[item.en] = this.SKUAttributesCache[item.en].filter(val => values.includes(val.id))
        }

        this.generateSKUTableData()
      },

      // 递归生成的SKU全排列组合
      generateSKUTableData() {
        const SKUList = []
        // 取到勾选了值的变种
        const attrList = []
        for (const key in this.SKUAttributesCache) {
          if (this.SKUAttributesCache[key].length) {
            attrList.push(this.SKUAttributesCache[key])
          }
        }
        if (!attrList.length) {
          this.SKUTableData = []
        } else {
          // 旧的SKUList转map，方便下方的复用判断
          const prevSKUMap = this.SKUList2Map(this.SKUTableData)

          const loop = (rowIndex, prevOptions) => {
            const attrItem = attrList[rowIndex]

            if (attrItem.length === 0) {
              loop(rowIndex + 1, prevOptions)
              return
            }

            for (const option of attrItem) {
              const curOptions = prevOptions.concat(option)

              //判断如果是最后一层，那就是组合完整了，将结果收集到全局的容器里
              if (rowIndex === attrList.length - 1) {
                // 将SKU的选项值用'_'连接起来组成一个SKUKey
                const SKUKey = curOptions.map(({ value }) => value).join('_')
                const uniqueId = curOptions.map(({ attributeId, id }) => `${attributeId}:${id}`).join(';')
                // 如果改变前后的 SKUKey 相同，复用SKU数据,避免数据覆盖
                if (prevSKUMap[SKUKey]) {
                  SKUList.push({
                    ...prevSKUMap[SKUKey]
                  })
                } else {
                  const attrObj = {}
                  curOptions.forEach(attr => {
                    attrObj[attr.code] = attr.propertyValueDefinitionName ? `${attr.value}(${attr.propertyValueDefinitionName})` : attr.value
                  })
                  SKUList.push({
                    SKUKey,
                    uniqueId,
                    aeopSKUProperty: curOptions,
                    ...attrObj,
                    skuPrice: undefined, // 零售价
                    skuDiscountPrice: '', // 批发价 (not sure ? 促销价)
                    ipmSkuStock: 20000, // 库存
                    skuCode: '' // SKU编码
                  })
                }
              } else {
                loop(rowIndex + 1, curOptions)
              }
            }
          }

          // Genshin Impact START!
          loop(0, [])

          this.SKUTableData = SKUList
        }
        // 发送至区域调价
        this.store.$patch(state => {
          state.SKUAttributesCache = this.SKUAttributesCache
          state.SKUTableData = this.SKUTableData
        })
      },

      /**
       * @description SKU列表数据转map,方便映射查找，判断SKU数据对比复用
       * @param SKUList  SKU列表
       * @returns SKUKey做键, SKU数据做值的SKU查找映射
       */
      SKUList2Map(SKUList) {
        return SKUList.reduce((map, SKU) => {
          map[SKU.SKUKey] = SKU
          return map
        }, {})
      },
      // 设置自定义名称
      setCustomizedName(record) {
        this.SKUTableData.forEach(item => {
          const i = item.aeopSKUProperty.findIndex(property => property.id === record.id)
          if (i > -1) {
            item[record.code] = record.propertyValueDefinitionName ? `${record.value}(${record.propertyValueDefinitionName})` : record.value
          }
        })
      },
      // 图片
      fillImgData(imgData, record) {
        record.skuImage = imgData[0].url
      },
      remove(record) {
        record.skuImage = ''
      },
      // 获取 SKU 展示的图片
      getImageUrl(record, key) {
        const attr = record.aeopSKUProperty.find(item => item.code === key)
        if (attr && attr.skuImage) {
          return attr.skuImage
        } else {
          return ''
        }
      },
      // 批量填充
      batchFillCol() {
        const propList = ['skuPrice', 'ipmSkuStock', 'skuCode']
        propList.forEach(name => {
          if (this.batchValue[name] !== undefined && this.batchValue[name] !== '') {
            this.SKUTableData.forEach(item => {
              item[name] = this.batchValue[name]
            })
          }
        })

        this.toggleWholesale()

        this.batchValue = {
          skuPrice: undefined,
          ipmSkuStock: undefined,
          skuCode: ''
        }
      },
      // 切换是否批发
      toggleWholesale() {
        if (this.form.wholesale_check) {
          if (this.form.wholesale_discount) {
            this.SKUTableData.forEach(item => {
              item.skuDiscountPrice = item.skuPrice ? ((item.skuPrice * (100 - this.form.wholesale_discount)) / 100).toFixed(2) : ''
            })
          }
        } else {
          this.SKUTableData.forEach(item => {
            item.skuDiscountPrice = ''
          })
        }
      },
      async emitData({ looseValidate = false }) {
        if (looseValidate) {
          this.$refs.form.clearValidate()
          this.$refs.SKUAttributesForm.clearValidate()
        } else {
          let valid = true
          await this.$refs.form.validate().catch(err => {
            valid = false
          })
          let SKUAttrValid = true
          this.$refs.SKUAttributesForm.validate().catch(err => {
            SKUAttrValid = false
          })
          if (!valid || !SKUAttrValid) return
        }

        const { productUnit, reduceStrategy } = this.form
        let aeopAeProductSKUs = []
        if (this.SKUTableData.length) {
          aeopAeProductSKUs = this.SKUTableData.map(item => {
            const aeopSKUProperty = item.aeopSKUProperty.map(property => {
              return {
                propertyValueId: property.id,
                skuPropertyValue: property.value,
                propertyValueDefinitionName: property.propertyValueDefinitionName,
                skuPropertyId: property.attributeId,
                skuPropertyName: property.code,
                skuImage: property.skuImage && property.skuImage.replace('/prod-api', '')
              }
            })

            return {
              aeopSKUProperty,
              skuPrice: item.skuPrice,
              ipmSkuStock: item.ipmSkuStock,
              skuDiscountPrice: item.skuDiscountPrice,
              skuCode: item.skuCode,
              skuId: item.skuId || String(Math.random()).slice(3), // 保存到草稿时需要用到; 提交到速卖通后台该字段被忽略
              id: item.uniqueId || '<none>' // 保存到草稿时需要用到; 提交到速卖通后台该字段被忽略
            }
          })
        } else {
          aeopAeProductSKUs = [
            {
              skuPrice: this.form.productPrice,
              ipmSkuStock: this.form.skuStock,
              skuDiscountPrice: this.form.skuDiscountPrice,
              skuCode: this.form.skuCode,
              id: '<none>'
            }
          ]
        }
        return {
          currencyCode: this.currencyCode,
          productUnit,
          packageType: this.form.saleMode === '2',
          lotNum: this.form.saleMode === '1' ? 1 : this.form.lotNum,
          bulkOrder: this.form.wholesale_check ? this.form.wholesale_amount : undefined,
          bulkDiscount: this.form.wholesale_check ? this.form.wholesale_discount : undefined,
          reduceStrategy,
          aeopAeProductSKUs
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .price-and-stock {
    .wholesale-wrap {
      display: flex;
      .wholesale-text {
        margin: 4px 6px 0;
      }
    }

    .color-box {
      border: 1px solid #eee;
      display: inline-block;
      position: relative;
      top: 2px;
      width: 14px;
      height: 14px;
      margin-right: 4px;
      background: linear-gradient(45deg, transparent 0, transparent 49.5%, #ec4339 49.5%, #ec4339 50.5%, transparent 50.5%, transparent 100%);
    }

    .image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      position: relative;
      .image-panel {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(5, 5, 5, 0.3);
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
</style>
