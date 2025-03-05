<template>
  <a-modal
    :open="open"
    title="批量修改图片尺寸"
    width="1200px"
    :footer="null"
    @cancel="cancel"
  >
    <a-spin :spinning="spinning">
      <div class="mt-5 flex">
        <a-select
          v-model:value="picScale"
          style="width: 200px"
          @change="handleChange"
        >
          <a-select-option :value="'equal'">等比例调整</a-select-option>
          <a-select-option :value="'custom'">自定义比例调整</a-select-option>
        </a-select>
        <a-select
          v-model:value="picSize"
          class="mx-2.5"
          style="width: 200px"
          :options="sizeOptions"
        >
        </a-select>
        <span class="mr-2.5">变化至</span>
        <div class="flex">
          <a-input-number
            v-model:value="sizeValue"
            placeholder="请填写尺寸"
            :precision="0"
            :controls="false"
          />
          <div
            class="w-10 h-full text-center"
            style="background: #eee"
          >
            px
          </div>
        </div>
        <a-select
          v-model:value="scaleValue"
          v-if="picSize !== 'customWH' && picScale === 'custom'"
          class="mx-2.5"
          style="width: 200px"
          :options="scaleOpion"
        >
        </a-select>
        <div
          class="flex mx-2.5"
          v-if="picSize === 'customWH'"
        >
          <a-input-number
            v-model:value="heightValue"
            placeholder="请填写尺寸"
            :controls="false"
            :precision="0"
          />
          <div
            class="w-10 h-full text-center"
            style="background: #eee"
          >
            px
          </div>
        </div>
        <a-button
          type="primary"
          class="ml-2.5"
          @click="generate({ fileType: 'jpg' })"
          >生成JPG图片</a-button
        >
        <a-button
          class="mx-2.5"
          @click="generate({ fileType: 'png' })"
          >生成PNG图片</a-button
        >
      </div>
      <div class="mt-5">
        <a-button
          @click="selectAllImg"
          class="mr-5 mt-1"
          >{{ selectAll ? '取消选择全部图片' : '选择全部图片' }}</a-button
        >
        <div class="flex mt-5 flex-wrap">
          <a-card
            v-for="item in copyImageList"
            :key="item.id"
            style="margin-right: 10px; margin-bottom: 10px"
            hoverable
          >
            <div>
              <div>
                <a-image
                  :src="item.url"
                  :width="150"
                  :height="150"
                />
                <div class="text-center">{{ item.width }} X {{ item.height }}</div>
              </div>
            </div>
            <div>
              <a-checkbox
                v-model:checked="item.checked"
                @change="handleSelectImg($event, item)"
              ></a-checkbox>
            </div>
          </a-card>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script setup>
  import { v4 as uuidv4 } from 'uuid'
  import { message } from 'ant-design-vue'
  import { replaceSuffixApi } from '@/pages/aliexpress/apis/common'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    imageList: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(['update:open', 'confirm'])

  const picScale = ref('equal')
  const picSize = ref('small')
  const selectAll = ref(true)
  const copyImageList = ref([])
  const sizeValue = ref(null)
  const scaleValue = ref('none')
  const heightValue = ref(null)
  const spinning = ref(false)
  const pictureOtion = ref([
    {
      label: '图片小边',
      value: 'small',
      field: 'equal'
    },
    {
      label: '图片大边',
      value: 'big',
      field: 'equal'
    },
    {
      label: '图片宽',
      value: 'pWidth',
      field: 'custom'
    },
    {
      label: '图片高',
      value: 'pHeight',
      field: 'custom'
    },
    {
      label: '自定义宽高',
      value: 'customWH',
      field: 'custom'
    }
  ])
  const scaleOpion = ref([
    {
      label: '保持原图比例',
      value: 'none'
    },
    {
      label: '1:1',
      value: '1'
    },
    {
      label: '3:4',
      value: '2'
    },
    {
      label: '4:3',
      value: '3'
    },
    {
      label: '9:16',
      value: '4'
    },
    {
      label: '16:9',
      value: '5'
    }
  ])

  const sizeOptions = computed(() => {
    return pictureOtion.value.filter(item => item.field === picScale.value)
  })

  const handleChange = () => {
    picSize.value = picScale.value === 'equal' ? 'small' : 'pWidth'
  }

  const cancel = () => {
    emit('update:open', false)
    copyImageList.value = []
  }

  function adjustList(list, picScale, picSize, scaleValue, sizeValue, heightValue) {
    return list.map(item => {
      const newItem = { ...item }
      if (picScale === 'equal') {
        handleEqual(newItem, picSize, sizeValue)
      } else if (picScale === 'custom') {
        handleCustom(newItem, picSize, scaleValue, sizeValue, heightValue)
      }
      return newItem
    })
  }

  function handleEqual(item, picSize, sizeValue) {
    const width = parseInt(item.width)
    const height = parseInt(item.height)

    if (width === height) {
      item.width = sizeValue
    } else {
      const isSmall = picSize === 'small'
      const min = Math.min(width, height)
      const max = Math.max(width, height)

      if ((isSmall && width === min) || (!isSmall && width === max)) {
        item.width = sizeValue
      } else {
        item.height = sizeValue
      }
    }
  }

  function handleCustom(item, picSize, scaleValue, sizeValue, heightValue) {
    const originalWidth = parseInt(item.width)
    const originalHeight = parseInt(item.height)

    if (picSize === 'pWidth') {
      item.width = sizeValue
      const ratio = scaleValue === 'none' ? originalHeight / originalWidth : getHeightRatio(scaleValue)
      item.height = Math.round(sizeValue * ratio)
    } else if (picSize === 'pHeight') {
      item.height = sizeValue
      const ratio = scaleValue === 'none' ? originalWidth / originalHeight : getWidthRatio(scaleValue)
      item.width = Math.round(sizeValue * ratio)
    } else if (picSize === 'customWH') {
      item.width = sizeValue
      item.height = heightValue
    }
  }

  function getHeightRatio(scaleValue) {
    switch (scaleValue) {
      case '1':
        return 1 // 1:1
      case '2':
        return 4 / 3 // 3:4 → height is 4 parts
      case '3':
        return 3 / 4 // 4:3 → height is 3 parts
      case '4':
        return 16 / 9 // 9:16 → height is 16 parts
      case '5':
        return 9 / 16 // 16:9 → height is 9 parts
      default:
        return 1
    }
  }

  function getWidthRatio(scaleValue) {
    switch (scaleValue) {
      case '1':
        return 1 // 1:1
      case '2':
        return 3 / 4 // 3:4 → width is 3 parts
      case '3':
        return 4 / 3 // 4:3 → width is 4 parts
      case '4':
        return 9 / 16 // 9:16 → width is 9 parts
      case '5':
        return 16 / 9 // 16:9 → width is 16 parts
      default:
        return 1
    }
  }

  // 转换成 jpg/png
  const generate = ({ fileType = 'jpg' }) => {
    let isCheckedList = copyImageList.value.filter(item => item.checked)
    let handeleList = isCheckedList.map(item => {
      return {
        id: item.id,
        path: item.url.replace('/prod-api', ''),
        width: item.width,
        height: item.height,
        isNetworkImage: !item.url.includes('/prod-api') // 是否为网络图片
      }
    })
    let arr = adjustList(handeleList, picScale.value, picSize.value, scaleValue.value, sizeValue.value, heightValue.value)
    spinning.value = true
    replaceSuffixApi({ images: arr, imagesSuffix: fileType })
      .then(res => {
        const list = res.data || []
        list.forEach(item => {
          const target = copyImageList.value.find(img => img.id === item.id)
          if (target) {
            target.url = '/prod-api' + item.path
          }
        })
        emit('confirm', copyImageList.value)
        cancel()
      })
      .finally(() => {
        spinning.value = false
      })
  }

  const selectAllImg = () => {
    selectAll.value = !selectAll.value
    copyImageList.value.forEach(item => {
      item.checked = selectAll.value
    })
  }

  const handleSelectImg = (e, item) => {
    item.checked = e.target.checked
  }

  // 获取图片尺寸
  function getImageSize(img) {
    const image = new Image()
    image.src = img.url
    image.onload = () => {
      img.width = image.width
      img.height = image.height
    }
  }

  watch(
    () => copyImageList.value,
    val => {
      if (val.length) {
        selectAll.value = !val.every(item => item.checked === false)
      }
    },
    { deep: true }
  )

  watch(
    () => props.imageList,
    list => {
      copyImageList.value = list.map(url => {
        return {
          url,
          originUrl: url,
          id: uuidv4(),
          checked: true,
          width: undefined,
          height: undefined
        }
      })
      copyImageList.value.forEach(img => getImageSize(img))
    },
    { deep: true }
  )
</script>
