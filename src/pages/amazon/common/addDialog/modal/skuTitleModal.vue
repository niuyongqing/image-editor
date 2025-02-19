<template>
<div id="skuTitleModal">
  <a-modal 
    v-model:open="props.open" 
    :title="'SKU标题生成'" 
    @ok="handleOk"
    :closable="false"
    style="width: 50%;"
  >
    <div v-if="type === 'foundation'">
      <a-input v-model:value="skuEditData.prefix" placeholder="输入前缀"></a-input>
    </div>
    <div v-if="type === 'senior'" class="dialog-box">
      <a-tabs v-model:activeKey="skuEditData.activeKey" @change="handleSelect">
        <a-tab-pane key="add" tab="生成SUK标题">
          <div class="content-box">
            <div class="box-addStr">
              <div class="box-content-title">自定义标题</div>
              <div class="box-addStr-text">
                <div class="box-addStr-text-item">
                  <span class="item-label">标题：</span>
                  <a-textarea 
                    v-model:value="addStr.content" 
                    placeholder="请输入内容"
                    :autoSize="{ maxRows: 2 }"
                    @blur="handleBlur"
                  ></a-textarea>
                </div>
                <div class="box-addStr-text-item">
                  <span class="item-label">标题变量：</span>
                  <a-button type="link"
                    v-for="(item, index) in skuEditData.variantAttribute" 
                    :key="item.id"
                    @click="handleTagClick(index)"
                  >变种主题{{ index+1 }}</a-button>
                </div>
              </div>
            </div>
            <div class="box-setVariant">
              <div class="box-content-title">设置变种代码</div>
              <div class="box-setVariant-content">
                <div class="setVariant-item" v-for="item in skuEditData.variantAttribute" :key="item.id">
                  <div class="setVariant-item-label">
                    <span>{{ item.name }}</span>
                    <a-button @click="variantAttributeShow(item)" type="text">{{ item.show ? '收起':'展开' }}</a-button>
                  </div>
                  <div class="setVariant-item-box" v-show="item.show">
                    <div class="setVariant-item-box-i" v-for="val in item.values">
                      <span>{{ val.label }}</span>
                      <a-input v-model:value="val.input" @change="variantItemChange(val, item.id)"></a-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="box-setSUK">
              <div class="box-content-title">标题字母</div>
              <a-checkbox v-model:checked="addStr.capital">首字母大写</a-checkbox>
            </div>
            <div class="box-setSUK">
              <div class="box-content-title">标题截取</div>
              <a-checkbox v-model:checked="addStr.capture">标题超过200个字符时删除结尾超出字符</a-checkbox>
            </div>
            <div class="box-setSUK">
              <div class="box-content-title">生成预览</div>
              <a-input v-model:value="skuPreview" disabled></a-input>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="edit" tab="修改SUK标题" force-render>
          <div class="content-box">
            <div class="box-addStr">
              <div class="box-addStr-text sukReplace">
                <div class="box-addStr-text-item">
                  <span class="item-label">前缀：</span>
                  <a-input v-model:value="addStr.prefix" placeholder="请输入前缀"></a-input>
                </div>
                <div class="box-addStr-text-item">
                  <span class="item-label">后缀：</span>
                  <a-input v-model:value="addStr.suffix" placeholder="请输入后缀"></a-input>
                </div>
              </div>
              <div class="box-addStr-text sukReplace">
                <div class="box-addStr-text-item sukReplace-item">
                  <span class="item-label">SKU中的：</span>
                  <a-input v-model:value="addStr.oldValue"></a-input>
                </div>
                <div class="box-addStr-text-item sukReplace-item">
                  <span class="item-label">替换为</span>
                  <a-input v-model:value="addStr.newValue"></a-input>
                </div>
              </div>
              <div class="box-addStr-text sukReplace">
                <div class="box-addStr-text-item">
                  <span class="item-label">标题中移除：</span>
                  <a-input v-model:value="addStr.delValue"></a-input>
                </div>
              </div>
              <div class="box-addStr-text sukReplace">
                <div class="box-addStr-text-item">
                  <span class="item-label">首字母大写：</span>
                  <a-checkbox v-model:checked="addStr.capital">首字母大写</a-checkbox>
                </div>
              </div>
              <div class="box-addStr-text sukReplace">
                <div class="box-addStr-text-item">
                  <span class="item-label">标题截取：</span>
                  <a-checkbox v-model:checked="addStr.capture">标题超过200个字符时删除结尾超出字符</a-checkbox>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="skuEditData.loading" @click="save">确定</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "skuTitleModal" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:open', 'editDone', 'generate']);
