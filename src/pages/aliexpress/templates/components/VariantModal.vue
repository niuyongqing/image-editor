<template>
  <a-modal
    :open="open"
    title="变种模版"
    width="40%"
    class="price-and-stock"
    :confirm-loading="confirmLoading"
    @cancel="cancel"
    @ok="handleOk"
  >
    <a-card
      title="模板信息"
      class="mb-4"
    >
      <a-form
        :model="baseInfoForm"
        :rules="rules"
        ref="baseInfoFormRef"
        :label-col="{ style: { width: '100px' } }"
      >
        <a-form-item
          label="模板名称"
          name="name"
        >
          <a-input
            v-model:value="baseInfoForm.name"
            placeholder="请输入"
            :maxlength="128"
            show-count
          />
        </a-form-item>
        <a-form-item
          label="店铺名称"
          name="sellerId"
        >
          <a-select
            v-model:value="baseInfoForm.sellerId"
            placeholder="请选择店铺"
            show-search
            allow-clear
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'sellerId' }"
            option-filter-prop="simpleName"
            @change="handleAccountChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          label="产品分类"
          name="categoryIds"
        >
          <a-cascader
            v-model:value="baseInfoForm.categoryIds"
            show-search
            placeholder="请选择产品分类"
            :options="categoryOptions"
            :field-names="{ value: 'id' }"
            :allow-clear="false"
            @change="getAttributes"
          ></a-cascader>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- SKU 变种属性 -->
    <a-card
      title="变种信息"
      :loading="loading"
    >
      <a-form
        ref="SKUAttributesFormRef"
        :model="SKUAttributesForm"
        :label-col="{ style: { width: '100px' } }"
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
            />
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
            class="ml-25 mb-4 w-fit"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.title === '自定义名称'">
                <a-input v-model:value="record.propertyValueDefinitionName" />
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
                  :account="baseInfoForm.sellerId"
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
    </a-card>
  </a-modal>
</template>

