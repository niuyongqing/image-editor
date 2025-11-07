<!-- 仿店小蜜的可搜索分类选择器 -->
<template>
  <a-modal
    title="选择分类"
    :open="open"
    :mask-closable="false"
    width="996px"
    @cancel="cancel"
    @ok="ok"
  >
    <a-select
      :options="flatTreeFilteredOptions"
      placeholder="搜索分类名称"
      allow-clear
      show-search
      :filter-option="false"
      :list-height="547"
      :dropdown-style="{ height: '555px' }"
      class="w-full"
      @search="val => (searchState.global = val)"
      @select="selectGlobalItem"
    >
      <template #suffixIcon><SearchOutlined /></template>
    </a-select>
    <div class="my-3">{{ categoryLabels }}</div>

    <!-- 三层级联选择 -->
    <div class="flex justify-around">
      <!-- 第一级 -->
      <a-card class="w-77">
        <a-input
          v-model:value="searchState.firstLevel"
          allow-clear
          class="mb-2"
        >
          <template #suffix><SearchOutlined /></template>
        </a-input>
        <div class="overflow-y-auto h-100">
          <div
            v-for="item in firstFilteredOptions"
            :key="item.id"
            class="py-1 px-2 hover:bg-[#0000000f] cursor-pointer flex items-center"
            :class="item.descriptionCategoryId === selectedCategoryList[0]?.descriptionCategoryId && 'bg-#e6f4ff!'"
            @click="selectFirst(item)"
          >
            <div
              class="flex-1 mr-2 truncate"
              :title="item.categoryName"
            >
              {{ item.categoryName }}
            </div>
            <RightOutlined class="flex-none" />
          </div>
        </div>
      </a-card>
      <!-- 第二级 -->
      <a-card class="w-77">
        <a-input
          v-model:value="searchState.secondLevel"
          allow-clear
          class="mb-2"
        >
          <template #suffix><SearchOutlined /></template>
        </a-input>
        <div class="overflow-y-auto h-100">
          <div
            v-for="item in secondFilteredOptions"
            :key="item.id"
            class="py-1 px-2 hover:bg-[#0000000f] cursor-pointer flex items-center"
            :class="item.descriptionCategoryId === selectedCategoryList[1]?.descriptionCategoryId && 'bg-#e6f4ff!'"
            @click="selectSecond(item)"
          >
            <div
              class="flex-1 mr-2 truncate"
              :title="item.categoryName"
            >
              {{ item.categoryName }}
            </div>
            <RightOutlined class="flex-none" />
          </div>
        </div>
      </a-card>
      <!-- 第三级 -->
      <a-card class="w-77">
        <a-input
          v-model:value="searchState.thirdLevel"
          allow-clear
          class="mb-2"
        >
          <template #suffix><SearchOutlined /></template>
        </a-input>
        <div class="overflow-y-auto h-100">
          <div
            v-for="item in thirdFilteredOptions"
            :key="item.id"
            class="py-1 px-2 hover:bg-[#0000000f] cursor-pointer"
            :class="item.descriptionCategoryId === selectedCategoryList[2]?.descriptionCategoryId && 'bg-#e6f4ff!'"
            @click="selectThird(item)"
          >
            <div
              class="truncate"
              :title="item.categoryName"
            >
              {{ item.categoryName }}
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </a-modal>
</template>

