<!-- 水印编辑 -->
<template>
  <div class="w-350 mx-auto text-left select-none">
    <a-space class="float-right">
      <a-button @click="close">关闭</a-button>
      <a-button
        type="primary"
        :loading="loading"
        @click="submit"
        >保存</a-button
      >
    </a-space>
    <br />

    <div h-270>
      <div class="ml-100 mb-3">
        <span>底图大小: </span>
        <a-select
          v-model:value="form.bgSize"
          :options="BASE_IMG_SIZE_OPTIONS"
          class="w-30"
        ></a-select>
        <a-tag
          color="cyan"
          class="mx-2"
          >说明</a-tag
        >
        <span>使用时将会根据原图大小对水印进行等比例缩放</span>
        <span class="ml-10">{{ `X: ${positionX}     Y: ${positionY}` }}</span>
      </div>

      <div class="flex">
        <!-- LEFT -->
        <div class="bg-white w-96 mr-4 p-4 flex-none h-150">
          <a-form
            :model="form"
            :label-col="{ style: { width: '80px' } }"
            ref="formRef"
          >
            <a-form-item
              label="模板名称"
              name="title"
              required
            >
              <a-input v-model:value="form.title" />
            </a-form-item>
            <a-divider />
            <!-- 水印类型变更时, 清空水印内容 -->
            <a-form-item label="水印类型">
              <a-radio-group
                v-model:value="form.type"
                :options="TYPE_RADIO_OPTIONS"
                @change="form.content = ''"
              />
            </a-form-item>
            <a-form-item
              v-if="form.type === 1"
              label="水印内容"
              name="content"
              required
            >
              <a-upload
                accept=".jpg,.jpeg,.png"
                :action="uploadImageUrl"
                list-type="picture-card"
                :headers="headers"
                :show-upload-list="false"
                @change="handleUploadChange"
              >
                <img
                  v-if="form.content"
                  :src="form.content"
                  width="100"
                  height="100"
                  class="object-contain"
                  alt="image watermark"
                />
                <div v-else>
                  <PlusOutlined />
                  <div>水印图片</div>
                </div>
              </a-upload>
              <a-tag
                color="cyan"
                class="mr-2"
                >说明</a-tag
              >
              <span>建议上传透明底的png格式图片</span>
            </a-form-item>
            <!-- 水印文字配置内容 -->
            <template v-else>
              <a-form-item
                label="水印内容"
                name="content"
                required
              >
                <a-textarea
                  v-model:value="form.content"
                  :auto-size="{ minRows: 4, maxRows: 6 }"
                />
              </a-form-item>
              <a-form-item label="字体类型">
                <a-select
                  v-model:value="form.typefaceType"
                  :options="FONT_FACE_OPTIONS"
                  class=""
                ></a-select>
              </a-form-item>
              <a-form-item label="字体大小">
                <a-select
                  v-model:value="form.typefaceSize"
                  :options="FONT_SIZE_OPTIONS"
                  class=""
                ></a-select>
              </a-form-item>
              <a-form-item label="字体颜色">
                <a-input
                  v-model:value="form.textColor"
                  type="color"
                />
              </a-form-item>
            </template>
            <a-form-item label="水印位置">
              <!-- 九宫格   ୧(๑•̀◡•́๑)૭ -->
              <a-radio-group
                v-model:value="form.relativePosition"
                class="w-[122px] [&>.ant-radio-wrapper]:(mr-0 w-10 h-10)"
                @change="relativePositionChange"
              >
                <a-radio
                  :value="1"
                  class="[&>.ant-radio]:(top--4.5 left--2)"
                  border="1 gray-200 solid"
                />
                <a-radio
                  :value="2"
                  class="[&>.ant-radio]:(top--4.5 left-3)"
                  border="0 t r b gray-200 solid"
                />
                <a-radio
                  :value="3"
                  class="[&>.ant-radio]:(top--4.5 left-8)"
                  border="0 t r b gray-200 solid"
                />
                <a-radio
                  :value="4"
                  class="[&>.ant-radio]:left--2"
                  border="0 r b l gray-200 solid"
                />
                <a-radio
                  :value="5"
                  class="[&>.ant-radio]:left-3"
                  border="0 r b gray-200 solid"
                />
                <a-radio
                  :value="6"
                  class="[&>.ant-radio]:left-8"
                  border="0 r b gray-200 solid"
                />
                <a-radio
                  :value="7"
                  class="[&>.ant-radio]:(top-4.5 left--2)"
                  border="0 r b l gray-200 solid"
                />
                <a-radio
                  :value="8"
                  class="[&>.ant-radio]:(top-4.5 left-3)"
                  border="0 r b gray-200 solid"
                />
                <a-radio
                  :value="9"
                  class="[&>.ant-radio]:(top-4.5 left-8)"
                  border="0 r b gray-200 solid"
                />
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="form.type === 1"
              label="水印大小"
            >
              <a-slider
                v-model:value="form.size"
                :min="20"
                :max="200"
                :tip-formatter="num => `${num}%`"
                @change="setImgSize"
              />
            </a-form-item>
          </a-form>
        </div>
        <!-- RIGHT -->
        <div class="flex-1">
          <div
            bg="[url(@/assets/images/common/watermark_base_bg.jpg)] contain no-repeat"
            :style="{ width: form.bgSize + 'px', height: form.bgSize + 'px' }"
            class="relative overflow-hidden"
            ref="containerRef"
          >
            <!-- dragable content -->
            <div
              class="absolute cursor-move shadow-md"
              border="1 dashed gray-3"
              ref="draggableRef"
              :style="{ left: positionX + 'px', top: positionY + 'px' }"
              @mousedown="handleMousedown"
            >
              <img
                v-if="form.content && form.type === 1"
                :src="form.content"
                draggable="false"
                :width="imgWidth"
                :height="imgHeight"
              />

              <div
                v-if="form.content && form.type === 2"
                class="p-2 whitespace-break-spaces"
                :style="{ fontFamily: form.typefaceType, fontSize: form.typefaceSize + 'px', color: form.textColor }"
              >
                {{ form.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-space class="float-right">
      <a-button @click="close">关闭</a-button>
      <a-button
        type="primary"
        :loading="loading"
        @click="submit"
        >保存</a-button
      >
    </a-space>
  </div>
</template>

<script setup>
  import { PlusOutlined } from '@ant-design/icons-vue'
  import { watermarkAddApi, watermarkDetailApi, watermarkEditApi } from '../api'
  import { message } from 'ant-design-vue'

  /** 编辑; 获取水印详情 */
  // 路由传 id, 则为编辑页
  const id = useRoute().query.id
  const watermarkDetail = {}
  let missOnce = false // 闪避一次
  if (id) {
    getDetail()
  }

  function getDetail() {
    watermarkDetailApi(id).then(res => {
      const detail = res.data || {}
      form.title = detail.title
      form.type = detail.type
      form.content = detail.content
      if (detail.bgWidth !== 800) {
        missOnce = true
      }
      form.bgSize = detail.bgWidth

      if (detail.type === 1) {
        form.size = detail.size
      } else {
        form.typefaceType = detail.typefaceType
        form.typefaceSize = detail.typefaceSize
        form.textColor = convertRgbToHex(detail.typefaceColour)
      }

      getImageNaturalSize(form.content).then(() => {
        setImgSize()
      })

      // 处理位置
      const [x, y] = detail.position.split(',').map(Number)
      positionX.value = x
      positionY.value = y
      nextTick(() => {
        const draggableRect = draggableRef.value.getBoundingClientRect()
        form.relativePosition = getRegion(x + draggableRect.width / 2, y + draggableRect.height / 2)
      })
    })
  }

  const headers = { Authorization: useAuthorization().value }
  const uploadImageUrl = import.meta.env.VITE_APP_BASE_API + '/common/upload'

  /** LEFT */
  const TYPE_RADIO_OPTIONS = [
    { label: '水印图片', value: 1 },
    { label: '水印文字', value: 2 }
  ]
  const FONT_FACE_OPTIONS = ['微软雅黑', '仿宋', '宋体', '黑体', '楷体', '幼圆'].map(value => ({ label: value, value }))
  const FONT_SIZE_OPTIONS = ['12', '13', '14', '16', '18', '24', '30', '36', '48', '60'].map(value => ({ label: value, value }))
  const form = reactive({
    title: '',
    type: 1,
    content: '',
    relativePosition: 1, // 水印相对位置, 九宫格
    size: 100, // 图片水印大小
    typefaceType: '微软雅黑', // 字体类型
    typefaceSize: '13', // 字体大小
    textColor: '#000000', // 字体颜色(传参时只取 rgb(x, x, x) 中间的 x, x, x)
    bgSize: 800
  })
  const formRef = ref()

  // 背景尺寸变化
  watch(
    () => form.bgSize,
    (newSize, oldSize) => {
      // 编辑状态初始化时触发的, 甩它一个 MISS
      if (missOnce) {
        missOnce = false

        return
      }

      const ratio = newSize / oldSize

      const draggableRect = draggableRef.value.getBoundingClientRect()
      const halfWidth = draggableRect.width / 2
      const halfHeight = draggableRect.height / 2
      positionX.value = Math.round((positionX.value + halfWidth) * ratio - halfWidth)
      positionY.value = Math.round((positionY.value + halfHeight) * ratio - halfHeight)
    }
  )

  // 上传图片的原始尺寸
  let naturalWidth = 0
  let naturalHeight = 0
  // 水印图片显示的尺寸
  const imgWidth = ref(100)
  const imgHeight = ref(100)

  function handleUploadChange({ file }) {
    if (file.status === 'done') {
      const res = file.response
      if (res.code === 200) {
        form.content = import.meta.env.VITE_APP_BASE_API + res.fileName

        getImageNaturalSize(form.content).then(() => {
          setImgSize()
        })
      }
    }
  }

  /** 获取图片自身尺寸 */
  function getImageNaturalSize(url) {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = url
      try {
        image.onload = () => {
          naturalWidth = image.width
          naturalHeight = image.height

          resolve()
        }
      } catch (err) {
        message.warning('无法获取图片宽高, 请重新上传')
        reject(err)
      }
    })
  }

  function relativePositionChange() {
    const containerRect = containerRef.value.getBoundingClientRect()
    const draggableRect = draggableRef.value.getBoundingClientRect()
    let x = 0,
      y = 0

    switch (form.relativePosition) {
      case 1:
        x = 0
        y = 0
        break
      case 2:
        x = Math.round((containerRect.width - draggableRect.width) / 2)
        y = 0
        break
      case 3:
        x = containerRect.width - draggableRect.width
        y = 0
        break
      case 4:
        x = 0
        y = Math.round((containerRect.height - draggableRect.height) / 2)
        break
      case 5:
        x = Math.round((containerRect.width - draggableRect.width) / 2)
        y = Math.round((containerRect.height - draggableRect.height) / 2)
        break
      case 6:
        x = containerRect.width - draggableRect.width
        y = Math.round((containerRect.height - draggableRect.height) / 2)
        break
      case 7:
        x = 0
        y = containerRect.height - draggableRect.height
        break
      case 8:
        x = Math.round((containerRect.width - draggableRect.width) / 2)
        y = containerRect.height - draggableRect.height
        break
      case 9:
        x = containerRect.width - draggableRect.width
        y = containerRect.height - draggableRect.height
        break

      default:
        break
    }

    positionX.value = x
    positionY.value = y
  }

  function setImgSize() {
    imgWidth.value = Math.round((naturalWidth * form.size) / 100)
    imgHeight.value = Math.round((naturalHeight * form.size) / 100)
  }

  /** RIGHT */
  const BASE_IMG_SIZE_OPTIONS = [
    { label: '600 * 600', value: 600 },
    { label: '800 * 800', value: 800 },
    { label: '1000 * 1000', value: 1000 }
  ]
  const containerRef = ref()
  const draggableRef = ref()
  let isDragging = false
  let offsetX, offsetY
  const positionX = ref(0)
  const positionY = ref(0)

  // 鼠标按下事件(水印块内)
  function handleMousedown(e) {
    isDragging = true
    // 计算鼠标在水印块内的位置
    offsetX = e.clientX - draggableRef.value.getBoundingClientRect().left
    offsetY = e.clientY - draggableRef.value.getBoundingClientRect().top
  }

  // 在全局监听鼠标事件, 避免鼠标移出背景边界后丢失事件响应
  document.addEventListener('mousemove', handleMousemove)
  document.addEventListener('mouseup', handleMouseup)

  // 鼠标移动事件
  function handleMousemove(e) {
    if (!isDragging) return

    const containerRect = containerRef.value.getBoundingClientRect()
    const draggableRect = draggableRef.value.getBoundingClientRect()
    let x = e.clientX - offsetX - containerRect.left
    let y = e.clientY - offsetY - containerRect.top

    // 边界检查
    ;[x, y] = checkBoundaries(x, y)
    positionX.value = x
    positionY.value = y

    // 联动至九宫格区域; 计算水印块中心点, 加上一半宽高
    form.relativePosition = getRegion(x + draggableRect.width / 2, y + draggableRect.height / 2)
  }

  // 鼠标释放事件
  function handleMouseup() {
    if (isDragging) isDragging = false
  }

  // 边界检查
  function checkBoundaries(x, y) {
    const containerRect = containerRef.value.getBoundingClientRect()
    const draggableRect = draggableRef.value.getBoundingClientRect()

    const minX = 0
    const minY = 0
    const maxX = containerRect.width - draggableRect.width
    const maxY = containerRect.height - draggableRect.height

    // 确保不超出边界
    x = Math.max(minX, Math.min(x, maxX))
    y = Math.max(minY, Math.min(y, maxY))

    return [x, y]
  }

  // 获取水印块在九宫格的区域
  function getRegion(x, y) {
    // 每个小区域的尺寸
    const regionSize = form.bgSize / 3
    // 计算列索引 (0, 1, 2)
    const col = Math.min(2, Math.floor(x / regionSize))
    // 计算列索引 (0, 1, 2)
    const row = Math.min(2, Math.floor(y / regionSize))

    // 返回区域编号 (1~9)
    return row * 3 + col + 1
  }

  /** 按钮区 关闭/保存 */
  function close() {
    document.removeEventListener('mousemove', handleMousemove)
    document.removeEventListener('mouseup', handleMouseup)
    window.close()
  }

  const loading = ref(false)
  function submit() {
    formRef.value
      .validate()
      .then(() => {
        const params = {
          ...form,
          bgWidth: form.bgSize,
          bgHeight: form.bgSize,
          position: `${positionX.value},${positionY.value}`
        }
        delete params.bgSize
        delete params.relativePosition
        if (form.type === 1) {
          // 图片
          delete params.typefaceType
          delete params.typefaceSize
          delete params.textColor
        } else {
          // 文字
          params.typefaceColour = convertHexToRgb(form.textColor)
          delete params.textColor
          delete params.size
        }

        if (id) params.id = id

        const requestApi = id ? watermarkEditApi : watermarkAddApi
        requestApi(params).then(res => {
          message.success('保存成功')
          setTimeout(() => {
            close()
          }, 2000)
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  /**
   * 将标准的16进制颜色值（带#号的7字符小写字符串）转换为RGB格式
   * @param {string} hex - 标准的16进制颜色值（格式："#rrggbb"）
   * @returns {string} - RGB格式字符串 "rgb(r, g, b)"
   * @throws {Error} - 当输入不符合标准格式时抛出错误
   */
  function convertHexToRgb(hex) {
    // 验证输入格式：必须是7个字符，以#开头，后跟6个十六进制字符
    if (!/^#[0-9a-f]{6}$/.test(hex)) {
      throw new Error('输入必须是带#号的7字符小写十六进制颜色值（如"#ffffff"）')
    }

    // 提取并转换RGB分量; 十六进制转十进制
    const r = parseInt(hex.substring(1, 3), 16)
    const g = parseInt(hex.substring(3, 5), 16)
    const b = parseInt(hex.substring(5, 7), 16)

    // 返回RGB格式字符串(缺斤少两版)
    // return `rgb(${r}, ${g}, ${b})`
    return `${r}, ${g}, ${b}`
  }

  /**
   * 反转, 将 RGB(只有括号内的值) 格式转换为 HEX 格式; 若输入值无效, 统一输出 #000000
   * @param {string} RGB - r,g,b
   * @returns {string} - 标准的带#号的16进制颜色值
   */
  function convertRgbToHex(rgb) {
    let hex = '#000000'
    if (rgb) {
      const list = rgb.split(',')
      if (list.length === 3) {
        // 十进制转十六进制
        const r = Number(list[0]).toString(16)
        const g = Number(list[1]).toString(16)
        const b = Number(list[2]).toString(16)

        hex = `#${r}${g}${b}`
      }
    }

    return hex
  }
</script>
