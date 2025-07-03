<template>
<div id="acquisitionEdit_variantInfo" class="acquisitionEdit_variantInfo">
  <a-card style="text-align: left;">
    <template #title>
      变种属性
    </template>
    <a-form :model="variantTheme" ref="ERPformRef" :laba-col="{ span: 3 }">
      <a-form-item 
        label="变种主题" 
        name="addVariantTitle"
      >
        <a-form-item-rest>
          <div class="box" style="width: 100%; display: flex; flex-direction: column;">
            <div class="addVariant-btn">
              <a-button @click="variantTheme.isAddVariant = !variantTheme.isAddVariant" style="width: 120px;" type="primary">添加自定义属性</a-button>
              <div class="addVariant-btn-input" v-show="variantTheme.isAddVariant">
                <a-input 
                  style="width: 200px;"  
                  v-model:value="variantTheme.addVariantTitle" 
                  placeholder="请输入自定义属性"
                  ref="addVariantInputRef"
                  @blur="addVariant('check')"
                ></a-input>
                <async-icon :icon="'CheckOutlined'" @click="addVariant('check')"></async-icon>
                <async-icon :icon="'UndoOutlined'" @click="addVariant('refresh')"></async-icon>
              </div> 
            </div>
          </div>
        </a-form-item-rest>
      </a-form-item>
      <a-form-item 
        v-for="(item, index) in variantTheme.variantList"
        label="" 
        :colon="false"
        :name="item.id"
        :key="item.id"
      >
        <a-form-item-rest>
          <div class="variant-attribute-box">
            <div class="variant-attribute-header">
              <div class="variant-title">
                变种主题 {{ index+1 }}：
                <div v-show="!item.showInput">
                  <span>{{ item.name }}</span>
                  <async-icon :icon="'EditOutlined'" @click="titleIconClick('edit', item, form[item.id])"></async-icon>
                </div>
                <div v-show="item.showInput">
                  <a-input 
                    style="width: 200px;" 
                    v-model:value="item.addTitleValue" 
                    placeholder="请输入内容" 
                    @blur="titleIconClick('check', item, form[item.id])"
                  ></a-input>
                  <async-icon :icon="'CheckOutlined'" @click="titleIconClick('check', item, form[item.id])"></async-icon>
                  <async-icon :icon="'UndoOutlined'" @click="titleIconClick('refresh', item, form[item.id])"></async-icon>
                </div>
              </div>
              <div style="display: flex; align-items: center;">
                <div style="display: flex; align-items: center;" v-if="index">
                  <a-button @click="setVariantOne(item, index)" type="link">
                    <async-icon :icon="'HomeOutlined'"></async-icon>
                    设置为变种主题1
                  </a-button>
                  <!-- <a-tooltip style="margin-top: 0" class="item" effect="dark" :content="'只有变种主题1可以设置变种图'" placement="top">
                    <i class="a-icon-info"></i>
                  </a-tooltip> -->
                </div>
                <a-button @click="removeVariant(item, index)" danger type="text">移除</a-button>
              </div>
            </div>
            <div class="variant-content">
              <div class="variant-item" v-for="(i, x) in item.values" :key="(i.id + x)">
                <a-checkbox 
                  v-model:checked="i.checked"
                  class="item-check" 
                  @change="(e) => variantItemChange(i.checked, i, form[item.id])" 
                ></a-checkbox>
                <span v-if="i.color" :style="`width: 12px; height: 12px; background-color: ${i.color};`"></span>
                <div v-show="!i.isEditVal">
                  {{ i.name }}
                  <async-icon :icon="'EditOutlined'" @click.stop="itemIconClick('edit', i, form[item.id])"></async-icon>
                </div>
                <div v-show="i.isEditVal">
                  <a-input 
                    style="width: 200px;" 
                    v-model:value="i.editValue" 
                    :ref="`input_${i.id}`"
                    placeholder="请输入内容" 
                    @blur="itemIconClick('check', i, form[item.id])"
                  ></a-input>
                  <async-icon :icon="'CheckOutlined'" @click.stop="itemIconClick('check', i, form[item.id])"></async-icon>
                  <async-icon :icon="'UndoOutlined'" @click.stop="itemIconClick('refresh', i, form[item.id])"></async-icon>
                </div>
              </div>
            </div>
            <div class="item-add-value">
              <a-input style="width: 200px;" v-model:value="item.addItemValue" placeholder="请输入内容" ></a-input>
              <a-button @click="variantAddItem(item)" type="primary">添加</a-button>
            </div>
          </div>
        </a-form-item-rest>
      </a-form-item>
    </a-form>
  </a-card>
  <br>
  <a-card style="text-align: left;">
    <template #title>变种信息</template>
    <a-form :model="variantTheme" ref="ERPformRef" :laba-col="{ span: 3 }">
      <a-form-item 
        label="" 
        name="addVariantTitle"
      >
        <a-form-item-rest>
          <div class="variantInfo-box">
            <a-table :columns="header" :data-source="variantTheme.tableData">
              <template #headerCell="{ column }">
                {{ column.title }}
                <!-- <template>
                </template> -->
              </template>

              <template #bodyCell="{ column, record: row }">
                <template v-if="variantTheme.header.some(i => i.key === column.key)">
                  <span>{{ row[column.key].name }}</span>
                </template>
                <template v-else-if="column.key === 'skuCode'">
                  <div class="row-input-content">
                    <!-- <span>{{ row[column.key] }}</span> -->
                    <a-input v-model:value="row[column.key]" placeholder="" />
                  </div>
                </template>
                <template v-else-if="['originalPrice', 'currentPrice', 'inventory'].includes(column.key)">
                  <div class="row-input-content">
                    <!-- <span>{{ row[column.key] }}</span> -->
                    <a-input-number 
                      v-model:value="row[column.key]" 
                      placeholder="" 
                      style="width: 100%;"
                      :min="0"
                    />
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </a-form-item-rest>
      </a-form-item>
    </a-form>
  </a-card>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'
