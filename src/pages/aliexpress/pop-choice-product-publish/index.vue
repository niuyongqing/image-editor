<!-- 半托管产品编辑 -->
<template>
  <div class="pop-choice-product-publish text-left">
    <a-space class="mb-3 pr-4 w-full justify-end">
      <a-button
        :loading="draftSaveLoading"
        @click="backToProductEdit"
        >返回商品编辑</a-button
      >
      <!-- 编辑时就没有保存草稿了 -->
      <a-button
        v-if="!isEdit"
        type="primary"
        ghost
        :loading="draftSaveLoading"
        @click="saveDraft"
        >保存草稿</a-button
      >
      <a-button
        type="primary"
        :loading="saveLoading"
        @click="submit"
        >提 交</a-button
      >
    </a-space>

    <a-card
      title="参与国家/地区"
      class="mb-4"
    >
      <p class="text-gray">在商品成功加入半托管服务后，国家/地区可以自行选择</p>
      <a-checkbox
        :indeterminate="isIndeterminate"
        v-model:checked="checkAll"
        :disabled="!isEdit"
        @change="handleCheckAllChange"
        >全选</a-checkbox
      >
      <a-spin :spinning="countryLoading">
        <a-checkbox-group
          v-model:value="joinedCountryList"
          :disabled="!isEdit"
          @change="handleCheckedCountriesChange"
        >
          <a-checkbox
            v-for="item in countryList"
            :key="item.countryCode"
            :value="item.countryCode"
            ><span
              :title="item.cnName"
              class="inline-block w-30 align-middle truncate"
              >{{ item.cnName }}</span
            ></a-checkbox
          >
        </a-checkbox-group>
      </a-spin>
    </a-card>

    <a-card
      :loading="SKUInfoLoading"
      title="货品信息"
      class="mb-4"
    >
      <div
        v-if="attrList.length"
        class="w-2/3 text-end"
      >
        <!-- 批量填充按钮 -->
        <a-button
          type="primary"
          class="mb-2"
          @click="batchFillColSKUInfo"
          >批量填充</a-button
        >
        <a-table
          :data-source="popChoiceProductData"
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
                  <span class="mx-1">*</span>
                  <a-input-number
                    v-model:value="batchValueSKUInfo.packageWidth"
                    :controls="false"
                    :min="0.01"
                    :max="200"
                    :precision="2"
                    placeholder="宽"
                  ></a-input-number>
                  <span class="mx-1">*</span>
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
              <a-popover
                v-if="getImageUrl(record, column.dataIndex)"
                placement="right"
              >
                <template #content>
                  <img
                    :src="getImageUrl(record, column.dataIndex)"
                    class="w-100 h-100"
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
              <span class="ml-2">{{ getLabel(record, column.dataIndex) }}</span>
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
              <span class="mx-1">*</span>
              <a-input-number
                v-model:value="record.packageWidth"
                :controls="false"
                :min="0.01"
                :max="200"
                :precision="2"
                placeholder="宽"
              ></a-input-number>
              <span class="mx-1">*</span>
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

    <a-card
      :loading="SKUInfoLoading"
      title="变种信息"
    >
      <div
        v-if="attrList.length"
        class="w-2/3 text-end"
      >
        <!-- 批量填充按钮 -->
        <a-button
          type="primary"
          style="margin-bottom: 8px"
          @click="batchFillColWarehouse"
          >批量填充</a-button
        >
        <a-table
          :data-source="popChoiceProductData"
          :columns="SKUWarehouseHeader"
          :scroll="{ y: 800 }"
          bordered
          :pagination="false"
        >
          <template #headerCell="{ column }">
            <template v-if="['basePrice', 'sellableQuantity', 'skuCode', 'scItemCode', 'scItemBarCode', 'status'].includes(column.dataIndex)">
              <template v-if="column.dataIndex === 'basePrice'">
                <a-input-number
                  v-model:value="batchValueWarehouse[column.dataIndex]"
                  :controls="false"
                  :min="0.01"
                  :max="9999"
                  :precision="2"
                  :placeholder="currencyCode"
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
                <a-input-number
                  v-model:value="batchValueWarehouse[column.dataIndex]"
                  :controls="false"
                  :min="0"
                  :max="99999"
                  :precision="0"
                  :placeholder="warehouseName"
                  class="ml-1"
                ></a-input-number>
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
            <template v-if="!['basePrice', 'sellableQuantity', 'skuCode', 'scItemCode', 'scItemBarCode', 'status'].includes(column.dataIndex)">
              <a-popover
                v-if="getImageUrl(record, column.dataIndex)"
                placement="right"
              >
                <template #content>
                  <img
                    :src="getImageUrl(record, column.dataIndex)"
                    class="w-100 h-100"
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
              <span class="ml-2">{{ getLabel(record, column.dataIndex) }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'basePrice'">
              <a-input-number
                v-model:value="record[column.dataIndex]"
                :controls="false"
                :min="0.01"
                :max="9999"
                :precision="2"
                :placeholder="currencyCode"
              ></a-input-number>
            </template>
            <template v-else-if="column.dataIndex === 'sellableQuantity'">
              <a-input-number
                v-model:value="record.sellableQuantity"
                :controls="false"
                :min="0"
                :max="99999"
                :precision="0"
                :placeholder="warehouseName"
              ></a-input-number>
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
  </div>
</template>

<script>
  import { SPECIAL_PRODUCT_TYPE_OPTIONS } from '../pop-choice-product/config'
  import { getSellerInfoApi } from '../apis/common'
  import { popChoiceInfoApi, SKUInfoApi, detailApi, getPopChoiceProductApi, draftSaveApi, popChoiceProductSaveApi, editApi } from '../apis/pop-choice-product'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'

  export default {
    name: 'PopChoiceProductPublish',
    components: { InfoCircleOutlined },
    data() {
      return {
        isEdit: false,
        params: {},
        categoryId: '',
        currencyCode: '',
        countryLoading: false,
        countryList: [],
        checkAll: false,
        isIndeterminate: true, // 只负责控制老大的样式
        joinedCountryList: [],
        warehouseList: [],
        productSupportSpecialType: [], // 当前商品支持的特殊类型
        specialTypeRequired: false, // 特殊商品是否必传
        SKUInfoLoading: false,
        popChoiceProductData: [],
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
          basePrice: undefined,
          sellableQuantity: undefined,
          skuCode: '',
          scItemCode: '',
          scItemBarCode: ''
        },
        draftSaveLoading: false,
        saveLoading: false
      }
    },
    computed: {
      // 竖向合并相同值的单元格的依赖数据
      mergeColMap() {
        if (this.popChoiceProductData[0] && this.popChoiceProductData[0].skuPropertyList) {
          const skuPropertyList = this.popChoiceProductData[0].skuPropertyList
          const mapList = []
          skuPropertyList.forEach((attr, i) => {
            let count = 1
            for (let index = 1; index < this.popChoiceProductData.length; index++) {
              const { propertyValueIdLong } = this.popChoiceProductData[index].skuPropertyList[i]
              if (propertyValueIdLong === attr.propertyValueIdLong) {
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
      // SKU 属性
      attrList() {
        if (!this.popChoiceProductData[0] || !this.popChoiceProductData[0].skuPropertyList) return []

        const list = this.popChoiceProductData[0].skuPropertyList.map((item, i) => {
          return {
            title: item.skuPropertyName, // 中文属性名没有啊
            dataIndex: item.skuPropertyName,
            fixed: 'left',
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
        return [
          ...this.attrList,
          { title: '商品价格(不含物流费)', dataIndex: 'basePrice' },
          { title: '半托管-JIT库存', dataIndex: 'sellableQuantity' },
          { title: 'SKU编码', dataIndex: 'skuCode' },
          { title: '货品编码', dataIndex: 'scItemCode' },
          { title: '货品条码', dataIndex: 'scItemBarCode' }
        ]
      },
      // JIT 仓库名
      warehouseName() {
        if (this.warehouseList[0]) {
          return this.warehouseList[0].warehouseName
        } else {
          return 'JIT库存'
        }
      },
      warehouseCode() {
        if (this.warehouseList[0]) {
          return this.warehouseList[0].warehouseCode
        } else {
          return ''
        }
      }
    },
    watch: {},
    mounted() {
      const { query } = this.$route
      this.params = {
        sellerId: query.sellerId,
        productId: query.productId
      }
      this.isEdit = query.isEdit === 'true'
      // 拿 currencyCode
      this.getSellerInfo()
      // 半托管基本信息
      this.getPopChoiceInfo()
      this.getSKUInfo()
    },
    methods: {
      // 获取商家信息
      getSellerInfo() {
        getSellerInfoApi({ sellerId: this.params.sellerId }).then(res => {
          this.currencyCode = res.data.profile.quotationCurrency
        })
      },
      // 获取商家半托管基本信息
      getPopChoiceInfo() {
        this.countryLoading = true
        popChoiceInfoApi(this.params)
          .then(res => {
            this.countryList = res.data.result.popChoiceCountryList || []
            this.warehouseList = res.data.result.popChoiceWarehouseList || []
            const specialTypeList = res.data.productSupportSpecialType || []
            this.productSupportSpecialType = SPECIAL_PRODUCT_TYPE_OPTIONS.filter(item => specialTypeList.includes(+item.value))
            this.specialTypeRequired = res.data.specialTypeTequired

            // 新增时全选国家/地区
            if (!this.isEdit) {
              this.checkAll = true
              this.joinedCountryList = this.countryList.map(item => item.countryCode)
              this.isIndeterminate = false
            }
          })
          .catch(() => {
            this.countryLoading = false
          })
      },
      // 获取 SKU 信息
      getSKUInfo() {
        this.SKUInfoLoading = true
        SKUInfoApi(this.params)
          .then(res => {
            this.categoryId = res.data.result.popChoiceProduct.categoryId
            const productSkuList = res.data.result.popChoiceProduct.productSkuList || []
            // type [number, multiple-select] will find its way
            // 赋初始值
            productSkuList.forEach(item => {
              item.originalBox = ''
              item.scItemCode = ''
              item.scItemBarCode = ''
              item.sellableQuantity = 20000
            })
            this.popChoiceProductData = productSkuList
            // 结构搭好了再填充数据
            if (this.isEdit) {
              this.getDetail()
            } else {
              this.getDraftDetail()
            }
          })
          .catch(() => {
            this.SKUInfoLoading = false
          })
      },
      getDraftDetail() {
        getPopChoiceProductApi(this.params)
          .then(res => {
            if (res.data) {
              const { joinedCountryList = [], productSkuList = [] } = res.data.result.popChoiceProduct
              this.joinedCountryList = joinedCountryList
              this.popChoiceProductData.forEach(item => {
                const SKU = productSkuList.find(SKU => SKU.skuId === item.skuId)
                if (SKU) {
                  item.originalBox = SKU.popChoiceProductSkuScItemInfo.originalBox
                  item.specialProductTypeList = SKU.popChoiceProductSkuScItemInfo.specialProductTypeList || []
                  item.scItemCode = SKU.popChoiceProductSkuScItemInfo.scItemCode
                  item.scItemBarCode = SKU.popChoiceProductSkuScItemInfo.scItemBarCode
                  item.packageWeight = SKU.packageWeight ?? undefined
                  item.packageLength = SKU.packageLength ?? undefined
                  item.packageWidth = SKU.packageWidth ?? undefined
                  item.packageHeight = SKU.packageHeight ?? undefined
                  item.skuCode = SKU.skuCode
                  item.basePrice = SKU.basePrice ?? undefined
                  item.sellableQuantity = SKU.popChoiceSkuWarehouseStockList[0].sellableQuantity ?? undefined
                }
              })
            }
          })
          .finally(() => {
            this.countryLoading = false
            this.SKUInfoLoading = false
          })
      },
      getDetail() {
        detailApi(this.params)
          .then(res => {
            if (res.data) {
              const { joinedCountryList = [], productSkuList = [] } = res.data.result.popChoiceProduct
              this.joinedCountryList = joinedCountryList
              this.popChoiceProductData.forEach(item => {
                const SKU = productSkuList.find(SKU => SKU.skuId === item.skuId)
                if (SKU) {
                  item.originalBox = SKU.popChoiceProductSkuScItemInfo.originalBox
                  item.specialProductTypeList = SKU.popChoiceProductSkuScItemInfo.specialProductTypeList || []
                  item.scItemCode = SKU.popChoiceProductSkuScItemInfo.scItemCode
                  item.scItemBarCode = SKU.popChoiceProductSkuScItemInfo.scItemBarCode
                  item.packageWeight = SKU.packageWeight ?? undefined
                  item.packageLength = SKU.packageLength ?? undefined
                  item.packageWidth = SKU.packageWidth ?? undefined
                  item.packageHeight = SKU.packageHeight ?? undefined
                  item.skuCode = SKU.skuCode
                  item.basePrice = SKU.basePrice ?? undefined
                  item.sellableQuantity = SKU.popChoiceSkuWarehouseStockList[0].sellableQuantity ?? undefined
                }
              })
            }
          })
          .finally(() => {
            this.countryLoading = false
            this.SKUInfoLoading = false
          })
      },
      handleCheckAllChange(e) {
        this.joinedCountryList = e.target.checked ? this.countryList.map(item => item.countryCode) : []
        this.isIndeterminate = false
      },
      handleCheckedCountriesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.countryList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.countryList.length
      },
      // 获取 SKU 展示的图片
      getImageUrl(row, prop) {
        const attr = row.skuPropertyList.find(item => item.skuPropertyName === prop)
        if (attr && attr.skuImage) {
          return attr.skuImage
        } else {
          return ''
        }
      },
      // 获取 SKU 展示的属性值
      getLabel(row, prop) {
        const attr = row.skuPropertyList.find(item => item.skuPropertyName === prop)
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
            this.popChoiceProductData.forEach(item => {
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
            this.popChoiceProductData.forEach(item => {
              item[prop] = this.batchValueWarehouse[prop]
            })
          }
        })

        this.batchValueWarehouse = {
          basePrice: undefined,
          sellableQuantity: undefined,
          skuCode: '',
          scItemCode: '',
          scItemBarCode: ''
        }
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
            basePrice: '商品价格',
            sellableQuantity: '半托管-JIT库存'
          }
          for (const key in requiredEnum) {
            if (this.popChoiceProductData.some(item => item[key] === '' || item[key] === undefined)) {
              this.$message.warning(`请填写: ${requiredEnum[key]}`)
              return
            }
          }
          // 特殊商品类型 特殊判断
          if (this.specialTypeRequired) {
            if (this.popChoiceProductData.some(item => item.specialProductTypeList.length === 0)) {
              this.$message.warning('请填写: 特殊商品类型')
              return
            }
          }
        }

        const productSkuList = this.popChoiceProductData.map(item => {
          return {
            skuId: item.skuId,
            skuCode: item.skuCode,
            basePrice: item.basePrice,
            packageWeight: item.packageWeight,
            packageLength: item.packageLength,
            packageWidth: item.packageWidth,
            packageHeight: item.packageHeight,
            skuPropertyList: item.skuPropertyList,
            popChoiceProductSkuScItemInfo: {
              scItemCode: item.scItemCode,
              scItemBarCode: item.scItemBarCode,
              specialProductTypeList: item.specialProductTypeList,
              originalBox: item.originalBox
            },
            popChoiceSkuWarehouseStockList: [
              {
                sellableQuantity: item.sellableQuantity,
                warehouseCode: this.warehouseCode
              }
            ]
          }
        })
        const key = needValidate ? (this.isEdit ? 'productId' : 'draftId') : 'productId'
        const popChoiceProduct = {
          [key]: this.params.productId,
          categoryId: this.categoryId,
          currencyCode: this.currencyCode,
          joinedCountryList: this.joinedCountryList,
          productSkuList
        }
        return {
          sellerId: this.params.sellerId,
          popChoiceProduct
        }
      },
      // 返回商品编辑
      backToProductEdit() {
        this.$router.push({
          path: '/platform/aliexpress/pop-product-publish',
          query: this.params
        })
      },
      // 保存草稿
      saveDraft() {
        const params = this.generateCommonParams(false)

        this.draftSaveLoading = true
        draftSaveApi(params)
          .then(_ => {
            this.$message.success('保存成功')
          })
          .finally(() => {
            this.draftSaveLoading = false
          })
      },
      // 提交
      submit() {
        const params = this.generateCommonParams(true)
        if (!params) return

        this.saveLoading = true
        const requestApi = this.isEdit ? editApi : popChoiceProductSaveApi
        requestApi(params)
          .then(_ => {
            this.$message.success('提交成功')
          })
          .finally(() => {
            this.saveLoading = false
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  .required-dot::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
</style>