const props = defineProps({
  open: Boolean,
  modalData: {
    type: Object,
    default: () => {}
  }
})
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
  content: '',      // 标题内容
  cursorPos: null,  // 光标位置
  capital: false,   // 首字母大写
  capture: false,   // 字段截取

  prefix: '',
  suffix: '',

  oldValue: '',                 
  newValue: '',
  delValue: '',               // 需要移除的字段
}) 
const type = computed(() => {
  return props.modalData.type
})
const skuPreview = computed(() => {
  let reg = new RegExp(`#([^#]*变种主题[^#]*)#`, 'g');
  let newStr = addStr.content
  let item = skuEditData.variantInfo[0]
  newStr = newStr.replace(reg, (match) => {
    let index = Number(match.split('变种主题')[1].split('#')[0]) - 1
    let id = skuEditData.variantAttribute[index].id
    return item[id].input
  })
  if (addStr.capital) {
    newStr = newStr.replace(/\b\w/g, (char) => char.toUpperCase())
  }
  if (addStr.capture && newStr.length > 200) {
    newStr = newStr.slice(0, 200)
  }
  return newStr
}) 
watch(() => props.open, (val, old) => {
  if (val) {
    skuEditData.variantInfo = JSON.parse(JSON.stringify(props.modalData.variantInfo))
    skuEditData.prop = props.modalData.prop
    nextTick(() => {
      // tagDrop()
      creatVariantAttribute()
    })
  }
})
function handleCancel() {
  emit('update:open', false)
}
function handleOk() {
  emit('editDone')
}

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
      i[item.key].input = i[item.key].label
      if (obj.values.length < 1) {
        obj.values.push({...i[item.key]})
      } else if (obj.values.every(val => val.key !== i[item.key].key)) {
        obj.values.push({...i[item.key]})
      }
    })
    // obj.values.forEach(i => i.input = i.name)
    skuEditData.variantAttribute.push(obj)
  })
  skuEditData.variantAttribute[0].show = true
}
// 输入框获取焦点
function handleBlur(e) {
  addStr.cursorPos = e.srcElement.selectionStart;
}
// 插入变种主题
function handleTagClick(index) {
  let tag = `#变种主题${index + 1}#`
  if (!addStr.content) {
    addStr.content = tag
  } else {
    let start = addStr.content.substring(0, addStr.cursorPos || 0);
    let end = addStr.content.substring(addStr.cursorPos || 0);
    addStr.content = start + tag + end
  }
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
    content: '',      // 标题内容
    cursorPos: null,  // 光标位置
    capital: false,   // 首字母大写
    capture: false,   // 字段截取

    prefix: '',
    suffix: '',

    oldValue: '',                 
    newValue: '',
    delValue: '',               // 需要移除的字段
  }
  Object.keys(_addStr).forEach(item => {
    if (addStr[item]) {
      addStr[item] = _addStr[item]
    }
  })
  skuEditData.prefix = ''
  emit('generate', data);
  handleCancel()
}
function save() {
  if (type.value === 'foundation') {
    foundationFn()
  } else if (type.value === 'senior') {
    seniorFn()
  }
  // return
  handleClose(skuEditData.variantInfo)
}
// 一键生成
function foundationFn() {
  let keys = props.modalData.headerList.map(i => i.key)
  skuEditData.variantInfo.forEach(item => {
    let str = skuEditData.prefix ? skuEditData.prefix + '-' : ''
    let arr = []
    keys.forEach(key => {
      arr.push(item[key].label)
    })
    item[skuEditData.prop] = str + arr.join('-')
  })
}
// 高级设置
function seniorFn() {
  let keys = skuEditData.variantAttribute.map(i => i.id)
  let prop = skuEditData.prop
  skuEditData.variantInfo.forEach((item, index) => {
    let obj = {
      prefix: '',
      suffix: ''
    }
    let arr = []
    keys.forEach(key => {
      arr.push(item[key].input)
    })
    let fix = ['prefix', 'suffix']
    fix.forEach((f, i) => {
      obj[f] = addStr[f]
    })
    if (skuEditData.activeKey === 'add') {
      let reg = new RegExp(`#([^#]*变种主题[^#]*)#`, 'g');
      // console.log(22, reg, addStr.content)
      let newStr = addStr.content
      newStr = newStr.replace(reg, (match) => {
        let index = Number(match.split('变种主题')[1].split('#')[0]) - 1
        let id = skuEditData.variantAttribute[index].id
        // console.log(Number(match.split('变种主题')[1].split('#')[0]) - 1, item[id]);
        return item[id].input
      })
      if (addStr.capital) {
        newStr = newStr.replace(/\b\w/g, (char) => {
          return char.toUpperCase()
        })
      }
      if (addStr.capture && newStr.length > 200) {
        newStr = newStr.slice(0, 200)
      }
      item[prop] = newStr
    } else if (skuEditData.activeKey === 'edit') {
      item[prop] = `${obj.prefix}${item[prop]}${obj.suffix}`.replace(addStr.delValue, '')
      if (addStr.oldValue) {
        let reg = new RegExp(addStr.oldValue, 'g')
        item[prop] = item[prop].replace(reg, addStr.newValue)
      }
      if (addStr.capital) {
        item[prop] = item[prop].replace(/\b\w/g, (char) => char.toUpperCase())
      }
      if (addStr.capture && item[prop].length > 200) {
        item[prop] = item[prop].slice(0, 200)
      }
    }
  })
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
      let num = Math.floor(Math.random()*1000)
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
// 设置变种代码
function variantItemChange(val, key) {
  skuEditData.variantInfo.forEach(item => {
    if (item[key].id === val.id) {
      item[key].input = val.input
    }
  })
}
function handleSelect(index) {
  let _addStr = {
    content: '',      // 标题内容
    cursorPos: null,  // 光标位置
    capital: false,   // 首字母大写
    capture: false,   // 字段截取

    prefix: '',
    suffix: '',

    oldValue: '',                 
    newValue: '',
    delValue: '',               // 需要移除的字段
  }
  Object.keys(_addStr).forEach(item => {
    if (addStr[item]) {
      addStr[item] = _addStr[item]
    }
  })
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
        // height: 40px;
        display: flex;
        // justify-content: space-between;
        flex-direction: column;
        :deep(.box-addStr-text-item) {
          // width: 30%;
          display: flex;
          align-items: center;
          .item-label {
            white-space:nowrap;
          }
          .ant-input {
            // width: 130px;
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
      }
      .sukReplace {
        justify-content: flex-start;
        // justify-content: space-between;
        margin-bottom: 8px;
        flex-direction: row;
        :deep(.box-addStr-text-item) {
          // width: 30%;
          display: flex;
          align-items: center;
          .item-label {
            white-space:nowrap;
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
              :deep(.ant-input) {
                width: 120px;
              }
              span {
                white-space: nowrap;
                margin-right: 6px;
              }
            }
          }
        }
      }
    }
  }
}
</style>