defineOptions({ name: "acquisitionEdit_variantInfo" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:variantInfoData'])
const props = defineProps({
  variantInfoData: {
    type: Object,
    default: () => {}
  },
  productData: {
    type: Object,
    default: () => {}
  }
})
const form = reactive({})
const variantTheme = reactive({
  addVariantTitle: '',
  isAddVariant: false,
  variantList: [],
  header: [],
  tableData: [],
})

const header = computed(() => {
  let fixedHeader = [
    {
      title: 'SKU',
      dataIndex: 'skuCode',
      key: "skuCode",
      align: "center",
      width: 200
    },
    {
      title: `价格（${props.productData?.priceInfo?.currency}）`,
      dataIndex: 'originalPrice',
      key: "originalPrice",
      align: "center",
      width: 200
    },
    {
      title: `促销价（${props.productData?.priceInfo?.currency}）`,
      dataIndex: 'currentPrice',
      key: "currentPrice",
      align: "center",
      width: 200
    },
    {
      title: '库存',
      dataIndex: 'inventory',
      key: "inventory",
      align: "center",
      width: 200
    },
  ];
  return [...variantTheme.header, ...fixedHeader];
})
watch(() => props.productData?.id, (val) => {
  // console.log(111);
  openFn();
})
function openFn() {
  
}
// 添加主题
function addVariant(key, val = {}) {
  switch (key) {
    case 'check':
      let obj = {
        id: (val && val.id) || `${variantTheme.addVariantTitle}_add_xinZhan_${createRandom()}`,
        name: (val && val.name) || variantTheme.addVariantTitle,
        values: (val && val.values) || [],
        addItemValue: '',
        addTitleValue: '',
        showInput: false,
      }
      if (!obj.name) return;
      variantTheme.variantList.push(obj)
      let formItem = {
        id: obj.id,
        name: obj.name,
        params: []
      }
      // variantTheme.$set(form, obj.id, formItem)
      form[obj.id] = formItem
      break;
    case 'refresh':
      break;
    default:
      break;
  }
  variantTheme.addVariantTitle = ''
  variantTheme.isAddVariant = false
}
// 主题名称编辑
function titleIconClick(key, data, formItem) {
  switch (key) {
    case 'edit':
      data.addTitleValue = data.name 
      break;
    case 'check':
      data.name = data.addTitleValue ? data.addTitleValue : data.name
      data.addTitleValue = ''
      formItem.name = data.name
      if (variantTheme.header.length > 0) {
        variantTheme.header.forEach(item => {
          if (item.key === data.id) {
            item.title = data.name
          }
        })
      };
      break;
    case 'refresh':
      data.addTitleValue = ''
      break;
    default:
      break;
  }
  data.showInput = !data.showInput
}
// 将其他主题设置为主题一
function setVariantOne(val, index) {
  let att = variantTheme.variantList.splice(index, 1)[0]
  variantTheme.variantList.unshift(att)
  createHeaderList(true)
  // form[val.id].params.forEach(item => {
  //   item.imageUrl = ''
  //   item.uri = ''
  //   item.newFileName = ''
  //   item.width = 0
  //   item.height = 0
  // })
}
// 移除主题
function removeVariant(val, index) {
  variantTheme.variantList.splice(index, 1)
  variantTheme.header = variantTheme.header.filter(i => i.key !== val.id)
  createHeaderList()
  form[val.id].params.forEach((item, index) => {
    if (index === (form[val.id].params.length - 1) && variantTheme.header.length > 0) {
      variantTheme.tableData.forEach(info => {
        delete info[val.id]
      })
    } else {
      variantTheme.tableData = variantTheme.tableData.filter(i => i[val.id].id !== item.id)
    }
  })
  delete form[val.id]
}
// 添加主题选项
function variantAddItem(data) {
  if (!data.addItemValue) return;
  let obj = {
    id: `${data.addItemValue}_add_xinZhan_${createRandom()}`,
    name: data.addItemValue,
    isEdit: false,
    editValue: '',
    checked: true,
  }
  if (data.values.every(i => i.name !== obj.name)) {
    data.values.push(obj)
    data.addItemValue = ''
    // 直接选中
    variantItemChange(true, obj, form[data.id])
  }
}
// 主题选项编辑
function itemIconClick(key, data, formItem) {
  switch (key) {
    case 'edit':
      data.editValue = data.name 
      break;
    case 'check':
      data.name = data.editValue ? data.editValue : data.name
      data.editValue = ''
      formItem.params.some(i => {
        if (i.id === data.id) {
          i.name = data.name
        }
        return i.id === data.id
      })
      // 编辑时同时更新变种信息
      variantTheme.tableData.forEach(item => {
        if (item[formItem.id] && item[formItem.id].id === data.id) {
          item[formItem.id].name = data.name
        }
      })
      break;
    case 'refresh':
      data.editValue = ''
      break;
    default:
      break;
  }
  data.isEditVal = !data.isEditVal
  if (data.isEditVal) {
    nextTick(() => {
      _this.$refs[`input_${data.id}`][0].focus()
    })
  }
}
// 主题选项勾选
function variantItemChange(e, val, formItem) {
  // console.log({e, val, formItem});
  if (e) {
    formItem.params.push(val)
  } else {
    formItem.params = formItem.params.filter(i => i.id !== val.id)
  }
  // 编辑状态不生成变种信息
  // if (this.isFill) return;
  generateVariantInfo(e, val, formItem)
}
// 创建变种主题表头
function createHeaderList(renew = false) {
  if (renew) {
    // 是否更新表头列表
    variantTheme.header = []
  }
  variantTheme.variantList.forEach(item => {
    if (item.values.some(i => i.checked)) {
      if (variantTheme.header.some(i => i.key === item.id)) return;
      let header = {
        title: item.name,
        dataIndex: item.id,
        key: item.id,
        align: "center",
        width: 120
      }
      variantTheme.header.push(header)
    } else {
      variantTheme.header = variantTheme.header.filter(i => i.key !== item.id)
    }
  })  
  // variantTheme.header.forEach((item, index) => {
  //   item.isOne = (item.key === variantTheme.variantList[0].id) // 是不是主题一
  // })
}
// 生成变种信息
function generateVariantInfo(e, val, formItem) {
  createHeaderList()
  // 固有表头字段
  let keys = ['skuCode', 'originalPrice', 'currentPrice', 'inventory',];
  if (!e) {
    // 取消点选属性，删除变种信息
    if (formItem.params.length > 0) {
      variantTheme.tableData = variantTheme.tableData.filter(i => i[formItem.id].id !== val.id)
    } else {
      variantTheme.tableData.forEach(item => {
        delete item[formItem.id]
      })
    }
    if (variantTheme.header.length < 1) {
      variantTheme.tableData = []
    }
    return;
  }
  if (variantTheme.tableData.length < 1) {
    let obj = {}
    // obj[formItem.id] = {
    //   id: val.id,
    //   name: val.name,
    //   imageUrl: ''
    // }
    obj[formItem.id] = {...val}
    keys.forEach(item => {
      obj[item] = ''
    })
    variantTheme.tableData.push(obj)
  } else {
    if (formItem.params.length === 1) {
      // 如果之前变种信息没有该变种属性，那么给所有信息添加这个属性
      variantTheme.tableData.forEach(item => {
        item[formItem.id] = {...val}
      })
    } else {
      // 如果这个变种有多个属性，那么创建其他变种主题属性数乘积条信息
      let list = []
      variantTheme.header.forEach((item, index) => {
        let _list = []
        let params = (item.key === formItem.id) ? form[item.key].params.filter(i => i.id === val.id) : form[item.key].params
        params.forEach((i, idx) => {
          if (index < 1) {
            let obj = {}
            obj[item.key] = {...i}
            _list.push(obj)
          } else {
            list.forEach((info, infoIndex) => {
              let obj = {...info}
              obj[item.key] = {...i}
              _list.push(obj)
            })
          }
        })
        list = _list
      })
      list.forEach(item => {
        item[formItem.id] = {...val}
        keys.forEach(key => {
          item[key] = ''
        })
      })
      // 将创建的信息添加到数据中
      variantTheme.tableData = [...variantTheme.tableData, ...list];
      variantTheme.tableData.forEach((item, index) => {
        item.rowId = index
      })
    }
  }
}
// 生成一个随机数
function createRandom() {
  return Math.floor(Math.random() * 100000000) + ''
}
</script>
<style lang="less" scoped>
.acquisitionEdit_variantInfo {
  .addVariant-btn {
    display: flex;
    .addVariant-btn-input {
      margin-left: 16px;
    }
  }
  .variant-attribute-box {
    width: calc(100% - 40px);
    // padding: 0px 30px 20px;
    border: 1px solid #e8e8e8;
    margin: 0 20px;
    .variant-attribute-header {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      font-weight: 600;
      background: #f2f2f2;
      .variant-title {
        width: 50%;
        display: flex;
        align-items: center;
        height: 28px;
        .variant-title-text {
          margin-right: 6px;
        }
      }
    }
    .variant-content {
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      .variant-item {
        display: flex;
        align-items: center;
        margin: 0 24px 20px 0;
        .item-check {
          margin-right: 6px;
        }
      }
    }
    .item-add-value {
      padding: 0 20px 20px;
    }
  }
  .variantInfo-box {
    padding: 20px;
  }
  .anticon {
    margin-left: 6px;
    cursor: pointer;
  }
}
</style>