<!-- 移动端详情编辑器 -->
<template>
  <div class="mobile-detail-editor">
    <!-- 外显的部分 -->
    <div class="preview">
      <div class="wrap">
        <div
          v-for="(item, i) in mobileDetail"
          :key="i"
        >
          <div v-if="item.type === 'text'">
            <div
              v-for="(text, i2) in item.texts"
              :key="i2"
            >
              <!-- 类型(class)分为 title 和 body, 但没有区别, 只是编辑时设置的默认样式不一样 -->
              <div
                :style="{ 'font-size': text.style.fontSize + 'px', 'font-weight': text.style.fontWeight, 'text-align': text.style.align, color: text.style.color }"
                :innerText="text.content"
              ></div>
            </div>
          </div>
          <div v-else-if="item.type === 'image'">
            <div
              v-for="(image, i2) in item.images"
              :key="i2"
            >
              <!-- 固定尺寸, 撑满 -->
              <img
                :src="image.url"
                width="100%"
                :class="image.hasMargin ? 'mb-2' : ''"
              />
            </div>
          </div>
          <div v-else-if="item.type === 'text-image'">图文</div>
          <div v-else>暂不支持该类型: {{ item.type }}</div>
        </div>
      </div>
      <div class="mask">
        <a-button
          type="primary"
          shape="round"
          size="large"
          class="mt-60 mb-4"
          @click="openEditor"
          >移动端详情编辑器</a-button
        >
        <br />
        <a-button
          shape="round"
          size="large"
          @click="clear"
          >清空移动端详情</a-button
        >
      </div>
    </div>

    <!-- 编辑器部分 -->
    <div
      v-if="show"
      class="editor"
    >
      <div class="header">
        <a-space>
          <a-button @click="handleClose">关闭</a-button>
          <a-button
            type="primary"
            @click="openModal"
            >批量改图片尺寸</a-button
          >
          <a-button
            type="primary"
            @click="save"
            >保存</a-button
          >
        </a-space>
      </div>
      <!-- 版心 -->
      <div class="main">
        <!-- 左侧 -->
        <div class="left">
          <div class="font-bold mb-2">添加模块</div>
          <div class="module">
            <div
              v-for="item in modules"
              :key="item.name"
              :data-name="item.name"
              class="module-item"
              draggable="true"
              @dragstart="drag"
              @dragend="dragends"
            >
              <div :class="['module-item-icon', item.name]"></div>
              <div>
                <div>{{ item.text }}</div>
                <div>{{ moduleList.filter(el => el.type === item.name).length }} / {{ item.limit }}</div>
              </div>
            </div>
          </div>
          <div class="font-bold mb-2">使用中的模块</div>
          <a-empty
            v-if="moduleList.length === 0"
            :image="simpleImage"
          />
          <Draggable
            v-else
            class="active-module"
            :list="moduleList"
            item-key="id"
            group="left"
            animation="200"
          >
            <template #item="{ element: item, index }">
              <div
                :class="['active-module-item', activeId === item.id && 'active-bar']"
                @click="selectModule(item, index)"
              >
                <HolderOutlined class="mx-2" />
                <span>{{ TEXT_ENUM[item.type] }}</span>
                <div class="btn">
                  <a-button
                    type="text"
                    title="复制"
                    @click.stop="moduleCopy(index)"
                  >
                    <CopyOutlined />
                  </a-button>
                  <a-button
                    type="text"
                    title="删除"
                    @click.stop="moduleDel"
                  >
                    <DeleteOutlined />
                  </a-button>
                </div>
              </div>
            </template>
          </Draggable>
        </div>

        <!-- 中间内容 -->
        <section
          class="inline-block"
          @dragover="allowDrop"
          @drop="drop"
          @dragleave="dragleaves"
        >
          <div :class="['content', pointerEventsNone && 'pointer-events-none']">
            <template v-if="moduleList.length">
              <div
                v-for="(item, i) in moduleList"
                :key="i"
                :class="['content-module-item', activeId === item.id && 'active']"
                :id="item.id"
                @click="selectModule(item, i)"
              >
                <div v-if="item.type === 'text'">
                  <template v-if="item.texts.length">
                    <div
                      v-for="(text, i2) in item.texts"
                      :key="i2"
                    >
                      <!-- 类型(class)分为 title 和 body, 但没有区别, 只是编辑时设置的默认样式不一样 -->
                      <div
                        :style="{ 'font-size': text.style.fontSize + 'px', 'font-weight': text.style.fontWeight, 'text-align': text.style.align, color: text.style.color }"
                        :innerText="text.content"
                      ></div>
                    </div>
                  </template>
                  <div
                    v-else
                    :class="['empty', item.type]"
                  ></div>
                </div>
                <div v-else-if="item.type === 'image'">
                  <template v-if="item.images[0].url">
                    <div
                      v-for="(image, i2) in item.images"
                      :key="i2"
                    >
                      <!-- 固定尺寸, 撑满 -->
                      <img
                        :src="image.url"
                        width="100%"
                        :class="item.noMargin ? '' : 'mb-2'"
                      />
                    </div>
                  </template>
                  <div
                    v-else
                    :class="['empty', item.type]"
                  ></div>
                </div>
                <div v-else-if="item.type === 'text-image'">图文</div>
                <div v-else-if="item.type === 'placement-area'">
                  <!-- 提示模块 -->
                  <div class="placement-area">可将模块放置到此区域</div>
                </div>
                <div v-else>暂不支持该类型: {{ item.type }}</div>
              </div>
            </template>
            <div
              v-else
              class="module-empty"
            ></div>
          </div>
        </section>

        <!-- 右侧详情 -->
        <div
          v-if="showRight"
          class="right"
          :style="{ top: offsetTop + 'px' }"
        >
          <!-- 点击中间模块时显示在右边的操作面板 -->
          <div class="content-panel">
            <a-space
              direction="vertical"
              class="text-xl"
            >
              <a-button
                type="text"
                title="上移"
                :disabled="activeModuleIndex === 0"
                @click="moduleUp"
              >
                <ArrowUpOutlined />
              </a-button>
              <a-button
                type="text"
                title="下移"
                :disabled="activeModuleIndex === moduleList.length - 1"
                @click="moduleDown"
              >
                <ArrowDownOutlined />
              </a-button>
              <a-button
                type="text"
                title="复制"
                @click="moduleCopy()"
              >
                <CopyOutlined />
              </a-button>
              <!-- <a-button
                  type="text"
                  @click="moduleMore"
                >
                  <RightSquareOutlined />
                </a-button> -->
              <a-button
                type="text"
                title="删除"
                @click="moduleDel"
              >
                <DeleteOutlined />
              </a-button>
            </a-space>
          </div>
          <div class="text-base text-gray flex justify-between mb-2">
            <span>{{ TEXT_ENUM[activeModule.type] }}</span>
            <CloseOutlined
              class="bold"
              @click="closeModule"
            />
          </div>
          <!-- 文本 -->
          <template v-if="activeModule.type === 'text'">
            <div
              v-for="key in ['titleInfo', 'bodyInfo']"
              :key="key"
              class="text-item"
            >
              <div class="text-gray">{{ key === 'titleInfo' ? '标题' : '正文' }}</div>
              <a-input
                v-if="key === 'titleInfo'"
                v-model:value="textDetail[key].text"
                @blur="titleChange"
              />
              <a-textarea
                v-if="key === 'bodyInfo'"
                v-model:value="textDetail[key].text"
                :auto-size="{ minRows: 4 }"
                @blur="bodyChange"
              />
              <a-button
                type="link"
                @click="textDetail[key].expand = !textDetail[key].expand"
                >高级设置 <UpOutlined v-if="textDetail[key].expand" /><DownOutlined v-else
              /></a-button>
              <div v-show="textDetail[key].expand">
                <div class="style">
                  <div class="style-item">
                    <div>字重:</div>
                    <a-select
                      v-model:value="textDetail[key].style.fontWeight"
                      :options="FONT_WEIGHT_OPTION"
                    />
                  </div>
                  <div class="style-item">
                    <div>字号:</div>
                    <a-select
                      v-model:value="textDetail[key].style.fontSize"
                      :options="FONT_SIZE_OPTION"
                    />
                  </div>
                  <div class="style-item">
                    <div>颜色:</div>
                    <a-input
                      v-model:value="textDetail[key].style.color"
                      type="color"
                    />
                  </div>
                </div>
                <div>
                  <div>对齐:</div>
                  <a-radio-group v-model:value="textDetail[key].style.align">
                    <a-radio
                      v-for="item in ALIGN_OPTION"
                      :key="item.value"
                      :value="item.value"
                      >{{ item.label }}</a-radio
                    >
                  </a-radio-group>
                </div>
              </div>
            </div>
          </template>
          <!-- 图片 -->
          <template v-else-if="activeModule.type === 'image'">
            <div
              v-for="(imageItem, i) in activeModule.images"
              :key="i"
              class="mb-3"
            >
              <div class="image-cell">
                <div class="image-content">
                  <!-- 有图片, 显示'更换图片'按钮 -->
                  <div
                    v-if="imageItem.url"
                    class="img-wrap"
                  >
                    <img
                      :src="imageItem.url"
                      class="img"
                    />
                    <div class="img-mask">
                      <DropdownOfImage
                        :account="props.sellerId"
                        @submit="imgData => switchImgData(imgData, i)"
                      >
                        <a-button
                          type="link"
                          class="mt-16 text-white"
                          >更换图片</a-button
                        >
                      </DropdownOfImage>
                    </div>
                  </div>
                  <!-- 无图片, 显示'添加图片'按钮 -->
                  <DropdownOfImage
                    v-else
                    :account="props.sellerId"
                    :limit="10"
                    @submit="imgData => fillImgData(imgData, i)"
                  >
                    <a-button
                      type="link"
                      class="mt-16"
                      >添加图片</a-button
                    >
                  </DropdownOfImage>
                </div>
                <div class="image-panel">
                  <a-space
                    direction="vertical"
                    class="text-xl"
                  >
                    <a-button
                      type="text"
                      title="上移"
                      :disabled="i === 0"
                      @click="up(i)"
                    >
                      <ArrowUpOutlined />
                    </a-button>
                    <a-button
                      type="text"
                      title="下移"
                      :disabled="i === activeModule.images.length - 1"
                      @click="down(i)"
                    >
                      <ArrowDownOutlined />
                    </a-button>
                    <a-button
                      type="text"
                      title="添加超链接"
                      :class="imageItem.targetURL ? 'text-[#1677ff]' : ''"
                      @click="imageItem.linkShow = !imageItem.linkShow"
                    >
                      <LinkOutlined />
                    </a-button>
                    <a-button
                      type="text"
                      title="删除"
                      :disabled="i === 0"
                      @click="del(i)"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </a-space>
                </div>
              </div>
              <a-input
                v-show="imageItem.linkShow"
                v-model:value="imageItem.targetURL"
                placeholder='只支持"http://"或"https://"开头的地址'
                class="w-6/7 mt-2"
              />
            </div>
            <a-checkbox
              v-if="activeModule.images.length > 1"
              v-model:checked="activeModule.noMargin"
              >图片之间不保留间隙</a-checkbox
            >
            <div>
              <a-button
                type="primary"
                class="mt-2 ml-30"
                @click="add"
                >继续添加</a-button
              >
            </div>
          </template>
          <!-- 图文 -->
          <!-- <template v-else-if="activeModule.type === 'text-image'"></template> -->
          <template v-else>
            <span>暂不支持该类型: {{ activeModule.type }}</span>
          </template>
        </div>
      </div>
    </div>

    <!-- 批量编辑图片尺寸 -->
    <EditImageBatch
      v-model:open="open"
      :image-list="imageList"
      @confirm="editImageConfirm"
    />
  </div>