<script>
  import { getProductClassificationApi, resultByPostCateIdAndPathApi } from '../../apis/product'
  import DropdownOfImage from '@/components/dropdown-of-image/index.vue'
  import { listGroupApi } from '../../apis/media'
  import { templateAddApi, templateUpdateApi } from '../../apis/templates'
  import { message, Modal } from 'ant-design-vue'
  import { DownOutlined, DeleteOutlined } from '@ant-design/icons-vue'

  export default {
    name: 'VariantModal',
    components: { DownOutlined, DeleteOutlined },
    props: {
      open: {
        type: Boolean,
        default: false
      },
      accountList: {
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
        baseInfoForm: {
          name: '',
          sellerId: undefined,
          categoryIds: []
        },
        categoryOptions: [],
        // imgGroupList: [],
        loading: false,
        SKUAttributeList: [],
        SKUAttributesForm: {},
        SKUAttributesCache: {}, // 对选中的 SKU 变种值的 tableData 缓存 { key: [{}] }
        shipsFromExpand: false,
        rules: {
          sellerId: {
            required: true,
            message: '必填项，请填写',
            trigger: 'change'
          },
          name: {
            required: true,
            message: '必填项，请填写',
            trigger: 'change'
          },
          categoryIds: {
            required: true,
            message: '必填项，请填写',
            trigger: 'change'
          }
        },
        confirmLoading: false
      }
    },
    watch: {
      open: {
        handler: function (open) {
          if (open && Object.keys(this.detail).length) {
            this.baseInfoForm.name = this.detail.templateName
            this.baseInfoForm.sellerId = this.detail.sellerId
            this.getCategoryOptions()
            this.baseInfoForm.categoryIds = this.detail.productClassification
            this.getSKUList()

            const templateValue = JSON.parse(this.detail.templateValue)

            this.SKUAttributesForm = templateValue.SKUAttributesForm
            this.SKUAttributesCache = templateValue.SKUAttributesCache
          }
        },
        immediate: true
      }
    },
    methods: {
      handleAccountChange() {
        this.baseInfoForm.categoryIds = []
        this.categoryOptions = []
        this.getCategoryOptions()
      },
      // 获取分类选项列表
      getCategoryOptions() {
        getProductClassificationApi({ channelSellerId: this.baseInfoForm.sellerId }).then(res => {
          const rawList = res.data || []
          rawList.forEach(item => {
            const names = JSON.parse(item.names)
            item.label = `${names.zh}(${names.en})`
          })

          // 添加进第一级数据
          const options = rawList.filter(item => item.levelId === '0')
          generateNodeTree(options)
          this.categoryOptions = options

          // 生成节点树
          function generateNodeTree(list) {
            list.forEach(node => {
              if (!node.isleaf) {
                node.children = rawList.filter(item => item.levelId === node.id)
                generateNodeTree(node.children)
              }
            })
          }
        })
      },
      // 选完分类后获取属性
      getAttributes() {
        this.loading = true
        this.SKUAttributeList = []
        this.SKUAttributesForm = {}
        this.SKUAttributesCache = {}
        const params = {
          channelSellerId: this.baseInfoForm.sellerId,
          categoryId: this.baseInfoForm.categoryIds.slice(-1)[0] // 叶子类目id
        }
        resultByPostCateIdAndPathApi(params)
          .then(res => {
            const tempList = res.data.result.attributes || []
            const SKUList = tempList.filter(item => item.visible && item.sku)
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

            this.SKUAttributeList = SKUList
          })
          .finally(() => {
            this.loading = false
          })
      },
      // 编辑时获取 SKUList(等于是选完分类后操作的简化版)
      getSKUList() {
        this.loading = true
        this.SKUAttributeList = []
        const params = {
          channelSellerId: this.baseInfoForm.sellerId,
          categoryId: this.baseInfoForm.categoryIds.slice(-1)[0] // 叶子类目id
        }
        resultByPostCateIdAndPathApi(params)
          .then(res => {
            const tempList = res.data.result.attributes || []
            const SKUList = tempList.filter(item => item.visible && item.sku)
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

            this.SKUAttributeList = SKUList
          })
          .finally(() => {
            this.loading = false
          })
      },
      // checkbox sku 尺寸属性显示的名称
      getAttrLabel(colorCheckbox) {
        if (colorCheckbox.valueTagsObj.size_model_value) {
          return `${colorCheckbox.zh} (${colorCheckbox.valueTagsObj.size_model_value})`
        } else {
          return colorCheckbox.zh
        }
      },
      // 上传图片时显示的图片分组(暂不启用)
      /* getImgGroup() {
        listGroupApi({ sellerId: this.baseInfoForm.sellerId }).then(res => {
          if (res && res.code === 200) {
            this.imgGroupList = res.data.result.photoBankImageGroupList || []
          }
        })
      }, */
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

      cancel() {
        this.$emit('update:open', false)
      },
      async handleOk() {
        let valid = true
        await this.$refs.baseInfoFormRef.validate().catch(err => {
          valid = false
        })
        let SKUAttrValid = true
        this.$refs.SKUAttributesFormRef.validate().catch(err => {
          SKUAttrValid = false
        })
        if (!valid || !SKUAttrValid) return

        this.confirmLoading = true
        const templateValue = {
          SKUAttributesForm: this.SKUAttributesForm,
          SKUAttributesCache: this.SKUAttributesCache
        }
        const SKUAttrList = []
        for (const key in this.SKUAttributesCache) {
          if (this.SKUAttributesCache[key].length) {
            SKUAttrList.push(this.SKUAttributesCache[key][0].label)
          }
        }
        const displayText = SKUAttrList.join('、')

        const params = {
          id: this.detail.id,
          sellerId: this.baseInfoForm.sellerId,
          templateName: this.baseInfoForm.name,
          templateType: 7,
          productClassification: this.baseInfoForm.categoryIds,
          displayText,
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

<style lang="less" scoped>
  .price-and-stock {
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
