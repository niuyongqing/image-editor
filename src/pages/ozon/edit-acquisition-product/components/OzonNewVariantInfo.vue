<template>
  <div id="OzonNewVariantInfoCont">
    <a-card title="SKU信息" class="text-left" :loading="categoryAttributesLoading">
      <a-card title="变种属性" class="text-left mx-50">
        <div>
          <span>变种主题：</span>
          <a-button type="primary" v-for="(item, index) in themeBtns" class="mr-2.5" :key="'add' + index + item.name"
            @click="enterVariantType(item)">
            <AsyncIcon icon="PlusCircleOutlined"></AsyncIcon>
            {{ item.name }}
          </a-button>

          <a-card v-for="(items, index) in attributeList" :key="items.id" style="margin-top: 10px">
            <template #title>
              <span style="font-weight: bolder">变种主题{{ index + 1 }}：
                <i v-if="items.isRequired" style="color: red; margin-right: 2px">*</i>
                <span>{{ items.name }}</span>
              </span>
              <a-popconfirm icon-color="red" title="确定要删除这个变种主题吗？" @confirm="removeVariantType(items, index)">
                <a-button type="text" danger v-if="!items.isRequired" style="float: right">移除</a-button>
              </a-popconfirm>
            </template>
            <a-table :columns="items.tableColumns" :data-source="items.tableData" :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === record.name">
                  <!-- 单选 -->
                  <div v-if="record.selectType == 'select'" class="w-4/5">
                    <a-select v-model:value="record.modelValue" class="w-full" optionFilterProp="label" labelInValue
                      allowClear placeholder="请选择" @change="pushValue(index, items)">
                      <a-select-option v-for="items in record.details" :key="items.id" :label="items.label"
                        :value="items">{{ items.label }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <!-- 多选 -->
                  <div v-if="record.selectType == 'multSelect'" class="w-4/5">
                    <a-select v-model:value="record.modelValue" class="w-full" optionFilterProp="label" allowClear
                      mode="multiple" placeholder="请选择" labelInValue @change="pushValue(index, items)"
                      :options="record.details">
                      <!-- <a-select-option v-for="items in record.details" :key="items.id"
                                                :label="items.label" :value="items">{{ items.label
                                                }}
                                            </a-select-option> -->
                    </a-select>
                  </div>
                  <!-- 输入框 -->
                  <div v-if="record.selectType == 'input'" class="w-4/5">
                    <a-input-number v-if="record.type == 'Integer'" allowClear v-model:value="record.modelValue"
                      @blur="index, items" placeholder="请输入内容" class="w-full"></a-input-number>
                    <a-input v-model:value="record.modelValue" allowClear v-else class="w-full" placeholder="请输入内容"
                      @blur="pushValue(index, items)"></a-input>
                  </div>
                </template>
                <template v-if="column.dataIndex === record[column.dataIndex]">
                  <a-input v-model:value="record.secondModelValue" allowClear class="w-4/5" placeholder="请输入内容"
                    @blur="pushValue(index, items)"></a-input>
                </template>
                <template v-if="column.dataIndex === 'options'">
                  <div>
                    <a-button class="mr-2.5" @click="addItem(record, items)">
                      <AsyncIcon icon="PlusCircleOutlined"></AsyncIcon>
                    </a-button>
                    <a-button v-if="items.tableData.length != 1" @click="removeItem(record, items)">
                      <AsyncIcon icon="MinusCircleOutlined"></AsyncIcon>
                    </a-button>
                  </div>
                </template>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-card>
      <a-card title="变种信息" class="text-left mx-50 mt-5">
        <!-- 自定义变种信息 -->
        <div class="flex mb-2.5">
          <a-checkbox-group v-model:value="addHeaderList" @change="changeHeade" :disabled="tableData.length == 0"
            :options="plainOptions">
          </a-checkbox-group>
          <!-- <a-button :disabled="custAttr.length == 0" @click="attrVisible = true" type="primary"
            style="margin-left: 10px" v-if="requiredList.length !== 0 || themeBtns.length !== 0">添加自定义变种属性</a-button> -->
        </div>
        <a-table bordered :columns="filteredHeaderList" :data-source="tableData" :pagination="false"
          :scroll="{ x: 2000 }">
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'sellerSKU'">
              <span><span style="color: #ff0a37">*</span> {{ column.title }}</span><a class="ml-1.25"
                @click="batchSKU">批量</a>
            </template>
            <template v-if="column.dataIndex === 'price'">
              <span><span style="color: #ff0a37">*</span> {{ column.title }}</span><a class="ml-1.25"
                @click="batchPrice">批量</a>
            </template>
            <template v-if="column.dataIndex === 'oldPrice'">
              <span><span style="color: #ff0a37">*</span> {{ column.title }}</span><a class="ml-1.25"
                @click="batcholdPricebatchPrice">批量</a>
            </template>
            <template v-if="column.dataIndex === 'quantity'">
              <span><span style="color: #ff0a37">*</span> {{ column.title }}</span><a class="ml-1.25"
                @click="batchStock('all')">批量</a>
            </template>
            <template v-if="column.dataIndex === 'packageLength'">
              <span><span style="color: #ff0a37">*</span>
                {{ column.title }}(mm)</span><a class="ml-1.25" @click="batchPackLength">批量</a>
            </template>
          </template>
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'colorImg'">
              <a-image v-if="record.colorImg.length > 0" style="position: relative" :width="100"
                :src="record.colorImg[0].url" />
              <div v-if="record.colorImg.length > 0" style="position: absolute; top: 5px; right: 5px">
                <AsyncIcon icon="CloseCircleOutlined" size="20px" color="black" @click="record.colorImg = []" />
              </div>
              <a-upload name="file" v-if="record.colorImg.length == 0" class="h-20 w-20 headerImg" :headers="headers"
                accept=".jpg,.jpeg,.png" :action="uploadUrl" :showUploadList="false" list-type="picture-card"
                @change="(e) => handleChangeColroImg(e, record)" :max-count="1">
                <div>
                  <AsyncIcon icon="PlusOutlined" />
                  <div>上传图片</div>
                </div>
              </a-upload>
            </template>
            <template v-if="column.dataIndex === 'skuTitle'">
              <a-input v-model:value="record.skuTitle" style="min-width: 200px"></a-input>
            </template>
            <template v-if="column.dataIndex === 'secondName'">
              <span>{{ record.secondName }}</span>
            </template>
            <template v-if="column.dataIndex === 'sellerSKU'">
              <a-input v-model:value="record.sellerSKU" style="min-width: 200px"
                @change="sellerSKUChange(record)"></a-input>
            </template>
            <template v-if="!otherHeader.includes(column.dataIndex)">
              <a-input v-if="column.selectType === 'input'" v-model:value="record[column.dataIndex]"
                style="min-width: 200px"></a-input>
              <a-select v-if="column.selectType === 'select'" v-model:value="record[column.dataIndex]"
                style="min-width: 200px" :options="column.options"></a-select>
              <a-select v-if="column.selectType === 'multSelect'" :maxTagCount="2"
                v-model:value="record[column.dataIndex]" style="min-width: 200px" :options="column.options"
                mode="tags"></a-select>
            </template>
            <template v-if="column.dataIndex === 'price'">
              <div class="flex">
                <a-input-number style="min-width: 150px" :min="0" :max="99999999" :precision="2"
                  v-model:value="record.price" @blur="judgeMax(record)"></a-input-number>
                <AsyncIcon icon="CopyOutlined" @click="applyAllValues(record.price, 'price')"
                  class="ml-2.5 cursor-pointer" size="15px"></AsyncIcon>
              </div>
            </template>
            <template v-if="column.dataIndex === 'oldPrice'">
              <div class="flex">
                <a-input-number style="min-width: 150px" :min="0" :max="99999999" v-model:value="record.oldPrice"
                  :precision="2" @blur="judgeMax(record)"></a-input-number>
                <AsyncIcon icon="CopyOutlined" @click="applyAllValues(record.oldPrice, 'oldPrice')"
                  class="ml-2.5 cursor-pointer" size="15px"></AsyncIcon>
              </div>
            </template>
            <template v-if="column.dataIndex === 'quantity'">
              <div class="flex">
                <span>{{
                  record.quantity === undefined ? 0 : record.quantity
                }}</span>
                <AsyncIcon icon="EditOutlined" @click="batchStock('single', record)"></AsyncIcon>
              </div>
            </template>
            <template v-if="column.dataIndex === 'packageLength'">
              <div class="flex justify-center">
                <div>
                  <div style="display: flex">
                    <div class="w-13 block">长度：</div>
                    <a-input-number controls-position="right" :min="0" style="min-width: 150px"
                      v-model:value="record.packageLength" placeholder="长度">
                      <template #addonAfter>mm</template>
                    </a-input-number>
                  </div>
                  <div style="display: flex; margin-top: 5px">
                    <div class="w-13 block">宽度：</div>
                    <a-input-number controls-position="right" :min="0" style="min-width: 150px"
                      v-model:value="record.packageWidth" placeholder="宽度">
                      <template #addonAfter>mm</template>
                    </a-input-number>
                  </div>
                  <div style="display: flex; margin-top: 5px">
                    <div class="w-13 block">高度：</div>
                    <a-input-number controls-position="right" :min="0" style="min-width: 150px"
                      v-model:value="record.packageHeight" placeholder="高度">
                      <template #addonAfter>mm</template>
                    </a-input-number>
                  </div>
                  <div style="display: flex; margin-top: 5px">
                    <div class="w-13 block">重量：</div>
                    <a-input-number controls-position="right" :precision="0" :min="0" style="min-width: 150px"
                      v-model:value="record.packageWeight" placeholder="重量">
                      <!-- @blur="handleInput(record.packageWeight, record)" -->
                      <template #addonAfter>g</template>
                    </a-input-number>
                  </div>
                </div>
                <div class="flex">
                  <AsyncIcon icon="CopyOutlined" @click="applyAllSize(record)" class="ml-2.5 cursor-pointer"
                    size="15px">
                  </AsyncIcon>
                </div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'options'">
              <div>
                <a-popconfirm title="确定要删除这个SKU吗？" @confirm="deleteVariable(record, index)">
                  <a-button v-if="tableData.length != 1" type="text" danger>删除</a-button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </a-card>
      <a-card title="变种图片" class="text-left mx-50 mt-5">
        <div>
          <div v-for="item in tableData" :key="item.id">
            <div v-if="tableData.length > 0">
              <a-card class="mb-2.5 ml-2.5">
                <div>
                  <a-tag color="warning">！说明</a-tag>
                  <span style="color: #9fa0a2">
                    第一张图片默认为主图，点击图片拖动，即可调整图片顺序！
                    单张不超过2M，只支持jpg、.png、.jpeg格式；普通分类图片尺寸为200*200-4320*7680，服装、鞋靴和饰品类目-最低分辨率为900*1200，建议纵横比为3：4；服装、鞋靴和配饰类目，背景应为灰色(#f2f3f5)</span>
                </div>

                <!-- <span v-if="item.imageUrl" class="block mt-2.5">{{ item.imageUrl.length
                                }}/30</span> -->
                <SkuDragUpload v-model:file-list="item.imageUrl" :maxCount="30" :showUploadList="false"
                  accept=".jpg,.png" :api="uploadImage" :waterList="watermark">
                  <template #default>
                    <div flex flex-col w-full justify-start mb-4px text-left>
                      <p>
                        <a-tag color="#00AEB3">说明！</a-tag>
                        <span class="text-#999"> 第一张图片默认为主图，点击图片拖动，即可调整图片顺序。只能对本地上传的图片进行添加水印和修改尺寸
                        </span>
                      </p>
                    </div>
                  </template>
                  <template #variantInfo>
                    <!-- <div v-if="lazadaAttrsState.selectTheme.length === 1">
                                            {{ variantInfo(item) }}
                                        </div>
                                        <div text-left v-if="lazadaAttrsState.selectTheme.length === 2">
                                            <p pb-1px mb-0> {{ variantInfo(item) }} </p>
                                            <p> {{ variantInfoTwo(item) }} </p>
                                        </div> -->
                  </template>
                  <template #skuInfo>
                    {{ `【${item.imageUrl.length}/30】图片 ` }}
                  </template>
                </SkuDragUpload>


              </a-card>
            </div>
          </div>
        </div>
      </a-card>
    </a-card>
    <!-- 修改库存 -->
    <EditProdQuantity @backQuantity="backQuantity" :editQuantityVis="editQuantityVis" :editStockList="editStockList"
      @backCloseQuantity="editQuantityVis = false"></EditProdQuantity>
    <!-- 批量修改 -->
    <batchEditModal :batchOpen="batchOpen" :batchTitle="batchTitle" :batchType="batchType"
      @batchEditModalClose="batchOpen = false" @backValue="backValue"></batchEditModal>
    <!-- 选择自定义属性  -->
    <SelectAttr @selectAttrList="selectAttrList" :attrVisible="attrVisible" :custAttr="custAttr"
      :newAttribute="newAttribute" @handleStatsModalClose="attrVisible = false"></SelectAttr>
  </div>
</template>

<script setup name="OzonNewVariantInfo">
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message, Modal } from "ant-design-vue";
import EditProdQuantity from "../../productPublish/comm/EditProdQuantity.vue";
import dragUpload from "../../productPublish/comm/dragUpload.vue";
import {
  scaleApi,
  watermarkListApi,
  watermarkApi,
} from "~/api/common/water-mark";
import { productWarehouse } from "../../config/api/product";
import SelectAttr from "../../productPublish/comm/SelectAttr.vue";
import { useOzonProductStore } from "~@/stores/ozon-product";
import batchEditModal from "~/pages/ozon/config/component/batchEditModal/index.vue";
import {
  updatePrice,
  endResult,
  processAttributesCache,
  reorderArray,
  cartesianProduct,
  processResult,
  processData,
  checkSellerSKU,
  hasDuplicateModelValues,
  checkData,
  rearrangeColorFields,
  handleTheme,
  processImageSource,
} from "../../config/commJs/index";
import { publishHead, otherList } from "../../config/tabColumns/skuHead";
import { uploadImage } from '@/pages/ozon/config/api/draft';
import SkuDragUpload from '@/components/skuDragUpload/index.vue';
import { debounce } from "lodash";



const props = defineProps({
  categoryAttributesLoading: Boolean,
  productDetail: Object,
  shopCode: String,
});
const themeList = ref([]); //主题数据
const themeBtns = ref([]); //主题按钮
const requiredList = ref([]); //必填变种主题
const attributeList = ref([]); //变种主题卡片
const colorAttributeList = ref([]); //带颜色名称的变种主题卡片
const tableData = ref([]);
const watermark = ref([]);
const watermarkValue = ref("");
const cropWidth = ref(800);
const cropHeight = ref(800);
const editQuantityVis = ref(false);
const selectAll = ref(false);
const batchOpen = ref(false);
const batchTitle = ref("");
const batchType = ref("");
const currentNumber = ref(0);
const headerList = ref([]); //动态表头
// const imgHeaderList = ref([]);
const addHeaderList = ref([]);
const requireColumns = ref([]);
const imageList = ref([]);
const quantityRow = ref({});
const types = ref("");
const editStockList = ref([]);
const attrVisible = ref(false);
const newAttribute = ref([]);
const custAttr = ref([]); //可控制属性
const plainOptions = [
  {
    label: "颜色样本",
    value: "colorImg",
  },
  {
    label: "设置SKU标题",
    value: "skuTitle",
  },
];
const otherHeader = otherList;
let isConform = false;
const headers = {
  Authorization: "Bearer " + useAuthorization().value,
};
const uploadUrl =
  import.meta.env.VITE_APP_BASE_API +
  "/platform-ozon/platform/ozon/file/upload/img";

const handleChangeColroImg = (info, record) => {
  if (info.file.status === "done") {
    record.colorImg.push({
      name: info.file.response.originalFilename,
      url: "/prod-api" + info.file.response.url,
      checked: false,
      width: info.file.response.width,
      height: info.file.response.height,
    });
  }
  if (info.file.status === "error") {
    message.error("图片上传有误！");
  }
};

// 添加自定义属性
const selectAttrList = (list) => {
  newAttribute.value = list;
  const namesInA = list.map((item) => item.name);
  // 删除重复元素
  if (list.length === 0) {
    headerList.value = headerList.value.filter((item) => !(item.type === 3));
  } else {
    headerList.value = headerList.value.filter(
      (item) =>
        item.type !== 3 || (item.type === 3 && namesInA.includes(item.title))
    );
  }
  let obj = {};
  // 再添加新的不重复元素
  list.forEach((item) => {
    if (!headerList.value.find((obj) => obj.title === item.name)) {
      obj = {
        title: item.name,
        dataIndex: item.name,
        selectType: item.selectType,
        type: 3,
        options: item.options,
        show: true,
        align: "center",
      };
      const index = headerList.value.findIndex(
        (item) => item.dataIndex === "sellerSKU"
      );
      headerList.value.splice(index + 1, 0, obj);
    }
  });
  const displayAttr = useOzonProductStore().attributes;
  const idMap = new Map();
  list.forEach((item) => {
    idMap.set(item.id, true);
  });

  displayAttr.forEach((item) => {
    item.show = idMap.has(item.id) ? false : true;
  });
};

// 批量应用字段值
const applyAllValues = (fields, fieldName) => {
  tableData.value.forEach((item) => {
    item[fieldName] = fields;
  });
};
// 批量应用尺寸值
const applyAllSize = (row) => {
  tableData.value.forEach((item) => {
    item.packageLength = row.packageLength;
    item.packageWidth = row.packageWidth;
    item.packageHeight = row.packageHeight;
    item.packageWeight = row.packageWeight;
  });
};

const filteredHeaderList = computed(() => {
  return headerList.value.filter((item) => item.show === true);
});

// 处理数据格式
const processDataFormat = (list = []) => {
  let newHeaderList = handleTheme(list);
  const insertIndex = headerList.value.length - 6;
  for (let i = list.length - 1; i >= 0; i--) {
    // reversedArray.push(originalArray[i]);
    headerList.value.splice(insertIndex, 0, {
      dataIndex: list[i].name,
      id: list[i].id,
      title: list[i].name,
      show: true,
      align: "center",
    });
    // imgHeaderList.value.push({
    //   title: list[i].name,
    // });
  }
  attributeList.value = [...attributeList.value, ...newHeaderList];
};

// 手动添加多个变种主题
const enterVariantType = (item) => {
  let arr = [];
  if (isConform && item.id === 10096) {
    arr = [
      {
        ...item,
      },
      {
        selectType: "input",
        id: 10097,
        isAspect: true,
        isCollection: false,
        isRequired: false,
        name: "颜色名称(Название цвета)",
        isAspect: true,
        isCollection: false,
        isRequired: false,
      },
    ];
  } else {
    arr.push(item);
  }
  processDataFormat(arr);
  for (let i = 0; i < themeBtns.value.length; i++) {
    if (themeBtns.value[i].id === item.id) {
      themeBtns.value.splice(i, 1);
      break;
    }
  }
};
// 移除主题操作
const removeVariantType = (item, index) => {
  attributeList.value.splice(index, 1);
  // imgHeaderList.value.splice(index, 1);
  let name = item.tableData[0].name
  let secondName = item.tableData[0].secondName

  // 表头删除
  headerList.value = headerList.value.filter((e) => e.title != item.title);
  if (secondName) {
    headerList.value = headerList.value.filter((e) => e.title != secondName);
  }

  let newThem = {
    options: item.details,
    show: false,
    selectType: item.selectType,
    id: item.id,
    isRequired: item.isRequired,
    categoryDependent: item.categoryDependent,
    isCollection: item.isCollection,
    name: item.name,
    isAspect: item.isAspect,
  }
  themeBtns.value.unshift(newThem);

  /** 移除变种主题后需要重新生成变种信息 table 数据 */
  let cartesianProducts = cartesianProduct(attributeList.value);
  let newTableData = processResult(cartesianProducts);
  tableData.value = newTableData;
};
// 添加多个属性操作
const addItem = (item, row) => {
  let ele = {};
  if (isConform && item.id === 10096) {
    ele = {
      id: item.id,
      name: item.name,
      modelValue: item.selectType === "multSelect" ? [] : undefined,
      selectType: item.selectType,
      details: item.details,
      secondName: "颜色名称(Название цвета)",
      "颜色名称(Название цвета)": "颜色名称(Название цвета)",
      secondId: 10097,
      secondModelValue: "",
    };
  } else if (isConform && item.id === 4295) {
    ele = {
      id: item.id,
      name: item.name,
      modelValue: item.selectType === "multSelect" ? [] : undefined,
      selectType: item.selectType,
      details: item.details,
      secondName: "由制造商规定尺码(Размер производителя)",
      "由制造商规定尺码(Размер производителя)": "由制造商规定尺码(Размер производителя)",
      secondId: 9533,
      secondModelValue: "",
    };
  } else {
    ele = {
      id: Date.now(),
      name: item.name,
      modelValue: item.selectType === "multSelect" ? [] : undefined,
      selectType: item.selectType,
      details: item.details,
    };
  }
  row.tableData.push(ele);
};

// 移除多个属性操作
const removeItem = (item, row) => {
  let ind = row.tableData.indexOf(item);
  if (item.id === 10096 || item.name == "商品颜色(Цвет товара)") {
    row.tableData.splice(ind, 1);
  } else if (item.id === 4295 || item.name == "俄罗斯尺码") {
    row.tableData.splice(ind, 1);
  } else {
    if (item.selectType === "select" || item.selectType === "input") {
      row.tableData = row.tableData.filter(tableItem =>
        tableItem.id !== item.id
      );
    } else {
      // 获取需要排除的ID集合
      const excludeIds = item.modelValue.map(mv => mv.id); // [971918068]
      // 过滤掉包含这些ID的项
      row.tableData = row.tableData.filter(tableItem => {
        // 检查当前项的modelValue是否包含排除ID
        return !tableItem.modelValue.some(mv => excludeIds.includes(mv.id));
      });
    }
  }

  // 获取所有需要删除的标签
  const deletedLabels = item.selectType === 'multSelect'
    ? item.modelValue.map(v => v.label)
    : [];
  let newData = tableData.value.filter(row => {
    // 检查行数据是否包含要删除的属性值
    return !Object.values(row).some(value => {
      if (item.selectType === 'multSelect') {
        // 统一处理数组和字符串类型的值
        const currentValues = Array.isArray(value)
          ? value.map(v => v?.label || '')
          : String(value || '').split(',');
        return currentValues.some(v => deletedLabels.includes(v));
      }
      return item.selectType === 'input' ? row.attrIdList.includes(item.id)
        : item.selectType === 'select' ? value === item?.modelValue?.label
          : false;
    });
  });

  tableData.value = newData;
};

// 将根据主题中选择的数据进行添加到表格中
const pushValue = (index, item) => {
  let flag = hasDuplicateModelValues(attributeList.value);
  if (flag) {
    message.error("变种属性值不能有相同的，请修改");
    return;
  }
  // 处理表格数据
  let cartesianProducts = cartesianProduct(attributeList.value);
  let newTableData = processResult(cartesianProducts);

  let minLength = Math.min(newTableData.length, tableData.value.length);
  for (let i = 0; i < minLength; i++) {
    // 将b数组中对应下标的数据赋值到a数组中
    newTableData[i].skuTitle = tableData.value[i].skuTitle;
    newTableData[i].sellerSKU = tableData.value[i].sellerSKU;
    newTableData[i].price = tableData.value[i].price;
    newTableData[i].oldPrice = tableData.value[i].oldPrice;
    newTableData[i].colorImg = tableData.value[i].colorImg;
    newTableData[i].imageUrl = tableData.value[i].imageUrl;
    newTableData[i].quantity = tableData.value[i].quantity;
    newTableData[i].warehouseList = tableData.value[i].warehouseList;
    newTableData[i].packageHeight = tableData.value[i].packageHeight;
    newTableData[i].packageLength = tableData.value[i].packageLength;
    newTableData[i].packageWidth = tableData.value[i].packageWidth;
    newTableData[i].packageWeight = tableData.value[i].packageWeight;
  }
  tableData.value = newTableData;
};

// 动态添加表头数据
const changeHeade = () => {
  //  删除重复元素
  headerList.value = headerList.value.filter(
    (item) =>
      item.type !== 1 ||
      (item.type == 1 && addHeaderList.value.includes(item.dataIndex))
  );
  let obj = {};
  // 再添加新的不重复元素
  addHeaderList.value.forEach((item) => {
    if (!headerList.value.find((obj) => obj.dataIndex === item)) {
      obj = {
        dataIndex: item,
        title: item == "colorImg" ? "颜色样本" : "SKU标题",
        selectType: item == "colorImg" ? "url" : "input",
        type: 1,
        options: null,
        show: true,
        align: "center",
      };
      if (item == "colorImg") {
        headerList.value.unshift(obj);
      } else if (item == "skuTitle") {
        let skuIndex = headerList.value.findIndex(
          (item) => item.title === "SKU"
        );
        headerList.value.splice(skuIndex + 1, 0, obj);
      } else {
        headerList.value.push(obj);
      }
    }
  });

  const ozonStore = useOzonProductStore()
  ozonStore.$patch(state => {
    state.addHeaderList = addHeaderList.value
  })
};

// 删除表格数据
const deleteVariable = (row, index) => {
  tableData.value.splice(index, 1);
  attributeList.value = processData(attributeList.value, tableData.value);
};

// 批量修改售价
const batchPrice = () => {
  if (tableData.value.length == 0) {
    message.warning("请先添加sku！");
    return;
  }
  batchOpen.value = true;
  batchTitle.value = "批量修改售价";
  batchType.value = "price";
};
// 批量修改SKU
const batchSKU = () => {
  if (tableData.value.length == 0) {
    message.warning("请先添加sku！");
    return;
  }
  batchOpen.value = true;
  batchTitle.value = "批量修改SKU";
  batchType.value = "sku";
};
// 批量修改SKU标题
const batchSkuTitle = () => {
  if (tableData.value.length == 0) {
    message.warning("请先添加sku！");
    return;
  }
  batchOpen.value = true;
  batchTitle.value = "批量修改SKU标题";
  batchType.value = "skuTitle";
}
// 修改 SKU 时同步修改 warehouseList 里的 offerId
const sellerSKUChange = debounce(record => {
  record.warehouseList.forEach(item => {
    item.offerId = record.sellerSKU
  })
}, 200)

// 批量修改库存
const batchStock = (type, row = {}) => {
  if (tableData.value.length == 0) {
    message.warning("请先添加sku！");
    return;
  }
  getEditStore(props.shopCode);
  quantityRow.value = row;
  editQuantityVis.value = true;
  types.value = type;
};

//修改库存
const backQuantity = (quantities, copyList) => {
  // 生成仓库条目函数（过滤空值并映射结构）
  const createWarehouseEntries = (offerId, copyList) =>
    copyList[0].children
      .filter((item) => item.stock != null && item.stock !== "")
      .map((item) => ({
        offerId,
        warehouseId: item.warehouseId,
        present: item.stock,
        warehouseName: item.name,
      }));

  // 按仓库ID去重函数
  const deduplicateByWarehouseId = (entries) =>
    Array.from(
      new Map(entries.map((item) => [item.warehouseId, item])).values()
    );

  if (types.value === "single") {
    // 单规格模式
    quantityRow.value.quantity = quantities;
    quantityRow.value.warehouseList = createWarehouseEntries(
      quantityRow.value.sellerSKU,
      copyList
    );
  } else {
    // 多规格模式
    tableData.value.forEach((e) => {
      e.quantity = quantities;
      const entries = createWarehouseEntries(e.sellerSKU, copyList);
      e.warehouseList = deduplicateByWarehouseId(entries);
    });
  }
};

//批量修改原价
const batcholdPricebatchPrice = () => {
  if (tableData.value.length == 0) {
    message.warning("请先添加sku！");
    return;
  }
  batchOpen.value = true;
  batchTitle.value = "批量修改原价";
  batchType.value = "oldPrice";
};

const batchPackLength = () => {
  if (tableData.value.length == 0) {
    message.warning("请先添加sku！");
    return;
  }
  batchOpen.value = true;
  batchTitle.value = "批量修改尺寸";
  batchType.value = "packLength";
};

const backValue = (batchFields) => {
  switch (batchType.value) {
    case "sku":
      tableData.value.forEach((item) => {
        item.sellerSKU = batchFields.batchValue;

        item.warehouseList.forEach(warehouse => {
          warehouse.offerId = item.sellerSKU
        })
      });
      break;
    case "skuTitle":
      tableData.value.forEach((item) => {
        item.skuTitle = batchFields.batchValue;
      });
      break;
    case "price":
      updatePrice(tableData.value, "price", batchFields);
      break;
    case "oldPrice":
      updatePrice(tableData.value, "oldPrice", batchFields);
      break;
    case "packLength":
      tableData.value.forEach((item) => {
        Object.assign(item, batchFields.packageSize);
      });
      break;
    default:
      break;
  }
  batchOpen.value = false;
};

const getEditStore = (account) => {
  let params = {
    account: [account],
  };
  productWarehouse(params).then((res) => {
    editStockList.value =
      res?.data?.map((item) => {
        return {
          account: item.account,
          simpleName: item.simpleName,
          children: item.children,
          allStock: "",
        };
      }) || [];
  });
};

// 获取水印列表
const getWatermark = () => {
  watermarkListApi().then((res) => {
    watermark.value = res.data;
  });
};

const judgeMax = (item) => {
  const { price, oldPrice } = item;
  // 检查 price 和 oldPrice 是否为空或 null
  if (price == null || oldPrice == null) {
    return; // 如果有一个为空或 null，直接返回，不做后续比较
  }
  // 确保 price 和 oldPrice 是有效的数字
  const parsedPrice = parseFloat(price);
  const parsedOldPrice = parseFloat(oldPrice);
  if (isNaN(parsedPrice) || isNaN(parsedOldPrice)) {
    return; // 如果转换后不是有效的数字，直接返回
  }

  if (parsedPrice > parsedOldPrice) {
    Modal.error({
      title: "错误提示",
      content: "售价不能大于原价！",
    });
  }
};

// 变种主题中是组合在一起的主题
const dependencyMap = new Map([
  [10096, 10097], // 商品颜色和颜色名称
  [4295, 9533], // 俄罗斯尺码和制造商尺码
]);

watch(
  () => useOzonProductStore().attributes,
  (val) => {
    if (val) {
      themeBtns.value = [];
      requiredList.value = [];
      attributeList.value = [];
      tableData.value = [];
      // imgHeaderList.value = [];
      addHeaderList.value = []; //清空自定义变种信息
      headerList.value = [...publishHead]; //重新赋值
      let editRes = [];
      // 提取变种主题
      let arr = val.filter((obj) => obj.isAspect);
      isConform = checkData(arr);
      const requiredItem = arr.some((item) => item.isRequired === true);
      let sortArr = rearrangeColorFields(arr);
      //判断主题中是否有颜色名称，且商品颜色是不是必填项
      if (requiredItem) {
        if (isConform) {
          requiredList.value = arr.filter((obj) => obj.isRequired);
          // 将arr转换为ID索引对象，提高查找效率
          const arrById = arr.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {});
          // 检查并添加依赖项
          dependencyMap.forEach((addId, targetId) => {
            // 检查目标ID是否存在
            if (requiredList.value.some((item) => item.id === targetId)) {
              // 获取要添加的对象
              const itemToAdd = arrById[addId];
              // 检查是否已存在且对象存在
              if (
                itemToAdd &&
                !requiredList.value.some((item) => item.id === addId)
              ) {
                requiredList.value.push(itemToAdd);
              }
            }
          });
          // if (requiredList.value.some(item => (item.id === 10096))) {
          //     requiredList.value.push(arr.find(obj => obj.id === 10097))
          // }
          themeBtns.value = arr.filter(
            (obj) => !(obj.isRequired || obj.id === 10097 || obj.id === 9533) //obj.id === 9533
          );
          requiredList.value = reorderArray(requiredList.value);
        } else {
          requiredList.value = arr.filter((obj) => obj.isRequired);
        }
      } else {
        if (isConform) {
          themeBtns.value = arr.filter(
            (obj) => !(obj.isRequired || obj.id === 10097)
          );
        } else {
          themeBtns.value = arr.filter((obj) => !obj.isRequired);
        }
      }

      const { skuList } = props.productDetail;
      const newAttributesCache = processAttributesCache(val);
      const list = newAttributesCache.filter((a) => !a.isRequired);
      custAttr.value = list.filter(
        (a) =>
          !(a.isAspect && !a.isRequired) &&
          !(a.isAspect && a.isCollection) &&
          !(
            a.id === 4080 ||
            a.id == 8229 ||
            a.id == 8789 ||
            a.id == 8790 ||
            a.id == 4180 ||
            a.id == 4191 ||
            a.id == 11254 ||
            a.id == 9024
          ) &&
          !(
            a.attributeComplexId == "100001" || a.attributeComplexId == "100002"
          )
      );
      if (requiredList.value.length != 0) {
        processDataFormat(requiredList.value);
      }
      let result = [];
      let attrHeaderList = [];
      // 遍历b中的skuList
      skuList.forEach((sku) => {
        let newItem = {
          oldPrice: sku.oldPrice,
          price: sku.price,
          quantity: sku.stock,
          packageHeight: sku.height,
          packageLength: sku.depth,
          packageWeight: sku.weight,
          packageWidth: sku.width,
          colorImg: sku?.colorImage
            ? [
              {
                url: processImageSource(sku.colorImage),
                name: sku.colorImage.split("/").pop(),
              },
            ]
            : [],
          warehouseList: sku?.warehouseList?.map((item) => {
            return {
              ...item,
              offerId: sku.offerId,
            };
          }),
          sellerSKU: sku.offerId,
          imageUrl:
            sku.images?.map((item) => {
              return {
                url: processImageSource(item),
                checked: false,
              };
            }) ?? [],
        };

        // 遍历a数组
        sortArr.forEach((attr) => {
          // 遍历sku的attributes中的每个attributes
          sku.attributes.forEach((subAttr) => {
            if (subAttr.id == attr.id) {
              if (attr.selectType === "multSelect" && attr.options) {
                let values = subAttr.values.map((val) => {
                  let option = attr.options.find(
                    (opt) => opt.id == val.dictionaryValueId
                  );
                  return option ? option.value : val.value;
                });
                newItem[attr.name] = values.join(", ");
              } else if (attr.selectType === "select" && attr.options) {
                let values = subAttr.values.map((val) => {
                  let option = attr.options.find(
                    (opt) => opt.id == val.dictionaryValueId
                  );
                  return option ? option.value : val.value;
                });
                newItem[attr.name] = values.join(", ");
              } else {
                newItem[attr.name] = subAttr.values[0].value;
              }
              attrHeaderList.push({
                title: attr.name,
                dataIndex: attr.name,
                id: attr.id,
                show: true,
                align: "center",
              });
            }
          });
        });

        result.push(newItem);
      });
      // 处理数据回显到表格
      attrHeaderList = [
        ...new Map(
          attrHeaderList.map((item) => [item.dataIndex, item])
        ).values(),
      ];
      const uniqueArr = [];
      const titleSet = new Set();
      [...attrHeaderList, ...headerList.value].forEach((item) => {
        if (!titleSet.has(item.title)) {
          titleSet.add(item.title);
          uniqueArr.push(item);
        }
      });

      headerList.value = uniqueArr; //表格主题标题赋值
      // imgHeaderList.value = attrHeaderList; //图片标题赋值
      if (result.some((item) => item.colorImg.length !== 0)) {
        headerList.value.unshift({
          title: "颜色样本",
          dataIndex: "colorImg",
          selectType: "url",
          type: 1,
          show: true,
          align: "center",
        });
        addHeaderList.value.push("colorImg");
      }
      if (result.some(item => item.skuTitle !== null && item.skuTitle !== '') && result.length > 1) {
        let skuIndex = headerList.value.findIndex(item => item.title === 'SKU')
        let obj = {
          title: 'SKU标题',
          dataIndex: 'skuTitle',
          selectType: 'input',
          type: 1,
          options: null,
          show: true,
          align: 'center'
        }
        headerList.value.splice(skuIndex + 1, 0, obj)
        addHeaderList.value.push('skuTitle')
        const ozonStore = useOzonProductStore()
        ozonStore.$patch(state => {
          state.addHeaderList = addHeaderList.value
        })
      }
      tableData.value = result;
      // 将不匹配的主题过滤掉
      let comAttrList = [10096, 4295];
      let comAttrs = [10096, 10097];
      // 从数组 a 中提取所有的 id
      const idsInA = sortArr.map((item) => item.id);
      // 使用 every 方法检查 comAttrList 中的每个元素是否都在 idsInA 中
      const isAllMatched = comAttrList.every((id) => idsInA.includes(id)); //双组合主题
      const isAllMatche = comAttrs.some((id) => idsInA.includes(id)); //单组合主题
      let filteredB = sortArr.filter((itemB) =>
        uniqueArr.some((itemA) => itemA.id === itemB.id)
      );
      let echoThemeList = [];
      let isModelValueList = [];
      // 判断sortArr中是否有组合数据
      // if (isAllMatched) {
      //   echoThemeList = handleTheme(sortArr); //handleTheme方法可以将属性转换成主题数据格式
      // } else if (isAllMatche) {
      //   echoThemeList = handleTheme(filteredB);
      // } else {
      //   isModelValueList = filterModelValues(sortArr, skuList);
      //   echoThemeList = handleTheme(isModelValueList);
      // }
      if (isAllMatched || isAllMatche) {
        echoThemeList = handleTheme(filteredB); //handleTheme方法可以将属性转换成主题数据格式
      } else {
        isModelValueList = filterModelValues(sortArr, skuList);
        echoThemeList = handleTheme(isModelValueList);
      }
      // 处理到数据回显到主题
      const aIds = echoThemeList.map((item) => item.id);
      // 过滤 有数据的主题
      themeBtns.value = themeBtns.value.filter(
        (item) => !aIds.includes(item.id)
      );
      attributeList.value = matchAndAssignValues(echoThemeList, skuList);
    }
  }
);

