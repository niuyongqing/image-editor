<!-- SKU信息 变种 -->
<template>
  <div>
    <a-card
      title="SKU信息"
      class="text-left"
    >
      <a-card title="变种属性">
        <div class="mb-2">
          <span>变种主题: </span>
          <a-space v-if="filteredAspectBtnList.length">
            <a-button
              v-for="item in filteredAspectBtnList"
              :key="item.key"
              type="link"
              @click="addAspect(item)"
              >{{ item.name }} <PlusOutlined
            /></a-button>
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
              >*</span
            >
            <span>{{ item.name }}</span>
          </template>

          <template #extra>
            <a-space>
              <!-- TODO: -->
              <a-button
                v-if="item.columns[0].options"
                type="link"
                >批量设置</a-button
              >
              <a-button
                v-if="!item.isRequired"
                type="link"
                danger
                @click="removeAspect(item)"
                >移除</a-button
              >
            </a-space>
          </template>

          <a-table
            :columns="item.columns"
            :data-source="item.tableData"
            row-key="uuid"
            :pagination="false"
          >
            <template #headerCell="{ title, column }">
              <template v-if="column.isRequired">
                <span class="text-[#ff4d4f]">*</span>
                <span>{{ title }}</span>
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
                  :precision="0"
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
        <a-table
          :columns="SKUColumns"
          :data-source="SKUTableData"
          row-key="uuid"
          :pagination="false"
        >
          <template #headerCell="{ title }">
            <template v-if="title === 'SKU'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <a-button
                type="link"
                class="ml-1"
                >批量</a-button
              >
            </template>
            <template v-else-if="title === '成本价'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <a-button
                type="link"
                class="ml-1"
                >批量</a-button
              >
            </template>
            <template v-else-if="title === '库存'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <a-button
                type="link"
                class="ml-1"
                >批量</a-button
              >
            </template>
            <template v-else-if="title === '策划数量'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <a-button
                type="link"
                class="ml-1"
                >批量</a-button
              >
            </template>
            <template v-else-if="title === '售卖单位'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <a-button
                type="link"
                class="ml-1"
                >批量</a-button
              >
            </template>
            <template v-else-if="title === '尺寸(mm)'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <a-button
                type="link"
                class="ml-1"
                >批量</a-button
              >
            </template>
            <template v-else-if="title === '重量(g)'">
              <span class="text-[#ff4d4f]">*</span>
              <span>{{ title }}</span>
              <a-button
                type="link"
                class="ml-1"
                >批量</a-button
              >
            </template>
          </template>

          <template #bodyCell="{ record, column }">
            <template v-if="column.title === 'SKU'">
              <a-input
                v-model:value="record.skuCode"
                placeholder="请输入"
                class="w-full"
              />
            </template>
            <template v-else-if="column.title === '成本价'">
              <a-input-number
                v-model:value="record.costPrice"
                :controls="false"
                :precision="2"
                :min="0.01"
                :max="99999"
                placeholder="请输入数值"
                class="w-full"
              />
            </template>
            <template v-else-if="column.title === '库存'">
              <a-input-number
                v-model:value="record.stock"
                :controls="false"
                :precision="0"
                :min="1"
                :max="99999"
                placeholder="请输入数值"
                class="w-full"
              />
            </template>
            <template v-else-if="column.title === '策划数量'">
              <a-input-number
                v-model:value="record.quantity"
                :controls="false"
                :precision="0"
                :min="1"
                :max="99999"
                placeholder="请输入数值"
                class="w-full"
              />
            </template>
            <template v-else-if="column.title === '售卖单位'">
              <a-input
                v-model:value="record.unit"
                placeholder="请输入"
                class="w-full"
              />
            </template>
            <template v-else-if="column.title === '尺寸(mm)'">
              <a-space>
                <a-input-number
                  v-model:value="record.length"
                  :controls="false"
                  :precision="0"
                  :min="1"
                  :max="99999"
                  placeholder="长"
                  class="w-full"
                />
                <a-input-number
                  v-model:value="record.width"
                  :controls="false"
                  :precision="0"
                  :min="1"
                  :max="99999"
                  placeholder="宽"
                  class="w-full"
                />
                <a-input-number
                  v-model:value="record.height"
                  :controls="false"
                  :precision="0"
                  :min="1"
                  :max="99999"
                  placeholder="高"
                  class="w-full"
                />
              </a-space>
            </template>
            <template v-else-if="column.title === '重量(g)'">
              <a-input-number
                v-model:value="record.weight"
                :controls="false"
                :precision="0"
                :min="1"
                :max="99999"
                placeholder="请输入数值"
                class="w-full"
              />
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
  </div>
</template>

<script setup>
  import { COLUMNS } from './config'
  import { message } from 'ant-design-vue'
  import { v4 as uuidv4 } from 'uuid'
  import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons-vue'

  const store = useProductReviewStore()
  const detail = computed(() => store.detail)
  const rawAttributes = computed(() => store.attributes)

  /** 变种属性列表 */
  watch(
    () => rawAttributes.value,
    list => {
      if (list.length) {
        getAspectList()
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
          labelList.push(getValue(record[key], 'label'))
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

        list.push({ title: key, key, dataIndex: key, width: 100 })
      }
    })

    return list
  })
  // SKU 表头(合并变种属性表头和常量表头)
  const SKUColumns = computed(() => [...aspectColumns.value, ...COLUMNS])
  /** computed END */

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
        return Boolean(Object.keys(val).length)
      case 'String':
      default:
        return Boolean(val)
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
  const SKUTableData = ref([{ uuid: uuidv4() }])

  watch(
    () => usefulAspect.value,
    list => {
      if (hasDuplicateAspect.value) return

      SKUTableData.value = generateSKUCombinations()
    },
    { deep: true }
  )

  // 生成 SKU 组合 (! KEY FUNCTION !)
  function generateSKUCombinations() {
    return usefulAspect.value.reduce(
      (combinations, item) => {
        // 对现有组合进行扩展
        return combinations.flatMap(combination =>
          item.nonEmptyTableData.map(record => {
            // 收集父级 uuid, 做未使用变种的 tree shaking
            const newObj = { uuid: uuidv4(), parentUuidList: combination.parentUuidList ? [...combination.parentUuidList] : [] }
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
      [{ uuid: uuidv4() }]
    )
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

  /** 校验并提交数据 */
  function emitData() {}

  // 抛出数据和方法，可以让父级用ref获取
  defineExpose({ emitData })
</script>
