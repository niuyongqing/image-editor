<template>
  <div id="productDatabase_detailsModal" class="productDatabase_detailsModal">
    <a-modal v-model:open="modalOpen" :style="{ top: '10px', padding: 0, height: '99vh' }"
      :bodyStyle="{ height: 'calc(95vh - 100px)', 'overflow-y': 'auto' }" :title="'产品详情'" :maskClosable="false"
      width="95%">
      <div class="dialog-box">
        <a-descriptions title="基本信息">
          <a-descriptions-item label="产品名称">
            <div v-html="detailData.data.tradeName"></div>
          </a-descriptions-item>
          <a-descriptions-item label="产品类型">
            <a-tag color="success">{{ classify() }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="市场方向">
            <div v-html="devAttributableMarket()"></div>
          </a-descriptions-item>
          <a-descriptions-item label="产品库区" v-if="detailData.data.devAttributableMarket == 3">
            <div v-html="stockAreaTag()"></div>
          </a-descriptions-item>
          <a-descriptions-item label="禁止刊登平台">
            <div style="margin-top: -8px" v-html="devProhibitPlatform()"></div>
          </a-descriptions-item>
        </a-descriptions>
        <a-divider></a-divider>

        <a-descriptions title="价格信息" v-if="price == '1' || roleName == 'admin'">
          <a-descriptions-item label="售价($)">{{ detailData.data.devPrice }}</a-descriptions-item>
          <a-descriptions-item label="预估重量(g)">{{ detailData.data.devWeight }}</a-descriptions-item>
          <a-descriptions-item label="采购成本(￥)">{{ detailData.data.devPrimeCost }}</a-descriptions-item>
          <a-descriptions-item label="预估利润(￥)">{{ detailData.data.devProfit }}</a-descriptions-item>
          <a-descriptions-item label="预估利润率(%)">{{ detailData.data.devProfitMargin }}</a-descriptions-item>
        </a-descriptions>
        <a-divider></a-divider>

        <!-- <a-descriptions title="参考链接">
          <a-descriptions-item label="开发参考链接">
            <a v-for="(item, index) in detailData.data.devConsultLink" :key="index" target="_blank" :href="item"
              style="width:100%">{{ item }}</a>
          </a-descriptions-item>
          <a-descriptions-item label="供应商链接" v-if="vdata == '1' || roleName == 'admin'">
            <a v-for="(item, index) in detailData.data.devSupplierUrl" :key="index" target="_blank" :href="item"
              style="width:100%;">
              {{ item }}
            </a>
          </a-descriptions-item>
        </a-descriptions>
        <a-divider></a-divider> -->

        <a-descriptions title="文案信息">
          <a-descriptions-item label="供应商" v-if="vdata == '1' || roleName == 'admin'">
            {{ detailData.data.meansSupplier }}
          </a-descriptions-item>
          <a-descriptions-item label="shopee禁售属性">
            <div v-for="(item, index) in detailData.data.meansForbidAttribute" :key="index">
              <a-tag style="margin-right: 3px;">{{ getAttrName3(item) }}</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="产品SKU">{{ skuList(detailData.data.skuList) }}</a-descriptions-item>
          <a-descriptions-item label="商品属性">
            <div v-for="(item, index) in detailData.data.meansProductProperties" :key="index">
              <a-tag style="margin-right: 3px;">{{ getAttrName1(item) }}</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="产品编号"> {{ detailData.data.number }} </a-descriptions-item>
          <a-descriptions-item label="品牌">{{ detailData.data.meansBrand }} </a-descriptions-item>
          <a-descriptions-item label="授权截止日期"> {{ detailData.data.meansEmpowerStop }} </a-descriptions-item>
          <a-descriptions-item label="包装材料">{{ detailData.data.meansPackaging }}</a-descriptions-item>
          <a-descriptions-item label="包装重量"> {{ detailData.data.meansPackagingWeight }} </a-descriptions-item>
          <a-descriptions-item label="shopee禁售站点">
            <div v-for="(item, index) in detailData.data.meansForbidSite" :key="index">
              <a-tag>{{ getAttrName4(item) }}</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="仓储类别">
            <div v-for="(item, index) in detailData.data.meansKeepGrain" :key="index">
              <a-tag style="margin-right: 3px;">{{ getAttrName2(item) }}</a-tag>
            </div>
          </a-descriptions-item>
        </a-descriptions>
        <a-divider></a-divider>

        <a-descriptions title="产品描述">
          <a-descriptions-item label="中文产品描述">
            {{ detailData.data.meansChineseDescription }}
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <div>英文产品描述</div>
              <!-- <div><a-button type="link" @click="copyMeansEnglishDescription">复制</a-button></div> -->
            </template>
            <pre v-html="detailData.data.meansEnglishDescription" style="font-family: none; color: #606266"></pre>
          </a-descriptions-item>
        </a-descriptions>
        <a-divider></a-divider>

        <a-descriptions title="备注" :colon="false" v-if="price == '1' || roleName == 'admin'">
          <a-descriptions-item>
            <div v-html="detailData.data.meansRemark"></div>
          </a-descriptions-item>
        </a-descriptions>
        <a-divider></a-divider>

        <a-descriptions title="SKU列表" :colon="false">
          <a-descriptions-item>
            <a-table :columns="columns" :dataSource="detailData.data.sku" :bordered="true"
              :rowKey="record => record.skuNumber" :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'attr'">
                  {{ record.detail.attr }}
                </template>
                <template v-if="column.dataIndex === 'productNo'">
                  {{ record.detail.productNo }}
                </template>
                <template v-if="column.dataIndex === 'describe'">
                  {{ record.detail.describe }}
                </template>
                <template v-if="column.dataIndex === 'cost'">
                  {{ record.detail.cost }}
                </template>
                <template v-if="column.dataIndex === 'weight'">
                  {{ record.detail.weight }}
                </template>
                <template v-if="column.dataIndex === 'sellCount'">
                  {{ record.detail.sellCount }}
                </template>

                <template v-if="column.dataIndex === 'remarks'">
                  <a-select v-model:value="record.detail.remarks" placeholder="" mode="multiple" disabled
                    style="width: 200px;" :options="remarksList"></a-select>
                </template>
              </template>
            </a-table>
          </a-descriptions-item>
        </a-descriptions>
        <a-divider></a-divider>
      </div>
      <template #footer>
        <a-button key="back" type="primary" @click="closeModalFn">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { storeDetail } from '~@/api/common/selectProduct';
import classifyRevert from '~@/utils/classifyRevert';
import devAttributableMarketRevert from '~@/utils/devAttributableMarketRevert';
import devProhibitPlatformRevert from '~@/utils/devProhibitPlatformRevert';
import { devStockAreaTag } from '~@/utils/devStatusTag';
import { productAttr, meansKeepGrains } from '@/utils/devStatusSelect'
import sheepProhibitionSelect from "@/utils/sheepProhibitionSelect";
defineOptions({ name: "productDatabase_detailsModal" })
const { proxy: _this } = getCurrentInstance()
const props = defineProps({
  modalData: {
    type: Object,
    default: () => {}
  }
});
const modalOpen = ref(false);
const detailData = reactive({
  data: [],
  forbidSaleList: [],
  cacheGetArr: [],
  productAttrOptions: productAttr,
  forbidSiteOptions: sheepProhibitionSelect,
  meansKeepGrainOptions: meansKeepGrains,

  oldMeansEnglishDescription: '',
})

const columns = [
  {
    title: 'SKU编码',
    dataIndex: 'skuNumber',
    key: 'skuNumber',
    width: 200,
  },
  {
    title: '型号',
    dataIndex: 'attr',
    key: 'attr',
    width: 200,
  },
  {
    title: '产品编号',
    dataIndex: 'productNo',
    key: 'productNo',
    width: 200,
  },
  {
    title: 'SKU描述',
    dataIndex: 'describe',
    key: 'describe',
    width: 250,
  },
  {
    title: '成本价格',
    dataIndex: 'cost',
    key: 'cost',
    width: 200,
    // customRender: (text, record) => (this.price == '1' || this.roleName == 'admin') ? text : '',
  },
  {
    title: '重量',
    dataIndex: 'weight',
    key: 'weight',
    width: 200,
  },
  {
    title: '30天销量',
    dataIndex: 'sellCount',
    key: 'sellCount',
    width: 200,
    // customRender: (text, record) => (this.sale == '1' || this.roleName == 'admin') ? text : '',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    scopedSlots: { customRender: 'remarks' },
    width: 200,
  },
];
const remarksList = [
  {
    label: '国内仓',
    value: '1'
  },
  {
    label: '菲律宾仓',
    value: '2'
  },
  {
    label: '泰国仓',
    value: '3'
  }
];

const userStore = useUserStore();
const vdata = computed(() => {
  return userStore.userInfo.sysUser.roles[0].vdata;
});
const price = computed(() => {
  return userStore.userInfo.sysUser.roles[0].price;
});
const roleName = computed(() => {
  return userStore.userInfo.roles[0];
});
const sale = computed(() => {
  return userStore.userInfo.sysUser.roles[0].sale;
});
async function modalOpenFn({ id, forbidSaleList, cacheGetArr }) {
  detailData.cacheGetArr = cacheGetArr;
  detailData.forbidSaleList = forbidSaleList
  try {
    let res = await storeDetail({ id });
    const data = res.data ?? {}
    //赋值最开始的英文描述
    detailData.oldMeansEnglishDescription = data.meansEnglishDescription;
    let sku = [];
    data.sku.forEach(v => {
      v.detail = v.detail || '{}'
      v.detail = JSON.parse(v.detail.replaceAll("'", '"'));
      sku.push(v);
    });
    sku.forEach(v => {
      if (v.detail.remarks == null || v.detail.remarks == undefined || v.detail.remarks == '') {
        v.remarks = [];
      }
      else {
        v.detail.remarks = v.detail.remarks.toString().split(',');
      }
    });
    data.sku = sku;

    if (data.devDrawing !== '' && data.devDrawing !== null) {
      data.devDrawing = JSON.parse(data.devDrawing);
    }
    if (data.artMainImage !== '' && data.artMainImage !== null) {
      data.artMainImage = JSON.parse(data.artMainImage);
    }
    if (data.artAssistantImage !== '' && data.artAssistantImage !== null) {
      data.artAssistantImage = JSON.parse(data.artAssistantImage);
    }

    if (data.artSkuImage !== '' && data.artSkuImage !== null) {
      data.artSkuImage = JSON.parse(data.artSkuImage);
    };
    if (detailData.data.artNewImage !== '' && data.artNewImage !== null) {
      data.artNewImage = JSON.parse(data.artNewImage);
    }

    if (data.artVideo !== '' && data.artVideo !== null) {
      data.artVideo = JSON.parse(data.artVideo);
    };

    if (data.meansForbidAttribute !== null) {
      data.meansForbidAttribute = data.meansForbidAttribute.split(",");
    } else {
      data.meansForbidAttribute = [];
    }
    if (data.meansProductProperties !== null) {
      data.meansProductProperties = data.meansProductProperties.split(",");
    } else {
      data.meansProductProperties = [];
    }
    if (data.meansKeepGrain !== null) {
      data.meansKeepGrain = data.meansKeepGrain.split(",");
    } else {
      data.meansKeepGrain = [];
    };


    if (data.meansForbidSite !== null) {
      data.meansForbidSite = data.meansForbidSite.split(",");
    } else {
      data.meansForbidSite = [];
    }
    if (data.devConsultLink) {
      data.devConsultLink = JSON.parse(data.devConsultLink);
    } else {
      data.devConsultLink = [];
    }

    if (data.devSupplierUrl) {
      data.devSupplierUrl = JSON.parse(data.devSupplierUrl);
    } else {
      data.devSupplierUrl = [];
    };
    if (detailData.cacheGetArr && detailData.cacheGetArr.length > 0) {
      // detailData.cacheGetArr = this.cacheGetArr.filter(value => value.length > 1)
      // 修改匹配逻辑
      for (let i = 0; i < detailData.cacheGetArr.length; i++) {
        // 直接使用字符串，不再二次调用 escapeRegExp
        const searchString = detailData.cacheGetArr[i];
        // 为包含空格的字符串构建正则表达式时不添加单词边界
        let regexPattern = "";
        if (searchString === "s") {
          regexPattern = `(?<!\\w)(?<!\\w')(s)(?!\\w)`;
        } else {
          regexPattern = `(?<!\\w)${escapeRegExp(searchString)}(?!\\w)`;
        }

        const regex = new RegExp(regexPattern, 'gi'); // 'g'表示全局匹配，'i'表示不区分大小写
        // 进行文本替换
        data.meansEnglishDescription = data.meansEnglishDescription.replace(regex, (matched) => {
          return `<span style="color: red;font-size: 18px;font-weight: bolder">${matched}</span>`; // 使用匹配到的原始文本（保留大小写）
        });
      }
      data.meansEnglishDescription = data.meansEnglishDescription.replaceAll("<span <span style=\"color: red;font-size: 18px;font-weight: bolder\">style</span>=\"color: red;font-size: 18px;font-weight: bolder\">", "<span style=\"color: red;font-size: 18px;font-weight: bolder\">");
    }
    detailData.data = data
  } catch (error) {
    console.error(error)
  }
  // console.log({ id, forbidSaleList, cacheGetArr, res });
  modalOpen.value = !modalOpen.value
}
function closeModalFn() {
  modalOpen.value = false
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
};

function classify() {
  if (detailData.data.classify != null && detailData.data.classify !== '' && detailData.data.classify !== undefined) {
        return classifyRevert(detailData.data.classify.split(","))
    }
};
function devAttributableMarket() {
  if (detailData.data.devAttributableMarket != null && detailData.data.devAttributableMarket !== '' && detailData.data.devAttributableMarket !== undefined) {
        return devAttributableMarketRevert(detailData.data.devAttributableMarket.split(","))
    }
};
function stockAreaTag() {
  return devStockAreaTag(detailData.data.devStockArea)
};
function devProhibitPlatform() {
  if (detailData.data.devProhibitPlatform != null && detailData.data.devProhibitPlatform !== '' && detailData.data.devProhibitPlatform !== undefined) {
        return devProhibitPlatformRevert(detailData.data.devProhibitPlatform.split(','))
    }
};
function getAttrName1(val) {
    let Aname1
    if (detailData.productAttrOptions.length > 0) {
      detailData.productAttrOptions.forEach(item => {
            if (item.value == val) {
                Aname1 = item.label
            }
        });
    };
    return Aname1
};

function getAttrName2(val) {
    let Aname1
    if (detailData.meansKeepGrainOptions.length > 0) {
      detailData.meansKeepGrainOptions.forEach(item => {
            if (item.value == val) {
                Aname1 = item.label
            }
        })
    };
    return Aname1
};
function getAttrName3(key) {
    let Aname1
    let Aname2
    if (detailData.forbidSaleList.length > 0) {
        Aname1 = detailData.forbidSaleList.find(item => {
            return item.key == key
        })
        if (Aname1) {
            Aname2 = Aname1.attributes

        } else {
            Aname2 = ''
        }

    };
    return Aname2
};
function getAttrName4(val) {
    let Aname1;
    if (detailData.forbidSiteOptions.length > 0) {
      detailData.forbidSiteOptions.forEach(item => {
            if (item.value == val) {
                Aname1 = item.label
            }
        })
    }
    return Aname1
};
function skuList(e) {
    let str = ''
    if (e == '' || e == null) {
        e = ''
    }
    let spanD = e.split(',');
    let oldSku = e.split(','); //原始错乱sku
    let b = [] //去除所有带标签的
    oldSku.map(item => {
        b.push(item.replace(/<[^>]+>/g, ''))
    })
    let newSku = b.sort(); //排序 正确的sku
    if (newSku.length == 0) {
        str = ''
    } else if (newSku.length == 1) {
        str = spanD[0]
    } else if (newSku.length > 1) {
        spanD.forEach(v => {
            if (v.includes(newSku[0])) {
                newSku[0] = v
            }
            if (v.includes(newSku[newSku.length - 1])) {
                newSku[newSku.length - 1] = v
            }
        })
        str = `${newSku[0]} - ${newSku[newSku.length - 1]}`
    }
    return str
};



defineExpose({
  modalOpenFn
})
</script>
<style lang="less" scoped>

</style>