const filterModelValues = (a, b) => {
  const allAttributeIds = b.flatMap((item) =>
    item.attributes.map((attr) => attr.id)
  );
  // 过滤 sortArr 中匹配不上的项
  const filteredSortArr = a.filter((item) => allAttributeIds.includes(item.id));
  return filteredSortArr;
};

const matchAndAssignValues = (a, b) => {
  // 遍历 a 数组的每个配置项
  return a.map((aItem) => {
    const isThemeData = checkThemeData(aItem.tableData);
    const newTableData = b.map((bItem) => {
      const tableDataTemplate = JSON.parse(JSON.stringify(aItem.tableData[0]));
      const attributeId = tableDataTemplate.id;
      const matchedAttribute = bItem.attributes.find(
        (attr) => attr.id === attributeId
      );
      const secondAttr = bItem.attributes.find(
        (attr) => attr.id === tableDataTemplate?.secondId
      );
      return processTableDataItem(
        tableDataTemplate,
        matchedAttribute,
        secondAttr,
        isThemeData
      );
    });
    aItem.tableData = deduplicateTableData(newTableData, isThemeData);
    return aItem;
  });
};

// 对数组中的对象按指定属性去重
const removeDuplicatesByProperty = (arr, property) => {
  return arr.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t[property] === value[property])
  );
};

