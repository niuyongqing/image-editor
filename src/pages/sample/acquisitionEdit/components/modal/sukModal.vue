<template>
<div id="sukModal" class="sukModal">
  <a-modal 
    v-model:open="modalOpen" 
    :title="'SKU一键生成'" 
    :closable="false"
    :style="`width: ${type === 'foundation' ? '500px':'1000px'};`"
  >
    <div v-if="type === 'foundation'">
      <a-input 
        v-model:value="skuEditData.prefix" 
        placeholder="输入前缀"
        style="width: 300px;"
      ></a-input>
    </div>
    <div v-if="type === 'senior'" class="dialog-box">
      <a-tabs v-model:activeKey="skuEditData.activeKey" @change="handleSelect">
        <a-tab-pane key="add" tab="生成SUK">
          <div class="content-box">
            <div class="box-addStr">
              <div class="box-content-title">添加前后缀</div>
              <div class="box-addStr-text">
                <div class="box-addStr-text-item">
                  <span class="item-label">前缀：</span>
                  <a-select style="width: 150px;" v-model:value="addStr.prefixType" @change="val => selectChange(val, 'prefix')" placeholder="请选择">
                    <a-select-option
                      v-for="item in skuEditData.options"
                      :key="item.val"
                      :disabled="item.val === 2 && skuEditData.variantInfo.length > 999"
                      :value="item.val"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                  <a-input v-model:value="addStr.prefix" placeholder="请输入前缀" v-if="addStr.prefixType === 1"></a-input>
                  <a-input v-model:value="addStr.prefix" disabled v-if="addStr.prefixType === 2"></a-input>
                  <a-input-number
                    style="width: 120px;"
                    :min="0"
                    v-model:value="addStr.prefix" 
                    v-if="addStr.prefixType === 3"
                    placeholder="请输入起始值" 
                  ></a-input-number>
                </div>
                <div class="box-addStr-text-item">
                  <span class="item-label">连接符：</span>
                  <a-input v-model:value="addStr.connector" placeholder="请输入连接符"></a-input>
                </div>
                <div class="box-addStr-text-item">
                  <span class="item-label">后缀：</span>
                  <a-select style="width: 150px;" v-model:value="addStr.suffixType" @change="selectChange($event, 'suffix')" placeholder="请选择">
                    <a-select-option
                      v-for="item in skuEditData.options"
                      :key="item.val"
                      :disabled="item.val === 2 && skuEditData.variantInfo.length > 999"
                      :value="item.val"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                  <a-input v-model:value="addStr.suffix" placeholder="请输入后缀" v-if="addStr.suffixType === 1"></a-input>
                  <a-input v-model:value="addStr.suffix" disabled v-if="addStr.suffixType === 2"></a-input>
                  <a-input-number
                    style="width: 120px;"
                    :min="0"
                    v-model:value="addStr.suffix" 
                    v-if="addStr.suffixType === 3"
                    placeholder="请输入起始值" 
                  ></a-input-number>
                </div>
              </div>
            </div>
            <div class="box-setSUK">
              <div class="box-content-title">设置SKU格式</div>
              <draggable
                v-model="skuEditData.variantAttribute"
                @end="handleDragEnd" 
                tag="div" 
                class="box-setSUK-tags"
                item-key="id"
                v-if="skuEditData.variantAttribute.length > 0"
              >
                <template #item="{ element: item }">
                  <div class="label-tag">
                    <span>{{ item.name }}</span>
                    <CloseOutlined style="margin-left: 6px; font-size: 16px;" @click="removeTag(item)"/>
                  </div>
                </template>
              </draggable>
            </div>
            <div class="box-setVariant">
              <div class="box-content-title">设置变种代码</div>
              <div class="box-setVariant-content">
                <div class="setVariant-item" v-for="item in skuEditData.variantAttribute" :key="item.id">
                  <div class="setVariant-item-label">
                    <div>
                      <span>{{ item.name }}</span>
                      <a-button @click="editToABC(item)" type="link">修改为abc</a-button>
                    </div>
                    <a-button @click="variantAttributeShow(item)" type="link">{{ item.show ? '收起':'展开' }}</a-button>
                  </div>
                  <div class="setVariant-item-box" v-show="item.show">
                    <div class="setVariant-item-box-i" v-for="val in item.values">
                      <a-tooltip>
                        <template #title>{{ val.name }}</template>
                        <div class="item-box-i-name">{{ val.name }}</div>
                      </a-tooltip>
                      <a-input v-model:value="val.input" @change="variantItemChange(val, item.id)"></a-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="box-setSUK">
              <div class="box-content-title">SKU生成预览</div>
              <a-input v-model:value="skuPreview" disabled></a-input>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="edit" tab="修改SUK" force-render>
          <div class="content-box">
            <div class="box-addStr">
              <div class="box-addStr-text sukReplace">
                <div class="box-addStr-text-item">
                  <span class="item-label">前缀：</span>
                  <a-select style="width: 150px;" v-model:value="addStr.prefixType" @change="val => selectChange(val, 'prefix')" placeholder="请选择">
                    <a-select-option
                      v-for="item in skuEditData.options"
                      :key="item.val"
                      :disabled="item.val === 2 && skuEditData.variantInfo.length > 999"
                      :value="item.val"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                  <a-input v-model:value="addStr.prefix" placeholder="请输入后缀" v-if="addStr.prefixType === 1"></a-input>
                  <a-input v-model:value="addStr.prefix" disabled v-if="addStr.prefixType === 2"></a-input>
                  <a-input-number
                    style="width: 120px;"
                    :min="0"
                    v-model:value="addStr.prefix" 
                    v-if="addStr.prefixType === 3"
                    placeholder="请输入起始值" 
                  ></a-input-number>
                </div>
                <div class="box-addStr-text-item">
                  <span class="item-label">后缀：</span>
                  <a-select style="width: 150px;" v-model:value="addStr.suffixType" @change="val => selectChange(val, 'suffix')" placeholder="请选择">
                    <a-select-option
                      v-for="item in skuEditData.options"
                      :key="item.val"
                      :disabled="item.val === 2 && skuEditData.variantInfo.length > 999"
                      :value="item.val"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                  <a-input v-model:value="addStr.suffix" placeholder="请输入后缀" v-if="addStr.suffixType === 1"></a-input>
                  <a-input v-model:value="addStr.suffix" disabled v-if="addStr.suffixType === 2"></a-input>
                  <a-input-number
                    style="width: 120px;"
                    :min="0"
                    v-model="addStr.suffix" 
                    v-if="addStr.suffixType === 3"
                    placeholder="请输入起始值" 
                  ></a-input-number>
                </div>
              </div>
              <div class="box-addStr-text sukReplace">
                <div class="box-addStr-text-item sukReplace-item">
                  <span class="item-label">SKU中的：</span>
                  <a-input v-model:value="addStr.oldValue"></a-input>
                </div>
                <div class="box-addStr-text-item sukReplace-item">
                  <span class="item-label" style="margin-right: 20px;">替换为</span>
                  <a-input v-model:value="addStr.newValue"></a-input>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template #footer>
      <a-button key="back" @click="handleClose">取消</a-button>
      <a-button key="submit" type="primary" :loading="skuEditData.loading" @click="save">确定</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue' 