</template>

<script setup>
  import { cloneDeep } from 'lodash'
  import { v4 as uuidv4 } from 'uuid'
  import Draggable from 'vuedraggable'
  import DropdownOfImage from '../dropdown-of-image/index.vue'
  import { HolderOutlined, CloseOutlined, UpOutlined, DownOutlined, ArrowUpOutlined, ArrowDownOutlined, LinkOutlined, DeleteOutlined, RightSquareOutlined, CopyOutlined } from '@ant-design/icons-vue'
  import EditImageBatch from '../edit-image-batch/index.vue'
  import { Empty, Modal, message } from 'ant-design-vue'
  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

  defineOptions({ name: 'MobileDetailEditor' })

  const props = defineProps({
    mobileDetail: {
      type: Array,
      default: () => []
    },
    sellerId: {
      type: String,
      default: ''
    }
  })
  const emits = defineEmits(['clear', 'mobileDetailEdit'])

  const show = ref(false)
  const moduleList = ref([])
  function openEditor() {
    moduleList.value = props.mobileDetail.map(item => {
      const obj = {
        ...cloneDeep(item),
        id: uuidv4()
      }
      if (item.type === 'image') {
        obj.noMargin = !item.images[0].hasMargin
      }

      return obj
    })

    show.value = true
  }

  function clear() {
    Modal.confirm({
      title: '确定清空吗？',
      onOk: () => {
        emits('clear')
      }
    })
  }

  /** 编辑器部分 */
  // 模块
  const modules = ref([
    {
      text: '文字',
      name: 'text',
      limit: 30
    },
    {
      text: '图片',
      name: 'image',
      limit: 30
    }
    // {
    //   text: '图文',
    //   name: 'text-image',
    //   limit: 15
    // }
  ])
  const TEXT_ENUM = {
    text: '文字',
    image: '图片',
    'text-image': '图文',
    media: '视频'
  }

  // 拖拽方法
  const pointerEventsNone = ref(false)
  function drag(e) {
    pointerEventsNone.value = true
    e.dataTransfer.setData('componentName', e.target.dataset.name)
  }
  function dragends(e) {
    pointerEventsNone.value = false
  }

  /** 释放方法 */
  let offsetY = 0 // 记录上一次距离父元素高度
  // 当将元素拖动到有效放置目标（每几百毫秒）上时, 触发
  function allowDrop(e) {
    e.preventDefault()
    if (!pointerEventsNone.value) return

    /* 获取鼠标高度 */
    let eventoffset = e.offsetY

    /* 如果没有移动不触发事件减少损耗 */
    if (offsetY === eventoffset) return
    else offsetY = eventoffset

    /* 获取组件 */
    const childrenObject = e.target.children[0]

    // 如果当前模块数大于一个
    if (moduleList.value.length) {
      // 如果只有一个模块并且第一个是提示模块直接返回
      if (moduleList.value.length === 1 && moduleList.value[0].type === 'placement-area') return

      /* 如果鼠标的高度小于第一个的一半直接放到第一个 */
      if (eventoffset < childrenObject.children[0].clientHeight / 2) {
        /* 如果第一个是提示组件直接返回 */
        if (moduleList.value[0].type === 'placement-area') return

        /* 删除提示组件(如果存在) */
        moduleList.value = moduleList.value.filter(item => item.type !== 'placement-area')

        /* 最上面添加提示组件 */
        moduleList.value.unshift({ type: 'placement-area' })

        return
      }

      /* 记录距离父元素高度 */
      const childOff = childrenObject.offsetTop

      /* 鼠标在所有组件下面 */
      if (eventoffset > childrenObject.clientHeight || childrenObject.lastElementChild.offsetTop - childOff + childrenObject.lastElementChild.clientHeight / 2 < eventoffset) {
        /* 最后一个组件是提示组件返回 */
        if (moduleList.value[moduleList.value.length - 1].type === 'placement-area') return

        /* 清除提示组件 */
        moduleList.value = moduleList.value.filter(item => item.type !== 'placement-area')

        /* 最后一个不是提示组件添加 */
        moduleList.value.push({ type: 'placement-area' })

        return
      }

      /* 在两个组件中间，插入 */
      const childrens = childrenObject.children
      for (let i = 0, l = childrens.length; i < l; i++) {
        const childoffset = childrens[i].offsetTop - childOff

        if (childoffset + childrens[i].clientHeight / 2 > e.offsetY) {
          /* 如果是提示组件直接返回 */
          if (moduleList.value[i].type === 'placement-area') break

          if (moduleList.value[i - 1].type === 'placement-area') break

          /* 清除提示组件 */
          moduleList.value = moduleList.value.filter(item => item.type !== 'placement-area')

          moduleList.value.splice(i, 0, { type: 'placement-area' })
          break
        } else if (childoffset + childrens[i].clientHeight > e.offsetY) {
          if (moduleList.value[i].type === 'placement-area') break

          if (!moduleList.value[i + 1] || moduleList.value[i + 1].type === 'placement-area') break

          moduleList.value = moduleList.value.filter(item => item.type !== 'placement-area')

          moduleList.value.splice(i, 0, { type: 'placement-area' })

          break
        }
      }
    } else {
      // 空白时直接 push 提示模块
      moduleList.value.push({ type: 'placement-area' })
    }
  }
  // 当在有效放置目标上放置元素时触发此事件
  function drop(e) {
    if (!pointerEventsNone.value) return

    const type = e.dataTransfer.getData('componentName')
    const moduleItem = { type, id: uuidv4() }
    if (type === 'text') {
      moduleItem.texts = []
    } else if (type === 'image') {
      moduleItem.images = [{ url: '', style: {} }]
      moduleItem.noMargin = true
    }
    // 插入拖过来的模块(即为替换掉提示模块)
    const index = moduleList.value.findIndex(item => item.type === 'placement-area')
    moduleList.value.splice(index, 1, moduleItem)
    selectModule(moduleItem, index)
  }
  // 当拖动的元素离开有效的放置目标时, 触发
  function dragleaves() {
    moduleList.value = moduleList.value.filter(item => item.type !== 'placement-area')
  }

  // 点击模块
  const offsetTop = ref(0)
  const activeId = ref('')
  const activeModuleIndex = ref(0)
  function selectModule(item, i) {
    activeModuleIndex.value = i
    // 获取当前点击模块距离顶部的距离, 给右侧详情窗口设置一样的 top 值
    activeId.value = item.id
    nextTick(() => {
      const activeDom = document.getElementById(item.id)
      offsetTop.value = activeDom.offsetTop - 36
    })

    showRight.value = true
    activeModule.value = item
    if (item.type === 'text') {
      textDetail.value = cloneDeep(textDetailDefault)
      item.texts.forEach(textItem => {
        const key = { title: 'titleInfo', body: 'bodyInfo' }[textItem.class]
        textDetail.value[key].text = textItem.content
        textDetail.value[key].style = textItem.style
      })
    }
  }
  // 关闭选中的模块
  function closeModule() {
    activeModuleIndex.value = 0
    activeId.value = ''
    showRight.value = false
    activeModule.value = {}
    textDetail.value = cloneDeep(textDetailDefault)
  }
  // 模块右侧的控制面板
  function moduleUp() {
    const temp = { ...moduleList.value[activeModuleIndex.value] }
    moduleList.value[activeModuleIndex.value] = moduleList.value[activeModuleIndex.value - 1]
    moduleList.value[activeModuleIndex.value - 1] = temp
    // 更新当前选中的模块位置
    activeModuleIndex.value -= 1
    // 更新top位置
  }
  function moduleDown() {
    const temp = { ...moduleList.value[activeModuleIndex.value] }
    moduleList.value[activeModuleIndex.value] = moduleList.value[activeModuleIndex.value + 1]
    moduleList.value[activeModuleIndex.value + 1] = temp
    activeModuleIndex.value += 1
  }
  function moduleCopy(i) {
    let index = i === undefined ? activeModuleIndex.value : i
    const item = {
      ...moduleList.value[index],
      id: uuidv4()
    }
    const moduleItem = cloneDeep(item)
    index += 1
    moduleList.value.splice(index, 0, moduleItem)
    selectModule(moduleItem, index)
  }
  // 向下插入更多(文字, 图片, 图文)
  // function moduleMore() {}
  function moduleDel() {
    moduleList.value.splice(activeModuleIndex.value, 1)
    closeModule()
  }

  // 标题变动
  function titleChange() {
    const titleInfo = activeModule.value.texts.find(textItem => textItem.class === 'title')
    if (titleInfo) {
      titleInfo.content = textDetail.value.titleInfo.text
    } else {
      activeModule.value.texts.unshift({
        class: 'title',
        content: textDetail.value.titleInfo.text,
        style: textDetail.value.titleInfo.style
      })
    }
    // 无内容时情况 texts 数组
    if (activeModule.value.texts.every(item => !item.content)) {
      activeModule.value.texts = []
    }
  }
  // 正文变动
  function bodyChange() {
    const bodyInfo = activeModule.value.texts.find(textItem => textItem.class === 'body')
    if (bodyInfo) {
      bodyInfo.content = textDetail.value.bodyInfo.text
    } else {
      activeModule.value.texts.push({
        class: 'body',
        content: textDetail.value.bodyInfo.text,
        style: textDetail.value.bodyInfo.style
      })
    }
    // 无内容时情况 texts 数组
    if (activeModule.value.texts.every(item => !item.content)) {
      activeModule.value.texts = []
    }
  }

  /** 右侧 */
  const showRight = ref(false)
  const activeModule = ref({})

  // 文字; 因为文字类型有两种类型, 需要特殊处理
  const textDetailDefault = {
    // 标题
    titleInfo: {
      text: '',
      expand: false,
      style: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
        align: 'left'
      }
    },
    // 正文
    bodyInfo: {
      text: '',
      expand: false,
      style: {
        fontWeight: 'normal',
        fontSize: 13,
        color: '#000000',
        align: 'left'
      }
    }
  }
  const textDetail = ref({})
  textDetail.value = cloneDeep(textDetailDefault)
  // 文字样式枚举
  const FONT_WEIGHT_OPTION = [
    { label: '加粗', value: 'bold' },
    { label: '常规', value: 'normal' }
  ]
  const FONT_SIZE_OPTION = [
    { label: '12', value: 12 },
    { label: '13', value: 13 },
    { label: '16', value: 16 },
    { label: '20', value: 20 },
    { label: '24', value: 24 },
    { label: '28', value: 28 },
    { label: '32', value: 32 }
  ]
  const ALIGN_OPTION = [
    { label: '左对齐', value: 'left' },
    { label: '居中', value: 'center' },
    { label: '右对齐', value: 'right' }
  ]

  // 图片
  function fillImgData(imgData, i) {
    activeModule.value.images[i].url = imgData[0].url
    if (imgData.length > 1) {
      // 如果一次性上传多张图片, 自动在后面替换/插入
      const lengthDiff = imgData.length - 1 - (activeModule.value.images.length - (i + 1))
      if (lengthDiff > 0) {
        for (let index = 0; index < lengthDiff; index++) {
          activeModule.value.images.push({ url: '', style: {} })
        }
      }
      // 替换/插入
      for (let index = 1; index < imgData.length; index++) {
        activeModule.value.images[i + index].url = imgData[index].url
      }
    }
  }
  function switchImgData(imgData, i) {
    activeModule.value.images[i].url = imgData[0].url
    // 重置宽高?
  }
  function up(i) {
    const temp = { ...activeModule.value.images[i] }
    activeModule.value.images[i] = activeModule.value.images[i - 1]
    activeModule.value.images[i - 1] = temp
  }
  function down(i) {
    const temp = { ...activeModule.value.images[i] }
    activeModule.value.images[i] = activeModule.value.images[i + 1]
    activeModule.value.images[i + 1] = temp
  }
  function del(i) {
    activeModule.value.images.splice(i, 1)
  }
  function add() {
    activeModule.value.images.push({
      url: '',
      style: {
        width: '',
        height: '',
        hasMargin: false
      },
      noMargin: true
    })
  }

  /** 顶端按钮操作; 关闭, 保存等 */
  // 点击关闭按钮
  function handleClose() {
    Modal.confirm({
      title: '确定关闭吗吗？',
      onOk: () => {
        close()
      }
    })
  }
  // 真正的关闭操作
  function close() {
    activeModule.value = {}
    activeModuleIndex.value = 0
    show.value = false
    showRight.value = false
  }
  function save() {
    // 将 moduleList 数据转为速卖通接收的格式
    const res = []
    moduleList.value.forEach(item => {
      const obj = { ...item }
      // 移除空值(未填写任何内容或图片的模块)
      if (obj.type === 'text' && obj.texts.every(subItem => !subItem.content)) return
      if (obj.type === 'image' && obj.images.every(subItem => !subItem.url)) return
      if (obj.type === 'image') {
        obj.images.forEach(imageItem => {
          imageItem.style.hasMargin = !obj.noMargin
        })
        delete obj.noMargin
      }
      delete obj.id

      res.push(obj)
    })
    emits('mobileDetailEdit', res)
    close()
  }

  /** 修改图片尺寸弹窗 */
  const open = ref(false)
  const imageList = ref([])
  function openModal() {
    imageList.value = []
    // 提取所有图片
    const imageModuleList = moduleList.value.filter(item => item.type === 'image')
    imageModuleList.forEach(item => {
      item.images.forEach(image => {
        image.url && imageList.value.push(image.url)
      })
    })
    if (!imageList.value.length) {
      message.error('未检测到图片')

      return
    }

    open.value = true
  }
  function editImageConfirm(imageList) {
    const imageModuleList = moduleList.value.filter(item => item.type === 'image')
    imageModuleList.forEach(item => {
      item.images.forEach(image => {
        const target = imageList.find(img => img.originUrl === image.url)
        target && (image.url = target.url)
      })
    })
  }