// 检查两个数组是否内容相同
const isArrayContentEqual = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

// 处理单个 tableData 项
const processTableDataItem = (
  tableDataTemplate,
  matchedAttribute,
  secondAttr,
  isThemeData
) => {
  if (isThemeData) {
    if (matchedAttribute) {
      tableDataTemplate.modelValue = tableDataTemplate.details.filter(
        (itemA) => {
          return matchedAttribute.values.some((itemB) => {
            return itemA.id === itemB.dictionaryValueId;
          });
        }
      );
      tableDataTemplate.modelValue = removeDuplicatesByProperty(
        tableDataTemplate.modelValue,
        "id"
      );
    }
    if (secondAttr) {
      tableDataTemplate.secondModelValue = secondAttr.values[0].value;
    }
  } else {
    if (tableDataTemplate.selectType === "input") {
      if (matchedAttribute) {
        tableDataTemplate.modelValue = matchedAttribute.values[0].value;
      }
    } else if (tableDataTemplate.selectType === "select") {
      if (matchedAttribute) {
        let themIds = matchedAttribute.values.map(
          (item) => item.dictionaryValueId
        );
        const matchedValues = tableDataTemplate.details.filter((item) =>
          themIds.includes(item.id)
        );
        tableDataTemplate.modelValue = {
          label: matchedValues[0]?.label,
          value: matchedValues[0]?.id,
        };
      }
    } else {
      if (matchedAttribute) {
        let themIds = matchedAttribute.values.map(
          (item) => item.dictionaryValueId
        );
        const matchedValues = tableDataTemplate.details.filter((item) =>
          themIds.includes(item.id)
        );
        // removeDuplicatesByProperty 去重方法
        const uniqueMatchedValues = removeDuplicatesByProperty(
          matchedValues,
          "value"
        );
        tableDataTemplate.modelValue = uniqueMatchedValues;
      }
    }
  }
  return tableDataTemplate;
};

