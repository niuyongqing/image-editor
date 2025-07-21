<template>
  <div id="productDatabase_index" class="productDatabase_index">
    <a-modal 
      v-model:open="modalOpen" 
      :style="{ top: '10px', padding: 0, height: '99vh' }" 
      :title="'产品资料库'"
      :footer="false" 
      :maskClosable="false"
      width="95%"
    >
      <div class="dialog-box">
        <a-form :model="formData" layout="inline" :label-col="{ span: 6 }">
          <div class="formItem-row">
            <a-form-item label="产品分类" name="classify">
              <a-cascader 
                placeholder="产品分类" 
                allowClear 
                v-model:value="formData.classify" 
                :options="commodityTypeList"
                :allow-clear="true" 
                :field-names="{ label: 'label', value: 'value', children: 'children' }" 
              />
            </a-form-item>
            <a-form-item label="完成状态" name="status">
              <a-select 
                v-model:value="formData.status" 
                :options="storeStatus" 
                placeholder="完成状态" 
                allowClear
              ></a-select>
            </a-form-item>
            <a-form-item label="禁售站点" name="meansForbidSite">
              <a-select 
                v-model:value="formData.meansForbidSite" 
                :options="sheepProhibitionSelect" 
                placeholder="禁售站点"
                allowClear
              ></a-select>
            </a-form-item>
            <a-form-item label="禁售属性" name="meansForbidAttribute">
              <a-select 
                :options="forbidSaleList" 
                placeholder="禁售属性" 
                v-model:value="formData.meansForbidAttribute"
                :field-names="{ label: 'attributes', value: 'key' }" 
                allowClear
              ></a-select>
            </a-form-item>
          </div>
          <div class="formItem-row">
            <a-form-item label="仓储类别" name="preciseMeansKeepGrain">
              <a-select 
                v-model:value="formData.preciseMeansKeepGrain" 
                :options="meansKeepGrains"
                placeholder="仓储类别"
                allowClear
              ></a-select>
            </a-form-item>
            <a-form-item label="市场方向" name="devAttributableMarket">
              <a-select 
                v-model:value="formData.devAttributableMarket" 
                :options="devAttributableMarketRevertSelect"
                placeholder="市场方向" 
                allowClear
              ></a-select>
            </a-form-item>
            <a-form-item label="成本筛选" name="skuCosts">
              <a-form-item-rest>
                <div style="display: flex;justify-content: flex-start;align-items: center;font-size: 14px;">
                  <a-input-number placeholder="最小值" v-model:value="formData.skuCostsMin" style="width: 30%;"
                    :controls="false" />
                  <div style="margin: 0 5px">-</div>
                  <a-input-number placeholder="最大值" v-model:value="formData.skuCostsMax" style="width: 30%;"
                    :controls="false" />
                </div>
              </a-form-item-rest>
            </a-form-item>
            <a-form-item label="审核时间" name="meansAuditTime">
              <a-range-picker v-model:value="formData.meansAuditTime" allowClear />
            </a-form-item>
          </div>
          <div class="formItem-row">
            <a-form-item label="重量筛选" name="skuWeight">
              <a-form-item-rest>
                <div style="display: flex;justify-content: flex-start;align-items: center;font-size: 14px;">
                  <a-input-number placeholder="最小值" v-model:value="formData.skuWeightMin" style="width: 30%;"
                    :controls="false" />
                  <div style="margin: 0 5px">-</div>
                  <a-input-number placeholder="最大值" v-model:value="formData.skuWeightMax" style="width: 30%;"
                    :controls="false" />
                </div>
              </a-form-item-rest>
            </a-form-item>
            <a-form-item class="tradeName-item" label="模糊查找" name="tradeName">
              <a-form-item-rest>
                <div flex gap-10px style="width: 800px;">
                  <a-input v-model:value="formData.tradeName" placeholder="分词查找产品名称" />
                  <a-input v-model:value="formData.developPerson" placeholder="开发人员"></a-input>
                  <a-input v-model:value="formData.accurateTradeName" placeholder="商品名"></a-input>
                  <a-input v-model:value="formData.sku" placeholder="SKU"></a-input>
                  <a-input v-model:value="formData.description" placeholder="描述"> </a-input>
                </div>
              </a-form-item-rest>
            </a-form-item>
            <div class="formItem-row-i right">
              <a-space>
                <a-button key="submit" type="primary" @click="onSubmit">查询</a-button>
                <a-button key="submit" @click="resetForm">重置</a-button>
              </a-space>
            </div>
          </div>
        </a-form>
        <br>
        <a-table 
          :columns="header" 
          :data-source="tableData.data" 
          :scroll="{ y: 'calc(80vh - 120px)', x: '3200px', scrollToFirstRowOnChange: true }"
          :pagination="false"
          @change="tableChange"
        >
          <template #bodyCell="{ column: {key}, record }">
            <template v-if="key === 'action'">
              选中
            </template>
            <template v-else-if="key === 'artMainImage'">
              <a-image-preview-group>
                <a-image :width="50" v-for="(item, index) in artMainImageSrc(record)" :src="item" :key="index" />
              </a-image-preview-group>
            </template>
            <template v-else-if="key === 'devAccount'">
              <span v-if="record.devAccount == 0">暂无</span>
              <span v-if="record.devAccount == 1">平台热销品</span>
              <span v-if="record.devAccount == 2">平台趋势产品</span>
              <span v-if="record.devAccount == 3">公司热销品周边产品</span>
              <span v-if="record.devAccount == 4">季节、节日、重要事件相关产品</span>
              <span v-if="record.devAccount == 5">市场热销品</span>
              <span v-if="record.devAccount == 6">前瞻性产品</span>
              <span v-if="record.devAccount == 7">其他</span>
              <span v-if="record.devAccount == 8">菲律宾本土仓开发</span>
            </template>
            <template v-else-if="key === 'devAttributableMarket'">
              <div v-html="devAttributableMarket(record.devAttributableMarket)"></div>
            </template>
            <template v-else-if="key === 'skuList'">
              <div v-html="sortArrey(record.skuList)"></div>
            </template>
            <template v-else-if="key === 'meansRelated'">
              <div v-if="record.meansRelated && JSON.parse(record.meansRelated).length > 0">
                <div v-for="(item, index) in meansRelated(record.meansRelated)" :key="index">
                  <span>
                    {{ item.sku }}
                  </span>
                </div>
              </div>
              <div v-else> </div>
            </template>
            <template v-else-if="key === 'status'">
              <span v-if="record.status == 0">-</span>
              <a-tag v-if="record.status == 1" color="success">已完成</a-tag>
              <a-tag v-if="record.status == 2" color="warning">已下架</a-tag>
              <a-tag v-if="record.status == 3" color="error">重拍中</a-tag>
              <a-tag v-if="record.status == 4" color="default">待拍照</a-tag>
            </template>
            <template v-else-if="key === 'classify'">
              <a-tag color="success">{{ classify(record.classify) }}</a-tag>
            </template>
            <template v-else-if="key === 'meansKeepGrain'">
              <a-tag v-for="tag in meansKeepGrainMap(record.meansKeepGrain)" :key="tag.key" color="processing">{{
                tag.label
                }}</a-tag>
            </template>
            <template v-else-if="key === 'phSelectionTime'">
              {{ record.selectionTime ? record.selectionTime : record.completeTime }}
            </template>
            <template v-else-if="key === 'devProhibitPlatform'">
              <div v-html="devProhibitPlatform(record.devProhibitPlatform)"></div>
            </template>
            <template v-else-if="key === 'tortType'">
              <div>
                <a-tag type="primary" danger v-if="record.tortType ? record.tortType.includes('1') : false"
                  effect="dark" style="margin-right: 5px">速卖通微侵权
                </a-tag>
                <a-tag type="primary" danger v-if="record.tortType ? record.tortType.includes('2') : false"
                  effect="dark">Shopee微侵权
                </a-tag>
              </div>
            </template>
            <template v-else-if="key === 'meansForbidAttribute'">
              <a-tag type="success" v-for="(item, index) in meansForbidAttribute(record.meansForbidAttribute)"
                :key="index" style="margin-right: 5px;">{{
                getAttrName(item) }}</a-tag>
            </template>
            <template v-else-if="key === 'meansForbidSite'">
              <a-tag v-for="tag in meansForbidSiteSplit(record.meansForbidSite)" :key="tag" color="red">{{
                tagMap(tag)
                }}</a-tag>
            </template>
            <template v-else-if="key === 'meansRemark'">
              <div
                style="width: 100%;text-overflow: ellipsis; overflow: hidden;white-space: nowrap;text-align: center;padding: 0 8px;"
                v-if="record.meansRemark">
                <span v-html="record.meansRemark.replace(/<[^>]+>/g, '')"></span>
              </div>
            </template>
            <template v-else>
              {{ record[key] }}
            </template>
          </template>
        </a-table>
        <br>
        <div class="pagination-box">
          <a-pagination 
            v-model:current="tableData.params.pageNum" 
            v-model:page-size="tableData.params.pageSize"
            :page-size-options="[10,50,100,200]" 
            :total="tableData.total" 
            :show-total="total => `共 ${total} 条`"
            show-size-changer 
            showQuickJumper 
            @change="paginationChange" 
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { storeList } from '@/api/common/selectProduct';
import { useSelectProduct } from './js/useSelectProduct';
import { header } from './js/header';
import _ from "lodash";
import devAttributableMarketRevert from '~@/utils/devAttributableMarketRevert';
import classifyRevert from '~@/utils/classifyRevert';
import devProhibitPlatformRevert from '~@/utils/devProhibitPlatformRevert';
defineOptions({ name: "productDatabase_index" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'confirm']);
const props = defineProps({
  modalOpen: Boolean,
  modalData: {
    type: Object,
    default: () => {}
  }
});
const { 
  commodityTypeList, 
  storeStatus, 
  sheepProhibitionSelect, 
  forbidSaleList, 
  meansKeepGrains,
  devAttributableMarketRevertSelect
} = useSelectProduct();
const modalOpen = ref(false);
const { state: formData, reset } = useResetReactive({
    classify: [],
    meansForbidSite: undefined,
    meansForbidAttribute: undefined,
    preciseMeansKeepGrain: undefined,
    devAttributableMarket: undefined,
    skuCostsMin: "",
    description: "",
    skuWeightMin: "",
    skuWeightMax: "",
    meansAuditTime: [],    //审核时间
    
    tradeName: "",    //产品名称
    developPerson: '',
    accurateTradeName: '',
    sku: '',
    description: ''
    //   "pageNum": 1,
    //   "pageSize": 20,
    //   "order": "ascending", // 倒正序，必须 descending/ascending
    //   "prop": "create_time" // 排序列，必须
})
const tableData = reactive({
  data: [],
  total: 0,
  params: {
    "pageNum": 1,
    "pageSize": 50,
    "order": "ascending", // 倒正序，必须 descending/ascending
    "prop": "create_time" // 排序列，必须
  }
})
let copyFormData = {}   // 表单参数
watch(() => props.modalOpen, (val) => {
  if (val) {
    modalOpen.value = val
    modalOpenFn()
  }
})
watch(() => modalOpen.value, (val, oldVal) => {
  !val && emit('update:modalOpen', false)
})
function modalOpenFn() {
  
}
// 查询
async function onSubmit() {
  copyFormData = _.cloneDeep(formData);
  paginationChange(1)
}
// 重置
function resetForm() {
  reset()
  copyFormData = _.cloneDeep(formData);
  paginationChange(1)
}
function tableChange(pagination, filters, sorter, { action, currentDataSource }) {
  // console.log({ pagination, filters, sorter, action, currentDataSource });
  tableData.params.order = (sorter.order ?? 'ascend') + 'ing'
  tableData.params.prop = sorter.columnKey ?? 'create_time';
  paginationChange(1);
}
// 分页变化
function paginationChange(page, pageSize) {
  tableData.params.pageNum = page
  getTableList()
}
// 查询列表
async function getTableList() {
  const meansAuditTimeStart = copyFormData.meansAuditTime[0] ?? ''; // 开始时间
  const meansAuditTimeEnd = copyFormData.meansAuditTime[1] ?? ''; // 结束时间
  let params = {
    ...copyFormData,
    // preciseMeansKeepGrain: false,
    classify: formData.classify.join(","),
    meansAuditTimeStart: meansAuditTimeStart,
    meansAuditTimeEnd: meansAuditTimeEnd,
    ...tableData.params
  }
  delete params.meansAuditTime
  // console.log({ meansAuditTimeStart, meansAuditTimeEnd });
  let res = await storeList(params)
  tableData.data = res.rows ?? []
  tableData.total = res.total
  // console.log({res});
}
// 主图显示
const artMainImageSrc = (record) => {
  if (record.artMainImage) {
    const imgs = JSON.parse(record.artMainImage).map(item => item.url);
    return [imgs[0]];
  }
  return [];
};
// 市场方向
const devAttributableMarket = (record) => {
  if (record === '' || record === null) {
    return '-';
  }
  return devAttributableMarketRevert(record.split(","));
};
const sortArrey = (e) => {
  let str = '';
  if (e == '' || e == null) {
    e = '';
  }
  let spanD = e.split(',');
  let oldSku = e.split(',');
  let b = []; //去除所有带标签的
  oldSku.map(item => {
    b.push(item.replace(/<[^>]+>/g, ''));
  });
  let newSku = b.sort(); //排序 正确的sku
  if (newSku.length == 0) {
    str = '';
  } else if (newSku.length == 1) {
    str = spanD[0];
  } else if (newSku.length > 1) {
    spanD.forEach(v => {
      if (v.includes(newSku[0])) {
        newSku[0] = v;
      }
      if (v.includes(newSku[newSku.length - 1])) {
        newSku[newSku.length - 1] = v;
      }
    });
    str = `${newSku[0]} - ${newSku[newSku.length - 1]}`;
  }
  return str;
};
// 还原关联商品
const meansRelated = (meansRelated) => {
  return meansRelated ? JSON.parse(meansRelated) : []
};
// 分类还原
const classify = (record) => {
  if (record == '' || record == null) {
    return '-';
  }
  return classifyRevert(record.split(","));
};
// 仓储类别整理
const meansKeepGrainMap = (list) => {
  const tagList = [];
  const listSplit = list ? list.split(',') : [];
  listSplit.forEach((v) => {
    switch (v) {
      case '0':
      case '总仓':
        tagList.push({ key: v, label: '总仓' });
        break;
      case '1':
      case '馨拓靓仓':
        tagList.push({ key: v, label: '馨拓靓仓' });
        break;
      case '2':
      case 'PH海外仓':
        tagList.push({ key: v, label: 'PH海外仓' });
        break;
      case '3':
      case '馨拓美仓':
        tagList.push({ key: v, label: '馨拓美仓' });
        break;
      case '4':
      case 'TH海外仓':
        tagList.push({ key: v, label: 'TH海外仓' });
        break;
      case '5':
      case '亚马逊仓':
        tagList.push({ key: v, label: '亚马逊仓' });
        break;
      default:
        break;
    }
  });
  return tagList;
};
// 禁止刊登平台
const devProhibitPlatform = (record) => {
  if (record == '' || record == null) {
    return '-';
  }
  return devProhibitPlatformRevert(record.split(","));
};
// 禁售属性
const meansForbidAttribute = (str) => {
  return str ? str.split(',') : [];
};
const getAttrName = (key) => {
  let Aname1;
  let Aname2;
  if (forbidSaleList.value.length > 0) {
    Aname1 = forbidSaleList.value.find(item => {
      return item.key == key;
    });
    if (Aname1) {
      Aname2 = Aname1.attributes;
    } else {
      Aname2 = '';
    }
  };
  return Aname2;
};
// 禁售站点
const meansForbidSiteSplit = (list) => {
  if (list) {
    return list.split(',');
  }
  return [];
};
const tagMap = (code) => {
  const tasStatus = {
    "01": "印尼",
    "02": "菲律宾",
    "03": "新加坡",
    "04": "泰国",
    "05": "马来西亚",
    "06": "越南",
    "07": "台湾",
    "08": "巴西",
    "09": "墨西哥",
    "10": "智利",
    "11": "哥伦比亚",
    "12": "波兰",
    "13": "法国",
    "14": "西班牙",
    "99": "全站点",
    "00": "无",
  };
  return tasStatus[code] || '';
};

</script>
<style lang="less" scoped>
.formItem-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  :deep(.ant-form-item) {
    width: 24%;
    margin-bottom: 10px;
    .ant-form-item-row {
      width: 100%;
    }
    .ant-form-item-control-input {
      width: 100%;
      .ant-form-item-control-input-content {
        width: 100%;
      }
    }
    &.tradeName-item {
      .ant-form-item-control  {
        width: 300px !important;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
  }
  // .formItem-row-i {
  //   width: 50%;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  // }
}
.pagination-box {
  display: flex; 
  justify-content: flex-end;
  :deep(.ant-select-selector) {
    width: 100px !important;
  }
}
.modal-content {
  padding: 24px;
}
</style>