<template>
<div id="variationInfo" class="variationInfo">
  <div class="title">
    <span>变种信息</span>
  </div>
  <div class="content">
    <a-form 
      :model="formState" 
    >
      <a-form-item
        label="变种主题："
        name="username"
      >
        <a-select
          ref="select"
          v-model:value="formState.theme"
          @change="themeChange"
        >
          <a-select-option 
            :value="item.label"
            :key="item.label"
            v-for="item in props.variationThemeData.theme"
          >{{ item.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item 
        v-for="item in formState.variationList"
        :name="item.name"
        :label="item.name"
        :key="item.name"
      >
        <a-form-item-rest>
          <div class="theme-box">
            <div class="box-item-content">
              <span class="box-item-checkbox" v-for="themeItem in item.values" :key="themeItem.key">
                <a-checkbox 
                  v-model:checked="themeItem.checked"
                  v-if="!themeItem.isEdit"
                  @change="checkboxChage(themeItem, item)"
                >{{ themeItem.label }}</a-checkbox>
                <div v-if="themeItem.type === 'add'" class="box-item-input">
                  <EditOutlined class="edit-icon" v-if="!themeItem.isEdit" @click="iconClick('edit', themeItem, item)" />
                  <div class="input-box" v-else>
                    <a-input v-model:value="themeItem.editText" />
                    <UndoOutlined class="edit-icon" @click="iconClick('undo', themeItem, item)" />
                    <CheckOutlined class="edit-icon" @click="iconClick('ok', themeItem, item)" />
                  </div>
                </div>
              </span>
            </div>
            <div class="box-addInput-content">
              <a-input-search
                style="width: 200px;"
                v-model:value="item.addValue"
                enter-button="添加"
                @search="addThemeItem(item)"
              />
            </div>
          </div>
        </a-form-item-rest>
      </a-form-item>
    </a-form>
    <a-table
      :columns="resultHeader"
      :data-source="formState.tableData"
      stripe
      class="variation-table"
      ref="tableRef"
      :scroll="{ y: 200 }"
      :row-key="record => record.key"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <div>变体：{{ record.amazonProducts.length }}</div>
        </template>
      </template>
    </a-table>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { EditOutlined, UndoOutlined, CheckOutlined } from '@ant-design/icons-vue';
defineOptions({ name: "variationInfo" })
const { proxy: _this } = getCurrentInstance();
const props = defineProps({
  variationThemeData: {
    type: Object,
    default() {
      return {
        data: {},             // 变种数据
        theme: [],            // 变种
        themeAttribute: [],   // 变种标题
      }
    }
  }
})
const formState = reactive({
  theme: '',
  variationList: [],
  tableData: []
})
const variationHeaders = ref([]) // 变种主题表头
const headers = [ // 固定表头
  {
    title: 'SKU',
    dataIndex: 'SKU',
    key: 'SKU',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  },
  {
    title: 'MPN',
    dataIndex: 'MPN',
    key: 'MPN',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  },
  {
    title: '物品状况',
    dataIndex: 'conditionType',
    key: 'conditionType',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  },
  {
    title: '物品描述',
    dataIndex: 'describe',
    key: 'describe',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  },
  {
    title: '价格',
    dataIndex: 'ourPrice',
    key: 'ourPrice',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  },
  {
    title: '数量',
    dataIndex: 'quality',
    key: 'quality',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  },
  {
    title: '促销价',
    dataIndex: 'discountedPrice',
    key: 'discountedPrice',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  },
  {
    title: '促销时间',
    dataIndex: 'discountedTime',
    key: 'discountedTime',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  },
  {
    title: '操作',
    dataIndex: 'options',
    key: 'options',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter:false,
  }
];
const resultHeader = computed(() => {
  return [...variationHeaders.value, ...headers]
})
// 切换变种主题
function themeChange(val) {
  let { value } = props.variationThemeData.theme.find(i => i.label === val)
  let obj = {}
  value.forEach(item => {
    obj[item] = props.variationThemeData.data[item]
  })
  setVariation(obj, value)
}
// 创建变种
function setVariation(data, val) {
  console.log({ val, data });
  let list = val.map(i => {
    let item = data[i]
    let obj = {
      id: `${item.title}_${createRandom()}`,
      name: item.title,
      values: [],
      params: [],
      addValue: ''
    }
    if (item.items.properties.value.enumNames) {
      obj.values = item.items.properties.value.enumNames.map((i, index) => {
        return {
          key: `${i}_${createRandom()}`,
          label: i,
          value: item.items.properties.value.enum[index],
          type: 'default',
          checked: false,
          editText: '',
          isEdit: false
        }
      })
    }
    return obj
  })
  formState.variationList = list
  // 生成表头
  let headKey = formState.variationList.filter(i => i.params.length > 0)
  variationHeaders.value = headKey.map(item => {
    return {
      title: item.name,
      dataIndex: item.id,
      key: item.id,
      align:"center",
      sortable:false,
      show: true,
      width: 200,
      filter:false,
    }
  })
}
// 生成变种主题表头
function updateHead() {
  let headKey = formState.variationList.filter(i => i.params.length > 0)
  // 判断是否需要更新表头
  if (headKey.length === variationHeaders.value.length) return;
  variationHeaders.value = headKey.map(item => {
    return {
      title: item.name,
      dataIndex: item.id,
      key: item.id,
      align:"center",
      sortable:false,
      show: true,
      width: 200,
      filter:false,
    }
  })
}
// 添加变种属性
function addThemeItem(variationItem) {
  // console.log({ variationItem });
  let flag = variationItem.values.some(i => i.value === variationItem.addValue)
  if (!variationItem.addValue || flag) return;
  let obj = {
    key: `${variationItem.addValue}_${createRandom()}`,
    label: variationItem.addValue,
    value: variationItem.addValue,
    type: 'add',
    checked: true,
    editText: '',
    isEdit: false
  }
  variationItem.values.push(obj)
  variationItem.addValue = ''
  checkboxChage(obj, variationItem)
}
// 变种属性名称编辑
function iconClick(type, themeItem, variationItem) {
  if (type === 'edit') {
    themeItem.editText = themeItem.label
  } else if (type === 'undo') {
    themeItem.editText = ''
  } else if (type === 'ok') {
    themeItem.label = themeItem.editText
    themeItem.value = themeItem.editText
    variationItem.params.forEach(item => {
      if (item.key === themeItem.key) {
        item.label = themeItem.label
        item.value = themeItem.label
      }
    })
  }
  themeItem.isEdit = !themeItem.isEdit
}
// 变种属性勾选
function checkboxChage(themeItem, variationItem) {
  console.log({themeItem, variationItem});
  if (themeItem.checked) {
    variationItem.params.push(themeItem)
  } else if (!themeItem.checked) {
    variationItem.params = variationItem.params.filter(i => i.key !== themeItem.key)
  }
  // 生成表头
  updateHead()
  creatVariationInfo(themeItem.checked, themeItem, variationItem)
}
// 生成变种信息
function creatVariationInfo(e, val, variationItem) {
  let keys = headers.map(i => i.key)
  if (!e) {
    // 取消点选属性，删除变种信息
    if (variationItem.params.length > 0) {
      formState.tableData = formState.tableData.filter(i => i[variationItem.id].key !== val.key)
    } else {
      formState.tableData.forEach(item => {
        delete item[variationItem.id]
      })
    }
    if (variationHeaders.value.length < 1) {
      formState.tableData = []
    }
    return;
  }
  if (formState.tableData.length < 1) {
    let obj = {}
    obj[variationItem.id] = {...val}
    keys.forEach(item => {
      obj[item] = ''
    })
    formState.tableData.push(obj)
  } else {
    if (variationItem.params.length === 1) {
      // 如果之前变种信息没有该变种属性，那么给所有信息添加这个属性
      formState.tableData.forEach(item => {
        item[variationItem.id] = {...val}
      })
    } else {
      // 如果这个变种有多个属性，那么创建其他变种主题属性数乘积条信息
      let list = []
      variationHeaders.value.forEach((item, index) => {
        let _list = []
        let _variationItem = formState.variationList.find(i => i.id === item.key)
        let params = (item.key === variationItem.id) ? variationItem.params.filter(i => i.key === val.key) : _variationItem.params;
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
        item[variationItem.id] = {...val}
        keys.forEach(key => {
          item[key] = ''
        })
      })
      // 将创建的信息添加到数据中
      formState.tableData = [...formState.tableData,...list]
      formState.tableData.forEach((item, ind) => {
        item.rowId = ind
      })
    }
  }
}
// 生成一个随机数
function createRandom() {
  return Math.floor(Math.random() * 100000000000) + ''
}
</script>
<style lang="less" scoped>
.variationInfo {
  width: 100%;
  .variation-table {
    width: 100%;
  }
}
::v-deep(.ant-form-item-control-input-content) {
  display: flex;
  text-align: left;
}
.theme-box {
  .box-item-content {
    width: 100%;
    max-height: 200px;
    min-height: 20px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .box-item-checkbox {
      display: flex;
      margin-right: 14px;
      .box-item-input {
        display: flex;
        .edit-icon {
          cursor: pointer;
          margin-right: 6px;
        }
        .input-box {
          display: flex;
          input {
            width: 100px;
            margin-right: 6px;
          }
        }
      }
    }
  }
  .box-addInput-content {
    margin-top: 10px;
  }
}
</style>