// 对 tableData 进行去重
const deduplicateTableData = (tableData, isThemeData) => {
  if (isThemeData) {
    return tableData.filter((item, index, self) => {
      return !self.some((uniqueItem, uniqueIndex) => {
        return (
          uniqueIndex < index &&
          uniqueItem.secondModelValue === item.secondModelValue &&
          isArrayContentEqual(uniqueItem.modelValue, item.modelValue)
        );
      });
    });
  } else {
    const valueMap = new Map();
    return tableData.filter((item) => {
      const key = JSON.stringify(item.modelValue);
      if (!valueMap.has(key)) {
        valueMap.set(key, true);
        return true;
      }
      return false;
    });
  }
};

const checkThemeData = (data) => {
  const hasColorName = data.some((item) => item.secondId === 10097);
  const hasProductColor = data.some((item) => item.id === 10096);
  const hasName = data.some((item) => item.secondId === 9533);
  const hasColor = data.some((item) => item.id === 4295);
  return (hasColorName && hasProductColor) || (hasName && hasColor);
};
// 判断是否有俄罗斯尺码和制造商尺码
const checkOtherData = (data) => {
  const hasColorName = data.some((item) => item.secondId === 9533);
  const hasProductColor = data.some((item) => item.id === 4295);

  return hasColorName && hasProductColor;
};

