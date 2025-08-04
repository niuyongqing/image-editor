<template>
  <a-modal :open="showEdit" title="批量修改图片尺寸" @ok="handleOk" @cancel="cancel" :keyboard="false" width="1200px">
    <a-spin :spinning="spinning">
      <div class="text-red">图片仅支持JPG、PNG格式修改</div>
      <div class="mt-5 flex">
        <a-select v-model:value="picScale" style="width: 200px" @change="handleChange">
          <a-select-option :value="'equal'">等比例调整</a-select-option>
          <a-select-option :value="'custom'">自定义比例调整</a-select-option>
        </a-select>
        <a-select v-model:value="picSize" class="mx-2.5" style="width: 200px" :options="sizeOptions">
        </a-select>
        <span class="mr-2.5">变化至</span>
        <div class="flex">
          <a-input-number v-model:value="sizeValue" placeholder="请填写尺寸" :precision="0" :controls="false" />
          <div class="w-10 h-full text-center" style="background: #eee;">px</div>
        </div>
        <a-select v-model:value="scaleValue" v-if="picSize !== 'customWH' && picScale === 'custom'" class="mx-2.5"
          style="width: 200px" :options="scaleOpion">
        </a-select>
        <div class="flex mx-2.5" v-if="picSize === 'customWH'">
          <a-input-number v-model:value="heightValue" placeholder="请填写尺寸" :controls="false" :precision="0" />
          <div class="w-10 h-full text-center" style="background: #eee;">px</div>
        </div>
        <a-button type="primary" class="ml-2.5" @click="generateJPG(1)">生成JPG图片</a-button>
        <a-button class="mx-2.5" @click="generateJPG(2)">生成PNG图片</a-button>
      </div>
      <div class="mt-5">
        <a-button @click="selectAllImg" class="mr-5 mt-1">{{ selectAll ? '取消选择全部图片' :
          '选择全部图片'
        }}</a-button>
        <div class="flex mt-5 flex-wrap">
          <a-card class="file-card" v-for="item in copyModuleList" :key="item.id"
            style="margin-right: 10px;margin-bottom: 10px;" hoverable>
            <div>
              <div class="file-img">
                <a-image :src="item.url" alt="" :width="150" :height="150" />
                <div class="image-mask text-center"> {{ item.width }} X {{ item.height }} </div>
              </div>
            </div>
            <div>
              <a-checkbox v-model:checked="item.checked" @change="handleSelectImg($event, item)"></a-checkbox>
            </div>
          </a-card>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script setup name=''>
import { message } from "ant-design-vue";
import { replaceSuffix } from "../../api/product";
const props = defineProps({
  showEdit: Boolean,
  moduleList: Array,
});

const emit = defineEmits(["handleBatchModifyClose", "rebackList"]);

const picScale = ref('equal')
const picSize = ref('small')
const selectAll = ref(true)
const copyModuleList = ref([])
const sizeValue = ref(null)
const scaleValue = ref("none")
const heightValue = ref(null)
const spinning = ref(false);
const pictureOtion = ref([
  {
    label: "图片小边",
    value: "small",
    field: "equal"
  },
  {
    label: "图片大边",
    value: "big",
    field: "equal"
  },
  {
    label: "图片宽",
    value: "pWidth",
    field: "custom"
  },
  {
    label: "图片高",
    value: "pHeight",
    field: "custom"
  },
  {
    label: "自定义宽高",
    value: "customWH",
    field: "custom"
  }
])
const scaleOpion = ref([
  {
    label: "保持原图比例",
    value: "none",
  },
  {
    label: "1:1",
    value: "1",
  },
  {
    label: "3:4",
    value: "2",
  },
  {
    label: "4:3",
    value: "3",
  },
  {
    label: "9:16",
    value: "4",
  },
  {
    label: "16:9",
    value: "5",
  },
])
const sizeOptions = computed(() => {
  return pictureOtion.value.filter(item => item.field === picScale.value);
})

const handleChange = () => {
  picSize.value = picScale.value === 'equal' ? 'small' : 'pWidth'
}

const cancel = () => {
  emit("handleBatchModifyClose")
}

// 清空字段
const clearField = () => {
  picScale.value = 'equal'
  picSize.value = 'small'
  sizeValue.value = null
  scaleValue.value = "none"
  heightValue.value = null
}

const handleOk = () => {
  if (!sizeValue.value || (picSize.value === 'customWH' && !heightValue.value)) {
    message.error("请填写变化值！")
    return
  }
  emit("rebackList", copyModuleList.value)
  cancel()
}

function adjustList(list, picScale, picSize, scaleValue, sizeValue, heightValue) {
  if (!sizeValue || (picSize === 'customWH' && !heightValue)) {
    message.error("请填写变化值！")
    return
  }
  return list.map(item => {
    const newItem = { ...item };
    if (picScale === 'equal') {
      handleEqual(newItem, picSize, sizeValue);
    } else if (picScale === 'custom') {
      handleCustom(newItem, picSize, scaleValue, sizeValue, heightValue);
    }
    return newItem;
  });
}