<script setup>
  import { SearchOutlined, RightOutlined } from '@ant-design/icons-vue'
  import { newCategoryTreeApi } from '@/pages/product-review/CommonDetail/api'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    // 分类 id 组, 英文逗号分割
    categoryIds: {
      type: String,
      default: ''
    },
    // 分类选项, 如未传, 则使用组件内的数据
    options: {
      type: Array,
      default: () => []
    }
  })
  const emits = defineEmits(['update:open', 'update:categoryIds', 'update:categoryLabels', 'change'])

  // 获取默认分类选项
  const defaultOptions = ref([])

  // 最终使用的分类选项(也即第一层数据源)
  const firstOptions = computed(() => (props.options.length ? props.options : defaultOptions.value))
  // 第一层分类选项 filtered
  const firstFilteredOptions = computed(() => (searchState.firstLevel ? firstOptions.value.filter(item => item.categoryName.includes(searchState.firstLevel)) : firstOptions.value))
  // 第二层分类选项
  const secondOptions = computed(() => {
    if (!selectedCategoryList.value[0]) return []

    return firstOptions.value.find(item => item.descriptionCategoryId === selectedCategoryList.value[0].descriptionCategoryId).children
  })
  // 第二层分类选项 filtered
  const secondFilteredOptions = computed(() => (searchState.secondLevel ? secondOptions.value.filter(item => item.categoryName.includes(searchState.secondLevel)) : secondOptions.value))
  // 第三层分类选项
  const thirdOptions = computed(() => {
    if (!selectedCategoryList.value[1]) return []

    return secondOptions.value.find(item => item.descriptionCategoryId === selectedCategoryList.value[1].descriptionCategoryId).children
  })
  // 第三层分类选项 filtered
  const thirdFilteredOptions = computed(() => (searchState.thirdLevel ? thirdOptions.value.filter(item => item.categoryName.includes(searchState.thirdLevel)) : thirdOptions.value))

  // 平铺的数据, 供全局搜索用
  const flatTreeList = computed(() => {
    const list = []

    // 遍历第一级
    for (const level1 of firstOptions.value) {
      // 遍历第二级
      for (const level2 of level1.children) {
        // 遍历第三级
        for (const level3 of level2.children) {
          // 将路径添加到结果数组
          const resLevel1 = { categoryName: level1.categoryName, descriptionCategoryId: level1.descriptionCategoryId }
          const resLevel2 = { categoryName: level2.categoryName, descriptionCategoryId: level2.descriptionCategoryId }
          const resLevel3 = { categoryName: level3.categoryName, descriptionCategoryId: level3.descriptionCategoryId }
          const valueArr = [resLevel1, resLevel2, resLevel3]
          const label = valueArr.map(item => item.categoryName).join(' / ')
          const uniqueCode = valueArr.map(item => item.descriptionCategoryId).join(',')

          list.push({ label, uniqueCode, value: valueArr })
        }
      }
    }
    return list
  })
  // 全局搜索时展示的数据
  const flatTreeFilteredOptions = computed(() => (searchState.global ? flatTreeList.value.filter(item => item.label.includes(searchState.global)) : []))

  // 已选分类的 id 文本
  const categoryIdText = computed(() => selectedCategoryList.value.map(item => item.descriptionCategoryId).join(','))
  // 已选分类的 label 文本
  const categoryLabels = computed(() => selectedCategoryList.value.map(item => item.categoryName).join(' / ') || '未选择分类')

  getOptions()
  function getOptions() {
    newCategoryTreeApi().then(res => {
      defaultOptions.value = res.data || []

      // 如果有传入 categoryIds, 回显文本
      setTimeout(
        () => {
          if (props.categoryIds) {
            const list = flatTreeList.value.find(item => item.uniqueCode === props.categoryIds)?.value || []
            selectedCategoryList.value = [...list]
            emits('update:categoryLabels', categoryLabels.value)
          }
        },
        props.categoryIds ? 0 : 500
      )
    })
  }

  /** 搜索 */
  const searchState = reactive({
    global: '', // 所有层级的搜索
    firstLevel: '', // 第一层
    secondLevel: '', // 第二层
    thirdLevel: '' // 第三层
  })

  // 全局搜索的选择
  function selectGlobalItem(val) {
    // 清空子级搜索
    searchState.global = ''
    searchState.firstLevel = ''
    searchState.secondLevel = ''
    searchState.thirdLevel = ''

    selectedCategoryList.value = [...val]
  }

  // 选中的分类集合
  const selectedCategoryList = ref([])

  // 选中第一级
  function selectFirst(item) {
    const { categoryName, descriptionCategoryId } = item
    selectedCategoryList.value.splice(0, 3, { categoryName, descriptionCategoryId })
  }

  // 选中第二级
  function selectSecond(item) {
    const { categoryName, descriptionCategoryId } = item
    selectedCategoryList.value.splice(1, 2, { categoryName, descriptionCategoryId })
  }

  // 选中第三级
  function selectThird(item) {
    const { categoryName, descriptionCategoryId } = item
    selectedCategoryList.value.splice(2, 1, { categoryName, descriptionCategoryId })
  }

  /** 取消和确认 */
  function cancel() {
    emits('update:open', false)
  }

  function ok() {
    if (selectedCategoryList.value.length === 3) {
      emits('update:categoryIds', categoryIdText.value)
      emits('update:categoryLabels', categoryLabels.value)
      emits('change', selectedCategoryList.value)
    }

    cancel()
  }
</script>
