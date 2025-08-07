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
          :disabled="selectedRowKeys.length === 0"
          @click="changeCategorybatch"
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
                :options="record.historyCategoryList"
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
                @click="changeCategorySingle(record)"
                >更换分类</a-button
              >
              <p>
                {{ getHistoryPath(record) }}
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

    <!--  修改分类级联弹窗 -->
    <CategoryModal
      ref="categoryModalRef"
      :account="curRecord.account"
      @select="handleSelect"
    ></CategoryModal>
  </div>
</template>

<script setup>
  import { message } from 'ant-design-vue'
  import CategoryModal from '../comm/categoryModal.vue'
  import { historyCategory, addHistoryCategory, categoryAttributes } from '@/pages/ozon/config/api/product.js'
  import { batchSave, batchRelationDetail } from '@/pages/ozon/config/api/draft.js'
  import { cloneDeep } from 'lodash'

  const { shopAccount } = defineProps({
    shopAccount: {
      type: Array,
      default: () => []
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
  const curRecord = ref({}) // 选中的分类
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
  const attributes = ref([])

  function filterOption(input, option) {
    return option.threeCategoryName.indexOf(input) >= 0
  }

  const primaryImage = primaryImage => {
    if (primaryImage.includes('https')) {
      return primaryImage
    }
    return baseApi + primaryImage
  }

  // 选择历史分类
  const selectAttributes = async (item, value) => {
    item.optionsLoading = true
    item.filterAttrOptions = []
    item.innerTableData.forEach(innerItem => {
      innerItem.ozonTheme = undefined
      innerItem.attrLabel = undefined
    })
    item.categoryId = ''
    if (!value) return

    const findItem = item.historyCategoryList.find(item => {
      return item.threeCategoryId === value
    })
    item.categoryId = findItem.secondCategoryId
    const res = await categoryAttributes({
      account: item.account,
      descriptionCategoryId: findItem.secondCategoryId, // bug to do
      typeId: value
    })
    item.filterAttrOptions = filterAttrs(res.data)
    item.optionsLoading = false
  }

  // 更换分类
  const changeCategorySingle = record => {
    curRecord.value = record
    isSingleCategory.value = true
    nextTick(() => {
      categoryModalEl.value.open(record.typeId)
    })
  }

  const handleSelect = async data => {
    const account = curRecord.value.account
    if (isSingleCategory.value) {
      acceptParams.value.forEach(item => {
        if (curRecord.value.gatherProductId === item.gatherProductId) {
          item.typeId = data.value
          item.categoryId = data.ids[1]
          item.filterAttrOptions = []
          item.innerTableData.forEach(innerItem => {
            innerItem.ozonTheme = undefined
            innerItem.attrLabel = undefined
          })

          item.optionsLoading = true
        }
      })
      //  如果选择不在历史分类里面，则添加到历史里面
      const findItem = curRecord.value.historyCategoryList.find(item => {
        return item.threeCategoryId === data.value
      })

      if (!findItem) {
        let params = {
          account,
          secondCategoryId: data.ids[1],
          threeCategoryId: data.ids[2]
        }
        await addHistoryCategory(params)
        getHistoryCategoryList([curRecord.value])
        // 获取属性
        const res2 = await categoryAttributes({
          account,
          descriptionCategoryId: data.ids[1],
          typeId: data.value
        })
        if (res2.code === 200) {
          acceptParams.value.forEach(paramsItem => {
            if (curRecord.value.gatherProductId === paramsItem.gatherProductId) {
              paramsItem.filterAttrOptions = filterAttrs(res2.data)
              paramsItem.optionsLoading = false
            }
          })
        }
      } else {
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
            paramsItem.filterAttrOptions = filterAttrs(res.data)
          })
        }
      }
    } else {
      // 批量修改分类
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
      const findItem = curRecord.value.historyCategoryList.find(item => {
        return item.threeCategoryId === data.value
      })
      if (!findItem) {
        let params = {
          account,
          secondCategoryId: data.ids[1],
          threeCategoryId: data.ids[2]
        }
        await addHistoryCategory(params)
        getHistoryCategoryList(selectedRowList.value)
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
                paramsItem.filterAttrOptions = filterAttrs(res2.data)
                paramsItem.optionsLoading = false
              }
            })
          })
        }
      } else {
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
                paramsItem.filterAttrOptions = filterAttrs(res.data)
                paramsItem.optionsLoading = false
              }
            })
          })
        }
      }
      selectedRowKeys.value = []
      selectedRowList.value = []
    }
  }

  const accountName = account => {
    return shopAccount.find(item => item.account === account)?.simpleName
  }

  // 批量修改分类
  const changeCategorybatch = () => {
    curRecord.value = selectedRowList.value[0] // 定为第一个选择的产品(共用一个 account)
    isSingleCategory.value = false
    nextTick(() => {
      categoryModalEl.value.open('')
    })
  }

  //  获取路径
  const getHistoryPath = record => {
    const findItem = record.historyCategoryList.find(item => {
      return item.threeCategoryId === record.typeId
    })
    return findItem ? `${findItem.categoryName} > ${findItem.secondCategoryName} > ${findItem.threeCategoryName}` : ''
  }

  //  获取历史分类列表
  function getHistoryCategoryList(productList) {
    const accountList = Array.from(new Set(productList.map(item => item.account)))
    // const listObj = {}
    accountList.forEach(account => {
      historyCategory({ account }).then(res => {
        // listObj[account] = res.data || []
        const list = res.data || []
        // 给每条产品数据内置分类列表
        acceptParams.value.forEach(item => {
          if (item.account === account) {
            item.historyCategoryList = list
          }
        })
      })
    })
  }

  // 初始化时获取分类属性
  function getCategoryAttributes() {
    const paramsList = acceptParams.value.filter(paramItem => paramItem.typeId)
    //  去重
    const uniqueParamsList = paramsList.filter((item, index) => {
      return paramsList.findIndex(i => i.typeId === item.typeId) === index
    })
    uniqueParamsList.forEach(item => {
      categoryAttributes({
        account: item.account,
        descriptionCategoryId: item.categoryId,
        typeId: item.typeId
      }).then(res => {
        if (res.code === 200) {
          acceptParams.value.forEach(paramsItem => {
            if (item.typeId === paramsItem.typeId) {
              paramsItem.filterAttrOptions = filterAttrs(res.data)
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
          item.typeId = findItem.typeId
          item.categoryId = findItem.categoryId
          // item.variantAttr = findItem.detailData || {}
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

  // 关联的结对变种属性
  const TWINS = [
    [10096, 10097], // [商品颜色, 颜色名称]
    [4295, 9533] // [俄罗斯尺码, 制造商尺码]
  ]
  // 过滤出变种属性, 颜色, 尺寸只保留一个
  function filterAttrs(list) {
    let aspectList = list.filter(attrItem => attrItem.isAspect)
    TWINS.forEach(arr => {
      const ids = aspectList.map(item => item.id)
      if (arr.every(id => ids.includes(id))) {
        // 删后一个 id
        aspectList = aspectList.filter(item => item.id !== arr[1])
      }
    })
    const resList = aspectList.map(attrItem => {
      return {
        label: attrItem.name.replace(/\(.*\)/, ''), // 去掉（）里面的
        value: attrItem.id,
        attrLabel: attrItem.name
      }
    })

    return resList
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
        historyCategoryList: [],
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
    getHistoryCategoryList(acceptParams.value)
    // 分类属性
    getCategoryAttributes()
  }

  const cancel = () => {
    platformSource.value = ''
    isSingleCategory.value = false
    curRecord.value = {}
    acceptParams.value = []
    copyAcceptParams.value = []
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
        relationType: 2, // 1-数据采集; 2-采集箱; 3-待发布; 4-已发布;
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
