<!-- SKU信息 变种 -->
<template>
  <div>
    <a-card
      title="SKU信息"
      class="text-left"
    >
      <template #extra v-if="!detail.categoryId">
        <a-button type="link" :disabled="!rawAttributes.length" @click="fillDataFromDetail">填入资料库SKU数据</a-button>
        <a-tooltip
          :title="`将资料库数据填入当前变种信息和图片信息中;\n数据可能有缺失;\n若当前已填有数据, 则会被覆盖.`"
          placement="topRight"
          :overlay-inner-style="{ width: '300px', whiteSpace: 'break-spaces' }"
        >
          <QuestionCircleOutlined class="ml-1" />
        </a-tooltip>
      </template>

      <a-card title="变种属性">
        <div class="mb-2">
          <span>变种主题: </span>
          <a-space v-if="filteredAspectBtnList.length">
            <a-button
              v-for="item in filteredAspectBtnList"
              :key="item.key"
              type="link"
              @click="addAspect(item)"
            >{{ item.name }}
              <PlusOutlined />
            </a-button>
          </a-space>
          <span v-else>无可选变种</span>
        </div>

        <a-card
          v-for="(item, i) in filteredAspectList"
          :key="item.key"
          class="mb-2"
        >
          <template #title>
            <span>{{ `变种主题${i + 1}: ` }}</span>
            <span
              v-if="item.isRequired"
              class="text-[#ff4d4f]"
            >*</span>
            <span>{{ item.name }}</span>
          </template>

          <template #extra>
            <a-button
              v-if="!item.isRequired"
              type="link"
              danger
              @click="removeAspect(item)"
            >移除</a-button>
          </template>

          <a-table
            :columns="item.columns"
            :data-source="item.tableData"
            row-key="uuid"
            :pagination="false"
          >
            <template #headerCell="{ title, column }">
              <!-- v-if="true" 是为了无条件渲染 -->
              <template v-if="true">
                <span
                  v-if="column.isRequired"
                  class="text-[#ff4d4f] mr-1"
                >*</span>
                <span>{{ title }}</span>
                <!-- 店小蜜做法: column.selectType === 'multSelect' (感觉没逻辑) -->
                <!-- v-if="column.options" -->
                <a-button
                  v-if="title !== '操作'"
                  type="link"
                  @click="batchAddAspectRow(column, item.tableData)"
                >批量</a-button>
              </template>
            </template>

            <template #bodyCell="{ record, column }">
              <template v-if="column.selectType === 'input'">
                <a-input
                  v-if="column.type === 'String'"
                  v-model:value="record[column.title]"
                  placeholder="请输入"
                  class="w-full"
                />
                <a-input-number
                  v-else
                  v-model:value="record[column.title]"
                  :controls="false"
                  :precision="item.type === 'Integer' ? 0 : 2"
                  :min="0"
                  :max="99999"
                  placeholder="请输入数值"
                  class="w-full"
                />
              </template>
              <template v-else-if="column.selectType === 'select'">
                <a-select
                  v-model:value="record[column.title]"
                  :options="column.options"
                  :field-names="{ label: 'value', value: 'id' }"
                  option-filter-prop="value"
                  label-in-value
                  show-search
                  allow-clear
                  placeholder="请选择"
                  class="w-full"
                />
              </template>
              <template v-else-if="column.selectType === 'multSelect'">
                <a-select
                  v-model:value="record[column.title]"
                  :options="column.options"
                  mode="multiple"
                  :field-names="{ label: 'value', value: 'id' }"
                  option-filter-prop="value"
                  label-in-value
                  show-search
                  allow-clear
                  placeholder="请选择, 支持多选"
                  class="w-full"
                />
              </template>
              <template v-if="column.title === '操作'">
                <a-space>
                  <a-button
                    type="link"
                    :disabled="item.tableData.length > 20"
                    @click="addAspectRow(item)"
                  >
                    <PlusOutlined />
                  </a-button>
                  <a-button
                    type="link"
                    danger
                    :disabled="item.tableData.length === 1"
                    @click="removeAspectRow(item, record.uuid)"
                  >
                    <MinusOutlined />
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-card>

      <a-card
        title="变种信息"
        class="text-left mt-4"
      >
        <template #extra>
          <a-checkbox-group
            v-model:value="checkedList"
            :options="RIGHT_OPTIONS"
          />
        </template>

        <a-table
          :columns="SKUColumns"
          :data-source="SKUTableData"
          row-key="uuid"
          :pagination="false"
          :scroll="{ x: 'max-content' }"
        >
          <template #headerCell="{ title }">
            <template v-if="title === '颜色样本'">
              <span class="mr-1">{{ title }}</span>
              <a-tooltip
                :title="colorImageDesc"
                :overlay-inner-style="{ width: '600px', whiteSpace: 'break-spaces' }"
              >
                <QuestionCircleOutlined />
              </a-tooltip>
              <br />
              <a-dropdown>
                <a-button type="link">批量
                  <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu @click="handleCommand">
                    <a-menu-item key="1">查看大图</a-menu-item>
                    <a-menu-item key="2">批量修改图片尺寸</a-menu-item>
                    <a-menu-item key="3">图片翻译</a-menu-item>
                    <a-sub-menu
                      key="4"
                      title="添加水印"
                    >
                      <a-menu-item
                        v-for="waterMark in watermarkOptions"
                        :key="waterMark.id"
                      >
                        <div>
                          <span class="mr-2">{{ waterMark.title }} </span>
                          <a-image
                            v-if="waterMark.type === 1"
                            :src="waterMark.content"
                            :width="20"
                            :height="20"
                            @click.stop
                          />
                          <span
                            v-else
                            class="ml-1"
                          >({{ waterMark.content }})</span>
                        </div>
                      </a-menu-item>
                    </a-sub-menu>
                    <a-menu-item key="5">清空图片</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <!-- 查看图片 (预览) -->
              <a-image-preview-group :preview="{
                visible: previewVisible,
                onVisibleChange: setVisible,
              }">
                <a-image
                  v-for="(img, i) in nonEmptyColorImageList"
                  :key="i"
                  :src="img"
                  class="hidden"
                />
              </a-image-preview-group>
            </template>
            <template v-else-if="title === 'SKU'">
              <span class="text-[#ff4d4f]">*</span>
              <span class="mr-1">{{ title }}</span>
              <a-tooltip
                title="如果编码中包含 '*', '/', '+', 则认定为有多数量策划意图, 建议勾选多数量策划"
              >
                <QuestionCircleOutlined />
              </a-tooltip>
              <br />
              <a-button
                type="link"
                @click="SKUCodeModalOpen = true"
              >批量</a-button>
            </template>
            <template v-else-if="title === '成本价(CNY)'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <br />
              <a-button
                type="link"
                @click="costPriceModalOpen = true"
              >批量</a-button>
            </template>
            <template v-else-if="title === '库存'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <br />
              <a-button
                type="link"
                @click="stockModalOpen = true"
              >批量</a-button>
            </template>
            <template v-else-if="title === '策划数量'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <br />
              <a-button
                type="link"
                @click="quantityModalOpen = true"
              >批量</a-button>
            </template>
            <template v-else-if="title === '多数量策划'">
              <span class="mr-1">{{ title }}</span>
              <a-tooltip title="勾选后, 策划数量限制为 1">
                <QuestionCircleOutlined />
              </a-tooltip>
              <br />
              <a-checkbox
                v-model:checked="multCheckAll"
                :indeterminate="indeterminate"
                class="ml-1"
                @change="checkAll"
              ><span class="text-[#1677ff] font-normal">全选</span></a-checkbox>
            </template>
            <template v-else-if="title === '售卖单位'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <br />
              <a-button
                type="link"
                @click="unitModalOpen = true"
              >批量</a-button>
            </template>
            <template v-else-if="title === '尺寸(mm)'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <br />
              <a-button
                type="link"
                @click="sizeModalOpen = true"
              >批量</a-button>
              <br />
            </template>
            <template v-else-if="title === '重量(g)'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <br />
              <a-button
                type="link"
                @click="weightModalOpen = true"
              >批量</a-button>
            </template>
          </template>

          <template #bodyCell="{ record, column }">
            <template v-if="column.title === '颜色样本'">
              <ImageOfColorSample
                v-model:image="record.colorImage"
                :loading="addWaterMarkLoading"
                @apply-to="confirmMenuClick($event, record, 'colorImage')"
              />
            </template>
            <template v-else-if="column.title === 'SKU'">
              <a-input
                v-model:value="record.skuCode"
                placeholder="请输入"
                class="w-full"
              />
            </template>
            <template v-else-if="column.title === '成本价(CNY)'">
              <div class="flex">
                <a-input-number
                  v-model:value="record.costPrice"
                  :controls="false"
                  :precision="4"
                  :min="0.0001"
                  :max="99999"
                  placeholder="请输入数值"
                  class="flex-1"
                />
                <a-dropdown>
                  <a-button
                    type="link"
                    class="flex-none"
                  >
                    <CopyOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="confirmMenuClick($event, record, 'costPrice')">
                      <a-menu-item
                        v-for="item in applyToMenuList"
                        :key="item.key"
                      >{{ item.label }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
            <template v-else-if="column.title === '库存'">
              <div class="flex">
                <a-input-number
                  v-model:value="record.stock"
                  :controls="false"
                  :precision="0"
                  :min="1"
                  :max="99999"
                  placeholder="请输入数值"
                  class="flex-1"
                />
                <a-dropdown>
                  <a-button
                    type="link"
                    class="flex-none"
                  >
                    <CopyOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="confirmMenuClick($event, record, 'stock')">
                      <a-menu-item
                        v-for="item in applyToMenuList"
                        :key="item.key"
                      >{{ item.label }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
            <template v-else-if="column.title === '策划数量'">
              <div class="flex">
                <a-input-number
                  v-model:value="record.planNum"
                  :controls="false"
                  :precision="0"
                  :min="1"
                  :max="9999"
                  placeholder="请输入数值"
                  class="flex-1"
                />
                <a-dropdown>
                  <a-button
                    type="link"
                    class="flex-none"
                  >
                    <CopyOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="confirmMenuClick($event, record, 'planNum')">
                      <a-menu-item
                        v-for="item in applyToMenuList"
                        :key="item.key"
                      >{{ item.label }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
            <template v-else-if="column.title === '多数量策划'">
              <div>
                <a-checkbox
                  v-model:checked="record.mult"
                  @change="checkboxChange"
                />
                <a-dropdown>
                  <a-button
                    type="link"
                    class="flex-none"
                  >
                    <CopyOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="confirmMenuClick($event, record, 'mult')">
                      <a-menu-item
                        v-for="item in applyToMenuList"
                        :key="item.key"
                      >{{ item.label }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
            <template v-else-if="column.title === '售卖单位'">
              <div class="flex">
                <a-select
                  v-model:value="record.saleUnit"
                  :options="UNIT_OPTIONS"
                  :field-names="{ value: 'ru' }"
                  placeholder="请选择"
                  class="min-w-40"
                />
                <a-dropdown>
                  <a-button
                    type="link"
                    class="flex-none"
                  >
                    <CopyOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="confirmMenuClick($event, record, 'saleUnit')">
                      <a-menu-item
                        v-for="item in applyToMenuList"
                        :key="item.key"
                      >{{ item.label }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
            <template v-else-if="column.title === '尺寸(mm)'">
              <div class="flex">
                <a-space>
                  <a-input-number
                    v-model:value="record.length"
                    :controls="false"
                    :precision="2"
                    :min="0.01"
                    :max="99999"
                    placeholder="长"
                    class="w-full min-w-20"
                  />
                  <a-input-number
                    v-model:value="record.width"
                    :controls="false"
                    :precision="2"
                    :min="0.01"
                    :max="99999"
                    placeholder="宽"
                    class="w-full min-w-20"
                  />
                  <a-input-number
                    v-model:value="record.height"
                    :controls="false"
                    :precision="2"
                    :min="0.01"
                    :max="99999"
                    placeholder="高"
                    class="w-full min-w-20"
                  />
                </a-space>
                <a-dropdown>
                  <a-button
                    type="link"
                    class="flex-none"
                  >
                    <CopyOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="confirmMenuClick($event, record, 'size')">
                      <a-menu-item
                        v-for="item in applyToMenuList"
                        :key="item.key"
                      >{{ item.label }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
            <template v-else-if="column.title === '重量(g)'">
              <div class="flex">
                <a-input-number
                  v-model:value="record.weight"
                  :controls="false"
                  :precision="2"
                  :min="0.01"
                  :max="99999"
                  placeholder="请输入数值"
                  class="flex-1"
                />
                <a-dropdown>
                  <a-button
                    type="link"
                    class="flex-none"
                  >
                    <CopyOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="confirmMenuClick($event, record, 'weight')">
                      <a-menu-item
                        v-for="item in applyToMenuList"
                        :key="item.key"
                      >{{ item.label }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
            <template v-else-if="column.title === '操作'">
              <a-button
                type="link"
                danger
                :disabled="SKUTableData.length === 1"
                @click="removeSKUTableRow(record)"
              >
                <DeleteOutlined />
              </a-button>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-card>

    <a-divider />

    <!-- 批量添加变种属性(行 hang) 弹窗 -->
    <AddAspectRowModal
      v-model:open="addAspectRowModalOpen"
      :column-data="columnData"
      :aspect-data="aspectData"
      @ok="batchAddAspectRowConfirm"
    />

    <!-- 批量修改图片尺寸弹窗 -->
    <BacthSkuEditImg
      ref="bacthEditImgSizeRef"
      @submit="bacthEditImgSize"
    />

    <!-- 图片翻译弹窗 -->
    <ImageTranslation
      ref="imgTransRef"
      @emitImages="handleEmitImages"
    />

    <!-- 变种信息表格批量编辑弹窗 -->
    <SKUCodeModal
      v-model:open="SKUCodeModalOpen"
      ref="SKUCodeModalRef"
      :joined-aspect-name-list="joinedAspectNameList"
      @ok="SKUCodeOk"
    />

    <CostPriceModal
      v-model:open="costPriceModalOpen"
      ref="costPriceModalRef"
      @ok="costPriceOk"
    />

    <StockModal
      v-model:open="stockModalOpen"
      ref="stockModalRef"
      @ok="stockOk"
    />

    <QuantityModal
      v-model:open="quantityModalOpen"
      ref="quantityModalRef"
      @ok="quantityOk"
    />

    <UnitModal
      v-model:open="unitModalOpen"
      ref="unitModalRef"
      @ok="unitOk"
    />

    <SizeModal
      v-model:open="sizeModalOpen"
      ref="sizeModalRef"
      @ok="sizeOk"
    />

    <WeightModal
      v-model:open="weightModalOpen"
      ref="weightModalRef"
      @ok="weightOk"
    />
  </div>
</template>

<script setup>
  import { COLOR_IMAGE_COL, COLUMNS, UNIT_OPTIONS } from './config'
  import { message } from 'ant-design-vue'
  import { v4 as uuidv4 } from 'uuid'
  import { PlusOutlined, MinusOutlined, DeleteOutlined, DownOutlined, CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
  import { processImageSource } from '@/pages/ozon/config/commJs/index'
  import { watermarkApi } from '@/api/common/water-mark'

  import AddAspectRowModal from './components/AddAspectRowModal.vue'
  import SKUCodeModal from './components/SKUCodeModal.vue'
  import CostPriceModal from './components/CostPriceModal.vue'
  import StockModal from './components/StockModal.vue'
  import QuantityModal from './components/QuantityModal.vue'
  import UnitModal from './components/UnitModal.vue'
  import SizeModal from './components/SizeModal.vue'
  import WeightModal from './components/WeightModal.vue'
  import ImageOfColorSample from '@/components/image-of-color-sample/index.vue'
  import BacthSkuEditImg from '@/components/skuDragUpload/bacthSkuEditImg.vue'
  import ImageTranslation from '@/components/skuDragUpload/imageTranslation.vue'

  const store = useProductReviewStore()
  const detail = computed(() => store.detail)
  const rawAttributes = computed(() => store.attributes)
  const watermarkOptions = computed(() => store.watermarkOptions)

  /** 变种属性列表 */
  watch(
    () => rawAttributes.value,
    list => {
      if (list.length) {
        getAspectList()
        assignDetail()
      }
    }
  )

  // 结对变种
  const TWINS = [
    [10096, 10097], // [商品颜色, 颜色名称]
    [4295, 9533] // [俄罗斯尺码, 制造商尺码]
  ]

  // 获取变种属性表格
  const aspectList = ref([])
  const selectedAspectKeyList = ref([]) // 已选的变种 key 列表
  function getAspectList() {
    let tempAspectList = rawAttributes.value
      .filter(item => item.isAspect)
      .map(item => ({
        name: item.name,
        key: item.id,
        isRequired: item.isRequired,
        columns: [
          {
            ...item,
            title: item.name,
            key: item.id,
            minWidth: 400
          },
          { title: '操作', key: 'operate', width: 80 }
        ],
        tableData: [{ uuid: uuidv4(), [item.name]: getDetaultByType(item.selectType) }]
      }))
    let aspectIdList = tempAspectList.map(item => item.key)

    // 处理结对变种
    TWINS.forEach(twin => {
      if (twin.every(id => aspectIdList.includes(id))) {
        // 移除对应 id 的变种
        tempAspectList = tempAspectList.filter(item => !twin.includes(item.key))
        // 获取结对属性(保持顺序)
        const twinAspectList = twin.map(id => rawAttributes.value.find(item => item.id === id))
        // 添加联结属性
        const aspectItem = {
          name: twinAspectList[0].name,
          key: twin.join('-'),
          isRequired: twinAspectList.some(item => item.isRequired),
          columns: [
            ...twinAspectList.map(item => ({
              ...item,
              title: item.name,
              key: item.id,
              minWidth: 400
            })),
            { title: '操作', key: 'operate', width: 80 }
          ],
          tableData: [
            {
              uuid: uuidv4(),
              [twinAspectList[0].name]: getDetaultByType(twinAspectList[0].selectType),
              [twinAspectList[1].name]: getDetaultByType(twinAspectList[1].selectType)
            }
          ]
        }
        tempAspectList.unshift(aspectItem)
      }
    })

    aspectList.value = tempAspectList
    // 必填的默认选中
    selectedAspectKeyList.value = tempAspectList.filter(item => item.isRequired).map(item => item.key)
  }

  /** computed START */
  // 变种主题可选项(非必填的以按钮形式供选)
  const aspectBtnList = computed(() => aspectList.value.filter(item => !item.isRequired))
  // 过滤出已选择后的可选项(显示的按钮)
  const filteredAspectBtnList = computed(() => aspectBtnList.value.filter(item => !selectedAspectKeyList.value.includes(item.key)))
  // 已选中的变种属性(显示的变种列表)
  const filteredAspectList = computed(() => aspectList.value.filter(item => selectedAspectKeyList.value.includes(item.key)))
  // 非空的, 参与生成 SKU 的变种属性
  const usefulAspect = computed(() => {
    const list = filteredAspectList.value.map(item => {
      const aspectNameList = item.columns.slice(0, -1).map(column => column.title)
      const nonEmptyTableData = item.tableData.filter(record => aspectNameList.some(aspectName => nonEmpty(record[aspectName])))

      return {
        name: item.name,
        key: item.key,
        nonEmptyTableData
      }
    })

    return list.filter(item => item.nonEmptyTableData.length)
  })
  // 是否有重复的变种属性
  const hasDuplicateAspect = computed(() => {
    for (const item of usefulAspect.value) {
      const combinateSet = new Set()
      for (const record of item.nonEmptyTableData) {
        const keyList = []
        const labelList = []
        const valueList = []
        for (const key in record) {
          if (key === 'uuid') continue

          keyList.push(key)
          labelList.push(getValue(record[key], 'label')) // 这里的 label 指的是中文值
          // 排除顺序的影响
          const recordCopy = Array.isArray(record[key]) ? record[key].toSorted((a, b) => a.value - b.value) : record[key]
          valueList.push(getValue(recordCopy, 'value'))
        }

        // 拼接值作为关键字
        const keyCombinate = keyList.join('-')
        const labelCombinate = labelList.join('-')
        const combinateCode = valueList.join('-')
        if (combinateSet.has(combinateCode)) {
          message.error(`变种属性[ ${keyCombinate}的值: ${labelCombinate} ]不能重复`)

          return true
        }
        combinateSet.add(combinateCode)
      }
    }

    return false
  })
  // 有用到的变种属性行 id; (从变种信息表格中收集, 因 SKU 可删除, 未被引用的变种属性同步移除)
  const usefulAspectRowUuidList = computed(() => {
    const uuidSet = new Set()
    SKUTableData.value.forEach(item => {
      item.parentUuidList.forEach(uuid => {
        uuidSet.add(uuid)
      })
    })

    return uuidSet
  })
  // SKU 的变种属性表头
  const aspectColumns = computed(() => {
    const list = []
    usefulAspect.value.forEach(item => {
      for (const key in item.nonEmptyTableData[0]) {
        if (key === 'uuid') continue

        list.push({ title: key, key, dataIndex: key, width: 120 })
      }
    })

    return list
  })
  // 右侧 未被勾选的 checkbox
  const excludedList = computed(() =>
    RIGHT_OPTIONS.map(item => item.value).filter(val => !checkedList.value.includes(val))
  )
  // SKU 表头(合并变种属性表头和常量表头)
  const SKUColumns = computed(() => [...COLOR_IMAGE_COL.filter(col => !excludedList.value.includes(col.key)), ...aspectColumns.value, ...COLUMNS.filter(col => !excludedList.value.includes(col.key))])

  // 应用到同 xx 变种
  const PERMANENT_LIST = [{ label: '应用到全部', key: 'applyAll' }]
  const joinedAspectNameList = computed(() =>
    filteredAspectList.value.map(item =>
      item.columns
        .slice(0, -1)
        .map(column => column.title)
        .join('&')
    )
  )
  const applyToMenuList = computed(() => {
    const list = joinedAspectNameList.value.map(name => ({ label: `应用到同 ${name} 的变种`, key: name }))

    return [...PERMANENT_LIST, ...list]
  })
  /** computed END */

  watch(
    () => joinedAspectNameList.value,
    list => {
      // 存到小菠萝里
      store.$patch(state => {
        state.joinedAspectNameList = list
      })
    }
  )

  /** 详情回显 */
  function assignDetail() {
    // 回显选中的变种主题按钮
    const variantList = detail.value.skuList[0]?.attributes.filter(item => item.isVariant) || []
    const keySet = new Set()
    filteredAspectBtnList.value.forEach(item => {
      if (variantList.some(ele => String(item.key).split('-').map(Number).includes(ele.id))) {
        keySet.add(item.key)
      }
    })
    if (keySet.size) selectedAspectKeyList.value.push(...Array.from(keySet))

    // 填充 filteredAspectList 中 tableData 数据
    const { skuList = [] } = detail.value
    // 颜色样本 colorImage
    if (skuList.length && skuList.some(item => item.colorImage)) {
      !checkedList.value.includes('colorImage') && checkedList.value.push('colorImage')
    } else {
      checkedList.value = checkedList.value.filter(item => item !== 'colorImage')
    }
    // 多数量策划 mult
    if (skuList.length && skuList.some(item => item.isPlanNum === 1)) {
      !checkedList.value.includes('mult') && checkedList.value.push('mult')
      indeterminate.value = true
      if (skuList.every(item => item.isPlanNum === 1)) {
        multCheckAll.value = true
        indeterminate.value = false
      }
    } else {
      checkedList.value = checkedList.value.filter(item => item !== 'mult')
    }

    const valObj = {} // 收集值(去重)
    filteredAspectList.value.forEach(item => {
      valObj[item.name] = {}
    })
    skuList.forEach(item => {
      const variantList = item.attributes.filter(item => item.isVariant) // 以 variantList 为准
      filteredAspectList.value.forEach(item => {
        const obj = {}
        let key = ''
        item.columns.slice(0, -1).forEach(col => {
          obj[col.name] = variantList.find(ele => ele.id === col.id)?.values || []
          key += obj[col.name].map(val => val.value).join(',')
        })
        // 为了去重, 经历九转十八弯
        valObj[item.name][key] = obj
      })
    })
    filteredAspectList.value.forEach(item => {
      item.tableData = Object.values(valObj[item.name]).map(obj => {
        const row = { uuid: uuidv4() }
        const itemAspectList = item.columns.slice(0, -1)
        itemAspectList.forEach(ele => {
          row[ele.name] = nonEmpty(obj[ele.name]) ? getValueByType(obj[ele.name], ele.selectType) : getDetaultByType(ele.selectType)
        })

        return row
      })
    })

    function getValueByType(list, selectType) {
      switch (selectType) {
        case 'select':
          return { label: list[0].value, value: list[0].dictionaryValueId }
        case 'multSelect':
          return list.map(item => ({ label: item.value, value: item.dictionaryValueId }))
        case 'input':
        default:
          return list[0].value
      }
    }

    // 填充表格数据(根据变种值组成唯一 key 来匹配数据)
    nextTick(() => {
      const recordUuidList = []
      skuList.forEach(sku => {
        const variantList = sku.attributes.filter(item => item.isVariant)
        const skuKey = aspectColumns.value
          .map(col => {
            const id = rawAttributes.value.find(attr => attr.name === col.title).id
            const target = variantList.find(attr => attr.id === id)

            return target ? target.values.map(val => val.value).join(',') : ''
          })
          .join('-')

        const record = SKUTableData.value.find(record => {
          const recordKey = aspectColumns.value.map(col => record[col.title]).join('-')

          // if (!skuKey || !recordKey) return false

          return recordKey === skuKey
        })

        if (record) {
          recordUuidList.push(record.uuid)

          record.skuCode = sku.skuCode
          record.colorImage = sku.colorImage
          record.costPrice = sku.costPrice
          record.stock = sku.stock
          record.planNum = sku.planNum
          record.mult = sku.isPlanNum === 1
          record.saleUnit = sku.saleUnit
          record.length = sku.depth
          record.width = sku.width
          record.height = sku.height
          record.weight = sku.weight
          record.mainImages = sku.mainImages.map(url => ({ id: uuidv4(), url: processImageSource(url) }))
          record.subImages = sku.subImages.map(url => ({ id: uuidv4(), url: processImageSource(url) }))
        }
      })

      // 移除多余数据(因在提交时可能会删除几条 SKU)
      if (recordUuidList.length) {
        SKUTableData.value = SKUTableData.value.filter(record => recordUuidList.includes(record.uuid))
      }
    })
  }

  // 根据 selectType 获取默认值
  function getDetaultByType(selectType) {
    switch (selectType) {
      case 'select':
        // should in shape of `{ value: string | number, label?: any }` when you set `labelInValue`
        // return { value: undefined, label: undefined }
        return undefined // undefined for placeholder
      case 'multSelect':
        return []
      case 'input':
      default:
        return ''
    }
  }

  // 根据数据类型判断是否非空
  function nonEmpty(val) {
    const type = Object.prototype.toString.call(val).slice(8, -1)
    switch (type) {
      case 'Array':
        return Boolean(val.length)
      case 'Object':
        // return Boolean(Object.keys(val).length)
        return !['', null, undefined].includes(val.value)
      case 'String':
      default:
        return !['', null, undefined].includes(val)
    }
  }

  // 根据数据类型获取值
  function getValue(val, prop = 'label') {
    const type = Object.prototype.toString.call(val).slice(8, -1)
    switch (type) {
      case 'Array':
        return val.map(item => item[prop]).join(',')
      case 'Object':
        return val[prop]
      case 'String':
      default:
        return val
    }
  }

  // 回填资料库数据
  function fillDataFromDetail() {
    const list = detail.value.skuList || []
    const skuList = list.map(record => ({
      skuCode: record.skuCode,
      colorImage: record.colorImage,
      costPrice: record.costPrice,
      stock: record.stock,
      planNum: record.planNum,
      mult: record.isPlanNum === 1,
      saleUnit: record.saleUnit,
      length: record.depth,
      width: record.width,
      height: record.height,
      weight: record.weight,
      mainImages: record.mainImages.map(url => ({ id: uuidv4(), url: processImageSource(url) })),
      subImages: record.subImages.map(url => ({ id: uuidv4(), url: processImageSource(url) }))
    }))

    assignOldSKUData(skuList, true)
  }

  // 添加变种主题
  function addAspect(item) {
    selectedAspectKeyList.value.push(item.key)
  }

  // 移除变种主题
  function removeAspect(item) {
    selectedAspectKeyList.value = selectedAspectKeyList.value.filter(key => key !== item.key)

    const itemAspectList = item.columns.slice(0, -1)
    const row = { uuid: uuidv4() }
    itemAspectList.forEach(ele => {
      row[ele.name] = getDetaultByType(ele.selectType)
    })

    item.tableData = [row]
  }

  // 批量添加变种属性(行 hang) 打开弹窗
  const addAspectRowModalOpen = ref(false)
  const columnData = ref({})
  const aspectData = ref([])
  function batchAddAspectRow(column, tableData) {
    columnData.value = column
    aspectData.value = tableData
    addAspectRowModalOpen.value = true
  }

  // 批量添加变种属性弹窗确认
  function batchAddAspectRowConfirm(newAspectData) {
    for (const val of newAspectData) {
      let continueFlag = false
      // 如果有行, 且行存在空值, 先填充行; 再有多余的就往后添加新行
      for (const item of aspectData.value) {
        if (!nonEmpty(item[columnData.value.name])) {
          item[columnData.value.name] = columnData.value.selectType === 'multSelect' ? [val] : val
          continueFlag = true

          break
        }
      }
      if (continueFlag) continue

      const row = { uuid: uuidv4() }
      // just focus on self (如果是结对属性, 另一个值让双向绑定去隐式生成)
      row[columnData.value.name] = columnData.value.selectType === 'multSelect' ? [val] : val

      aspectData.value.push(row)

      aspectData.value.push(row)
    }

    columnData.value = {}
    aspectData.value = []
  }

  // 添加一行变种主题
  function addAspectRow(item) {
    const itemAspectList = item.columns.slice(0, -1)
    const row = { uuid: uuidv4() }
    itemAspectList.forEach(ele => {
      row[ele.name] = getDetaultByType(ele.selectType)
    })

    item.tableData.push(row)
  }

  // 移除一行变种主题
  function removeAspectRow(item, uuid) {
    item.tableData = item.tableData.filter(ele => ele.uuid !== uuid)
  }

  /** 变种信息(SKU 表格) */
  const SKUTableData = ref([{ uuid: uuidv4(), mainImages: [], subImages: [] }])
  const colorImageDesc = `请用图片展示商品颜色，例如，衣服上的图案、颜色或口红的样品等。买家将在切换器中看见的不是标准圆形按钮，而是商品小图片;\n(说明：图片大小不大于5MB，只支持jpg、png、jpeg格式；图片尺寸为200*200-4320*7680)`
  // 右侧的勾选选项
  const RIGHT_OPTIONS = [
    { label: '颜色样本', value: 'colorImage' },
    { label: '多数量策划', value: 'mult' },
  ]
  // 选中的 checkbox
  const checkedList = ref([])
  // 多数量策划全选
  const multCheckAll = ref(false)
  const indeterminate = ref(false)

  function checkAll(e) {
    const checked = e.target.checked
    SKUTableData.value.forEach(item => { item.mult = checked })
    indeterminate.value = false
  }

  function checkboxChange() {
    const checkedListLength = SKUTableData.value.filter(item => item.mult).length
    indeterminate.value = checkedListLength > 0 && checkedListLength < SKUTableData.value.length
    multCheckAll.value = checkedListLength === SKUTableData.value.length
  }

  // 查看图片 (预览)
  const previewVisible = ref(false)
  const nonEmptyColorImageList = computed(() => SKUTableData.value.filter(item => item.colorImage).map(item => processImageSource(item.colorImage)))

  function setVisible(visible) {
    previewVisible.value = visible
  }

  const bacthEditImgSizeRef = ref(null)
  const imgTransRef = ref(null)

  // 批量操作
  function handleCommand({ key }) {
    if (nonEmptyColorImageList.value.length === 0) {
      message.warning('请先添加颜色样本图片')
      return
    }

    const list = nonEmptyColorImageList.value.map(url => ({ url }))
    switch (key) {
      case '1':
        // 查看大图 (预览)
        setVisible(true)
        break
      case '2':
        // 批量修改图片尺寸
        bacthEditImgSizeRef.value.showModal(list)
        break
      case '3':
        // 图片翻译
        imgTransRef.value.showModal(list)
        break
      case '5':
        // 清空图片
        SKUTableData.value.forEach(item => { item.colorImage = '' })
        break
      default:
        // 其他, 就是添加水印
        addWaterMark(key)
        break
    }
  }

  // 批量修改图片尺寸回调
  function bacthEditImgSize(list) {
    SKUTableData.value.filter(item => item.colorImage).forEach((item, i) => {
      item.colorImage = list[i].url
    })
  }

  // 图片翻译回调
  function handleEmitImages(list) {
    SKUTableData.value.filter(item => item.colorImage).forEach(item => {
      list.forEach(ele => {
        if (ele.oldUrl === item.colorImage) {
          item.colorImage = processImageSource(ele.newUrl)
        }
      })
    })
  }

  /** 批量加水印 */
  const addWaterMarkLoading = ref(false)
  function addWaterMark(id) {
    addWaterMarkLoading.value = true
    // 存在本地服务的图片
    const imgLocalList = nonEmptyColorImageList.value.filter(url => url.includes('/prod-api'))
    // 远端图片; 拿 url 先上传本地服务后再处理
    const imgRemoteList = nonEmptyColorImageList.value.filter(url => !url.includes('/prod-api'))
    const promiseList = []
    if (imgLocalList.length) {
      const p1 = new Promise(resolve => {
        const imagePathList = imgLocalList.map(img => img.replace('/prod-api', ''))
        watermarkApi({
          id,
          imagePathList
        })
          .then(res => {
            const list = res.data || []
            for (const item of list) {
              loop: for (const SKU of SKUTableData.value) {
                if (SKU.colorImage === '/prod-api' + item.originalFilename) {
                  SKU.colorImage = item.url
                  break loop
                }
              }
            }
          })
          .finally(() => {
            resolve()
          })
      })
      promiseList.push(p1)
    }
    // 如有远端图片
    if (imgRemoteList.length) {
      const p2 = new Promise(resolve => {
        batchUploadFromUrlApi({ imageList: imgRemoteList }).then(res => {
          const imagePathList = res.data.map(item => ({
            originalName: item.originalName,
            url: item.url
          }))
          watermarkApi({
            id,
            imagePathList: imagePathList.map(item => item.url)
          })
            .then(res => {
              const list = res.data || []
              // 遍历查找两层, 找到对应的原图片
              for (const SKU of SKUTableData.value) {
                const originalName = SKU.colorImage.split('/').at(-1)
                const target = imagePathList.find(item => item.originalName === originalName)
                if (target) {
                  const target2 = list.find(item => item.originalFilename === target.url)
                  if (target2) {
                    SKU.colorImage = target2.url // 接口返回数据自带 '/prod-api'
                  }
                }
              }
            })
            .finally(() => {
              resolve()
            })
        })
      })
      promiseList.push(p2)
    }

    Promise.all(promiseList).then(_ => {
      addWaterMarkLoading.value = false
    })
  }

  watch(
    () => usefulAspect.value,
    (_, oldList) => {
      if (hasDuplicateAspect.value) return

      // 备份老数据
      const oldSKUData = SKUTableData.value
      // 生成新表格数据
      SKUTableData.value = generateSKUCombinations()
      // 赋值老数据
      assignOldSKUData(oldSKUData)
    },
    { deep: true }
  )

  watch(
    () => SKUTableData.value,
    data => {
      store.$patch(state => {
        state.SKUTableData = data
      })
    }
  )

  // SKU列表数据转map,方便映射查找，判断SKU数据对比复用
  /* function SKUDataToMap(oldList, SKUList) {
    const oldAspectNames = []
    oldList.forEach(item => {
      for (const key in item.nonEmptyTableData[0]) {
        if (key === 'uuid') continue

        oldAspectNames.push(key)
      }
    })

    return SKUList.reduce((map, SKU) => {
      const SKUKey = oldAspectNames.map(name => SKU[name]).join('-')
      SKUKey && (map[SKUKey] = SKU)

      return map
    }, {})
  } */

  /** 生成 SKU 组合 (! KEY FUNCTION !) */
  function generateSKUCombinations() {
    return usefulAspect.value.reduce(
      (combinations, item) => {
        // 对现有组合进行扩展
        return combinations.flatMap(combination =>
          item.nonEmptyTableData.map(record => {
            // 收集父级 uuid, 做未使用变种的 tree shaking
            const newObj = { uuid: uuidv4(), mult: multCheckAll.value, mainImages: [], subImages: [], parentUuidList: combination.parentUuidList ? [...combination.parentUuidList] : [] }
            newObj.parentUuidList.push(record.uuid)
            for (const key in record) {
              if (key === 'uuid') continue

              newObj[key] = getValue(record[key], 'label')
            }

            return {
              ...combination,
              ...newObj
            }
          })
        )
      },
      [{ uuid: uuidv4(), mainImages: [], subImages: [] }]
    )
  }

  // 赋值老数据
  function assignOldSKUData(oldSKUData, refresh = false) {
    // init field: ['uuid', 'mainImages', 'subImages'].length = 3
    if (!oldSKUData.length || Object.keys(oldSKUData[0]).length === 3) return

    // 维持新值的字段
    const fieldList = aspectColumns.value.map(col => col.title)
    fieldList.push('uuid', 'parentUuidList')

    SKUTableData.value.forEach((record, i) => {
      if (oldSKUData[i]) {
        SKUTableData.value[i] = { ...oldSKUData[i] }
  
        fieldList.forEach(field => {
          SKUTableData.value[i][field] = record[field]
        })
      }
    })

    if (refresh) {
      SKUTableData.value = [...SKUTableData.value]
    }

    /* SKUTableData.value.forEach((record, i) => {
      const SKUKey = aspectColumns.value.map(col => record[col.title]).join('-')

      if (oldSKUData[SKUKey]) {
        SKUTableData.value[i] = {
          ...oldSKUData[SKUKey],
          uuid: record.uuid
        }
      }
    }) */
  }

  // 移除一行 SKU
  function removeSKUTableRow(record) {
    SKUTableData.value = SKUTableData.value.filter(item => item.uuid !== record.uuid)

    // 反向删除未被引用的变种属性
    usefulAspect.value.forEach(item => {
      item.nonEmptyTableData.forEach(record => {
        if (!usefulAspectRowUuidList.value.has(record.uuid)) {
          aspectList.value.forEach(item2 => {
            item2.tableData = item2.tableData.filter(row => row.uuid !== record.uuid)
          })
        }
      })
    })
  }

  /** 应用到同 xx 变种 */
  function confirmMenuClick({ key }, record, prop) {
    if (key === 'applyAll') {
      if (prop === 'size') {
        SKUTableData.value.forEach(item => {
          item.length = record.length
          item.width = record.width
          item.height = record.height
        })
      } else {
        SKUTableData.value.forEach(item => {
          item[prop] = record[prop]
        })
      }
    } else {
      const nameList = key.split('&')
      if (prop === 'size') {
        SKUTableData.value.forEach(item => {
          if (nameList.every(name => item[name] === record[name])) {
            item.length = record.length
            item.width = record.width
            item.height = record.height
          }
        })
      } else {
        SKUTableData.value.forEach(item => {
          if (nameList.every(name => item[name] === record[name])) {
            item[prop] = record[prop]
          }
        })
      }
    }
  }

  /** 弹窗(批量操作) */
  // SKUCode
  const SKUCodeModalRef = ref()
  const SKUCodeModalOpen = ref(false)

  function SKUCodeOk() {
    SKUCodeModalRef.value.submit(SKUTableData.value)
  }

  // costPrice
  const costPriceModalRef = ref()
  const costPriceModalOpen = ref(false)

  function costPriceOk() {
    costPriceModalRef.value.modify(SKUTableData.value)
  }

  // stock
  const stockModalRef = ref()
  const stockModalOpen = ref(false)

  function stockOk() {
    stockModalRef.value.modify(SKUTableData.value)
  }

  // planNum
  const quantityModalRef = ref()
  const quantityModalOpen = ref(false)

  function quantityOk() {
    quantityModalRef.value.modify(SKUTableData.value)
  }

  // saleUnit
  const unitModalRef = ref()
  const unitModalOpen = ref(false)

  function unitOk() {
    unitModalRef.value.modify(SKUTableData.value)
  }

  // size
  const sizeModalRef = ref()
  const sizeModalOpen = ref(false)

  function sizeOk() {
    sizeModalRef.value.modify(SKUTableData.value)
  }

  // weight
  const weightModalRef = ref()
  const weightModalOpen = ref(false)

  function weightOk() {
    weightModalRef.value.modify(SKUTableData.value)
  }

  /** 校验并提交数据 */
  // 校验
  function validate() {
    let flag = true
    // 必填变种属性是否有空
    loop1: for (const item of filteredAspectList.value) {
      for (const column of item.columns.slice(0, -1)) {
        if (column.isRequired) {
          if (item.tableData.some(record => !nonEmpty(record[column.name]))) {
            message.error('有必填属性未填写')

            flag = false
            break loop1
          }
        }
      }
    }

    if (!flag) return false // 短路
    // SKUTable 是否有空
    const list = [...COLUMNS.slice(0, -1).filter(col => !excludedList.value.includes(col.key)), { title: '长', key: 'length' }, { title: '宽', key: 'width' }, { title: '高', key: 'height' }].filter(item => item.key !== 'size')
    loop2: for (const item of list) {
      for (const record of SKUTableData.value) {
        if (!nonEmpty(record[item.key])) {
          message.error(`有 ${item.title} 未填写`)

          flag = false
          break loop2
        }
      }
    }

    if (!flag) return false // 短路
    // SKUCode 不能相同
    const SKUCodeList = SKUTableData.value.map(record => record.skuCode)
    const SKUCodeSet = new Set(SKUCodeList)
    if (SKUCodeList.length !== SKUCodeSet.size) {
      message.error('SKU 编码不能重复')

      flag = false
    }

    if (!flag) return false // 短路
    // 校验图片数量 (说是不限制, 但至少得传1张吧, 也不能传个大几百张吧)
    const min = 1
    const max = 999
    const min2 = 5
    const max2 = 999
    for (const record of SKUTableData.value) {
      if (record.mainImages.length < min || record.mainImages.length > max) {
        message.error('主图的数量不符合限制, 请至少上传一张图片')

        flag = false
        break
      }
      if (record.subImages.length < min2 || record.subImages.length > max2) {
        message.error('副图的数量不符合限制, 请至少上传5张图片')

        flag = false
        break
      }
    }

    return flag
  }

  function emitData() {
    // 校验
    if (validate()) {
      const skuList = SKUTableData.value.map(item => {
        // SKU 属性
        const skuAttributes = []
        aspectColumns.value
          .map(col => col.key)
          .forEach(name => {
            // 从全部属性中找到对应的数据
            const target = rawAttributes.value.find(attr => attr.name === name)
            if (target) {
              const relatedAttributeIdList = target.relatedAttributeId?.split(',') || []
              // 变种属性的值可能是多选(以','分割)
              const valueList = String(item[name]).split(',')
              valueList.forEach((val, i) => {
                // 找到值对应的 id
                let attributeOptionId = '0'
                if (target.options) {
                  attributeOptionId = target.options.find(opt => opt.value === val)?.id ?? '0'
                }
                skuAttributes.push({
                  id: relatedAttributeIdList[i],
                  intelligentAttributeId: target.intelligentAttributeId,
                  complexId: '0',
                  skuId: item.skuId,
                  skuCode: item.skuCode,
                  attributeId: target.id,
                  attributeName: name,
                  attributeOptionId,
                  attributeValue: val,
                  isVariant: true
                })
              })
            }
          })

        const isPlanNum = checkedList.value.includes('mult') ? (item.mult ? 1 : 0) : 0
        const obj = {
          skuId: item.skuId,
          colorImage: checkedList.value.includes('colorImage') ? processImageSource(item.colorImage) : '',
          skuCode: item.skuCode.trim(),
          costPrice: item.costPrice,
          stock: item.stock,
          planNum: isPlanNum === 1 ? 1 : item.planNum,
          isPlanNum,
          saleUnit: item.saleUnit,
          length: item.length,
          width: item.width,
          height: item.height,
          weight: item.weight,
          mainImages: item.mainImages.map(image => processImageSource(image.url)),
          subImages: item.subImages.map(image => processImageSource(image.url)),
          skuAttributes
        }

        // 初始时, 如果没有 skuId, 从详情里根据 skuCode 匹配对应的 skuId
        if (!obj.skuId) {
          const targetItem = detail.value.skuList.find(item => item.skuCode === obj.skuCode)
          targetItem && (obj.skuId = targetItem.id)
        }

        return obj
      })

      return skuList
    } else {
      return false
    }
  }

  // 抛出数据和方法，可以让父级用ref获取
  defineExpose({ filteredAspectList, emitData })
</script>
