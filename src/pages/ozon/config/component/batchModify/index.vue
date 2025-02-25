<template>
  <a-modal :open="showEdit" title="批量修改图片尺寸" @ok="handleOk" @cancel="cancel" :keyboard="false" width="1200px">
    <div class="mt-5 flex">
      <a-select v-model:value="picScale" style="width: 200px" @change="handleChange">
        <a-select-option :value="'equal'">等比例调整</a-select-option>
        <a-select-option :value="'custom'">自定义比例调整</a-select-option>
      </a-select>
      <a-select v-model:value="picSize" class="mx-2.5" style="width: 200px" :options="sizeOptions">
      </a-select>
      <span class="mr-2.5">变化至</span>
      <div class="flex">
        <a-input v-model:value="sizeValue" placeholder="请填写尺寸" />
        <div class="w-10 h-full text-center" style="background: #eee;">px</div>
      </div>
      <a-select v-model:value="scaleValue" v-if="picSize !== 'customWH' && picScale ==='custom'" class="mx-2.5" style="width: 200px" :options="scaleOpion">
      </a-select>
      <div class="flex mx-2.5" v-if="picSize === 'customWH'">
        <a-input v-model:value="heightValue" placeholder="请填写尺寸" />
        <div class="w-10 h-full text-center" style="background: #eee;">px</div>
      </div>
      <a-button type="primary" class="ml-2.5">生成JPG图片</a-button>
      <a-button class="mx-2.5">生成PNG图片</a-button>
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
              <div class="image-mask text-center"> {{ item.height }} X {{ item.width }} </div>
            </div>
          </div>
          <div w-full>
            <div flex justify-between w-full>
              <a-checkbox v-model:checked="item.checked" @change="handleSelectImg($event, item)"></a-checkbox>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </a-modal>
</template>

<script setup name=''>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
  showEdit: Boolean,
  moduleList: Array,
});

const emit = defineEmits(["handleBatchModifyClose"]);

const picScale = ref('equal')
const picSize = ref('small')
const selectAll = ref(true)
const copyModuleList = ref([])
const sizeValue = ref("")
const scaleValue = ref("none")
const heightValue = ref(null)
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

const handleOk = () => {
  emit("handleBatchModifyClose")
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

watch(() => props.moduleList, val => {
  const uniqueSet = new Set();
  if (val.length) {
    console.log('va', val);
    val.forEach(item => {
      if (item.type === "text-image") {
        item.imgText.dataList.forEach(data => {
          data.src.forEach(srcObj => {
            uniqueSet.add(JSON.stringify(srcObj));
          });
        });
      } else if (item.type === "image") {
        item.img.forEach(imgItem => {
          imgItem.src.forEach(srcObj => {
            uniqueSet.add(JSON.stringify(srcObj));
          });
        });
      }
    });
    // 将 Set 转换回数组
    copyModuleList.value = Array.from(uniqueSet).map(str => JSON.parse(str));
    console.log('copyModuleList', copyModuleList.value);
  }
}, { deep: true });
</script>
<style lang="less" scoped></style>