const submitForm = () => {
  // 参数校验
  if (tableData.value.length === 0) {
    message.error("请编辑SKU信息！");
    return false;
  }
  // sku校验
  const result = checkSellerSKU(tableData.value);
  if (result) {
    message.error("SKU ID不能相同!");
    return false;
  }
  for (let i = 0; i < attributeList.value.length; i++) {
    for (let j = 0; j < attributeList.value[i].tableData.length; j++) {
      const row = attributeList.value[i].tableData[j];

      if (!validateRow(row)) {
        message.error("请填写变种主题！");
        return false;
      }
    }
  }
  const isEmpty = (value) => value == null || value === "" || value === 0;

  const validations = [
    { check: (row) => row.imageUrl == null, text: "请上传变体图片！" },
    {
      check: (row) => row.imageUrl.length === 0,
      text: "请上传变体图片，变体图片最少一张！",
    },
    { check: (row) => isEmpty(row.sellerSKU), text: "请填写SKU编号！" },
    { check: (row) => isEmpty(row.price), text: "请填写售价！" },
    { check: (row) => isEmpty(row.oldPrice), text: "请填写原价！" },
    { check: (row) => isEmpty(row.quantity), text: "请填写库存！" },
    {
      check: (row) =>
        [
          row.packageHeight,
          row.packageLength,
          row.packageWeight,
          row.packageWidth,
        ].some((v) => v == null),
      message: "请填写SKU包装信息！",
    },
  ];

  for (const row of tableData.value) {
    for (const { check, text } of validations) {
      if (check(row)) {
        message.error(text);
        return false;
      }
    }
  }
  return true;
};

function validateRow(row) {
  if (row.isRequired && row.selectType === "select") {
    return Object.keys(row.modelValue).length > 0;
  } else if (row.isRequired && row.selectType === "multSelect") {
    return row.modelValue && row.modelValue.length > 0;
  } else if (row.selectType === "select") {
    return Object.keys(row.modelValue).length > 0;
  } else {
    return (row.modelValue && row.modelValue.length > 0) || (row.secondModelValue && row.secondModelValue.length > 0);
  }
}

// 抛出数据和方法，可以让父级用ref获取
defineExpose({
  tableData,
  submitForm,
});
onMounted(() => {
  getWatermark();
});
</script>
<style lang="less" scoped>
.headerImg {
  :deep(.ant-upload) {
    width: 80px !important;
    height: 80px !important;
  }
}
</style>
