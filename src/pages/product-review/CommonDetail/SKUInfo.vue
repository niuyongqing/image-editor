<!-- SKU信息 变种 -->
<template>
  <div>
    <a-card
      title="SKU信息"
      class="text-left"
    >
      <a-card
        title="变种属性"
        :loading="loading"
      >
        <div>
          <span class="">变种主题：</span>
          <a-button
            v-for="(item, index) in themeBtns"
            :key="'add' + index + item.name"
            type="link"
            size="middle"
            class="mr-2.5"
            @click="enterVariantType(item)"
          >
            <AsyncIcon icon="PlusCircleOutlined"></AsyncIcon>
            {{ item.name }}
          </a-button>

          <a-card
            v-for="(items, index) in attributeList"
            :key="items.id"
            style="margin-top: 10px"
          >
            <template #title>
              <span style="font-weight: bolder"
                >变种主题{{ index + 1 }}：
                <i
                  v-if="items.isRequired"
                  style="color: red; margin-right: 2px"
                  >*</i
                >
                <span>{{ items.name }}</span>
              </span>
              <a-button
                type="link"
                v-if="[10096, 4295].includes(items.id)"
                @click="setColor(items)"
                style="float: right"
                size="middle"
                >批量设置</a-button
              >
              <a-popconfirm
                icon-color="red"
                title="确定要删除这个变种主题吗？"
                @confirm="removeVariantType(items, index)"
              >
                <a-button
                  type="text"
                  danger
                  v-if="!items.isRequired"
                  style="float: right"
                  size="middle"
                  >移除</a-button
                >
              </a-popconfirm>
            </template>
            <a-table
              :columns="items.tableColumns"
              :data-source="items.tableData"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === record.name">
                  <!-- 单选 -->
                  <div
                    v-if="record.selectType == 'select'"
                    class="w-4/5"
                  >
                    <a-select
                      v-model:value="record.modelValue"
                      class="w-full"
                      size="middle"
                      optionFilterProp="label"
                      labelInValue
                      allowClear
                      show-search
                      placeholder="请选择"
                      @change="pushValue(index, items)"
                    >
                      <a-select-option
                        v-for="items in record.details"
                        :key="items.id"
                        :label="items.label"
                        :value="items"
                        >{{ items.label }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <!-- 多选 -->
                  <div
                    v-if="record.selectType == 'multSelect'"
                    class="w-4/5"
                  >
                    <a-select
                      v-model:value="record.modelValue"
                      class="w-full"
                      size="middle"
                      optionFilterProp="label"
                      allowClear
                      mode="multiple"
                      placeholder="请选择"
                      labelInValue
                      @change="pushValue(index, items)"
                      :options="record.details"
                    >
                    </a-select>
                  </div>
                  <!-- 输入框 -->
                  <div
                    v-if="record.selectType == 'input'"
                    class="w-4/5"
                  >
                    <a-input-number
                      v-if="record.type == 'Integer'"
                      size="middle"
                      allowClear
                      v-model:value="record.modelValue"
                      placeholder="请输入内容"
                      class="w-full"
                      @blur="pushValue(index, items)"
                    ></a-input-number>
                    <a-input
                      v-else
                      v-model:value="record.modelValue"
                      size="middle"
                      allowClear
                      class="w-full"
                      placeholder="请输入内容"
                      @blur="pushValue(index, items)"
                    ></a-input>
                  </div>
                </template>
                <template v-if="column.dataIndex === record[column.dataIndex]">
                  <a-input
                    v-model:value="record.secondModelValue"
                    size="middle"
                    allowClear
                    class="w-4/5"
                    placeholder="请输入内容"
                    @blur="pushValue(index, items)"
                  ></a-input>
                </template>
                <template v-if="column.dataIndex === 'options'">
                  <div>
                    <a-button
                      class="mr-2.5"
                      @click="addItem(record, items)"
                    >
                      <AsyncIcon icon="PlusCircleOutlined"></AsyncIcon>
                    </a-button>
                    <a-button
                      v-if="items.tableData.length != 1"
                      @click="removeItem(record, items)"
                    >
                      <AsyncIcon icon="MinusCircleOutlined"></AsyncIcon>
                    </a-button>
                  </div>
                </template>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-card>
      <a-card
        title="变种信息"
        class="text-left mt-5 z-11 relative"
        :loading="loading"
      >
        <!-- 自定义变种信息 -->
        <!-- <div class="flex mb-2.5">
          <a-checkbox-group
            v-model:value="addHeaderList"
            :disabled="tableData.length == 0"
            :options="plainOptions"
            @change="changeHeade"
          />
        </div> -->
        <a-table
          bordered
          :columns="filteredHeaderList"
          :data-source="tableData"
          :pagination="false"
        >
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'colorImg'">
              <div><span style="color: #ff0a37">*</span> {{ column.title }}</div>
              <a-dropdown>
                <a>
                  (批量
                  <DownOutlined />)
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      :preview="{ visible: false }"
                      @click="bigImgvisible = true"
                    >
                      查看大图
                      <div style="display: none">
                        <a-image-preview-group
                          style="width: 90% !important"
                          :preview="{ visible: bigImgvisible, onVisibleChange: vis => (bigImgvisible = vis) }"
                        >
                          <a-image
                            v-for="(item, index) in tableData"
                            :key="index"
                            :src="item.colorImg.length > 0 ? processImageSource(item.colorImg[0]?.url) : ''"
                          />
                        </a-image-preview-group>
                      </div>
                    </a-menu-item>
                    <a-menu-item @click="changeImgSize"> 批量改图片尺寸 </a-menu-item>
                    <a-menu-item @click="changeImgTranslation"> 图片翻译 </a-menu-item>
                    <a-sub-menu
                      key="sub1"
                      title="添加水印"
                    >
                      <a-menu-item
                        v-for="item in watermark"
                        :key="item"
                        @click="changeImgWater(item)"
                      >
                        {{ item.title }}
                      </a-menu-item>
                    </a-sub-menu>
                    <a-menu-item @click="clearImg"> 清空图片 </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <template v-if="column.dataIndex === 'sellerSKU'">
              <div class="flex flex-col min-w-25">
                <span><span style="color: #ff0a37">*</span> {{ column.title }}</span
                ><a
                  class="ml-1.25"
                  @click="batchSKU"
                  >批量</a
                >
              </div>
            </template>
            <template v-if="column.dataIndex === 'skuTitle'">
              <div class="flex flex-col min-w-25">
                <span><span style="color: #ff0a37">*</span> {{ column.title }}</span
                ><a
                  class="ml-1.25"
                  @click="batchSkuTitle"
                  >批量</a
                >
              </div>
            </template>
            <template v-if="column.dataIndex === 'costPrice'">
              <div class="flex flex-col min-w-25">
                <span><span style="color: #ff0a37">*</span> {{ column.title }}</span
                ><a
                  class="ml-1.25"
                  @click="batchPrice"
                  >批量</a
                >
              </div>
            </template>
            <template v-if="column.dataIndex === 'quantity'">
              <div class="flex flex-col min-w-25">
                <span><span style="color: #ff0a37">*</span> {{ column.title }}</span
                ><a
                  class="ml-1.25"
                  @click="batchStock('all')"
                  >批量</a
                >
              </div>
            </template>
            <template v-if="column.dataIndex === 'packageLength'">
              <span><span style="color: #ff0a37">*</span> {{ column.title }}(mm)</span
              ><a
                class="ml-1.25"
                @click="batchPackLength"
                >批量</a
              >
              <p>长*宽*高*重量</p>
            </template>
          </template>
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'colorImg'">
              <a-image
                v-if="record.colorImg.length > 0"
                style="position: relative"
                :width="100"
                :src="processImageSource(record.colorImg[0].url)"
              />
              <div
                v-if="record.colorImg.length > 0"
                style="position: absolute; top: 5px; right: 5px"
              >
                <AsyncIcon
                  icon="CloseCircleOutlined"
                  size="20px"
                  color="black"
                  @click="record.colorImg = []"
                />
              </div>
              <a-upload
                v-if="record.colorImg.length == 0"
                class="h-20 w-20 headerImg"
                :headers="headers"
                accept=".jpg,.jpeg,.png"
                :action="uploadUrl"
                :showUploadList="false"
                list-type="picture-card"
                :max-count="1"
                @change="e => handleChangeColroImg(e, record)"
              >
                <div>
                  <AsyncIcon icon="PlusOutlined" />
                  <div>上传图片</div>
                </div>
              </a-upload>
            </template>
            <template v-if="column.dataIndex === 'skuTitle'">
              <a-input
                class="min-w-200px"
                v-model:value="record.skuTitle"
                :title="record.skuTitle"
                size="middle"
              />
            </template>
            <template v-if="column.dataIndex === 'secondName'">
              <span class="min-w-200px">{{ record.secondName }}</span>
            </template>
            <template v-if="column.dataIndex === 'sellerSKU'">
              <a-input
                v-model:value.trim="record.sellerSKU"
                size="middle"
                @change="sellerSKUChange(record)"
              ></a-input>
            </template>
            <template v-if="!otherHeader.includes(column.dataIndex)">
              <a-input
                v-if="column.selectType === 'input'"
                v-model:value="record[column.dataIndex]"
                size="middle"
                class="min-w-200px"
              ></a-input>
              <a-select
                v-if="column.selectType === 'select'"
                v-model:value="record[column.dataIndex]"
                size="middle"
                class="min-w-200px"
                :options="column.options"
              ></a-select>
              <a-select
                v-if="column.selectType === 'multSelect'"
                v-model:value="record[column.dataIndex]"
                size="middle"
                :options="column.options"
                :maxTagCount="2"
                class="min-w-200px"
                mode="tags"
              ></a-select>
            </template>
            <template v-if="column.dataIndex === 'costPrice'">
              <div class="flex justify-center">
                <a-input-number
                  :min="0"
                  size="middle"
                  :controls="false"
                  :max="99999999"
                  :precision="2"
                  v-model:value="record.costPrice"
                  class="w-full"
                ></a-input-number>
                <a-dropdown>
                  <AsyncIcon
                    icon="CopyOutlined"
                    class="ml-2.5 cursor-pointer"
                    size="15px"
                  >
                  </AsyncIcon>
                  <template #overlay>
                    <a-menu @click="confirmMenuClick($event, record, 'costPrice')">
                      <a-menu-item
                        v-for="menuItem in confirmMenuList"
                        :key="menuItem.key"
                        >{{ menuItem.label }}</a-menu-item
                      >
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
            <template v-if="column.dataIndex === 'quantity'">
              <div class="flex justify-center">
                <span>{{ record.quantity === undefined ? 0 : record.quantity }}</span>
                <AsyncIcon
                  class="ml-2.5"
                  icon="EditOutlined"
                  @click="batchStock('single', record)"
                ></AsyncIcon>
              </div>
            </template>
            <template v-if="column.dataIndex === 'packageLength'">
              <div class="flex">
                <div class="flex items-center">
                  <div>
                    <a-input-number
                      v-model:value="record.packageLength"
                      controls-position="right"
                      class="min-w-100px"
                      size="middle"
                      :min="0"
                      placeholder="长度"
                      :controls="false"
                    >
                      <template #addonAfter>mm</template>
                    </a-input-number>
                  </div>
                  <div class="ml-2.5">
                    <a-input-number
                      v-model:value="record.packageWidth"
                      controls-position="right"
                      class="min-w-100px"
                      size="middle"
                      :min="0"
                      placeholder="宽度"
                      :controls="false"
                    >
                      <template #addonAfter>mm</template>
                    </a-input-number>
                  </div>
                  <div class="ml-2.5">
                    <a-input-number
                      v-model:value="record.packageHeight"
                      controls-position="right"
                      class="min-w-100px"
                      :min="0"
                      size="middle"
                      placeholder="高度"
                      :controls="false"
                    >
                      <template #addonAfter>mm</template>
                    </a-input-number>
                  </div>
                  <div class="ml-2.5">
                    <a-input-number
                      v-model:value="record.packageWeight"
                      controls-position="right"
                      class="min-w-100px"
                      :precision="0"
                      size="middle"
                      :min="0"
                      placeholder="重量"
                      :controls="false"
                    >
                      <template #addonAfter>g</template>
                    </a-input-number>
                  </div>
                </div>
                <div class="flex">
                  <a-dropdown>
                    <AsyncIcon
                      icon="CopyOutlined"
                      class="ml-2.5 cursor-pointer"
                      size="15px"
                    >
                    </AsyncIcon>
                    <template #overlay>
                      <a-menu @click="confirmMenuClick($event, record, 'size')">
                        <a-menu-item
                          v-for="menuItem in confirmMenuList"
                          :key="menuItem.key"
                          >{{ menuItem.label }}</a-menu-item
                        >
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'options'">
              <div>
                <a-popconfirm
                  title="确定要删除这个SKU吗？"
                  @confirm="deleteVariable(record, index)"
                >
                  <a-button
                    v-if="tableData.length != 1"
                    type="text"
                    danger
                    >删除</a-button
                  >
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-card>
    <a-divider />

    <!-- 修改库存 -->
    <EditProdQuantity
      :editQuantityVis="editQuantityVis"
      :editStockList="editStockList"
      @backQuantity="backQuantity"
      @backCloseQuantity="editQuantityVis = false"
    />
    <!-- 批量修改 -->
    <BatchEditModal
      :batchOpen="batchOpen"
      :batchTitle="batchTitle"
      :batchType="batchType"
      @batchEditModalClose="batchOpen = false"
      @backValue="backValue"
    />
    <!-- 选择自定义属性  -->
    <SelectAttr
      :attrVisible="attrVisible"
      :custAttr="custAttr"
      :newAttribute="newAttribute"
      @selectAttrList="selectAttrList"
      @handleStatsModalClose="attrVisible = false"
    />
    <!-- 批量设置变种属性 -->
    <BatchSetColor
      :setValueVis="setValueVis"
      :setColorOption="setColorOption"
      @closeColorModal="setValueVis = false"
      @confirm="confirm"
      @handleCancel="handleColorCancel"
    />
    <!-- 批量修改颜色样本大小 -->
    <BacthEditColorImg ref="bacthEditColorImgRef" />
    <!-- 颜色样本翻译 -->
    <ColorImgTranslation ref="colorImgTranslationRef" />
  </div>
</template>

<script setup>
  import AsyncIcon from '~/layouts/components/menu/async-icon.vue'
  import { message, Modal } from 'ant-design-vue'
  import { watermarkListApi, watermarkApi } from '@/api/common/water-mark'
  import { productWarehouse, templateList } from '@/pages/ozon/config/api/product'
  import {
    updatePrice,
    endResult,
    processAttributesCache,
    reorderArray,
    cartesianProduct,
    processResult,
    processData,
    checkSellerSKU,
    hasDuplicateModelValues,
    checkData,
    rearrangeColorFields,
    handleTheme,
    processImageSource,
    customSort
  } from '@/pages/ozon/config/commJs/index'
  import { columns, otherList } from './config'
  import { debounce, cloneDeep } from 'lodash'
  import { imageUrlUpload } from '@/pages/sample/acquisitionEdit/js/api.js'
  import { FileOutlined, SettingOutlined, DownOutlined } from '@ant-design/icons-vue'
  import { v4 as uuidv4 } from 'uuid'
  import EditProdQuantity from '@/pages/ozon/productPublish/comm/EditProdQuantity.vue'
  import SelectAttr from '@/pages/ozon/productPublish/comm/SelectAttr.vue'
  import BatchEditModal from '@/pages/ozon/config/component/batchEditModal/index.vue'
  import BatchSetColor from '@/pages/ozon/editWaitProduct/comm/batchSetColor.vue'
  import ColorImgTranslation from '@/pages/ozon/editWaitProduct/comm/colorImgTranslation.vue'
  import BacthEditColorImg from '@/pages/ozon/editWaitProduct/comm/bacthEditColorImg.vue'

  const store = useProductReviewStore()
  const productDetail = computed(() => store.productDetail)

  const bacthEditColorImgRef = ref()
  const colorImgTranslationRef = ref()

  const bigImgvisible = ref(false)
  const themeBtns = ref([]) //主题按钮
  const requiredList = ref([]) //必填变种主题
  const attributeList = ref([]) //变种主题卡片
  const tableData = ref([])
  const watermark = ref([])
  const editQuantityVis = ref(false)
  const batchOpen = ref(false)
  const batchTitle = ref('')
  const batchType = ref('')
  const headerList = ref([]) //动态表头
  const addHeaderList = ref([])
  const quantityRow = ref({})
  const types = ref('')
  const editStockList = ref([])
  const attrVisible = ref(false)
  const setValueVis = ref(false) //批量设置属性
  const newAttribute = ref([])
  const setColorOption = ref([])
  const colorRow = ref({})
  const custAttr = ref([]) //可控制属性
  const templateValue = ref('')
  const tempList = ref([])
  const databaseSkuList = ref([]) // 资料库产品数据回显
  const plainOptions = [
    {
      label: '颜色样本',
      value: 'colorImg'
    },
    {
      label: '设置SKU标题',
      value: 'skuTitle'
    }
  ]
  const otherHeader = otherList
  let isConform = false

  const headers = {
    Authorization: 'Bearer ' + useAuthorization().value
  }
  const uploadUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/img'

  const loading = computed(() => store.loading)

  watch(
    () => tableData.value,
    data => {
      store.$patch(state => {
        state.SKUTableData = data
      })
    }
  )
  // 监听 attributeList, 获取变种名列表
  const attrList = ref([])
  watch(
    () => attributeList.value,
    () => {
      attrList.value = attributeList.value.map(item => item.tableColumns.slice(0, -1).map(column => column.title))

      store.$patch(state => {
        state.attrList = attrList.value
      })
    }
  )

  const handleChangeColroImg = (info, record) => {
    if (info.file.status === 'done') {
      record.colorImg.push({
        name: info.file.response.originalFilename,
        url: '/prod-api' + info.file.response.url,
        checked: false,
        width: info.file.response.width,
        height: info.file.response.height
      })
    }
    if (info.file.status === 'error') {
      message.error('图片上传有误！')
    }
  }

  // 批量设置变种属性
  const setColor = row => {
    colorRow.value = row
    setValueVis.value = true
    setColorOption.value = row.details.map(item => {
      return {
        label: item.value,
        value: item.id
      }
    })
  }
  // 批量设置变种属性后数据清空
  const handleColorCancel = () => {
    setValueVis.value = false
    setColorOption.value = []
  }
  // 批量设置属性
  const confirm = selectedValues => {
    // 解构只需要用到的details属性
    const { details } = colorRow.value.tableData[0] || {}
    const result = details?.filter(item => new Set(selectedValues).has(item.id)) || []

    // 获取已存在的属性并去重
    const existingAttributes = colorRow.value.tableData.flatMap(item => item?.modelValue?.map(v => v) || []).filter(Boolean)

    // 根据是否存在已有属性进行过滤
    const filteredResult = existingAttributes.length > 0 ? result.filter(item => !new Set(existingAttributes.map(a => a.id)).has(item.id)) : result

    // 统一处理表格更新
    colorRow.value.tableData = procTableData(colorRow.value.tableData, filteredResult)
    tableData.value = commProceData()
  }

  // 此方法用于处理属性批量添加到主题中
  const procTableData = (newData, newItems) => {
    // 深拷贝原始数据避免污染
    const processedData = cloneDeep(newData)
    const usedIds = new Set()

    // 第一阶段：填充空值项
    let itemIndex = 0
    for (const item of processedData) {
      if (item.modelValue.length === 0 && newItems[itemIndex]) {
        item.modelValue = [cloneDeep(newItems[itemIndex])]
        usedIds.add(newItems[itemIndex].id)
        itemIndex++
      }
    }

    // 第二阶段：创建新条目
    const remainingItems = newItems.filter(item => !usedIds.has(item.id))
    const baseTemplate = processedData[0] ? cloneDeep(processedData[0]) : {}
    delete baseTemplate.uniqueId // 清除可能存在的临时ID

    remainingItems.forEach(item => {
      processedData.push({
        ...baseTemplate,
        modelValue: [cloneDeep(item)],
        uniqueId: Date.now() + Math.random().toString(36).slice(2)
      })
    })

    return processedData.filter(
      item => item.modelValue.length > 0 || item.uniqueId // 保留新创建的空条目
    )
  }

  // 颜色样本- 批量改图片尺寸
  const changeImgSize = () => {
    bacthEditColorImgRef.value.showModal(tableData.value)
  }
  // 颜色样本- 添加水印
  const changeImgWater = async item => {
    for (const tabbleItem of tableData.value) {
      const fileList = tabbleItem.colorImg || []
      if (fileList.length === 0) {
        continue
      }
      const netPathList = fileList
        .filter(file => file.url.includes('http'))
        .map(item => {
          return item.url
        })
      // 只有本地图片
      if (netPathList.length === 0) {
        const imagePathList = fileList
          .filter(file => !file.url.includes('http'))
          .map(item => {
            return item.url
          })
        const waterRes = await watermarkApi({
          imagePathList: imagePathList, //
          id: item.id
        })
        if (waterRes.code === 200) {
          const data = waterRes.data || []
          data.forEach(item => {
            fileList.forEach(v => {
              if (item.originalFilename === v.url) {
                v.url = item.url
                v.name = item.newFileName
                v.checked = false
              }
            })
          })
        }
      } else {
        // 有网络图片
        const fileList = tabbleItem.colorImg || []
        for (let index = 0; index < fileList.length; index++) {
          const fileItem = fileList[index]
          try {
            let netImgs = []
            const url = fileItem.url
            if (url.includes('http')) {
              let res = await imageUrlUpload({ url })
              netImgs.push(res.data)
              fileList.forEach(i => {
                if (i.url === url) {
                  i.url = res.data.url
                }
              })
              const waterRes = await watermarkApi({
                imagePathList: netImgs.map(img => img.url),
                id: item.id
              })
              if (waterRes.code === 200) {
                const data = waterRes.data || []
                data.forEach(_item => {
                  fileList.forEach(v => {
                    if (_item.originalFilename.includes(v.url)) {
                      v.url = _item.url
                      v.name = _item.newFileName
                      v.checked = false
                    }
                  })
                })
              }
            } else {
              const imagePathList = fileList
                .filter(file => !file.url.includes('http'))
                .map(item => {
                  return item.url
                })
              const waterRes = await watermarkApi({
                imagePathList: imagePathList, //
                id: item.id
              })
              if (waterRes.code === 200) {
                const data = waterRes.data || []
                data.forEach(item => {
                  fileList.forEach(v => {
                    if (item.originalFilename === v.url) {
                      v.url = item.url
                      v.name = item.newFileName
                      v.checked = false
                    }
                  })
                })
              }
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
  }
  // 颜色样本- 清空图片
  const clearImg = () => {
    tableData.value.forEach(item => {
      item.colorImg = []
    })
  }
  // 打开 颜色样本- 图片翻译
  const changeImgTranslation = () => {
    colorImgTranslationRef.value.showModal(tableData.value)
  }

  // 添加自定义属性
  const selectAttrList = list => {
    newAttribute.value = list
    const namesInA = list.map(item => item.name)
    // 删除重复元素
    if (list.length === 0) {
      headerList.value = headerList.value.filter(item => !(item.type === 3))
    } else {
      headerList.value = headerList.value.filter(item => item.type !== 3 || (item.type === 3 && namesInA.includes(item.title)))
    }
    let obj = {}
    // 再添加新的不重复元素
    list.forEach(item => {
      if (!headerList.value.find(obj => obj.title === item.name)) {
        obj = {
          title: item.name,
          dataIndex: item.name,
          selectType: item.selectType,
          type: 3,
          options: item.options,
          show: true,
          align: 'center'
        }
        const index = headerList.value.findIndex(item => item.dataIndex === 'sellerSKU')
        headerList.value.splice(index + 1, 0, obj)
      }
    })
    const displayAttr = store.attributes
    const idMap = new Map()
    list.forEach(item => {
      idMap.set(item.id, true)
    })

    displayAttr.forEach(item => {
      item.show = idMap.has(item.id) ? false : true
    })
  }

  /** 尺寸数据应用到 按钮 */
  const PERMANENT_LIST = [{ label: '所有变种', key: 'applyAll' }]
  const confirmMenuList = computed(() => {
    const variantAttrList = attrList.value.map(list => list.join('-')).map(name => ({ label: `应用到同 ${name} 的变种`, key: name }))
    return [...PERMANENT_LIST, ...variantAttrList]
  })

  function confirmMenuClick({ key }, record, type) {
    // 定义不同type对应的属性映射关系
    const propertyMap = {
      size: ['packageLength', 'packageWidth', 'packageHeight', 'packageWeight'],
      costPrice: ['costPrice']
    }
    // 根据type获取对应的属性列表，默认不复制任何属性
    const properties = propertyMap[type] || []

    if (key === 'applyAll') {
      tableData.value.forEach(item => {
        properties.forEach(prop => {
          item[prop] = cloneDeep(record[prop])
        })
      })
    } else {
      const keyList = key.split('-')
      tableData.value.forEach(item => {
        if (keyList.every(key => item[key] === record[key])) {
          properties.forEach(prop => {
            item[prop] = cloneDeep(record[prop])
          })
        }
      })
    }
  }

  const filteredHeaderList = computed(() => {
    return headerList.value.filter(item => item.show === true)
  })

  // 处理数据格式
  const processDataFormat = (list = []) => {
    let newHeaderList = handleTheme(list)
    const insertIndex = headerList.value.length - 6
    for (let i = list.length - 1; i >= 0; i--) {
      headerList.value.splice(insertIndex, 0, {
        dataIndex: list[i].name,
        id: list[i].id,
        title: list[i].name,
        show: true,
        align: 'center'
      })
    }
    attributeList.value = [...attributeList.value, ...newHeaderList]
  }

  // 手动添加多个变种主题
  const enterVariantType = item => {
    let arr = []
    if (isConform && item.id === 10096) {
      arr = [
        {
          ...item
        },
        {
          selectType: 'input',
          id: 10097,
          isAspect: true,
          isCollection: false,
          isRequired: false,
          name: '颜色名称(Название цвета)',
          isAspect: true,
          isCollection: false,
          isRequired: false
        }
      ]
    } else {
      arr.push(item)
    }
    processDataFormat(arr)
    for (let i = 0; i < themeBtns.value.length; i++) {
      if (themeBtns.value[i].id === item.id) {
        themeBtns.value.splice(i, 1)
        break
      }
    }
  }
  // 移除主题操作
  const removeVariantType = (item, index) => {
    attributeList.value.splice(index, 1)
    let name = item.tableData[0].name
    let secondName = item.tableData[0].secondName
    // 表头删除
    headerList.value = headerList.value.filter(e => e.title != item.title)
    if (secondName) {
      headerList.value = headerList.value.filter(e => e.title != secondName)
    }

    let newThem = {
      options: item.details,
      show: false,
      selectType: item.selectType,
      id: item.id,
      isRequired: item.isRequired,
      categoryDependent: item.categoryDependent,
      isCollection: item.isCollection,
      name: item.name,
      isAspect: item.isAspect
    }
    themeBtns.value.unshift(newThem)

    /** 移除变种主题后需要重新生成变种信息 table 数据 */
    let cartesianProducts = cartesianProduct(attributeList.value)
    let newTableData = processResult(cartesianProducts)
    tableData.value = newTableData
  }
  // 添加多个属性操作
  const addItem = (item, row) => {
    let ele = {}
    if (isConform && item.id === 10096) {
      ele = {
        id: item.id,
        name: item.name,
        modelValue: item.selectType === 'multSelect' ? [] : undefined,
        selectType: item.selectType,
        details: item.details,
        secondName: '颜色名称(Название цвета)',
        '颜色名称(Название цвета)': '颜色名称(Название цвета)',
        secondId: 10097,
        secondModelValue: ''
      }
    } else if (isConform && item.id === 4295) {
      ele = {
        id: item.id,
        name: item.name,
        modelValue: item.selectType === 'multSelect' ? [] : undefined,
        selectType: item.selectType,
        details: item.details,
        secondName: '由制造商规定尺码(Размер производителя)',
        '由制造商规定尺码(Размер производителя)': '由制造商规定尺码(Размер производителя)',
        secondId: 9533,
        secondModelValue: ''
      }
    } else {
      ele = {
        id: Date.now(),
        name: item.name,
        modelValue: item.selectType === 'multSelect' ? [] : undefined,
        selectType: item.selectType,
        details: item.details
      }
    }
    row.tableData.push(ele)
  }

  // 移除多个属性操作
  const removeItem = (item, row) => {
    let ind = row.tableData.indexOf(item)
    if (item.id === 10096) {
      row.tableData.splice(ind, 1)
    } else if (item.id === 4295) {
      row.tableData.splice(ind, 1)
    } else {
      if (ind !== -1) {
        row.tableData.splice(ind, 1)
      } else if (item.selectType === 'select' || item.selectType === 'input') {
        row.tableData = row.tableData.filter(tableItem => tableItem.id !== item.id)
      } else {
        // 获取需要排除的ID集合
        const excludeIds = item.modelValue.map(mv => mv.id) // [971918068]
        // 过滤掉包含这些ID的项
        row.tableData = row.tableData.filter(tableItem => {
          // 检查当前项的modelValue是否包含排除ID
          return !tableItem.modelValue.some(mv => excludeIds.includes(mv.id))
        })
      }
    }

    // 获取所有需要删除的标签
    const deletedLabels =
      item.selectType === 'multSelect'
        ? item.modelValue.map(v => v.label?.trim()) // 增加trim处理
        : []
    const deletedSet = new Set(deletedLabels) // 改用Set提高查询效率

    let newData = tableData.value.filter(row => {
      const rowValue = String(row[item.name] || '')
      const inputValue = String(item.modelValue || '')

      if (item.selectType === 'select') {
        // 选择类型使用ID过滤
        return !(Array.isArray(row.attrIdList) && row.attrIdList.some(id => id === item.id))
      } else if (item.selectType === 'input') {
        // input类型同时检查ID和输入值
        const hasId = Array.isArray(row.attrIdList) && row.attrIdList.some(id => id === item.id)
        const valueMatch = rowValue === inputValue
        return !(hasId || valueMatch)
      } else {
        // 多选类型使用标签过滤
        return !deletedLabels?.some(val => val != null && String(val) === rowValue)
      }
    })

    tableData.value = newData
  }

  // 将根据主题中选择的数据进行添加到表格中
  const pushValue = (index, item) => {
    let flag = hasDuplicateModelValues(attributeList.value)
    if (flag) {
      message.error('变种属性值不能有相同的，请修改')
      return
    }
    tableData.value = commProceData()
  }

  const commProceData = () => {
    let cartesianProducts = cartesianProduct(attributeList.value)
    let newTableData = processResult(cartesianProducts)
    let minLength = Math.min(newTableData.length, tableData.value.length)
    for (let i = 0; i < minLength; i++) {
      // 将b数组中对应下标的数据赋值到a数组中
      newTableData[i].skuTitle = tableData.value[i].skuTitle
      newTableData[i].sellerSKU = tableData.value[i].sellerSKU
      newTableData[i].costPrice = tableData.value[i].costPrice
      newTableData[i].colorImg = tableData.value[i].colorImg
      // newTableData[i].imageUrl = tableData.value[i].imageUrl
      newTableData[i].mainImages = tableData.value[i].mainImages
      newTableData[i].subImages = tableData.value[i].subImages
      newTableData[i].imageList = tableData.value[i].imageList
      newTableData[i].quantity = tableData.value[i].quantity
      newTableData[i].warehouseList = tableData.value[i].warehouseList
      newTableData[i].packageHeight = tableData.value[i].packageHeight
      newTableData[i].packageLength = tableData.value[i].packageLength
      newTableData[i].packageWidth = tableData.value[i].packageWidth
      newTableData[i].packageWeight = tableData.value[i].packageWeight
    }
    return newTableData
  }

  // 动态添加表头数据
  const changeHeade = () => {
    //  删除重复元素
    headerList.value = headerList.value.filter(item => item.type !== 1 || (item.type == 1 && addHeaderList.value.includes(item.dataIndex)))
    let obj = {}
    // 再添加新的不重复元素
    addHeaderList.value.forEach(item => {
      if (!headerList.value.find(obj => obj.dataIndex === item)) {
        obj = {
          dataIndex: item,
          title: item == 'colorImg' ? '颜色样本' : 'SKU标题',
          selectType: item == 'colorImg' ? 'url' : 'input',
          type: 1,
          options: null,
          show: true,
          align: 'center'
        }
        if (item == 'colorImg') {
          headerList.value.unshift(obj)
        } else if (item == 'skuTitle') {
          let skuIndex = headerList.value.findIndex(item => item.title === 'SKU')
          headerList.value.splice(skuIndex + 1, 0, obj)
        } else {
          headerList.value.push(obj)
        }
      }
    })

    store.$patch(state => {
      state.addHeaderList = addHeaderList.value
    })
  }

  // 删除表格数据
  const deleteVariable = (row, index) => {
    tableData.value.splice(index, 1)
    attributeList.value = processData(attributeList.value, tableData.value)
  }

  // 批量修改成本价
  const batchPrice = () => {
    if (tableData.value.length == 0) {
      message.warning('请先添加sku！')
      return
    }
    batchOpen.value = true
    batchTitle.value = '批量修改成本价'
    batchType.value = 'costPrice'
  }
  // 批量修改SKU
  const batchSKU = () => {
    if (tableData.value.length == 0) {
      message.warning('请先添加sku！')
      return
    }
    batchOpen.value = true
    batchTitle.value = '批量修改SKU'
    batchType.value = 'sku'
  }
  // 批量修改SKU标题
  const batchSkuTitle = () => {
    if (tableData.value.length == 0) {
      message.warning('请先添加sku！')
      return
    }
    batchOpen.value = true
    batchTitle.value = '批量修改SKU标题'
    batchType.value = 'skuTitle'
  }
  // 修改 SKU 时同步修改 warehouseList 里的 skuCode
  const sellerSKUChange = debounce(record => {
    record.warehouseList.forEach(item => {
      item.skuCode = record.sellerSKU
    })
  }, 200)
  // 批量修改库存
  const batchStock = (type, row = {}) => {
    if (tableData.value.length == 0) {
      message.warning('请先添加sku！')
      return
    }
    getEditStore(shopCode)
    quantityRow.value = row
    editQuantityVis.value = true
    types.value = type
  }

  //修改库存
  const backQuantity = (quantities, copyList) => {
    // 生成仓库条目函数（过滤空值并映射结构）
    const createWarehouseEntries = (skuCode, copyList) =>
      copyList[0].children
        .filter(item => item.stock != null && item.stock !== '')
        .map(item => ({
          skuCode,
          warehouseId: item.warehouseId,
          present: item.stock,
          warehouseName: item.name
        }))

    // 按仓库ID去重函数
    const deduplicateByWarehouseId = entries => Array.from(new Map(entries.map(item => [item.warehouseId, item])).values())

    if (types.value === 'single') {
      // 单规格模式
      quantityRow.value.quantity = quantities
      quantityRow.value.warehouseList = createWarehouseEntries(quantityRow.value.sellerSKU, copyList)
    } else {
      // 多规格模式
      tableData.value.forEach(e => {
        e.quantity = quantities
        const entries = createWarehouseEntries(e.sellerSKU, copyList)
        e.warehouseList = deduplicateByWarehouseId(entries)
      })
    }
  }

  const batchPackLength = () => {
    if (tableData.value.length == 0) {
      message.warning('请先添加sku！')
      return
    }
    batchOpen.value = true
    batchTitle.value = '批量修改尺寸'
    batchType.value = 'packLength'
  }

  const backValue = batchFields => {
    switch (batchType.value) {
      case 'sku':
        tableData.value.forEach(item => {
          item.sellerSKU = batchFields.batchValue
          item.warehouseList.forEach(warehouse => {
            warehouse.skuCode = item.sellerSKU
          })
        })
        break
      case 'skuTitle':
        tableData.value.forEach(item => {
          item.skuTitle = batchFields.batchValue
        })
        break
      case 'costPrice':
        updatePrice(tableData.value, 'costPrice', batchFields)
        break
      case 'packLength':
        tableData.value.forEach(item => {
          Object.assign(item, batchFields.packageSize)
        })
        break
      default:
        break
    }
    batchOpen.value = false
  }

  const getEditStore = account => {
    let params = {
      account: [account]
    }
    productWarehouse(params).then(res => {
      editStockList.value =
        res?.data?.map(item => {
          return {
            account: item.account,
            simpleName: item.simpleName,
            children: item.children,
            allStock: ''
          }
        }) || []
    })
  }

  // 获取水印列表
  const getWatermark = () => {
    watermarkListApi().then(res => {
      watermark.value = res.data

      store.$patch(state => {
        state.waterMarkOptions = res.data
      })
    })
  }

  // 变种主题中是组合在一起的主题
  const dependencyMap = new Map([
    [10096, 10097], // 商品颜色和颜色名称
    [4295, 9533] // 俄罗斯尺码和制造商尺码
  ])

  watch(
    () => store.attributes,
    val => {
      if (val) {
        themeBtns.value = []
        requiredList.value = []
        attributeList.value = []
        tableData.value = []
        addHeaderList.value = [] //清空自定义变种信息
        headerList.value = [...columns] //重新赋值
        // 提取变种主题
        let arr = val.filter(obj => obj.isAspect)
        isConform = checkData(arr)
        const requiredItem = arr.some(item => item.isRequired === true)
        let sortArr = rearrangeColorFields(arr)
        //判断主题中是否有颜色名称，且商品颜色是不是必填项
        if (requiredItem) {
          if (isConform) {
            requiredList.value = arr.filter(obj => obj.isRequired)
            // 将arr转换为ID索引对象，提高查找效率
            const arrById = arr.reduce((acc, item) => {
              acc[item.id] = item
              return acc
            }, {})
            // 检查并添加依赖项
            dependencyMap.forEach((addId, targetId) => {
              // 检查目标ID是否存在
              if (requiredList.value.some(item => item.id === targetId)) {
                // 获取要添加的对象
                const itemToAdd = arrById[addId]
                // 检查是否已存在且对象存在
                if (itemToAdd && !requiredList.value.some(item => item.id === addId)) {
                  requiredList.value.push(itemToAdd)
                }
              }
            })
            themeBtns.value = arr.filter(
              obj => !(obj.isRequired || obj.id === 10097 || obj.id === 9533) //obj.id === 9533
            )
            requiredList.value = reorderArray(requiredList.value)
          } else {
            themeBtns.value = arr.filter(obj => !obj.isRequired)
            requiredList.value = arr.filter(obj => obj.isRequired)
          }
        } else {
          if (isConform) {
            themeBtns.value = arr.filter(obj => !(obj.isRequired || obj.id === 10097))
          } else {
            themeBtns.value = arr.filter(obj => !obj.isRequired)
          }
        }
        if (requiredList.value.length != 0) {
          processDataFormat(requiredList.value)
        }
        let result = []
        let attrHeaderList = []
        const uniqueArr = []
        const titleSet = new Set()

        if (store.dataType === 'edit') {
          // 编辑; 回显数据
          const { skuList } = productDetail.value
          skuList.forEach(sku => {
            const newItem = createNewItem(sku, {})
            processAttributes(sortArr, sku, newItem, attrHeaderList)
            result.push(newItem)
          })
          optimizeMethods(attrHeaderList, titleSet, sortArr, uniqueArr, result, skuList)
        } else {
          tableData.value.push({
            skuTitle: '',
            sellerSKU: '',
            costPrice: null,
            quantity: undefined,
            warehouseList: [],
            packageLength: undefined,
            packageWidth: undefined,
            packageHeight: undefined,
            packageWeight: undefined,
            mainImages: [],
            subImages: [],
            imageList: [],
            colorImg: [],
            id: Math.random().toString(36).substring(2, 10)
          })
        }
      }
    }
  )

  // 提取属性处理函数
  const processAttributes = (sortArr, sku, newItem, attrHeaderList) => {
    sortArr.forEach(attr => {
      const subAttr = sku.attributes.find(item => item.id === attr.id)
      if (!subAttr) return

      const values = subAttr.values.map(val => {
        if (attr.options && ['multSelect', 'select'].includes(attr.selectType)) {
          const option = attr.options.find(opt => opt.id === val.dictionaryValueId)
          return option?.value || val.value
        }
        return val.value
      })

      newItem[attr.name] = values.join(', ')
      addAttributeHeader(attr, attrHeaderList)
    })
  }

  // 添加表头函数
  const addAttributeHeader = (attr, headerList) => {
    const existingHeader = headerList.some(item => item.id === attr.id)
    if (!existingHeader) {
      headerList.push({
        title: attr.name,
        dataIndex: attr.name,
        id: attr.id,
        show: true,
        align: 'center'
      })
    }
  }

  // 提取公共的newItem创建函数
  const createNewItem = (sku, dataSource) => ({
    costPrice: dataSource.costPrice || sku.costPrice,
    quantity: dataSource.stock || sku.stock,
    packageHeight: sku.height,
    packageLength: sku.depth,
    packageWeight: sku.weight,
    packageWidth: sku.width,
    skuTitle: dataSource.name || sku.name,
    colorImg: createColorImg(dataSource.colorImage || sku.colorImage),
    warehouseList: formatWarehouseList(dataSource.warehouseList || sku.warehouseList, sku.skuCode),
    sellerSKU: dataSource.skuCode || sku.skuCode,
    // imageUrl: mergeAndDeduplicateImages(dataSource, sku),
    mainImages: fillImage(sku.mainImages),
    subImages: fillImage(sku.subImages),
    imageList: sku.imageList || []
  })

  // 给图片url地址添加id, 组成图片对象
  function fillImage(list) {
    if (Array.isArray(list)) {
      return list.map(url => ({
        url: processImageSource(url),
        id: uuidv4()
      }))
    } else {
      return []
    }
  }

  // 颜色图片处理函数
  const createColorImg = colorImage => {
    if (!colorImage) return []
    return [
      {
        url: processImageSource(colorImage),
        name: colorImage.split('/').pop()
      }
    ]
  }

  // 仓库列表格式化函数
  const formatWarehouseList = (warehouseList, skuCode) => {
    return warehouseList?.map(item => ({ ...item, skuCode })) || []
  }

  // 图片合并去重函数
  const mergeAndDeduplicateImages = (dataSource, sku) => {
    const primaryImages = dataSource.primaryImage || sku.primaryImage || []
    const normalImages = dataSource.images || sku.images || []
    const allImages = [...primaryImages, ...normalImages].filter(Boolean)
    return Array.from(new Set(allImages)).map(url => ({
      url: processImageSource(url),
      id: uuidv4(),
      checked: false
    }))
  }

  // 定义常量
  const CONSTANTS = {
    COM_ATTR_LIST: [10096, 4295], // 双主题
    COM_ATTRS: [10096, 10097], // 单主题

    TABLE_HEADER: {
      COLOR_IMG: { title: '颜色样本', dataIndex: 'colorImg', selectType: 'url', type: 1, show: true, align: 'center' },
      SKU_TITLE: { title: 'SKU标题', dataIndex: 'skuTitle', selectType: 'input', type: 1, options: null, show: true, align: 'center' }
    }
  }

  // 优化现有产品等方法
  const optimizeMethods = (attrHeaderList, titleSet, sortArr, uniqueArr, result, skuList) => {
    // 处理数据回显到表格 - 使用Map去重
    attrHeaderList = [...new Map(attrHeaderList.map(item => [item.dataIndex, item])).values()]

    // 合并表头并去重
    ;[...attrHeaderList, ...headerList.value].forEach(item => {
      if (!titleSet.has(item.title)) {
        titleSet.add(item.title)
        uniqueArr.push(item)
      }
    })

    // 过滤匹配的属性
    const filteredB = sortArr.filter(itemB => uniqueArr.some(itemA => itemA.id === itemB.id))
    headerList.value = customSort(uniqueArr)

    // 添加颜色样本列
    if (result.some(item => item.colorImg.length)) {
      headerList.value.unshift(CONSTANTS.TABLE_HEADER.COLOR_IMG)
      addHeaderList.value.push('colorImg')
    }

    // 添加SKU标题列
    if (result.some(item => item.skuTitle) && result.length > 1) {
      const skuIndex = headerList.value.findIndex(item => item.title === 'SKU')
      headerList.value.splice(skuIndex + 1, 0, CONSTANTS.TABLE_HEADER.SKU_TITLE)
      addHeaderList.value.push('skuTitle')
      store.$patch(state => (state.addHeaderList = addHeaderList.value))
    }

    tableData.value = result
    // 处理主题数据 新逻辑
    const echoThemeList = handleTheme(filteredB)
    // 过滤已有数据的主题
    const aIds = echoThemeList.map(item => item.id)
    themeBtns.value = themeBtns.value.filter(item => !aIds.includes(item.id))
    attributeList.value = matchAndAssignValues(echoThemeList, skuList)
    store.$patch(state => {
      state.loading = false
    })
    if (store.dataType === 'template') {
      message.success('变种变种模板应用成功')
    }
  }

  const filterModelValues = (sortArr, skuList) => {
    const allAttributeIds = skuList.flatMap(item => item.attributes.map(attr => attr.id))
    // 过滤 sortArr 中匹配不上的项
    const filteredSortArr = sortArr.filter(item => allAttributeIds.includes(item.id))
    return filteredSortArr
  }

  const matchAndAssignValues = (echoThemeList, skuList) => {
    // 遍历 echoThemeList 数组的每个配置项
    return echoThemeList.map(aItem => {
      const isThemeData = checkThemeData(aItem.tableData)
      const newTableData = skuList.map(bItem => {
        const tableDataTemplate = JSON.parse(JSON.stringify(aItem.tableData[0]))
        const attributeId = tableDataTemplate.id
        const matchedAttribute = bItem.attributes.find(attr => attr.id === attributeId)
        const secondAttr = bItem.attributes.find(attr => attr.id === tableDataTemplate?.secondId)
        return processTableDataItem(tableDataTemplate, matchedAttribute, secondAttr, isThemeData)
      })
      aItem.tableData = deduplicateTableData(newTableData, isThemeData)
      return aItem
    })
  }

  // 对数组中的对象按指定属性去重
  const removeDuplicatesByProperty = (arr, property) => {
    return arr.filter((value, index, self) => index === self.findIndex(t => t[property] === value[property]))
  }

  // 检查两个数组是否内容相同
  const isArrayContentEqual = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2)
  }

  /**
   * @param tableDataTemplate 主题数据中的值
   * @param matchedAttribute 匹配的属性ID数据
   * @param secondAttr  第二个属性ID数据
   * @param isThemeData 是否有组合的主题
   */
  const processTableDataItem = (tableDataTemplate, matchedAttribute, secondAttr, isThemeData) => {
    if (isThemeData) {
      if (matchedAttribute) {
        tableDataTemplate.modelValue = tableDataTemplate.details.filter(itemA => {
          return matchedAttribute.values.some(itemB => {
            return itemA.id === itemB.dictionaryValueId
          })
        })
        tableDataTemplate.modelValue = removeDuplicatesByProperty(tableDataTemplate.modelValue, 'id')
      }
      if (secondAttr) {
        tableDataTemplate.secondModelValue = secondAttr.values[0].value
      }
    } else {
      if (tableDataTemplate.selectType === 'input') {
        if (matchedAttribute) {
          tableDataTemplate.modelValue = matchedAttribute.values[0].value
        }
      } else if (tableDataTemplate.selectType === 'select') {
        if (matchedAttribute) {
          let themIds = matchedAttribute.values.map(item => item.dictionaryValueId)
          const matchedValues = tableDataTemplate.details.filter(item => themIds.includes(item.id))
          tableDataTemplate.modelValue = {
            label: matchedValues[0]?.label,
            value: matchedValues[0]?.id
          }
        }
      } else {
        if (matchedAttribute) {
          let themIds = matchedAttribute.values.map(item => item.dictionaryValueId)
          const matchedValues = tableDataTemplate.details.filter(item => themIds.includes(item.id))
          // removeDuplicatesByProperty 去重方法
          const uniqueMatchedValues = removeDuplicatesByProperty(matchedValues, 'value')
          tableDataTemplate.modelValue = uniqueMatchedValues
        }
      }
    }
    return tableDataTemplate
  }

  // 对 tableData 进行去重
  const deduplicateTableData = (tableData, isThemeData) => {
    if (isThemeData) {
      return tableData.filter((item, index, self) => {
        return !self.some((uniqueItem, uniqueIndex) => {
          return uniqueIndex < index && uniqueItem.secondModelValue === item.secondModelValue && isArrayContentEqual(uniqueItem.modelValue, item.modelValue)
        })
      })
    } else {
      const valueMap = new Map()
      return tableData.filter(item => {
        const key = JSON.stringify(item.modelValue)
        if (!valueMap.has(key)) {
          valueMap.set(key, true)
          return true
        }
        return false
      })
    }
  }
  // 检查数组中是否有组合的主题
  const checkThemeData = data => {
    const hasColorName = data.some(item => item.secondId === 10097)
    const hasProductColor = data.some(item => item.id === 10096)
    const hasName = data.some(item => item.secondId === 9533)
    const hasColor = data.some(item => item.id === 4295)
    return (hasColorName && hasProductColor) || (hasName && hasColor)
  }
  // 判断是否有俄罗斯尺码和制造商尺码
  const checkOtherData = data => {
    const hasColorName = data.some(item => item.secondId === 9533)
    const hasProductColor = data.some(item => item.id === 4295)

    return hasColorName && hasProductColor
  }

  const submitForm = () => {
    // 参数校验
    if (tableData.value.length === 0) {
      message.error('请编辑SKU信息！')
      return false
    }
    // sku校验
    const result = checkSellerSKU(tableData.value)
    if (result) {
      message.error('SKU ID不能相同!')
      return false
    }
    for (let i = 0; i < attributeList.value.length; i++) {
      for (let j = 0; j < attributeList.value[i].tableData.length; j++) {
        const row = attributeList.value[i].tableData[j]

        if (!validateRow(row)) {
          message.error('请填写变种主题！')
          return false
        }
      }
    }
    const isEmpty = value => value == null || value === '' || value === 0

    const validations = [
      { check: row => row.mainImages == null, text: '请上传主图！' },
      {
        check: row => row.mainImages.length === 0,
        text: '请上传主图，主图最少一张！'
      },
      { check: row => row.subImages == null, text: '请上传副图！' },
      {
        check: row => row.subImages.length === 0,
        text: '请上传副图，副图最少一张！'
      },
      { check: row => isEmpty(row.sellerSKU), text: '请填写SKU编号！' },
      { check: row => isEmpty(row.costPrice), text: '请填写成本价！' },
      { check: row => isEmpty(row.quantity), text: '请填写库存！' },
      {
        check: row => [row.packageHeight, row.packageLength, row.packageWeight, row.packageWidth].some(v => v == null),
        message: '请填写SKU包装信息！'
      }
    ]

    for (const row of tableData.value) {
      for (const { check, text } of validations) {
        if (check(row)) {
          message.error(text)
          return false
        }
      }
    }
    return true
  }

  function validateRow(row) {
    if (row.isRequired && row.selectType === 'select') {
      return Object.keys(row.modelValue).length > 0
    } else if (row.isRequired && row.selectType === 'multSelect') {
      return row.modelValue && row.modelValue.length > 0
    } else if (row.selectType === 'select') {
      return Object.keys(row.modelValue).length > 0
    } else {
      return (row.modelValue && row.modelValue.length > 0) || (row.secondModelValue && row.secondModelValue.length > 0)
    }
  }

  // 抛出数据和方法，可以让父级用ref获取
  defineExpose({
    tableData,
    submitForm
  })
  onMounted(() => {
    getWatermark()
  })
</script>

<style lang="less" scoped>
  .headerImg {
    :deep(.ant-upload) {
      width: 80px !important;
      height: 80px !important;
    }
  }

  :deep(.ant-table) {
    .ant-table-tbody {
      background-color: #fff;
    }
  }
</style>