function handleEqual(item, picSize, sizeValue) {
  const width = parseInt(item.width)
  const height = parseInt(item.height)

  const isSmall = picSize === 'small'
  const min = Math.min(width, height)

  if ((isSmall && width === min) || (!isSmall && width !== min)) {
    // 以宽为基准
    item.width = sizeValue
    item.height = (height / width) * sizeValue
  } else {
    // 高
    item.height = sizeValue
    item.width = (width / height) * sizeValue
  }
}

function handleCustom(item, picSize, scaleValue, sizeValue, heightValue) {
  const originalWidth = parseInt(item.width);
  const originalHeight = parseInt(item.height);

  if (picSize === 'pWidth') {
    item.width = sizeValue;
    const ratio = scaleValue === 'none'
      ? originalHeight / originalWidth
      : getHeightRatio(scaleValue);
    item.height = Math.round(sizeValue * ratio);
  } else if (picSize === 'pHeight') {
    item.height = sizeValue;
    const ratio = scaleValue === 'none'
      ? originalWidth / originalHeight
      : getWidthRatio(scaleValue);
    item.width = Math.round(sizeValue * ratio);
  } else if (picSize === 'customWH') {
    item.width = sizeValue;
    item.height = heightValue;
  }
}

function getHeightRatio(scaleValue) {
  switch (scaleValue) {
    case '1': return 1;          // 1:1
    case '2': return 4 / 3;      // 3:4 → height is 4 parts
    case '3': return 3 / 4;      // 4:3 → height is 3 parts
    case '4': return 16 / 9;     // 9:16 → height is 16 parts
    case '5': return 9 / 16;     // 16:9 → height is 9 parts
    default: return 1;
  }
}

function getWidthRatio(scaleValue) {
  switch (scaleValue) {
    case '1': return 1;          // 1:1
    case '2': return 3 / 4;      // 3:4 → width is 3 parts
    case '3': return 4 / 3;      // 4:3 → width is 4 parts
    case '4': return 9 / 16;     // 9:16 → width is 9 parts
    case '5': return 16 / 9;     // 16:9 → width is 16 parts
    default: return 1;
  }
}

// 转换成jpg
const generateJPG = (type) => {
  let isCheckedList = copyModuleList.value.filter((item) => item.checked);
  let handeleList = isCheckedList.map(item => {
    return {
      id: item.id,
      path: item.url.replace("/prod-api", ""),
      width: item.width,
      height: item.height
    }
  })
  let arr = adjustList(handeleList, picScale.value, picSize.value, scaleValue.value, sizeValue.value, heightValue.value)
  spinning.value = true
  replaceSuffix({ imags: arr, fileType: type }).then(res => {
    copyModuleList.value.forEach(itemB => {
      const matchingItemA = res?.data?.find(itemA => itemA.id === itemB.id);
      if (matchingItemA) {
        // 如果找到匹配的元素，则替换宽高和 url
        itemB.width = matchingItemA.width;
        itemB.height = matchingItemA.height;
        itemB.url = '/prod-api' + matchingItemA.path;
      }
    })
  }).finally(() => {
    spinning.value = false
    clearField();
  })
}

const selectAllImg = () => {
  selectAll.value = !selectAll.value
  copyModuleList.value.forEach(item => {
    item.checked = selectAll.value
  })
}

const handleSelectImg = (e, item) => {
  item.checked = e.target.checked
}

watch(() => copyModuleList.value, val => {
  if (val.length) {
    selectAll.value = !(val.every(item => item.checked === false));
  }
}, { deep: true })

// 获取图片尺寸
function getImageSize(img) {
  const image = new Image()
  image.src = img.url
  image.onload = () => {
    img.width = image.width
    img.height = image.height
  }
}

watch(() => props.moduleList, val => {
  const uniqueSet = new Set();
  if (val.length) {
    val.forEach(item => {
      if (item.type === "text-image") {
        item.imgText.dataList.forEach(data => {
          data.src.forEach(srcObj => {
            getImageSize(srcObj)
            uniqueSet.add(JSON.stringify(srcObj));
          });
        });
      } else if (item.type === "image") {
        item.img.forEach(imgItem => {
          imgItem.src.forEach(srcObj => {
            getImageSize(srcObj)
            uniqueSet.add(JSON.stringify(srcObj));
          });
        });
      }
    });
    // 将 Set 转换回数组
    copyModuleList.value = Array.from(uniqueSet).map(str => JSON.parse(str));
    // console.log('copyModuleList', copyModuleList.value);
  }
}, { deep: true, immediate: true });
</script>
<style lang="less" scoped></style>