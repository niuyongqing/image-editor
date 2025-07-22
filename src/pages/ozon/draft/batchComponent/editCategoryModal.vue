<template>
  <div>
    <!--   批量分类 -->
    <a-modal
      v-model:open="dialogVisible"
      title="提示"
      width="1000px"
      @cancel="cancel"
      :footer="null"
      :maskClosable="false"
      :style="{ top: '30px' }"
    >
      <div
        flex
        justify-between
        mb-15px
      >
        <div>
          <a-breadcrumb separator=">">
            <a-breadcrumb-item>Ozon</a-breadcrumb-item>
            <a-breadcrumb-item>采集箱</a-breadcrumb-item>
            <a-breadcrumb-item> 批量编辑 </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div>
          <a-space>
            <a-button
              type="primary"
              @click="saveEditCategory"
              style="height: 32px; background-color: #e97234"
              >保存，下一步</a-button
            >
            <a-button
              @click="skip"
              style="height: 32px; background-color: #f5f5f5"
              >关闭</a-button
            >
          </a-space>
        </div>
      </div>
      <div>
        <a-button
          type="primary"
          @click="showCategoryModal"
          :disabled="selectedRowKeys.length === 0"
        >
          批量修改分类
        </a-button>
        <a-card mt-12px>
          筛选来源：
          <a-select
            v-model:value="platformSource"
            allowClear
            placeholder="请选择"
            style="width: 300px"
            :options="sourceOptions"
            @change="selectSource"
          >
          </a-select>
        </a-card>
      </div>

      <div
        h-900px
        overflow-y-scroll
      >
        <a-table
          :columns="columns"
          :row-selection="rowSelection"
          :data-source="acceptParams"
          bordered
          :pagination="false"
          row-key="gatherProductId"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'primaryImage'">
              <div class="flex">
                <div w-80px>
                  <a-image
                    :src="primaryImage(record.primaryImage)"
                    class="imgCss"
                  />
                </div>
                <div class="flex-1 ml-5px">
                  <div class="font-bold">{{ record.name }}</div>
                  <div class="text-gray-500">「{{ accountName(record.account) }}」</div>
                  <div class="text-gray-500">来源: {{ platformName(record.gatherPlatformName) }}</div>
                </div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'category'"> >> </template>
            <template v-if="column.dataIndex === 'ozonCategory'">
              <a-select
                v-model:value="record.typeId"
                allowClear
                showSearch
                placeholder="请选择"
                style="width: 300px"
                :options="historyCategoryList"
                @change="selectAttributes(record, $event)"
                :fieldNames="{
                  label: 'threeCategoryName',
                  value: 'threeCategoryId'
                }"
                :filter-option="filterOption"
              >
              </a-select>
              <a-button
                type="link"
                @click="changeCategory(record)"
                >更换分类</a-button
              >
              <p>
                {{ getHistoryPath(record.typeId) }}
              </p>
              <a-table
                :columns="innerColumns"
                :data-source="record.innerTableData"
                bordered
                :pagination="false"
                style="margin-top: 10px"
              >
                <template #bodyCell="{ column: innerColumn, record: innerRecord }">
                  <template v-if="innerColumn.dataIndex === 'catTheme'">
                    {{ innerRecord.catTheme }}
                  </template>
                  <template v-if="innerColumn.dataIndex === 'ozonTheme'">
                    <div>
                      <a-select
                        v-model:value="innerRecord.ozonTheme"
                        allowClear
                        placeholder="请选择"
                        style="width: 180px"
                        :options="record.filterAttrOptions"
                      >
                        <template #notFoundContent>
                          <div
                            v-if="record.optionsLoading"
                            w-180px
                            h-150px
                            flex
                            justify-center
                            items-center
                          >
                            <a-spin />
                          </div>
                          <div
                            v-else
                            flex
                            justify-center
                            items-center
                          >
                            <a-empty />
                          </div>
                        </template>
                      </a-select>
                    </div>
                  </template>
                </template>
              </a-table>
            </template>
          </template>
        </a-table>
      </div>
    </a-modal>

    <!--  account -->
    <CategoryModal
      ref="categoryModalRef"
      :account="account"
      @select="handleSelect"
    ></CategoryModal>
  </div>
</template>

