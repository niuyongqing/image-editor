<template>
<div id="variationInfo" class="variationInfo">
  <div class="title">
    <span>变种信息</span>
  </div>
  <div class="content">
    <a-form 
      :model="formState" 
      :label-col="{ span: 3 }"
      labelWrap
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
      :scroll="{ y: 500 }"
      :row-key="record => record.key"
      :pagination="false"
    >
      <template #headerCell="{ column }">
        <div>
          <span
            style="color: red; margin-right: 4px;"
            v-if="['SKU', 'conditionType', 'ourPrice', 'quality'].includes(column.dataIndex)"
          >*</span>
          <span v-if="column.dataIndex !== 'MPN'">
            {{ column.title }}
          </span>
        </div>
        <div v-if="column.key === 'SKU'">
          (
            <a-button @click="headerDialog(column, 'foundation', 'skuEdit')" type="link" >一键生成</a-button>
            ·
            <a-button @click="headerDialog(column, 'senior', 'skuEdit')" type="link">高级</a-button>
          )
        </div>
        <div v-if="column.dataIndex === 'MPN'">
          <div>
            <div style="display: flex; justify-content: center;">
              <!-- <span style="color: red; margin-right: 4px;">*</span> -->
              <a-select
                ref="select"
                v-model:value="column.key"
                style="width: 100px"
                @change="val => MPNChange(val, column.select)"
              >
                <a-select-option
                  v-for="i in column.select" 
                  :value="i"
                  :key="i"
                > {{ i }} </a-select-option>
              </a-select>
              <a-tooltip>
                <template #title>
                  UPC需填写12位数的数字<br/>
                  EAN需填写13位数的数字<br/>
                  GTIN需填写12/13/14位数的数字<br/>
                  不同变种sku对应UPC/EAN/GTIN不可重复使用
                </template>
                <QuestionCircleOutlined style="margin-left: 6px;" />
              </a-tooltip>
            </div>
          </div>
        </div>
        <div v-if="column.key === 'SKUTitle'">
          (
            <a-button @click="headerDialog(column, 'foundation', 'skuTitleModal')" type="link" >一键生成</a-button>
            ·
            <a-button @click="headerDialog(column, 'senior', 'skuTitleModal')" type="link">高级</a-button>
          )
        </div>
        <div v-if="column.key === 'conditionType'">
          (
            <a-button @click="headerDialog(column, 'foundation', 'conditionTypeModal')" type="link">批量</a-button>
          )
        </div>
        <div v-if="column.key === 'describe'">
          (
            <a-button @click="headerDialog(column, 'foundation', 'describeModal')" type="link">批量</a-button>
          )
        </div>
        <div v-if="column.key === 'ourPrice'">
          (
            <a-button @click="headerDialog(column, 'foundation', 'numberEditModal', 1)" type="link">批量</a-button>
          )
        </div>
        <div v-if="column.key === 'quality'">
          (
            <a-button @click="headerDialog(column, 'foundation', 'numberEditModal', 2)" type="link">批量</a-button>
          )
        </div>
        <div v-if="column.key === 'discountedPrice'">
          (
            <a-button @click="headerDialog(column, 'foundation', 'numberEditModal', 3)" type="link">批量</a-button>
          )
        </div>
        <div v-if="column.key === 'discountedTime'">
          (
            <a-button @click="headerDialog(column, 'foundation', 'discountedTimeModal')" type="link">批量</a-button>
          )
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="variationHeaders.map(i => i.key).includes(column.key)">
          <div>{{ record[column.key].label }}</div>
        </template>
        <template v-if="column.key === 'SKU'">
          <div>
            <a-form :model="record" :ref="`${record.rowId}_${column.key}`">
              <a-form-item
                :name="column.key"
                :rules="[{ required: true, message: '请输入SKU' }]"
              >
                <a-input v-model:value="record[column.key]" />
              </a-form-item>
            </a-form>
          </div>
        </template>
        <template v-if="column.dataIndex === 'MPN'">
          <div>
            <a-form :model="record" :ref="`${record.rowId}_${column.key}`">
              <a-form-item
                :name="column.key"
                :rules="[{ required: true, message: `请输入${column.key}` }]"
              >
                <a-input v-model:value="record[column.key]" />
              </a-form-item>
            </a-form>
          </div>
        </template>
        <template v-if="column.key === 'SKUTitle'">
          <div>
            <a-input v-model:value="record[column.key]" />
            <div style="height: 24px;"></div>
          </div>
        </template>
        <template v-if="column.key === 'conditionType'">
          <div>
            <a-form :model="record" :ref="`${record.rowId}_${column.key}`">
              <a-form-item
                :name="column.key"
                :rules="[{ required: true, message: '请选择物品状况' }]"
              >
                <a-select
                  v-model:value="record[column.key]"
                  showSearch
                >
                  <a-select-option 
                    :value="item.value"
                    :key="item.label"
                    v-for="item in conditionTypeList"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
        </template>
        <template v-if="column.key === 'describe'">
          <div>
            <a-input v-model:value="record[column.key]" />
            <div style="height: 24px;"></div>
          </div>
        </template>
        <template v-if="['quality','ourPrice'].includes(column.key)">
          <div>
            <a-form :model="record" :ref="`${record.rowId}_${column.key}`">
              <a-form-item
                :name="column.key"
                :rules="[{ required: true, message: `请输入${column.title}` }]"
              >
                <a-input-number style="width: 110px;" :min="1" v-model:value="record[column.key]" />
                <a-dropdown :trigger="['click']">
                  <ExportOutlined style="margin-left: 6px;" />
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <div class="dropdown-item" @click="shareData(record, '', column.key, 'all')">
                          {{ `应用到全部` }}
                        </div>
                      </a-menu-item>
                      <a-menu-item 
                        v-for="(dropdownItem, index) in variationHeaders"
                        :key="index + dropdownItem.key" 
                      >
                        <div class="dropdown-item" @click="shareData(record, dropdownItem.key, column.key, 'identical')">
                          {{ `应用到所有 ${record[dropdownItem.key].label} ` }}
                        </div>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-form-item>
            </a-form>
          </div>
        </template>
        <!-- <template v-if="column.key === 'quality'">
          <div>
            <a-form :model="record" :ref="`${record.rowId}_${column.key}`">
              <a-form-item
                :name="column.key"
                :rules="[{ required: true, message: '请输入数量' }]"
              >
                <a-input-number style="width: 110px;" :min="1" v-model:value="record[column.key]" />
              </a-form-item>
            </a-form>
          </div>
        </template> -->
        <template v-if="column.key === 'discountedPrice'">
          <div>
            <a-input-number style="width: 110px;" :min="1" v-model:value="record[column.key]" />
            <a-dropdown :trigger="['click']">
              <ExportOutlined style="margin-left: 6px;" />
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <div class="dropdown-item" @click="shareData(record, '', column.key, 'all')">
                      {{ `应用到全部` }}
                    </div>
                  </a-menu-item>
                  <a-menu-item 
                    v-for="(dropdownItem, index) in variationHeaders"
                    :key="index + dropdownItem.key" 
                  >
                    <div class="dropdown-item" @click="shareData(record, dropdownItem.key, column.key, 'identical')">
                      {{ `应用到所有 ${record[dropdownItem.key].label} ` }}
                    </div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <div style="height: 24px;"></div>
          </div>
        </template>
        <template v-if="column.key === 'discountedTime'">
          <div>
            <a-range-picker v-model:value="record[column.key]" />
            <div style="height: 24px;"></div>
          </div>
        </template>
        <template v-if="column.key === 'options'">
          <div>
            <a-button @click="delRow(record)" danger type="text">删除</a-button>
            <div style="height: 24px;"></div>
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <!-- 弹窗组件 -->
  <component
    :is="modalInfo.name"
    v-model:open="modalInfo.open"
    :modal-data="modalInfo.data"
    @editDone="editDone"
    @generate="generate"
  ></component>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect, markRaw } from 'vue'