</script>

<style lang="less" scoped>
  .mobile-detail-editor {
    position: relative;
    .preview {
      border: 1px solid #ccc;
      padding: 12px;
      width: 400px;
      height: 600px;
      overflow-y: scroll;
      .mask {
        display: none;
        background-color: rgba(0, 0, 0, 0.2);
        width: 382px;
        height: 600px;
        position: absolute;
        top: 0;
        left: 0;
        text-align: center;
      }
      &:hover {
        .mask {
          display: block;
        }
      }
    }

    .editor {
      background-color: #f0f2f5;
      width: 100%;
      height: 100%;
      z-index: 999;
      position: fixed;
      top: 0;
      left: 48px;
      .header {
        padding-top: 12px;
        padding-right: 160px;
        text-align: right;
      }
      .main {
        width: 1200px;
        height: calc(100vmin - 36px);
        margin: 0 auto;
        padding-bottom: 100px;
        overflow: auto;
        // 隐藏滚动条
        -ms-overflow-style: none; // IE and Edge
        scrollbar-width: none; // Firefox
        &::-webkit-scrollbar {
          display: none;
        }
        .left {
          background-color: #fff;
          user-select: none;
          width: 235px;
          min-height: 330px;
          padding: 16px;
          position: fixed;
          .module {
            display: flex;
            flex-wrap: wrap;
            &-item {
              width: 50%;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              &-icon {
                width: 35px;
                height: 35px;
                margin-right: 8px;
                vertical-align: top;
              }
              @type: text, image, text-image;
              each(@type, {
                .@{value} {
                  background: url('@/assets/images/common/@{value}.png') center / contain no-repeat;
                }
              });
            }
          }
          .active-module {
            &-item {
              position: relative;
              border-radius: 4px;
              overflow: hidden;
              height: 30px;
              padding: 4px 0;
              background-color: #f2f2f2;
              cursor: grab;
              margin-bottom: 8px;
              &:last-child {
                margin-bottom: 0;
              }
              &:hover {
                .btn {
                  display: block;
                }
              }
            }
            .active-bar {
              background-color: #eff2f9;
              &::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 3px;
                height: 100%;
                background-color: #00aaff;
              }
            }
            .btn {
              float: right;
              display: none;
            }
          }
        }
        .content {
          background-color: #fff;
          user-select: none;
          width: 500px;
          min-height: 330px;
          margin-left: 250px;
          padding: 8px;
          &-module-item {
            border: 1px solid #ddd;
            padding: 8px;
            margin-bottom: 8px;
            &:last-child {
              margin-bottom: 0;
            }
            .empty {
              padding: 12px;
              height: 60px;
              opacity: 0.5;
            }
            @type: text, image, text-image;
            each(@type, {
              .@{value} {
                background: url('@/assets/images/common/@{value}.png') center / contain no-repeat;
              }
            });
            .placement-area {
              background-color: rgba(#00aaff, 0.1);
              color: #00aaff;
              border: 2px dashed #00aaff;
              width: 100%;
              height: 60px;
              text-align: center;
              line-height: 60px;
            }
          }
          .active {
            border: 1px solid #00aaff;
          }

          .module-empty {
            height: 314px;
            background: url('@/assets/images/common/module-empty.png') center no-repeat;
          }
        }
        .right {
          background-color: #fff;
          padding: 8px;
          display: inline-block;
          position: relative;
          width: 370px;
          margin-left: 60px;
          vertical-align: top;
          .content-panel {
            position: absolute;
            top: 0;
            left: -50px;
            background-color: #fff;
          }

          .text-item {
            border-bottom: 1px solid #ddd;
            padding-bottom: 12px;
            margin-bottom: 12px;
            .style {
              display: flex;
              &-item {
                flex: 1;
                margin-right: 8px;
                &:last-child {
                  margin-right: 0;
                }
              }
            }
          }
          .image-cell {
            display: flex;
            .image-content {
              width: 300px;
              height: 150px;
              background-color: #eee;
              margin-right: 12px;
              text-align: center;
              .img-wrap {
                position: relative;
                width: 100%;
                height: 100%;
                .img {
                  max-width: 100%;
                  height: 100%;
                }
                .img-mask {
                  display: none;
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.2);
                }
                &:hover {
                  .img-mask {
                    display: block;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