<script setup>
  import { message } from 'ant-design-vue'
  import CategoryModal from '../comm/categoryModal.vue'
  import { categoryTree, historyCategory, addHistoryCategory, categoryAttributes } from '@/pages/ozon/config/api/product.js'
  import { batchSave, batchRelationDetail } from '@/pages/ozon/config/api/draft.js'
  import { cloneDeep } from 'lodash'

  const { shopAccount, account } = defineProps({
    shopAccount: {
      type: Array,
      default: () => []
    },
    account: {
      type: String,
      default: ''
    }
  })

  const platNames = {
    Ozon: 'Ozon',
    Tmall: '天猫',
    AliExpress: '速卖通'
  }
  const baseApi = import.meta.env.VITE_APP_BASE_API
  const platformSource = ref('') // 平台来源
  const dialogVisible = ref(false)
  const acceptParams = ref([])
  const copyAcceptParams = ref([])

  const columns = [
    {
      title: '产品信息',
      dataIndex: 'primaryImage',
      key: 'primaryImage',
      width: 300
    },
    {
      title: '分类对应',
      dataIndex: 'category',
      key: 'category',
      width: 100
    },
    {
      title: 'OZON分类',
      dataIndex: 'ozonCategory',
      key: 'ozonCategory',
      width: 400
    }
  ]
  const isSingleCategory = ref(false) // 是否点击的是单个分类
  const selectCategory = ref({}) // 选中的分类
  const selectedRowList = ref([]) // 选中的行数据
  const selectedRowKeys = ref([])
  const rowSelection = computed(() => {
    return {
      selectedRowKeys: selectedRowKeys.value,
      onChange: (rowKeys, rows) => {
        selectedRowKeys.value = rowKeys
        selectedRowList.value = rows
      }
    }
  })
  const innerColumns = computed(() => {
    return [
      {
        title: '变种主题',
        dataIndex: 'catTheme',
        key: 'catTheme',
        width: 150
      },
      {
        title: '对应Ozon变种主题',
        dataIndex: 'ozonTheme',
        key: 'ozonTheme',
        width: 150
      }
    ]
  })

  //  筛选来源-列表
  const sourceOptions = computed(() => {
    const list = copyAcceptParams.value.map(item => {
      return {
        label: item.gatherPlatformName,
        value: item.gatherPlatformName
      }
    })
    const platformSourceList = [
      {
        label: '全部',
        value: ''
      },
      ...list
    ]
    const uniquePlatformSourceList = platformSourceList.filter((item, index) => {
      return platformSourceList.findIndex(i => i.value === item.value) === index
    })
    return uniquePlatformSourceList
  })

  // 筛选来源
  const selectSource = value => {
    if (!value) {
      acceptParams.value = copyAcceptParams.value
    } else {
      acceptParams.value = copyAcceptParams.value.filter(item => item.gatherPlatformName === value)
    }
  }

  const categoryModalEl = useTemplateRef('categoryModalRef')
  const historyCategoryList = ref([])
  const secondCategoryId = ref(undefined)
  const attributes = ref([])
  const filterAttrOptions = ref([]) // 过滤后的属性

  function filterOption(input, option) {
    return option.threeCategoryName.indexOf(input) >= 0
  }

  const primaryImage = primaryImage => {
    if (primaryImage.includes('https')) {
      return primaryImage
    }
    return baseApi + primaryImage
  }
  function getFilterAttrs() {
    acceptParams.value.forEach(item => {
      item.filterAttrOptions = item.attributes
        .filter(attrItem => {
          return attrItem.isAspect
        })
        .map(attrItem => {
          return {
            label: attrItem.name.replace(/\(.*\)/, ''), // 去掉（）里面的
            value: attrItem.id,
            attrLabel: attrItem.name
          }
        })
    })
  }

  // 选择历史分类
  const selectAttributes = async (item, value) => {
    item.optionsLoading = true
    item.filterAttrOptions = []
    item.innerTableData.forEach(innerItem => {
      innerItem.ozonTheme = undefined
      innerItem.attrLabel = undefined
    })
    if (!value) return

    const findItem = historyCategoryList.value.find(item => {
      return item.threeCategoryId === value
    })
    const res = await categoryAttributes({
      account: item.account,
      descriptionCategoryId: findItem.secondCategoryId, // bug to do
      typeId: value
    })
    const data = res.data
      .filter(item => {
        return item.isAspect
      })
      .map(item => {
        return {
          label: item.name.replace(/\(.*\)/, ''), // 去掉（）里面的
          value: item.id,
          attrLabel: item.name
        }
      })
    item.filterAttrOptions = data
    item.optionsLoading = false
  }

  // 更换分类
  const changeCategory = item => {
    nextTick(() => {
      selectCategory.value = item
      isSingleCategory.value = true
      categoryModalEl.value.open(item.typeId)
    })
  }

  const handleSelect = async data => {
    if (isSingleCategory.value) {
      console.log('单个', selectCategory.value)
      acceptParams.value.forEach(item => {
        if (selectCategory.value.gatherProductId === item.gatherProductId) {
          item.typeId = data.value
          item.filterAttrOptions = []
          item.innerTableData.forEach(innerItem => {
            innerItem.ozonTheme = undefined
            innerItem.attrLabel = undefined
          })

          item.optionsLoading = true
        }
      })
      //  如果选择不在历史分类里面，则添加到历史里面
      const findItem = historyCategoryList.value.find(item => {
        return item.threeCategoryId === data.value
      })

      if (!findItem) {
        let params = {
          account,
          secondCategoryId: data.ids[1],
          threeCategoryId: data.ids[2]
        }
        await addHistoryCategory(params)
        const res = await historyCategory({ account })
        if (res.code === 200) {
          historyCategoryList.value = res.data || []
        }
        // 获取属性
        const res2 = await categoryAttributes({
          account,
          descriptionCategoryId: data.ids[1],
          typeId: data.value
        })
        if (res2.code === 200) {
          acceptParams.value.forEach(paramsItem => {
            if (selectCategory.value.gatherProductId === paramsItem.gatherProductId) {
              paramsItem.filterAttrOptions = res2.data
                .filter(attrItem => {
                  return attrItem.isAspect
                })
                .map(attrItem => {
                  return {
                    label: attrItem.name.replace(/\(.*\)/, ''), // 去掉（）里面的
                    value: attrItem.id,
                    attrLabel: attrItem.name
                  }
                })
              paramsItem.optionsLoading = false
            }
          })
        }
      } else {
        console.log('在历史里面 -》》》')
        // 获取属性
        acceptParams.value.forEach(paramsItem => {
          selectedRowList.value.forEach(rowItem => {
            if (rowItem.gatherProductId === paramsItem.gatherProductId) {
              paramsItem.optionsLoading = true
            }
          })
        })
        const res = await categoryAttributes({
          account,
          descriptionCategoryId: data.ids[1],
          typeId: data.value
        })
        if (res.code === 200) {
          acceptParams.value.forEach(paramsItem => {
            paramsItem.filterAttrOptions = res.data
              .filter(attrItem => {
                return attrItem.isAspect
              })
              .map(attrItem => {
                return {
                  label: attrItem.name.replace(/\(.*\)/, ''), // 去掉（）里面的
                  value: attrItem.id,
                  attrLabel: attrItem.name
                }
              })
          })
        }
      }
    } else {
      console.log('批量')
      acceptParams.value.forEach(item => {
        selectedRowList.value.forEach(rowItem => {
          if (rowItem.gatherProductId === item.gatherProductId) {
            item.typeId = data.value
            item.filterAttrOptions = []
            item.optionsLoading = true
            item.innerTableData.forEach(innerItem => {
              innerItem.ozonTheme = undefined
              innerItem.attrLabel = undefined
            })
          }
        })
      })
      //  如果选择不在历史分类里面，则添加到历史里面
      const findItem = historyCategoryList.value.find(item => {
        return item.threeCategoryId === data.value
      })
      if (!findItem) {
        let params = {
          account,
          secondCategoryId: data.ids[1],
          threeCategoryId: data.ids[2]
        }
        await addHistoryCategory(params)
        const res = await historyCategory({ account })
        if (res.code === 200) {
          historyCategoryList.value = res.data || []
        }
        // 获取属性
        const res2 = await categoryAttributes({
          account,
          descriptionCategoryId: data.ids[1],
          typeId: data.value
        })
        if (res2.code === 200) {
          acceptParams.value.forEach(paramsItem => {
            selectedRowList.value.forEach(rowItem => {
              if (rowItem.gatherProductId === paramsItem.gatherProductId) {
                paramsItem.filterAttrOptions = res2.data
                  .filter(attrItem => {
                    return attrItem.isAspect
                  })
                  .map(attrItem => {
                    return {
                      label: attrItem.name.replace(/\(.*\)/, ''), // 去掉（）里面的
                      value: attrItem.id,
                      attrLabel: attrItem.name
                    }
                  })
                paramsItem.optionsLoading = false
              }
            })
          })
        }
      } else {
        console.log('在历史里面 -》》》')
        // 获取属性
        acceptParams.value.forEach(paramsItem => {
          selectedRowList.value.forEach(rowItem => {
            if (rowItem.gatherProductId === paramsItem.gatherProductId) {
              paramsItem.optionsLoading = true
            }
          })
        })
        const res = await categoryAttributes({
          account,
          descriptionCategoryId: data.ids[1],
          typeId: data.value
        })
        if (res.code === 200) {
          acceptParams.value.forEach(paramsItem => {
            selectedRowList.value.forEach(rowItem => {
              if (rowItem.gatherProductId === paramsItem.gatherProductId) {
                const filterAttr = res.data.filter(attrItem => {
                  return attrItem.isAspect
                })
                paramsItem.filterAttrOptions = filterAttr.map(attrItem => {
                  return {
                    label: attrItem.name.replace(/\(.*\)/, ''), // 去掉（）里面的
                    value: attrItem.id,
                    attrLabel: attrItem.name
                  }
                })
                paramsItem.optionsLoading = false
              }
            })
          })
        }
      }
    }
  }

  const accountName = account => {
    return shopAccount.find(item => item.account === account)?.simpleName
  }

  // 批量修改分类
  const showCategoryModal = () => {
    isSingleCategory.value = false
    categoryModalEl.value.open('') // to do
  }

  //  获取路劲
  const getHistoryPath = typeId => {
    const findItem = historyCategoryList.value.find(item => {
      return item.threeCategoryId === typeId
    })
    return findItem ? `${findItem.categoryName} > ${findItem.secondCategoryName} > ${findItem.threeCategoryName}` : ''
  }

  //  获取历史分类列表
  const getHistoryList = async () => {
    const res = await historyCategory({ account })
    if (res.code === 200) {
      historyCategoryList.value = res.data || []
    }
    const paramsList = acceptParams.value.filter(paramItem => paramItem.typeId)
    //  去重
    const uniqueParamsList = paramsList.filter((item, index) => {
      return paramsList.findIndex(i => i.typeId === item.typeId) === index
    })
    uniqueParamsList.forEach(item => {
      categoryAttributes({
        account,
        descriptionCategoryId: item.categoryId,
        typeId: item.typeId
      }).then(res => {
        if (res.code === 200) {
          acceptParams.value.forEach(paramsItem => {
            if (item.typeId === paramsItem.typeId) {
              const filterAttr = res.data.filter(attrItem => {
                return attrItem.isAspect
              })
              paramsItem.filterAttrOptions = filterAttr.map(attrItem => {
                return {
                  label: attrItem.name.replace(/\(.*\)/, ''), // 去掉（）里面的
                  value: attrItem.id,
                  attrLabel: attrItem.name
                }
              })
            }
          })
        }
      })
    })
  }

  // 批量查询变种关联关系
  const getVariantRelationList = async () => {
    const relationReqList = acceptParams.value.map(item => {
      return {
        productCollectId: item.gatherProductId,
        platformName: 'ozon'
      }
    })
    const res = await batchRelationDetail({
      relationReqList: relationReqList
    })
    if (res.code === 200) {
      acceptParams.value.forEach(item => {
        const findItem = res.data.find(relationItem => {
          return relationItem.productCollectId === item.gatherProductId
        })
        if (findItem) {
          item.variantAttr = findItem.detailData || {}
          item.optionsLoading = true
          item.innerTableData.forEach(innerItem => {
            const findVariantItem = findItem.variantRelationList.find(relationItem => {
              return relationItem.originalVariantName === innerItem.catTheme
            })
            if (findVariantItem) {
              innerItem.ozonTheme = findVariantItem.attributeId
              innerItem.attrLabel = findVariantItem.platformVariantName
            }
          })
          item.optionsLoading = false
        }
      })
    }
  }

  const open = async (data = []) => {
    acceptParams.value = data.map(item => {
      let innerTableData = []
      Object.keys(item.variantAttr).forEach(key => {
        innerTableData.push({
          catTheme: key,
          ozonTheme: undefined,
          attrLabel: undefined
        })
      })
      return {
        ...item,
        hisAttrObj: {},
        tableData: [
          {
            primaryImage: item.primaryImage,
            name: item.name,
            category: item.typeId,
            gatherPlatformName: item.gatherPlatformName,
            account: item.account
          }
        ],
        filterAttrOptions: [],
        innerTableData: innerTableData
      }
    })
    copyAcceptParams.value = cloneDeep(acceptParams.value)
    dialogVisible.value = true
    // 批量查询变种关联关系
    await getVariantRelationList()
    // 获取历史分类
    await getHistoryList()
  }

  const cancel = () => {
    platformSource.value = ''
    isSingleCategory.value = false
    selectCategory.value = {}
    acceptParams.value = []
    copyAcceptParams.value = []
    historyCategoryList.value = []
    dialogVisible.value = false
  }
  const platformName = platform => {
    return platNames[platform] ?? platform
  }

  // 保存编辑分类
  const saveEditCategory = () => {
    const typeIdList = acceptParams.value.filter(item => {
      return !item.typeId
    })
    console.log('typeIdList', typeIdList)
    if (typeIdList.length > 0) {
      message.error('选择分类不能为空')
      return
    }

    let typeIdError = [] // 分类错误
    let repeatError = [] // 重复错误
    let ozonThemeError = [] // ozon主题错误
    acceptParams.value.forEach(item => {
      const innerTableData = item.innerTableData.map(innerItem => {
        return {
          originalVariantName: innerItem.catTheme,
          platformVariantName: innerItem.attrLabel,
          attributeId: innerItem.ozonTheme
        }
      })

      // 对应Ozon变种主题 选择不能有一样的
      const attributeIdList = innerTableData.map(item => item.attributeId).filter(Boolean)
      const hasRepeat = attributeIdList.some((item, index) => attributeIdList.indexOf(item) !== index)

      if (hasRepeat) {
        repeatError.push(item.gatherProductId)
      }
      if (attributeIdList.every(item => item === undefined)) {
        ozonThemeError.push(item.gatherProductId)
      }

      if (!item.typeId) {
        typeIdError.push(item.gatherProductId)
      }
    })

    if (typeIdError.length > 0) {
      message.error('分类不能为空')
      return
    }
    if (ozonThemeError.length > 0) {
      message.error('对应Ozon变种主题，选择不能为空')
      return
    }
    if (repeatError.length > 0) {
      message.error('对应Ozon变种主题，选择不能有重复')
      return
    }

    const relationReqList = acceptParams.value.map(item => {

      return {
        productCollectId: item.gatherProductId, //数据采集产品id或者采集箱产品id
        platformName: 'ozon', //所属平台
        categoryId: item.categoryId, //平台分类id
        typeId: item.typeId, // 商品类型ID (目前只有ozon平台有，其他平台应该没有)
        variantRelationList: item.innerTableData.map(innerItem => {
          const attrLabel = item.filterAttrOptions.find(el => el.value === innerItem.ozonTheme)?.attrLabel
          return {
            originalVariantName: innerItem.catTheme,
            platformVariantName: attrLabel,
            attributeId: innerItem.ozonTheme
          }
        })
      }
    })

    batchSave({
      relationReqList: relationReqList
    }).then(res => {
      if (res.code === 200) {
        message.success('保存成功')
        emits('success')
        cancel()
        window.open(`/platform/ozon/batch-edit`, '_blank')
      }
    })
  }
  //  跳过
  const skip = () => {
    emits('skip')
    cancel()
  }
  const emits = defineEmits(['cancel', 'edit', 'skip', 'sendShortCode', 'getAttributes'])
  defineExpose({
    open
  })
</script>
<style lang="less" scoped>
  .card {
    background-color: #f9f9f9;
  }

  .imgCss {
    width: 80px;
    height: 80px;
  }

  .info {
    color: #999;

    p {
      margin: 0;
    }
  }

  .tooltip-text {
    color: #a0a3a6;
    padding-top: 5px;
  }
</style>
