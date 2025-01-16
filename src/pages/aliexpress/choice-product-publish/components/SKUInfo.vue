<template>
  <a-card
    title="SKU信息"
    class="sku-info mb-4"
  >
    <a-form
      :model="form"
      :rules="rules"
      ref="form"
      :label-col="{ style: { width: '180px' } }"
    >
      <a-form-item
        label="计件单位"
        name="productUnit"
      >
        <a-select
          v-model:value="form.productUnit"
          :options="UNIT_OPTIONS"
          show-search
          option-filter-prop="label"
          placeholder="请选择计件单位"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="销售方式"
        name="saleMode"
      >
        <a-select
          v-model:value="form.saleMode"
          :options="saleModeOptions"
        >
        </a-select>
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
            :label="item.zh"
            :name="item.en"
          >
            <template v-if="item.attributeShowTypeValue === 'check_box'">
              <!-- 多选框内有不同的属性, 各自处理 -->
              <a-checkbox-group
                v-if="item.en === 'Color'"
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
                    :title="checkbox.zh"
                    class="inline-block w-30 align-middle truncate"
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
                <span>(<span class="text-[#ec4339]">非海外仓用户请勿勾选</span>) </span>
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
              <template v-if="column.title === item.zh">
                <span>{{ record.skuPropertyValueName }}</span>
              </template>
              <template v-if="column.title === '自定义名称'">
                <a-input
                  v-model:value="record.propertyValueDefinitionName"
                  @change="setCustomizedName(record)"
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
    </a-form>
  </a-card>
</template>