import { EditOutlined, UndoOutlined, CheckOutlined, QuestionCircleOutlined, ExportOutlined } from '@ant-design/icons-vue';
import skuEdit from './modal/skuEdit.vue';
import conditionTypeModal from './modal/conditionTypeModal.vue';
import describeModal from './modal/describeModal.vue';
import numberEditModal from './modal/numberEditModal.vue';
import discountedTimeModal from './modal/discountedTimeModal.vue';
import skuTitleModal from './modal/skuTitleModal.vue';
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
const conditionTypeList = ref([])     // 变种信息物品状况列表
const variationHeaders = ref([])  // 变种主题表头
const headers = [ // 固定表头
  {
    title: 'SKU',
    dataIndex: 'SKU',
    key: 'SKU',
    align:"center",
    sortable:false,
    show: true,
    width: 200,
    filter: false,
    valueType: 'string',
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
    valueType: 'string',
    select: ['MPN','EAN','GTIN','UPC']
  },
  {
    title: 'SKU标题',
    dataIndex: 'SKUTitle',
    key: 'SKUTitle',
    align:"center",
    sortable:false,
    show: true,
    width: 300,
    filter: false,
    valueType: 'string',
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
    valueType: 'string',
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
    valueType: 'string',
  },
  {
    title: '价格',
    dataIndex: 'ourPrice',
    key: 'ourPrice',
    align:"center",
    sortable:false,
    show: true,
    width: 160,
    filter:false,
    valueType: 'number',
  },
  {
    title: '数量',
    dataIndex: 'quality',
    key: 'quality',
    align:"center",
    sortable:false,
    show: true,
    width: 160,
    filter:false,
    valueType: 'number',
  },
  {
    title: '促销价',
    dataIndex: 'discountedPrice',
    key: 'discountedPrice',
    align:"center",
    sortable:false,
    show: true,
    width: 160,
    filter:false,
    valueType: 'number',
  },
  {
    title: '促销时间',
    dataIndex: 'discountedTime',
    key: 'discountedTime',
    align:"center",
    sortable:false,
    show: true,
    width: 240,
    filter:false,
    valueType: 'array',
  },
  {
    title: '操作',
    dataIndex: 'options',
    key: 'options',
    align:"center",
    sortable:false,
    show: true,
    width: 80,
    filter:false,
    fixed: 'right',
  }
];
const modalInfo = reactive({        // 表头弹窗
  name: null,
  open: false,
  data: {
    headerList: [],           // 表头
    type: 'foundation',       // foundation: 一键生成 senior: 高级
    variantInfo: [],           // 变种信息
    prop: '',
  },
  component: {
    skuEdit: markRaw(skuEdit),
    conditionTypeModal: markRaw(conditionTypeModal),
    describeModal: markRaw(describeModal),
    numberEditModal: markRaw(numberEditModal),
    discountedTimeModal: markRaw(discountedTimeModal),
    skuTitleModal: markRaw(skuTitleModal),
  },
})
// 展示的表头
const resultHeader = computed(() => {
  return [...variationHeaders.value, ...headers]
})
watch(() => props.variationThemeData.key, (val) => {
  // 创建变种信息物品状况列表
  conditionTypeList.value = props.variationThemeData.data.condition_type.items.properties.value.enumNames.map((i, index) => {
    return {
      label: i, 
      value: props.variationThemeData.data.condition_type.items.properties.value.enum[index]
    }
  })
})
// onMounted(() => {
//   // 创建变种信息物品状况列表
//   if (props.variationThemeData.data.condition_type) {
//     conditionTypeList.value = props.variationThemeData.data.condition_type.items.properties.value.enumNames.map((i, index) => {
//       return {
//         label: i, 
//         value: props.variationThemeData.data.condition_type.items.properties.value.enum[index]
//       }
//     })
//   }
// })
// 切换变种主题
function themeChange(val) {
  let { value } = props.variationThemeData.theme.find(i => i.label === val)
  let obj = {}
  value.forEach(item => {
    obj[item] = props.variationThemeData.data[item]
  })
  formState.tableData = []
  setVariation(obj, value)
}
// 创建变种
function setVariation(data, val) {
  // console.log({ val, data });
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
      width: 150,
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
    formState.tableData.forEach(item => {
      if (item[variationItem.id].key === themeItem.key) {
        item[variationItem.id].label = themeItem.label
        item[variationItem.id].value = themeItem.label
      }
    })
  }
  themeItem.isEdit = !themeItem.isEdit
}
// 变种属性勾选
function checkboxChage(themeItem, variationItem) {
  // console.log({themeItem, variationItem});
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
    headers.forEach(item => {
      if (item.valueType === 'array') {
        obj[item.key] = []
      } else {
        obj[item.key] = ''
      }
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
        headers.forEach(head => {
          if (head.valueType === 'array') {
            item[head.key] = []
          } else {
            item[head.key] = ''
          }
        })
      })
      // 将创建的信息添加到数据中
      formState.tableData = [...formState.tableData,...list]
    }
  }
  formState.tableData.forEach((item, ind) => {
    if (!item.rowId) {
      item.rowId = 'sku_info_' + createRandom()
    }
  })
}
// 删除变种信息
function delRow(row) {
  let index = formState.tableData.findIndex(i => i.rowId === row.rowId)
  formState.tableData.splice(index, 1)
  Object.keys(row).forEach(item => {
    if (formState.variationList.some(i => i.id === item)) {
      if (!formState.tableData.some(i => i[item].key === row[item].key)) {
        let variant = formState.variationList.find(i => i.id === item)
        variant.params = variant.params.filter(i => i.key !== row[item].key)
        variant.values.forEach(val => {
          if (val.key === row[item].key) {
            val.checked = false
          }
        })
      }
    }
  })
}
// 校验必填项
async function validateVariationInfo() {
  let infoKeys = Object.keys(_this.$refs).filter(i => i.includes('sku_info_'))
  for (const item of infoKeys) {
    _this.$refs[item].validateFields()
  }
}
// 生成一个随机数
function createRandom() {
  return Math.floor(Math.random() * 100000000000) + ''
}
// 表头复选框变化
function MPNChange(val, select) {
  // console.log({val});
  // 删除之前的选项，给新选项赋值
  formState.tableData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (select.includes(key)) {
        let str = item[key]
        delete item[key]
        item[val] = str
      }
    })
  })
  _this.$forceUpdate()
}
function shareData(row, target, val, type) {
  formState.tableData.forEach(item => {
    if (type === 'all') {
      item[val] = row[val]
    } else if (type === 'identical' && item[target].key === row[target].key) {
      item[val] = row[val]
    }
  })
}
/**
 * 表头弹窗
 * @param column 当前列
 * @param type 弹窗类型 foundation: 一键生成 senior: 高级
 * @param modalName 弹窗组件名称
 * @param title 弹窗名称
 */
function headerDialog(column, type, modalName, title = '') {
  // console.log({column, type});
  modalInfo.name = modalInfo.component[modalName]
  nextTick(() => {
    modalInfo.open = true
    modalInfo.data = {
      headerList: variationHeaders.value,           // 表头
      typeList: conditionTypeList.value,           // 状况列表
      type: type,       // foundation: 一键生成 senior: 高级
      variantInfo: formState.tableData,           // 变种信息
      prop: column.key,
      title,
    }
  })
}
// 弹窗确认关闭
function editDone(modalKey) {
  modalInfo.open = false
  // modalInfo.name = null
  modalInfo.data = {}
}
// 修改完成
function generate(data) {
  data && (formState.tableData = data)
}
defineExpose({
  validateVariationInfo
})
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