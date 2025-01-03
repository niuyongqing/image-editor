<template>
  <!-- 全属性修改弹窗 -->
  <a-modal
    title="修改属性"
    :open="dialogVisible"
    width="40%"
    destroy-on-close
    :after-close="handleClose"
    @confirm="handleConfirm"
  >
    <div class="whole-attr-edit-dialog">
      <div :class="['left', isAttrExpand && 'expand']">
        <div class="left-inner">
          <div
            class="group"
            v-for="(group, i) in attrGroupList"
            :key="i"
          >
            <a-checkbox
              v-model:checked="group.checkAll"
              :indeterminate="group.isIndeterminate"
              @change="val => handleCheckAllChange(val, i)"
              >{{ group.title }}</a-checkbox
            >
            <a-checkbox-group
              v-model:value="group.checkedList"
              class="ml-2"
              @change="values => handleCheckedChange(values, i)"
            >
              <a-checkbox
                v-for="item in group.attrList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</a-checkbox
              >
            </a-checkbox-group>
          </div>
        </div>
      </div>
      <div class="right">
        <a-button
          type="link"
          :class="['arrow', isAttrExpand ? 'at-right' : 'at-left']"
          @click="isAttrExpand = !isAttrExpand"
        >
          <DoubleLeftOutlined v-if="isAttrExpand" />
          <DoubleRightOutlined v-else />
        </a-button>
        <div class="right-inner">
          <!-- 产品标题 -->
          <a-card
            v-if="checkedListAll.includes('title')"
            title="产品标题"
          >
            <a-form
              :model="titleForm"
              :label-col="{ style: { width: '72px' } }"
            >
              <a-form-item label="开头添加">
                <a-input v-model:value="titleForm.padStart"></a-input>
              </a-form-item>
              <a-form-item label="结尾添加">
                <a-input v-model:value="titleForm.padEnd"></a-input>
              </a-form-item>
              <div style="display: flex">
                <a-form-item
                  label="标题中的"
                  style="flex: 50%"
                >
                  <a-input v-model:value="titleForm.textOld"></a-input>
                </a-form-item>
                <a-form-item
                  label="替换为"
                  style="flex: 50%"
                >
                  <a-input v-model:value="titleForm.textNew"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="标题移除">
                <a-input v-model:value="titleForm.textRemove"></a-input>
              </a-form-item>
              <a-form-item label="标题字母">
                <a-checkbox v-model:checked="titleForm.capitalCase">首字母大写</a-checkbox>
              </a-form-item>
              <a-form-item label="标题长度">
                <a-checkbox v-model:checked="titleForm.cutOverflow">超出128字符时自动移除</a-checkbox>
              </a-form-item>
            </a-form>
          </a-card>
          <!-- 区域调价 -->
          <a-card
            v-if="checkedListAll.includes('nationalQuote')"
            title="区域调价"
          >
            <a-form :label-col="{ style: { width: '72px' } }">
              <a-form-item label="修改方式">
                <a-radio-group v-model:value="nationalQuoteForm.editType">
                  <a-radio value="1">直接替换</a-radio>
                  <a-radio value="2">清空内容</a-radio>
                </a-radio-group>
              </a-form-item>
              <template v-if="nationalQuoteForm.editType === '1'">
                <p>
                  <a-tag color="warning">说明!</a-tag>
                  <span> 直接替换，相当于清空原本区域调价，重新设置新的区域调价，并不是在原本产品已有的区域调价基础上修改，谨慎使用 </span>
                </p>
                <a-form-item label="调价方式">
                  <a-select
                    v-model:value="nationalQuoteForm.configurationType"
                    :options="configurationTypeOptions"
                    @change="configurationChange"
                  />
                </a-form-item>
                <a-form-item label="调价区域">
                  <a-checkbox
                    :indeterminate="countriesIsIndeterminate"
                    v-model:checked="countriesCheckAll"
                    @change="handleCountriesCheckAllChange"
                    >全选</a-checkbox
                  >
                  <a-checkbox-group
                    v-model:value="checkedCountryList"
                    class="country-checkbox"
                    @change="handleCountriesCheckChange"
                  >
                    <a-checkbox
                      v-for="item in countries"
                      :key="item.areaCode"
                      :value="item.areaCode"
                      >{{ item.areaName }}</a-checkbox
                    >
                  </a-checkbox-group>
                  <a-table
                    :data-source="nationalQuoteTable"
                    :columns="nationalQuoteColumns"
                    bordered
                  >
                    <template #bodyCell="{ record }">
                      <a-input-number
                        v-model:value="record[item.prop]"
                        :min="-50"
                        :max="9999"
                        :precision="2"
                        :controls="false"
                      ></a-input-number>
                      <span v-if="nationalQuoteForm.configurationType === 'percentage'"> %</span>
                    </template>
                  </a-table>
                </a-form-item>
              </template>
              <template v-else>
                <span>说明：选择此项会清空区域调价里面的全部信息</span>
              </template>
            </a-form>
          </a-card>
          <!-- 运费模版 -->
          <a-card
            v-if="checkedListAll.includes('freightTemplate')"
            title="运费模版"
          >
            <a-button
              type="primary"
              class="mb-2"
              @click="syncFreightTemplateList"
              >同步</a-button
            >
            <p v-if="sellerList.length > 1">共选择 {{ rows.length }} 个产品, 属于不同的店铺, 请分别选择运费模版</p>
            <a-form
              :model="freightTemplateForm"
              :label-col="{ style: { width: '180px' } }"
            >
              <a-form-item
                v-for="seller in sellerList"
                :key="seller.sellerId"
                :label="seller.simpleName || '--'"
                :title="seller.simpleName || '--'"
                class=""
              >
                <a-select
                  v-model:value="freightTemplateForm[seller.sellerId]"
                  :options="freightTemplateOptionObj[seller.sellerId]"
                  :field-names="{ label: 'templateName', value: 'templateId' }"
                />
              </a-form-item>
            </a-form>
          </a-card>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { areaListApi, getListFreightTemplateApi, syncGetListFreightTemplateApi, editProductApi } from '../../apis/product'
  import { message } from 'ant-design-vue'
  import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue'

  export default {
    name: 'WholeAttrEditDialog',
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      command: {
        type: String,
        default: ''
      },
      accounts: {
        type: Array,
        default: () => []
      },
      selectedRows: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        rows: [],
        isAttrExpand: false,
        attrGroupList: [
          {
            title: '产品信息',
            attrList: [
              { label: '产品标题', value: 'title' }
              // { label: '产品分组', value: 'group' }
            ],
            isIndeterminate: true,
            checkAll: false,
            checkedList: []
          },
          {
            title: '变种信息',
            attrList: [
              // { label: 'SKU 编码', value: 'skuCode' },
              { label: '区域调价', value: 'nationalQuote' }
            ],
            isIndeterminate: true,
            checkAll: false,
            checkedList: []
          },
          {
            title: '模版信息',
            attrList: [
              { label: '运费模版', value: 'freightTemplate' }
              // { label: '服务模版', value: 'serviceTemplate' }
            ],
            isIndeterminate: true,
            checkAll: false,
            checkedList: []
          }
        ],
        submitLoading: false,
        /** 标题 */
        titleForm: {
          padStart: '',
          padEnd: '',
          textOld: '', // 标题中的 textOld
          textNew: '', // 替换为 textNew
          textRemove: '',
          capitalCase: false, // 首字母大写
          cutOverflow: false // 超出 128 字时自动移除
        },
        /** 区域调价 */
        nationalQuoteForm: {
          editType: '1',
          configurationType: 'absolute' // 还有一个类型: delete-删除分国家报价;
        },
        configurationTypeOptions: [
          { label: '直接报价', value: 'absolute' },
          { label: '按比例', value: 'percentage' },
          { label: '按金额', value: 'relative' }
        ],
        countries: [],
        countriesCheckAll: false,
        countriesIsIndeterminate: true,
        checkedCountryList: [],
        nationalQuoteTable: [],
        /** 运费模版 */
        freightTemplateForm: {}, // 运费模版绑定的表单; key 为 sellerId
        freightTemplateOptionObj: {} // 模版选项
      }
    },
    computed: {
      // 已勾选的属性
      checkedListAll() {
        const list = []
        this.attrGroupList.forEach(item => {
          list.push(...item.checkedList)
        })

        return list
      },
      checkedCountries() {
        return this.countries.filter(item => this.checkedCountryList.includes(item.areaCode))
      },
      nationalQuoteColumns() {
        const cols = this.checkedCountries.map(country => {
          return {
            label: country.areaName,
            prop: country.areaCode
          }
        })

        return cols
      },
      // 勾选产品所属的店铺列表
      sellerList() {
        const rawList = this.rows.map(item => item.sellerId)
        const list = Array.from(new Set(rawList))
        const targetList = list.map(sellerId => {
          const seller = this.accounts.find(account => account.sellerId === sellerId)
          return seller
        })

        return targetList
      }
    },
    watch: {
      command: {
        handler: function (command) {
          if (!command) return

          if (command === 'ALL') {
            this.attrGroupList.forEach(item => {
              item.checkAll = true
              item.isIndeterminate = false
              item.checkedList = item.attrList.map(attr => attr.value)
            })
            this.isAttrExpand = true
          } else {
            const item = this.attrGroupList.find(item => item.attrList.find(attr => attr.value === command))
            item.checkAll = true
            item.isIndeterminate = false
            item.checkedList = [command]
          }

          this.rows = cloneDeep(this.selectedRows)
        },
        immediate: true
      },
      // 已选择的属性 All
      checkedListAll: {
        handler: function (checkedListAll) {
          if (checkedListAll.length === 0) return

          if (checkedListAll.includes('freightTemplate')) {
            this.getFreightTemplateList()
          }
          if (checkedListAll.includes('nationalQuote')) {
            this.getAreaList()
          }
        },
        immediate: true
      },
      // 已选择的国家(区域)
      checkedCountryList: {
        handler: function (newVal, oldVal) {
          if (newVal.length === 0) {
            this.nationalQuoteTable = []

            return
          }
          // 首次添加调价区域(nationalQuoteTable 为空)
          if (this.nationalQuoteTable.length === 0) {
            // 这里的区域调价只会有一条数据
            this.nationalQuoteTable = [{}]
          }
          // 加上区域属性
          if (newVal.length > oldVal.length) {
            // 增加
            const addCheck = newVal.filter(item => !oldVal.includes(item))
            // 给区域价格表中每个变种添加地区属性
            addCheck.forEach(addItem => {
              this.nationalQuoteTable.forEach(item => {
                item[addItem] = undefined
              })
            })
          } else {
            // 移除
            const removeCheck = oldVal.filter(item => !newVal.includes(item))
            removeCheck.forEach(removeItem => {
              this.nationalQuoteTable.forEach(item => {
                delete item[removeItem]
              })
            })
          }
        }
      }
    },
    mounted() {},
    methods: {
      // 属性分组全选
      handleCheckAllChange(val, i) {
        this.attrGroupList[i].checkedList = val ? this.attrGroupList[i].attrList.map(attr => attr.value) : []
        this.attrGroupList[i].isIndeterminate = false
      },
      // 属性勾选变动
      handleCheckedChange(values, i) {
        let checkedCount = values.length
        this.attrGroupList[i].checkAll = checkedCount === this.attrGroupList[i].attrList.length
        this.attrGroupList[i].isIndeterminate = checkedCount > 0 && checkedCount < this.attrGroupList[i].attrList.length
      },
      /** 区域调价 */
      // 国家和地区
      getAreaList() {
        areaListApi().then(res => {
          this.countries = res.data || []
        })
      },
      handleCountriesCheckAllChange(val) {
        this.checkedCountryList = val ? this.countries.map(item => item.areaCode) : []
        this.countriesIsIndeterminate = false
      },
      handleCountriesCheckChange(value) {
        let checkedCount = value.length
        this.countriesCheckAll = checkedCount === this.countries.length
        this.countriesIsIndeterminate = checkedCount > 0 && checkedCount < this.countries.length
      },
      // 切换调价方式, 清空已填写数据
      configurationChange() {
        this.checkedCountryList.forEach(item => {
          this.nationalQuoteTable.forEach(country => {
            country[item] = undefined
          })
        })
      },
      /** 运费模版 */
      // 获取运费模版
      getFreightTemplate(sellerId) {
        getListFreightTemplateApi({ channelSellerId: sellerId }).then(res => {
          this.freightTemplateOptionObj[sellerId] = res.data
        })
      },
      getFreightTemplateList() {
        this.sellerList.forEach(seller => {
          this.getFreightTemplate(seller.sellerId)
        })
      },
      // 同步运费模版
      syncFreightTemplateList() {
        const syncList = this.sellerList.map(
          seller =>
            new Promise((resolve, reject) => {
              syncGetListFreightTemplateApi({ channelSellerId: seller.sellerId })
                .then(_ => {
                  this.getFreightTemplate(seller.sellerId)
                  resolve()
                })
                .catch(err => reject(err))
            })
        )
        Promise.all(syncList).then(_ => {
          message.success('运费模版同步成功')
        })
      },
      /** 弹窗操作 */
      handleClose() {
        this.$emit('dialogClose')
      },
      handleConfirm() {
        this.submitLoading = true
        /** 处理数据 */
        // 标题
        if (this.checkedListAll.includes('title')) {
          this.rows.forEach(row => {
            const target = row.subjectList.find(item => item.locale === row.locale)
            if (this.titleForm.padStart) {
              target.value = this.titleForm.padStart + target.value
            }
            if (this.titleForm.padEnd) {
              target.value += this.titleForm.padEnd
            }
            // 替换
            if (this.titleForm.textOld && this.titleForm.textNew) {
              target.value = target.value.replaceAll(this.titleForm.textOld, this.titleForm.textNew)
            }
            if (this.titleForm.textRemove) {
              target.value = target.value.replaceAll(this.titleForm.textRemove, '')
            }
            if (this.titleForm.capitalCase) {
              target.value = target.value.slice(0, 1).toUpperCase() + target.value.slice(1)
            }
            if (this.titleForm.cutOverflow) {
              target.value = target.value.slice(0, 128)
            }
          })
        }
        // 区域调价
        if (this.checkedListAll.includes('nationalQuote')) {
          if (this.nationalQuoteForm.editType === '1') {
            // 直接替换
            if (this.nationalQuoteTable.length !== 0) {
              this.rows.forEach(row => {
                const configurationData = []
                const absoluteQuoteMapKeyList = []
                if (row.aeopAeProductSKUs[0].aeopSKUPropertyList) {
                  row.aeopAeProductSKUs.forEach(SKU => {
                    const key = SKU.aeopSKUPropertyList.map(attr => attr.skuPropertyId + ':' + attr.propertyValueId).join(';')
                    absoluteQuoteMapKeyList.push(key)
                  })
                } else {
                  absoluteQuoteMapKeyList.push('')
                }
                for (const country in this.nationalQuoteTable[0]) {
                  const absoluteQuoteMap = {}
                  absoluteQuoteMapKeyList.forEach(key => {
                    absoluteQuoteMap[key] = this.nationalQuoteTable[0][country]
                  })

                  configurationData.push({
                    absoluteQuoteMap,
                    shiptoCountry: country
                  })
                }

                const aeopNationalQuoteConfiguration = {
                  configurationType: this.nationalQuoteForm.configurationType,
                  configurationData: JSON.stringify(configurationData)
                }
                row.aeopNationalQuoteConfiguration = aeopNationalQuoteConfiguration
              })
            }
          } else {
            // 清空内容
            this.rows.forEach(row => {
              row.aeopNationalQuoteConfiguration = {}
            })
          }
        }
        // 运费模版
        if (this.checkedListAll.includes('freightTemplate')) {
          this.rows.forEach(row => {
            if (this.freightTemplateForm[row.sellerId]) {
              row.freightTemplateId = this.freightTemplateForm[row.sellerId]
            }
          })
        }
        /** 提交数据 */
        const promiseList = this.rows.map(row => {
          return new Promise(resolve => {
            const params = {
              ...row,
              groupId: row.groupIds && row.groupIds.join(',')
            }
            params.aeopAeProductSKUs.forEach(SKU => {
              SKU.aeopSKUProperty = SKU.aeopSKUPropertyList
            })
            delete params.SKUExpand
            delete params.images
            delete params.gmtCreate
            delete params.gmtModified

            editProductApi(params)
              .then(_ => {
                resolve(row.productId)
              })
              .catch(() => {
                resolve()
              })
          })
        })
        Promise.all(promiseList).then(values => {
          const successList = values.filter(item => item)
          if (successList.length === values.length) {
            message.success('修改成功')
          } else {
            message.warning(`${successList.length} 条修改成功; ${values.length - successList.length} 条修改失败, 请调整后再发布`)
          }

          this.submitLoading = false
          // this.$bus.$emit('refresh')
        })
        this.handleClose()
      }
    }
  }
</script>

<style lang="less" scoped>
  .whole-attr-edit-dialog {
    height: 700px;
    display: flex;
    overflow: hidden;
    border-bottom: 1px solid #999;
    .left {
      width: 266px;
      flex: none;
      overflow-y: auto;
      margin-left: -270px;
      transition: margin-left 0.6s;
      .left-inner {
        .group {
          margin-bottom: 16px;
        }
      }
    }
    .expand {
      margin-left: 0;
    }
    .right {
      flex: 1;
      overflow: auto;
      border-left: 1px solid #999;
      .arrow {
        position: absolute;
        top: 49%;
        font-size: 22px;
        transition: left 0.6s;
        background-color: #fff;
      }
      .at-left {
        left: 10px;
      }
      .at-right {
        left: 272px;
      }
      &-inner {
        margin-left: 12px;
      }
    }
  }
</style>