<script>
  import DropdownOfImage from '@/components/dropdown-of-image/index.vue'
  import { cloneDeep } from 'lodash'
  import { listGroupApi } from '../../apis/media'
  import { UNIT_OPTIONS } from './config'
  import { useAliexpressChoiceProductStore } from '@/stores/aliexpress-choice-product'
  import { DownOutlined, DeleteOutlined } from '@ant-design/icons-vue'

  export default {
    name: 'SKUInfo',
    components: { DownOutlined, DeleteOutlined },
    data() {
      return {
        store: useAliexpressChoiceProductStore(),
        UNIT_OPTIONS,
        imgGroupList: [],
        SKUAttributeList: [],
        form: {
          productUnit: undefined,
          saleMode: '1', // 默认按件出售
          lotNum: undefined // 按件: lotNum = 1; 打包: lotNum > 1;
        },
        SKUAttributesForm: {},
        SKUAttributesCache: {}, // 对选中的SKU变种值的tableData缓存 { key: [{}] }
        shipsFromExpand: false,
        rules: {
          productUnit: [{ required: true, message: '请选择计件单位', trigger: 'change' }],
          lotNum: [{ required: true, message: '请输入每包数量', trigger: 'blur' }]
        },
        saleModeOptions: [
          { label: '按件出售', value: '1' }, // packageType: false
          { label: '打包出售(价格按照包计算)', value: '2' } // packageType: true
        ],
        SKUTableData: [], // SKU表数据
        isEditAssign: false,
        editCache: {}
      }
    },
    computed: {
      sellerId() {
        return this.store.sellerId
      },
      SKUList() {
        return this.store.SKUList
      },
      productDetail() {
        return this.store.productDetail
      }
    },
    watch: {
      sellerId: {
        handler: function (sellerId) {
          if (!sellerId) return

          this.getImgGroup()
        }
      },
      // 选择分类后获取到的 SKU 属性列表
      SKUList: {
        handler: function (newVal) {
          // 重置初始状态
          this.SKUAttributeList = []
          this.SKUTableData = []

          const SKUList = cloneDeep(newVal)
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
          if (this.isEditAssign) {
            if (this.productDetail.productSkuList[0].skuPropertyList) {
              checkboxList.forEach(item => {
                this.SKUAttributesForm[item.en] = this.editCache.SKUAttributesFormById[item.attributeId] || []

                if (this.editCache.SKUAttributesCacheById[item.attributeId]) {
                  this.editCache.SKUAttributesCacheById[item.attributeId].forEach(obj => {
                    const val = item.values.find(val => val.attributeValueId === obj.propertyValueId)
                    this.SKUAttributesCache[item.en].push({
                      label: item.zh,
                      skuPropertyName: item.en,
                      skuPropertyValueName: val.zh,
                      skuPropertyValue: val.en,
                      propertyValueDefinitionName: obj.propertyValueDefinitionName,
                      skuImage: obj.skuImage,
                      skuPropertyId: item.attributeId, // 属性id
                      propertyValueId: val.attributeValueId // 属性值id
                    })
                  })
                }
              })

              this.generateSKUTableData()
            }
            // 编辑的赋值只作用一次, 避免影响可能存在的修改品类操作
            this.isEditAssign = false
          }
          this.SKUAttributeList = SKUList
        }
      },
      productDetail: {
        handler: function (detail) {
          if (Object.keys(detail).length === 0) return

          this.isEditAssign = true
          this.form.productUnit = String(detail.packageDto.productUnit)
          this.form.saleMode = detail.packageDto.lotNum === 1 ? '1' : '2'
          this.form.lotNum = detail.packageDto.lotNum

          // 如果填写了 SKU
          if (detail.productSkuList[0].skuPropertyList) {
            const SKUAttributesFormById = {}
            const SKUAttributesCacheById = {}
            const skuPropertyIdList = detail.productSkuList[0].skuPropertyList.map(item => item.skuPropertyId)
            skuPropertyIdList.forEach(skuPropertyId => {
              detail.productSkuList.forEach(item => {
                const SKUPropertyObj = item.skuPropertyList.find(attr => attr.skuPropertyId === skuPropertyId)
                if (SKUAttributesFormById[skuPropertyId]) {
                  if (!SKUAttributesFormById[skuPropertyId].includes(SKUPropertyObj.propertyValueId)) {
                    SKUAttributesFormById[skuPropertyId].push(SKUPropertyObj.propertyValueId)
                    SKUAttributesCacheById[skuPropertyId].push(SKUPropertyObj)
                  }
                } else {
                  SKUAttributesFormById[skuPropertyId] = [SKUPropertyObj.propertyValueId]
                  SKUAttributesCacheById[skuPropertyId] = [SKUPropertyObj]
                }
              })
            })

            this.editCache = { SKUAttributesFormById, SKUAttributesCacheById }
          }
        }
        // immediate: true
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
        const columns = [{ title: item.zh, key: 'skuPropertyValue' }]
        item.customizedName && columns.push({ title: '自定义名称', key: 'propertyValueDefinitionName' })
        item.customizedPic && columns.push({ title: '自定义图片', key: 'skuImage' })

        return columns
      },
      // 多选框变动响应
      checkboxChange(item, values) {
        if (values.length > this.SKUAttributesCache[item.en].length) {
          // 增加
          const oldVal = this.SKUAttributesCache[item.en].map(val => val.propertyValueId)
          const addCheck = values.filter(id => !oldVal.includes(id))
          addCheck.forEach(id => {
            const val = item.values.find(val => val.attributeValueId === id)
            this.SKUAttributesCache[item.en].push({
              label: item.zh,
              skuPropertyName: item.en,
              skuPropertyValueName: val.zh,
              skuPropertyValue: val.en,
              propertyValueDefinitionName: '',
              skuImage: '',
              skuPropertyId: item.attributeId, // 属性id
              propertyValueId: val.attributeValueId // 属性值id
            })
          })
        } else {
          // 移除
          this.SKUAttributesCache[item.en] = this.SKUAttributesCache[item.en].filter(val => values.includes(val.propertyValueId))
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
                const SKUKey = curOptions.map(({ skuPropertyValue }) => skuPropertyValue).join('_')
                const uniqueId = curOptions.map(({ skuPropertyId, propertyValueId }) => `${skuPropertyId}:${propertyValueId}`).join(';')
                const attrObj = {}
                curOptions.forEach(attr => {
                  attrObj[attr.skuPropertyName] = attr.propertyValueDefinitionName ? `${attr.skuPropertyValueName}(${attr.propertyValueDefinitionName})` : attr.skuPropertyValueName
                })
                SKUList.push({
                  SKUKey,
                  uniqueId,
                  skuPropertyList: curOptions,
                  ...attrObj
                })
              } else {
                loop(rowIndex + 1, curOptions)
              }
            }
          }

          // Genshin Impact START!
          loop(0, [])

          this.SKUTableData = SKUList
        }
        this.store.$patch(state => {
          state.SKUTableData = this.SKUTableData
        })
      },
      // 设置自定义名称
      setCustomizedName(record) {
        this.SKUTableData.forEach(item => {
          const i = item.skuPropertyList.findIndex(property => property.skuPropertyId === record.skuPropertyId)
          if (i > -1) {
            item[record.skuPropertyName] = record.propertyValueDefinitionName ? `${record.skuPropertyValueName}(${record.propertyValueDefinitionName})` : record.skuPropertyValueName
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
      async emitData({ isDraft = false }) {
        if (isDraft) {
          this.$refs.form.clearValidate()
          this.$refs.SKUAttributesForm.clearValidate()
        } else {
          let valid = true
          await this.$refs.form.validate().catch(err => {
            valid = false
          })
          let SKUAttrValid = true
          await this.$refs.SKUAttributesForm.validate().catch(() => {
            SKUAttrValid = false
          })
          if (!valid || !SKUAttrValid) return
        }

        const { productUnit } = this.form
        const packageDto = {
          productUnit,
          packageType: this.form.saleMode === '2',
          lotNum: this.form.saleMode === '1' ? 1 : this.form.lotNum
        }
        return { packageDto }
      }
    }
  }
</script>

<style lang="less" scoped>
  .sku-info {
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
