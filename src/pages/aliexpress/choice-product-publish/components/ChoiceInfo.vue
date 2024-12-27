<template>
  <!-- 全托管信息 -->
  <div class="choice-info">
    <a-card
      :loading="SKUInfoLoading"
      title="变种信息"
      class="mb-4"
    >
      <div class="table-wrap">
        <!-- 批量填充按钮 -->
        <a-button
          type="primary"
          class="mb-2"
          @click="batchFillColWarehouse"
          >批量填充</a-button
        >
        <a-table
          :data-source="choiceProductData"
          :columns="SKUWarehouseHeader"
          :scroll="{ y: 800 }"
          bordered
          :pagination="false"
        >
          <template #headerCell="{ column }">
            <template v-if="['supplyPrice', 'sellableQuantity', 'skuCode', 'scItemCode', 'scItemBarCode', 'status'].includes(column.dataIndex)">
              <template v-if="column.dataIndex === 'supplyPrice'">
                <a-input-number
                  v-model:value="batchValueWarehouse[column.dataIndex]"
                  :controls="false"
                  :min="0.01"
                  :max="9999"
                  :precision="2"
                  :placeholder="channelInfo.channelCurrency"
                ></a-input-number>
                <div>
                  <span class="mr-1 required-dot">{{ column.title }}</span>
                  <a-popover>
                    <template #content>
                      <span>供货价并非前台零售价格，是提报给平台的批量供货价格。</span>
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'sellableQuantity'">
                <a-popover>
                  <template #content>
                    <template v-if="batchWarehouseList.length">
                      <div
                        v-for="warehouse in batchWarehouseList"
                        :key="warehouse.warehouseCode"
                        style="margin-bottom: 2px"
                      >
                        <span>{{ warehouse.warehouseName }}</span>
                        <a-input-number
                          v-model:value="warehouse.sellableQuantity"
                          :controls="false"
                          :min="0"
                          :max="99999"
                          :precision="0"
                          :placeholder="warehouse.warehouseName"
                          class="ml-1"
                        ></a-input-number>
                      </div>
                    </template>
                    <span v-else>请先选择店铺</span>
                  </template>
                  <a-button type="link">批量修改JIT库存</a-button>
                </a-popover>
                <div>
                  <span class="mr-1 required-dot">{{ column.title }}</span>
                  <a-popover>
                    <template #content>
                      <span>销售中的JIT商品，库存请在商品列表页进行调整，本页面不支持编辑。</span>
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'skuCode'">
                <a-input
                  v-model:value="batchValueWarehouse[column.dataIndex]"
                  :placeholder="column.title"
                ></a-input>
                <div>
                  <span class="mr-1">{{ column.title }}</span>
                  <a-popover>
                    <template #content>
                      <span>SKU编码请谨慎填写，建议与货品编码保持一致。如实物包装上的商品条形码；若无此编码，可以自行定义。</span>
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'scItemCode'">
                <a-input
                  v-model:value="batchValueWarehouse[column.dataIndex]"
                  :placeholder="column.title"
                ></a-input>
                <div>
                  <span class="mr-1">{{ column.title }}</span>
                  <a-popover>
                    <template #content>
                      <span>货品编码：商家ERP系统编码，商家可自行维护，等同SKU编码，如未维护系统会自动生成。</span>
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'scItemBarCode'">
                <a-input
                  v-model:value="batchValueWarehouse[column.dataIndex]"
                  :placeholder="column.title"
                ></a-input>
                <div>
                  <span class="mr-1">{{ column.title }}</span>
                  <a-popover :overlay-inner-style="{ width: '400px' }">
                    <template #content>
                      <span
                        >货品条码：用于货品出入库扫描，若商家货品有条码，可以维护在货品上，如没有条码，则系统使用货品ID当作您的条码。<br />
                        货品编码：商家ERP系统编码，商家可自行维护，等同SKU编码，如未维护系统会自动生成。</span
                      >
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'status'">
                <span class="mr-1">{{ column.title }}</span>
                <a-popover :overlay-inner-style="{ width: '400px' }">
                  <template #content>
                    <span
                      >不可销售：不提报该SKU商品，即使平台审核通过，也不会安排入仓，不会上架销售。该SKU商品供货价及商品信息仍需要正常填写，以免影响买家页面展示。<br />
                      可销售：提报该SKU商品，一旦平台审核通过，该SKU商品会安排入仓，并上架销售。</span
                    >
                  </template>
                  <InfoCircleOutlined />
                </a-popover>
              </template>
              <template v-else>
                <a-input
                  v-model:value="batchValueWarehouse[column.dataIndex]"
                  :placeholder="column.title"
                ></a-input>
                <div>
                  <span class="mr-1 required-dot">{{ column.title }}</span>
                </div>
              </template>
            </template>
          </template>

          <template #bodyCell="{ record, column }">
            <template v-if="!['supplyPrice', 'sellableQuantity', 'skuCode', 'scItemCode', 'scItemBarCode', 'status'].includes(column.dataIndex)">
              <a-popover v-if="getImageUrl(record, column.dataIndex)">
                <template #content>
                  <img
                    :src="getImageUrl(record, column.dataIndex)"
                    class="w-100 h-100"
                  />
                </template>
                <a-image
                  class="attr-img"
                  :src="getImageUrl(record, column.dataIndex)"
                />
              </a-popover>
              <span>{{ getLabel(record, column.dataIndex) }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'supplyPrice'">
              <a-input-number
                v-model:value="record[column.dataIndex]"
                :controls="false"
                :min="0.01"
                :max="9999"
                :precision="2"
                :placeholder="channelInfo.channelCurrency"
              ></a-input-number>
            </template>
            <template v-else-if="column.dataIndex === 'sellableQuantity'">
              <div
                v-for="warehouse in record.warehouseList"
                :key="warehouse.warehouseCode"
                class="sellable-quantity"
              >
                <span>{{ warehouse.warehouseName }}</span>
                <a-input-number
                  v-model:value="warehouse.sellableQuantity"
                  :controls="false"
                  :min="0"
                  :max="99999"
                  :precision="0"
                  :placeholder="warehouse.warehouseName"
                  class="ml-1"
                ></a-input-number>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-switch
                v-model:checked="record[column.dataIndex]"
                checked-children="是"
                un-checked-children="否"
                checked-value="active"
                un-checked-value="inactive"
              />
            </template>
            <a-input
              v-else
              v-model:value="record[column.dataIndex]"
              :placeholder="column.title"
            ></a-input>
          </template>
        </a-table>
      </div>
    </a-card>

    <a-card
      :loading="SKUInfoLoading"
      title="货品信息"
      class="mb-4"
    >
      <div class="table-wrap">
        <!-- 批量填充按钮 -->
        <a-button
          type="primary"
          class="mb-2"
          @click="batchFillColSKUInfo"
          >批量填充</a-button
        >
        <a-table
          :data-source="choiceProductData"
          :columns="productSKUHeader"
          :scroll="{ y: 800 }"
          bordered
          :pagination="false"
        >
          <template #headerCell="{ column }">
            <template v-if="['originalBox', 'packageWeight', 'packageSize', 'specialProductTypeList'].includes(column.dataIndex)">
              <template v-if="column.dataIndex === 'originalBox'">
                <a-select
                  v-model:value="batchValueSKUInfo[column.dataIndex]"
                  :options="originalBoxOption"
                  placeholder="请选择"
                >
                </a-select>
                <div>
                  <span class="mr-1 required-dot">{{ column.title }}</span>
                  <a-popover>
                    <template #content>
                      <span>确认仓库是否可以直接使用商品原包装发货。</span>
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'packageWeight'">
                <a-input-number
                  v-model:value="batchValueSKUInfo[column.dataIndex]"
                  :controls="false"
                  :min="0.001"
                  :max="70"
                  :precision="3"
                  placeholder="重量 (kg)"
                ></a-input-number>
                <div>
                  <span class="mr-1 required-dot">{{ column.title }}</span>
                  <a-popover>
                    <template #content>
                      <span>物流重量：请分SKU如实填写商品的重量,填写支持小数点后三位。</span>
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'packageSize'">
                <div class="package-size-wrap">
                  <a-input-number
                    v-model:value="batchValueSKUInfo.packageLength"
                    :controls="false"
                    :min="0.01"
                    :max="200"
                    :precision="2"
                    placeholder="长"
                  ></a-input-number>
                  <span class="divide">*</span>
                  <a-input-number
                    v-model:value="batchValueSKUInfo.packageWidth"
                    :controls="false"
                    :min="0.01"
                    :max="200"
                    :precision="2"
                    placeholder="宽"
                  ></a-input-number>
                  <span class="divide">*</span>
                  <a-input-number
                    v-model:value="batchValueSKUInfo.packageHeight"
                    :controls="false"
                    :min="0.01"
                    :max="200"
                    :precision="2"
                    placeholder="高"
                  ></a-input-number>
                </div>
                <div>
                  <span class="mr-1 required-dot">{{ column.title }}</span>
                  <a-popover>
                    <template #content>
                      <span>物流尺寸：请分SKU如实填写商品长宽高,填写支持小数点后两位。</span>
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'specialProductTypeList'">
                <a-select
                  v-model:value="batchValueSKUInfo[column.dataIndex]"
                  mode="multiple"
                  allow-clear
                  :options="productSupportSpecialType"
                  placeholder="请选择"
                  class="w-2/3"
                />
                <div>
                  <span class="mr-1">{{ column.title }}</span>
                  <a-popover :overlay-inner-style="{ width: '400px' }">
                    <template #content>
                      <span
                        >不选择默认普货。<br />
                        1.纯电及外置电池：纯电以及商品包装中带有未安装的外置电池，如充电宝、电池芯、电池组、电池模块、电池系统、电脑电池、手机电池、耳机充电盒（不含耳机）、电子烟充电盒（不含电子烟）、不间断电源、纽扣电池等。<br />
                        2. 内电：如平衡车（含锂电池）、电动滑板、电动踏板车、独轮车、电动扭扭车、电动童车、电动轮椅、手机等。<br />
                        3.弱磁（可走带电物流）：音响器材如音箱、耳机、喇叭等等，以及货品组件包含电容、电线圈、马达等电子元器件 <br />
                        4. 强磁（特货）：磁性材料，如磁铁、磁条等磁性物质<br />
                        5.
                        液体：含液体商品，如汽车修复液、粘合剂、香水、古龙水、药剂、洗洁精、纹身墨水、喷雾、化妆水、卸妆水、爽肤水、化妆乳液、化妆凝胶、化妆精华、头发定型胶、沐浴露、牙齿染色剂等各种液体<br />
                        6. 粉末：粉末状化妆品、散粉、粉饼等粉末状物质、足浴粉、沙袋蚀刻剂、沙漏、调味香料、粉笔、猫砂干燥剂、墨盒（墨胆）、硒鼓等。<br />
                        7. 膏体：眼影、胭脂、唇膏、睫毛膏、车蜡、肥皂、去角质剂、指甲胶、唇蜜、橡皮泥、膏状颜料、口红等。<br />
                        8. 管制刀具：刀尖角度小于60度，刀身长度超过150毫米的各类单刃、双刃和多刃刀具；其他刀尖角度大于60度，刀身长度超过220毫米的各类单刃、双刃和多刃刀具。</span
                      >
                    </template>
                    <InfoCircleOutlined />
                  </a-popover>
                </div>
              </template>
            </template>
          </template>

          <template #bodyCell="{ record, column }">
            <template v-if="!['originalBox', 'packageWeight', 'packageSize', 'specialProductTypeList'].includes(column.dataIndex)">
              <a-popover v-if="getImageUrl(record, column.dataIndex)">
                <template #content>
                  <img
                    :src="getImageUrl(record, column.dataIndex)"
                    class="w-100 h-100"
                  />
                </template>
                <a-image
                  class="attr-img"
                  :src="getImageUrl(record, column.dataIndex)"
                />
              </a-popover>
              <span>{{ getLabel(record, column.dataIndex) }}</span>
            </template>
            <a-select
              v-else-if="column.dataIndex === 'originalBox'"
              v-model:value="record[column.dataIndex]"
              :options="originalBoxOption"
              placeholder="请选择"
            >
            </a-select>
            <a-input-number
              v-else-if="column.dataIndex === 'packageWeight'"
              v-model:value="record[column.dataIndex]"
              :controls="false"
              :min="0.001"
              :max="70"
              :precision="3"
              placeholder="重量 (kg)"
            ></a-input-number>
            <div
              v-else-if="column.dataIndex === 'packageSize'"
              class="package-size-wrap"
            >
              <a-input-number
                v-model:value="record.packageLength"
                :controls="false"
                :min="0.01"
                :max="200"
                :precision="2"
                placeholder="长"
              ></a-input-number>
              <span class="divide">*</span>
              <a-input-number
                v-model:value="record.packageWidth"
                :controls="false"
                :min="0.01"
                :max="200"
                :precision="2"
                placeholder="宽"
              ></a-input-number>
              <span class="divide">*</span>
              <a-input-number
                v-model:value="record.packageHeight"
                :controls="false"
                :min="0.01"
                :max="200"
                :precision="2"
                placeholder="高"
              ></a-input-number>
            </div>
            <a-select
              v-else-if="column.dataIndex === 'specialProductTypeList'"
              v-model:value="record[column.dataIndex]"
              :options="productSupportSpecialType"
              mode="multiple"
              allow-clear
              placeholder="请选择"
              class="w-2/3"
            >
            </a-select>
            <a-input
              v-else
              v-model:value="record[column.dataIndex]"
            ></a-input>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import { SPECIAL_PRODUCT_TYPE_OPTIONS } from '../../choice-product/config'
  import { cloneDeep } from 'lodash'
  import { queryWarehouseCodeApi } from '../../apis/choice-product'
  import { useAliexpressChoiceProductStore } from '@/stores/aliexpress-choice-product'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'

  export default {
    name: 'ChoiceInfo',
    components: { InfoCircleOutlined },
    data() {
      return {
        store: useAliexpressChoiceProductStore(),
        warehouseList: [],
        productSupportSpecialType: SPECIAL_PRODUCT_TYPE_OPTIONS, // 当前商品支持的特殊类型
        specialTypeRequired: false, // 特殊商品是否必传
        SKUInfoLoading: false,
        choiceProductData: [],
        originalBoxOption: [
          { label: '是', value: '1' },
          { label: '否', value: '0' }
        ],
        // 货品信息批量填写的绑定值
        batchValueSKUInfo: {
          originalBox: undefined,
          packageWeight: undefined,
          packageLength: undefined,
          packageWidth: undefined,
          packageHeight: undefined,
          specialProductTypeList: []
        },
        // 变种信息批量填写的绑定值
        batchValueWarehouse: {
          supplyPrice: undefined,
          skuCode: '',
          scItemCode: '',
          scItemBarCode: ''
        },
        // 库存信息批量填写的绑定值
        batchWarehouseList: [],
        isEditAssign: false, // 是否为编辑赋值; 一次性
        isAllowAssign: true // 改变商家时, 是否运行赋值仓库编码; 一次性
      }
    },
    computed: {
      isEdit() {
        return this.store.isEdit
      },
      sellerId() {
        return this.store.sellerId
      },
      channelInfo() {
        return this.store.channelInfo
      },
      SKUTableData() {
        return this.store.SKUTableData
      },
      productDetail() {
        return this.store.productDetail
      },
      // 竖向合并相同值的单元格的依赖数据
      mergeColMap() {
        if (this.choiceProductData[0] && this.choiceProductData[0].skuPropertyList) {
          const skuPropertyList = this.choiceProductData[0].skuPropertyList
          const mapList = []
          skuPropertyList.forEach((attr, i) => {
            let count = 1
            for (let index = 1; index < this.choiceProductData.length; index++) {
              const { propertyValueId } = this.choiceProductData[index].skuPropertyList[i]
              if (propertyValueId === attr.propertyValueId) {
                count++
              } else {
                mapList.push(count)
                break
              }
            }
          })

          return mapList
        } else {
          return []
        }
      },
      // SKU 属性; 将合并单元格配置在这里
      attrList() {
        if (!this.choiceProductData[0] || !this.choiceProductData[0].skuPropertyList) return []

        const list = this.choiceProductData[0].skuPropertyList.map((item, i) => {
          return {
            title: item.label,
            dataIndex: item.skuPropertyName,
            fixed: true,
            customCell: (record, index) => ({
              rowSpan: index % this.mergeColMap[i] ? 0 : this.mergeColMap[i]
            })
          }
        })

        return list
      },
      // 货品信息表头
      productSKUHeader() {
        return [
          ...this.attrList,
          { title: '是否原箱', dataIndex: 'originalBox' }, // '1'-是; '0'-否
          { title: '重量 (kg)', dataIndex: 'packageWeight' },
          { title: '包装尺寸 (cm)', dataIndex: 'packageSize', width: 400 },
          { title: '特殊商品类型', dataIndex: 'specialProductTypeList', width: 240 }
        ]
      },
      // 变种信息表头
      SKUWarehouseHeader() {
        const supplyPriceLabel = this.channelInfo.channelCurrency ? `供货价 (${this.channelInfo.channelCurrency})` : '供货价'
        const list = [
          ...this.attrList,
          { title: supplyPriceLabel, dataIndex: 'supplyPrice' },
          { title: '库存', dataIndex: 'sellableQuantity', width: 300 },
          { title: 'SKU编码', dataIndex: 'skuCode' },
          { title: '货品编码', dataIndex: 'scItemCode' },
          { title: '货品条码', dataIndex: 'scItemBarCode' },
          { title: '申请销售', dataIndex: 'status', width: 100 }
        ]

        return this.isEdit && !this.productDetail.draftId ? list : list.filter(item => item.prop !== 'scItemCode')
      }
    },
    watch: {
      sellerId: function (sellerId) {
        if (!sellerId) return

        this.getWarehouseCode()
      },
      SKUTableData: {
        handler: function (newVal) {
          const SKUTableData = cloneDeep(newVal)
          const warehouseList = this.warehouseList.map(warehouse => ({
            ...warehouse,
            sellableQuantity: 20000
          }))
          if (SKUTableData.length) {
            // 旧的SKUList转map，方便下方的复用判断
            const prevSKUMap = this.SKUList2Map(this.choiceProductData)
            SKUTableData.forEach((item, i) => {
              // 如果改变前后的 SKUKey 相同，复用SKU数据,避免数据覆盖
              if (prevSKUMap[item.SKUKey]) {
                SKUTableData[i] = {
                  ...item,
                  supplyPrice: prevSKUMap[item.SKUKey].supplyPrice,
                  warehouseList: prevSKUMap[item.SKUKey].warehouseList,
                  skuCode: prevSKUMap[item.SKUKey].skuCode,
                  scItemCode: prevSKUMap[item.SKUKey].scItemCode,
                  scItemBarCode: prevSKUMap[item.SKUKey].scItemBarCode,
                  status: prevSKUMap[item.SKUKey].status,
                  originalBox: prevSKUMap[item.SKUKey].originalBox,
                  packageWeight: prevSKUMap[item.SKUKey].packageWeight,
                  packageLength: prevSKUMap[item.SKUKey].packageLength,
                  packageWidth: prevSKUMap[item.SKUKey].packageWidth,
                  packageHeight: prevSKUMap[item.SKUKey].packageHeight,
                  specialProductTypeList: prevSKUMap[item.SKUKey].specialProductTypeList
                }
              } else {
                SKUTableData[i] = {
                  ...item,
                  warehouseList,
                  skuCode: '',
                  scItemCode: '',
                  scItemBarCode: '',
                  status: 'active',
                  originalBox: undefined,
                  specialProductTypeList: []
                }
              }
            })
          } else {
            SKUTableData.push({
              warehouseList,
              skuCode: '',
              scItemCode: '',
              scItemBarCode: '',
              status: 'active',
              originalBox: undefined,
              specialProductTypeList: []
            })
          }
          this.choiceProductData = SKUTableData
          if (this.isEditAssign && Object.keys(this.productDetail).length !== 0) {
            this.choiceProductData.forEach(item => {
              const SKUData = this.productDetail.productSkuList.find(SKU => SKU.id === '<none>' || SKU.id.split(';').every(keyItem => item.uniqueId.includes(keyItem)))
              if (SKUData) {
                item.supplyPrice = SKUData.supplyPrice
                item.warehouseList = SKUData.warehouseList
                item.skuCode = SKUData.skuCode
                item.status = SKUData.status
                item.packageWeight = SKUData.packageWeight
                item.packageLength = SKUData.packageLength
                item.packageWidth = SKUData.packageWidth
                item.packageHeight = SKUData.packageHeight
                item.scItemCode = SKUData.scItemInfoDto.scItemCode
                item.scItemBarCode = SKUData.scItemInfoDto.scItemBarCode
                item.originalBox = SKUData.scItemInfoDto.originalBox
                item.specialProductTypeList = SKUData.scItemInfoDto.specialProductTypeList
              }
            })
            this.isEditAssign = false
          }
        },
        immediate: true,
        deep: true
      },
      productDetail: {
        handler: function (detail) {
          if (Object.keys(detail).length === 0) return

          if (detail.productSkuList.length === 1 && detail.productSkuList[0].id === '<none>') {
            // 品类下不存在 SKU 属性的, 在这里处理; (包含了未选 SKU 属性的数据, 但后面会被覆盖一次同样的值)
            const SKUData = detail.productSkuList[0]
            this.choiceProductData[0].supplyPrice = SKUData.supplyPrice
            this.choiceProductData[0].warehouseList = SKUData.warehouseList
            this.choiceProductData[0].skuCode = SKUData.skuCode
            this.choiceProductData[0].status = SKUData.status
            this.choiceProductData[0].packageWeight = SKUData.packageWeight
            this.choiceProductData[0].packageLength = SKUData.packageLength
            this.choiceProductData[0].packageWidth = SKUData.packageWidth
            this.choiceProductData[0].packageHeight = SKUData.packageHeight
            this.choiceProductData[0].scItemCode = SKUData.scItemInfoDto.scItemCode
            this.choiceProductData[0].scItemBarCode = SKUData.scItemInfoDto.scItemBarCode
            this.choiceProductData[0].originalBox = SKUData.scItemInfoDto.originalBox
            this.choiceProductData[0].specialProductTypeList = SKUData.scItemInfoDto.specialProductTypeList
          }
          this.isEditAssign = true
          this.isAllowAssign = false
        }
      }
    },
    methods: {
      // 获取商家仓库编码
      getWarehouseCode() {
        this.warehouseList = []
        queryWarehouseCodeApi({ sellerId: this.sellerId })
          .then(res => {
            this.warehouseList = res.data.warehouseList || []
            this.batchWarehouseList = this.warehouseList.map(item => {
              return {
                ...item,
                sellableQuantity: undefined
              }
            })
          })
          .catch(err => {})
          .finally(() => {
            if (this.isAllowAssign) {
              const warehouseList = this.warehouseList.map(warehouse => ({
                ...warehouse,
                sellableQuantity: 20000
              }))
              this.choiceProductData = [
                {
                  warehouseList,
                  skuCode: '',
                  scItemCode: '',
                  scItemBarCode: '',
                  status: 'active',
                  originalBox: undefined,
                  specialProductTypeList: []
                }
              ]
            } else {
              this.isAllowAssign = true
            }
          })
      },
      /**
       * @description SKU列表数据转map,方便映射查找，判断SKU数据对比复用
       * @param SKUList  SKU列表
       * @returns SKUKey做键, SKU数据做值的SKU查找映射
       */
      SKUList2Map(SKUList) {
        return SKUList.reduce((map, SKU) => {
          SKU.SKUKey && (map[SKU.SKUKey] = SKU)
          return map
        }, {})
      },
      // 获取 SKU 展示的图片
      getImageUrl(record, prop) {
        const attr = record.skuPropertyList.find(item => item.skuPropertyName === prop)
        if (attr && attr.skuImage) {
          return attr.skuImage
        } else {
          return ''
        }
      },
      // 获取 SKU 展示的属性值
      getLabel(record, prop) {
        const attr = record.skuPropertyList.find(item => item.skuPropertyName === prop)
        if (attr) {
          return attr.propertyValueDefinitionName ? `${attr.skuPropertyValue} (${attr.propertyValueDefinitionName})` : attr.skuPropertyValue
        } else {
          return '--'
        }
      },
      // 批量填充
      batchFillColSKUInfo() {
        const propList = Object.keys(this.batchValueSKUInfo)
        propList.forEach(prop => {
          // 非空
          let nonEmpty = true
          // 这么写是为了少走一些判断逻辑
          if (Array.isArray(this.batchValueSKUInfo[prop]) && this.batchValueSKUInfo[prop].length === 0) {
            nonEmpty = false
          } else if (this.batchValueSKUInfo[prop] === undefined || this.batchValueSKUInfo[prop] === '') {
            nonEmpty = false
          }

          if (nonEmpty) {
            this.choiceProductData.forEach(item => {
              item[prop] = this.batchValueSKUInfo[prop]
            })
          }
        })

        this.batchValueSKUInfo = {
          originalBox: undefined,
          packageWeight: undefined,
          packageLength: undefined,
          packageWidth: undefined,
          packageHeight: undefined,
          specialProductTypeList: []
        }
      },
      batchFillColWarehouse() {
        const propList = Object.keys(this.batchValueWarehouse)
        propList.forEach(prop => {
          // 非空
          let nonEmpty = true
          // 这么写是为了少走一些判断逻辑
          if (Array.isArray(this.batchValueWarehouse[prop]) && this.batchValueWarehouse[prop].length === 0) {
            nonEmpty = false
          } else if (this.batchValueWarehouse[prop] === undefined || this.batchValueWarehouse[prop] === '') {
            nonEmpty = false
          }

          if (nonEmpty) {
            this.choiceProductData.forEach(item => {
              item[prop] = this.batchValueWarehouse[prop]
            })
          }
        })

        this.batchValueWarehouse = {
          supplyPrice: undefined,
          skuCode: '',
          scItemCode: '',
          scItemBarCode: ''
        }

        // 管库存的
        this.choiceProductData.forEach(item => {
          item.warehouseList.forEach((warehouse, i) => {
            if (this.batchWarehouseList[i].sellableQuantity !== undefined) {
              warehouse.sellableQuantity = this.batchWarehouseList[i].sellableQuantity
            }
          })
        })
        this.batchWarehouseList.forEach(item => {
          item.sellableQuantity = undefined
        })
      },
      // 生成提交参数的公共部分
      generateCommonParams(needValidate) {
        if (needValidate) {
          // 必填校验
          const requiredEnum = {
            originalBox: '是否原箱',
            packageWeight: '重量',
            packageLength: '包装长度',
            packageWidth: '包装宽度',
            packageHeight: '包装高度',
            supplyPrice: '供货价'
          }
          for (const key in requiredEnum) {
            if (this.choiceProductData.some(item => item[key] === '' || item[key] === undefined)) {
              message.warning(`请填写: ${requiredEnum[key]}`)
              return
            }
          }
          // 库存
          const hasSellableQuantityEmpty = this.choiceProductData.some(item => item.warehouseList.some(warehouse => warehouse.sellableQuantity === undefined))
          if (hasSellableQuantityEmpty) {
            message.warning(`请填写: 库存`)
            return
          }
          // 特殊商品类型 特殊判断
          if (this.specialTypeRequired) {
            if (this.choiceProductData.some(item => item.specialProductTypeList.length === 0)) {
              message.warning('请填写: 特殊商品类型')
              return
            }
          }
        }

        const productSkuList = this.choiceProductData.map(item => {
          return {
            id: item.uniqueId || '<none>', // 保存到草稿时需要用到; 提交到速卖通后台该字段被忽略
            skuCode: item.skuCode,
            supplyPrice: item.supplyPrice,
            status: item.status,
            packageWeight: item.packageWeight,
            packageLength: item.packageLength,
            packageWidth: item.packageWidth,
            packageHeight: item.packageHeight,
            skuPropertyList: item.skuPropertyList || [],
            scItemInfoDto: {
              scItemCode: this.isEdit ? item.scItemCode : undefined,
              scItemBarCode: item.scItemBarCode,
              specialProductTypeList: item.specialProductTypeList,
              originalBox: item.originalBox
              // scItemId: ''
            },
            warehouseList: item.warehouseList
          }
        })

        return {
          productSkuList
        }
      },
      // 向上级提交数据
      emitData({ isDraft = false }) {
        return this.generateCommonParams(true)
      }
    }
  }
</script>

<style lang="less" scoped>
  .choice-info {
    position: relative;
    .table-wrap {
      margin-left: 180px;
      width: 66%;
      text-align: end;
    }
    .required-dot::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    .sellable-quantity {
      margin-bottom: 2px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .package-size-wrap {
      display: flex;
    }
    .attr-img {
      width: 56px;
      height: 56px;
      border: 1px solid #ccc;
      margin-right: 8px;
      vertical-align: middle;
    }
    .divide {
      margin: 5px 5px 0;
    }
  }
</style>