import { CloseOutlined } from '@ant-design/icons-vue';
import Sortable from 'sortablejs'
import draggable from 'vuedraggable';
defineOptions({ name: "sukModal" })
const { proxy: _this } = getCurrentInstance();
const emit = defineEmits(['update:modalOpen', 'confirm']);
const props = defineProps({
  modalOpen: Boolean,
  modalData: {
    type: Object,
    default: () => {}
  }
})
const modalOpen = ref(false)
const skuEditData = reactive({
  loading: false,
  activeKey: 'add',
  prop: '',
  prefix: '',               // 一键生成前缀
  variantAttribute: [],         // 变种主题列表
  variantInfo: [],         // 变种信息
  options: [
    {
      val: 1,
      label: '手动输入'
    },
    {
      val: 2,
      label: '添加随机3位数'
    },
    {
      val: 3,
      label: '自增长值'
    }
  ]
})
const addStr = reactive({
  prefix: '',
  prefixType: 1,
  prefixNumber: [],             // 随机数池，与变种信息的数量相等
  connector: '-',
  suffix: '',
  suffixType: 1,
  suffixNumber: [],             // 随机数池，与变种信息的数量相等

  oldValue: '',                 
  newValue: '',
}) 
const type = computed(() => {
  return props.modalData.type
})
const skuPreview = computed(() => {
  let arr = []
  skuEditData.variantAttribute.forEach(item => {
    arr.push(item.values[0].input)
  })
  let str = arr.join(` ${addStr.connector} `)
  // return arr.join(' - ')
  return `${addStr.prefix ? `${addStr.prefix} ${addStr.connector} `:''}${str}${addStr.suffix ? ` ${addStr.connector} ${addStr.suffix}`:''}`
}) 
watch(() => props.modalOpen, (val, old) => {
  if (val) {
    modalOpen.value = val
    skuEditData.variantInfo = JSON.parse(JSON.stringify(props.modalData.variantInfo))
    skuEditData.prop = props.modalData.prop
    nextTick(() => {
      creatVariantAttribute()
    })
  }
})
watch(() => modalOpen.value, (val, oldVal) => {
  !val && emit('update:modalOpen', false)
})

// 根据变种信息创建变种主题列表
function creatVariantAttribute() {
  skuEditData.variantAttribute = []
  props.modalData.headerList.forEach(item => {
    let obj = {
      name: item.title,
      id: item.key,
      show: false,
      values: []
    }
    skuEditData.variantInfo.forEach(i => {
      i[item.key].input = i[item.key].name
      if (obj.values.length < 1) {
        obj.values.push({...i[item.key]})
      } else if (obj.values.every(val => val.id !== i[item.key].id)) {
        obj.values.push({...i[item.key]})
      }
    })
    // obj.values.forEach(i => i.input = i.name)
    skuEditData.variantAttribute.push(obj)
  })
  skuEditData.variantAttribute[0].show = true
}
// 包含26个小写字母
const abc = Array.from({length: 26}, (_, i) => String.fromCharCode(i + 97));
// 修改为abc
function editToABC(val) {
  // console.log({val,abc});
  val.values.forEach((item, index) => {
    item.input = abc[index%26]
  })
}
// 变种主题展开收起
function variantAttributeShow(val) {
  skuEditData.variantAttribute.forEach(item => {
    if (item.id === val.id) {
      item.show = !item.show
    } else {
      item.show = false
    }
  })
}
function handleClose(data) {
  let _addStr = {
    prefix: '',
    prefixType: 1,
    prefixNumber: [],             // 随机数池，与变种信息的数量相等
    connector: '-',
    suffix: '',
    suffixType: 1,
    suffixNumber: [],             // 随机数池，与变种信息的数量相等

    oldValue: '',                 
    newValue: '',
  }
  Object.keys(_addStr).forEach(item => {
    if (addStr[item]) {
      addStr[item] = _addStr[item]
    }
  })
  skuEditData.activeKey = 'add';
  skuEditData.prefix = '';
  skuEditData.prop = '';
  modalOpen.value = false
}
function save() {
  if (type.value === 'foundation') {
    foundationFn()
  } else if (type.value === 'senior') {
    seniorFn()
  }
  let obj = {
    component: 'sukModal',
    variantInfo: skuEditData.variantInfo
  }
  emit('confirm', obj)
  handleClose()
}
// 一键生成
function foundationFn() {
  let prop = props.modalData.prop
  let keys = props.modalData.headerList.map(i => i.key)
  skuEditData.variantInfo.forEach(item => {
    let str = skuEditData.prefix ? skuEditData.prefix + '-' : ''
    let arr = []
    keys.forEach(key => {
      arr.push(item[key].name)
    })
    item[prop] = str + arr.join('-')
  })
}
// 高级设置
function seniorFn() {
  let keys = skuEditData.variantAttribute.map(i => i.id)
  skuEditData.variantInfo.forEach((item, index) => {
    let obj = {
      prefix: '',
      suffix: ''
    }
    let arr = []
    let str = ''
    keys.forEach(key => {
      arr.push(item[key].input)
    })
    str = arr.join(addStr.connector)
    let fix = ['prefix', 'suffix']
    fix.forEach((f, i) => {
      // 根据规则生成前缀和后缀l
      switch (addStr[(f + 'Type')]) {
        case 1:
          obj[f] = addStr[f]
          break;
        case 2:
          obj[f] = addStr[(f + 'Number')][index]
          break;
        case 3:
          obj[f] = (addStr[f]*1) + index + ''
          break;
      
        default:
          break;
      }
    })
    if (skuEditData.activeKey === 'add') {
      let connector = addStr.connector
      item[skuEditData.prop] = `${obj.prefix ? obj.prefix+connector : ''}${str}${obj.suffix ? connector+obj.suffix : ''}`
    } else if (skuEditData.activeKey === 'edit') {
      item[skuEditData.prop] = `${obj.prefix}${item[skuEditData.prop]}${obj.suffix}`
      if (addStr.oldValue) {
        let reg = new RegExp(addStr.oldValue, 'g')
        item[skuEditData.prop] = item[skuEditData.prop].replace(reg, addStr.newValue)
      }
    }
  })
}
// 标签拖拽
function handleDragEnd() {
  // console.log(11, {tagBox, sortable});
}
function selectChange(val, key) {
  let arr = []
  if (val === 2) {
    addStr[(key + 'Number')] = fn(skuEditData.variantInfo.length)
    addStr[key] = addStr[(key + 'Number')][0]
  } else {
    addStr[key] = ''
  }
  // 生成二位随机数，个数等于变种信息的个数
  function fn(length) {
    let list = []
    for (let index = 0; index < length; index++) {
      // let num = Math.floor(Math.random()*1000)
      let num = (Math.random() + '').split('.')[1].slice(0, 3);
      list.push(num)
    }
    arr = [...new Set([...arr, ...list])]
    if (skuEditData.variantInfo.length === arr.length) {
      return arr
    } else {
      let l = skuEditData.variantInfo.length - arr.length
      return fn(l)
    }
  }
}
// 标签删除
function removeTag(val) {
  skuEditData.variantAttribute = skuEditData.variantAttribute.filter(i => i.id !== val.id)
}
// 设置变种代码
function variantItemChange(val, key) {
  skuEditData.variantInfo.forEach(item => {
    if (item[key].id === val.id) {
      item[key].input = val.input
    }
  })
}
function handleSelect(index) {
  skuEditData.activeKey = index
  let _addStr = {
    prefix: '',
    prefixType: 1,
    prefixNumber: [],             // 随机数池，与变种信息的数量相等
    connector: '-',
    suffix: '',
    suffixType: 1,
    suffixNumber: [],             // 随机数池，与变种信息的数量相等

    oldValue: '',                 
    newValue: '',
  }
  Object.keys(_addStr).forEach(item => {
    if (addStr[item]) {
      addStr[item] = _addStr[item]
    }
  })
  addStr.connector = skuEditData.activeKey === 'add' ? '-':''
}
</script>
<style lang="less" scoped>
.dialog-box {
  width: 100%;
  .content-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    .box-content-title {
      margin: 16px 0 8px;
      font-weight: 700;
      font-size: 16px;
    }
    .box-addStr {
      width: 100%;
      .box-addStr-text {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        :deep(.box-addStr-text-item) {
          // width: 30%;
          margin-right: 20px;
          display: flex;
          align-items: center;
          .item-label {
            white-space:nowrap;
            // margin-right: 20px;
          }
          .ant-input {
            width: 130px;
            margin-right: 8px;
          }
        }
        :deep(.sukReplace-item) {
          // width: 30%;
          .ant-input {
            width: 100%;
            // width: calc(100% - 72px);
          }
        }
        &.sukReplace {
          justify-content: flex-start;
        }
      }
    }
    .box-setSUK {
      width: 100%;
      .box-setSUK-tags {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .label-tag {
          height: 28px;
          padding: 3px 10px;
          margin-right: 15px;
          font-size: 14px;
          border: 1px solid #f1f1f1;
          background-color: #f1f1f1;
          border-radius: 4px;
          cursor: move;
          i {
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
    .box-setVariant {
      width: 100%;
      .box-setVariant-content {
        width: 100%;
        .setVariant-item {
          width: 100%;
          margin-bottom: 2px;
          // height: 200px;
          .setVariant-item-label {
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;
            padding: 0 8px;
            background: #d7d7d7;
            justify-content: space-between;
          }
          .setVariant-item-box {
            width: 100%;
            height: 170px;
            padding: 10px 20px; 
            display: flex;
            flex-wrap: wrap;
            background: #f1f1f1;
            overflow-y: auto;
            .setVariant-item-box-i {
              height: 28px;
              display: flex;
              align-items: center;
              margin: 0 15px 20px;
              color: #000;
              .item-box-i-name {
                max-width: 100px;
                margin-right: 6px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              :deep(.ant-input) {
                width: 120px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
  