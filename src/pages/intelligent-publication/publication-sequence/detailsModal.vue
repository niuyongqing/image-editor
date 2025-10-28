<template>
  <div id="publicationDatabase_detailsModal" class="publicationDatabase_detailsModal">
    <a-modal 
      v-model:open="modalOpen" 
      :style="{ top: '10px', padding: 0, height: '99vh' }"
      :bodyStyle="{ height: 'calc(95vh - 100px)', padding: '20px 0 20px 20px', background: '#fcfcfc' }" 
      :title="'产品详情'" 
      :maskClosable="false"
      width="80%"
    >
      <a-spin :spinning="loading" wrapperClassName="dialog-box">
        <a-card title="基础信息" style="width: calc(100% - 25px)" class="baseInfo-card">
          <a-descriptions title="">
            <a-descriptions-item label="前缀修饰词">
              <div>{{ detailData.data.prefixDecorateName }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="产品名称">
              <div>{{ detailData.data.productName }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="后缀修饰词">
              <div>{{ detailData.data.suffixDecorateName }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="品牌">
              <div>{{ detailData.data.productAttributeList?.find(i => i.attributeId === 85)?.attributeValue || '无品牌' }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="VAT">
              <div v-if="detailData.data.vat === 0">免税</div>
              <div v-else>{{ (detailData.data.vat * 100) }}%</div>
            </a-descriptions-item>
            <a-descriptions-item label="制造国">
              <div>{{ detailData.data.productAttributeList?.find(i => i.attributeId === 4389)?.attributeValue || '无' }}</div>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions title="">
            <a-descriptions-item label="产品分类">
              <a-tag color="success" v-if="detailData.row.classify">{{ detailData.row.classify }}</a-tag>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions title="">
            <a-descriptions-item label="竞品参考链接">
              <div>
                <div class="url-item" v-for="(item, index) in detailData.data.competitiveList" :key="item.id">
                  {{ `${index + 1}、 ` }}
                  <a target="_blank" :href="item.linkUrl.includes('http') ? item.linkUrl : ('//' + item.linkUrl)">{{ item.linkUrl }}</a>
                </div>
              </div>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions title="">
            <a-descriptions-item label="采购链接">
              <div class="url-item" v-for="(item, index) in detailData.data.purchaseLinkUrls?.split(',')" :key="item">
                {{ `${index + 1}、 ` }}
                <a target="_blank" :href="item.includes('http') ? item : ('//' + item)">{{ item }}</a>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card title="属性信息" style="width: calc(100% - 25px)">
          <a-descriptions title="">
            <a-descriptions-item label="产品属性" :column="1">
              <div class="attribute-box">
                <div class="attribute-item" v-for="item in detailData.categoryAttributeList" :key="item.attributeId">
                  <a-tooltip>
                    <template #title>{{ item.attributeName }}</template>
                    <div class="attribute-item-label">
                      {{ item.attributeName }}
                    </div>
                  </a-tooltip>：
                  <div class="attribute-item-value">
                    {{ detailData.data.productAttributeList?.find(i => i.attributeId === item.attributeId)?.attributeValue || '无' }}
                  </div>
                </div>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card title="描述信息" style="width: calc(100% - 25px)">
          <a-descriptions title="" :column="2">
            <a-descriptions-item label="产品描述">
              <a-card style="width: 90%;">
                <div style="padding-right: 50px; height: 530px; overflow-y: auto;">{{ detailData.data.productAttributeList?.find(i => i.attributeId === 4191)?.attributeValue || '无' }}</div>
              </a-card>
            </a-descriptions-item>
            <a-descriptions-item label="JSON富文本">
              <div v-if="detailData.data.editor_json_11254">
                <MobileJSONEditor :jsonContent="detailData.data.editor_json_11254" :shop="''"></MobileJSONEditor>
              </div>
              <div v-else>{{ '无' }}</div>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions title="" :column="1">
            <a-descriptions-item label="封面视频" :labelStyle="{width: '120px'}">
              <video v-if="detailData.video.coverUrl" controls :src="detailData.video.coverUrl" class="avatar" width="200px" height="200px">
              </video>
              <a-empty v-else />
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions title="" :column="1">
            <a-descriptions-item label="详情描述视频" :labelStyle="{width: '120px'}">
              <div class="video-item" v-if="detailData.video.videoList.length > 0">
                <div class="items" v-for="(item, index) in detailData.video.videoList" :key="index">
                  <video controls :src="item.attributeValue" class="avatar" width="200px" height="200px">
                  </video>
                </div>
              </div>
              <a-empty v-else />
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card title="变种属性" style="width: calc(100% - 25px)">
          <div class="variantAttr-list">
            变种主题：
            <a-tag 
              color="blue"
              v-for="item in detailData.variantAttr" 
              :key="item.attributeId"
              style="margin-left: 20px;"
            >{{ item.attributeName }}</a-tag>
          </div>
          <div>
            <a-card 
              v-for="(theme, index) in detailData.variantTheme"
              :key="theme.attributeId"
              :title="`变种主题${index +1}：${theme.attributeName}`" 
              class="item-card"
            >
              <a-table :columns="theme.variantHeader" :data-source="theme.attributeValue" :pagination="false"></a-table>
            </a-card>
          </div>
        </a-card>
        <a-card title="变种信息" style="width: calc(100% - 25px)">
          <a-table :columns="skuInfoHeader" :data-source="detailData.data.skuList" :pagination="false"></a-table>
        </a-card>
        <a-card title="图片信息" style="width: calc(100% - 25px)">
          <div v-for="item in detailData.data.skuList" :key="item.skuCode">
            <a-card :title="item.skuCode" style="width: 100%">
              <a-descriptions title="">
                <a-descriptions-item label="主图">
                  <div class="img-box">
                    <div class="img-item" v-for="(imageUrl, i) in item.mainImages.split(',')" :key="i">
                      <a-image :width="120" :src="processImageSource(imageUrl) || EmptyImg" :fallback="EmptyImg"/>
                    </div>
                  </div>
                </a-descriptions-item>
              </a-descriptions>
              <a-descriptions title="">
                <a-descriptions-item label="副图">
                  <div class="img-box">
                    <div class="img-item" v-for="(imageUrl, i) in item.subImages.split(',')" :key="i">
                      <a-image :width="120" :src="processImageSource(imageUrl) || EmptyImg" :fallback="EmptyImg"/>
                    </div>
                  </div>
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </div>
        </a-card>
      </a-spin>
      <template #footer>
        <!-- <a-button key="back" type="primary" @click="handleSelect">选中</a-button> -->
        <a-button key="back" @click="closeModalFn">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { getDetail } from './js/api';
import EmptyImg from '@/assets/images/aliexpress/empty.png'
import MobileJSONEditor from './common/MobileJSONEditor.vue';
import { processImageSource } from '~/pages/ozon/config/commJs/index';
defineOptions({ name: "publicationDatabase_detailsModal" })
const { proxy: _this } = getCurrentInstance()
const modalOpen = ref(false);
const loading = ref(false);
const detailData = reactive({
  row: null,
  commodityTypeList: [],        // 产品分类
  data: {},
  categoryAttributeList: [],// 商品属性
  variantAttr: [],// 变种属性-从商品属性中分离出来的
  variantTheme: [], // 变种主题
  attrHeader: [],     // 变种属性表头
  video: {
    coverUrl: '',
    videoList: [],
  }
})
const publishHead = [
  {
    dataIndex: 'skuCode',
    title: 'SKU',
    show: true,
    align: 'center',
    width: 180
  },
  // {
  //   dataIndex: 'price',
  //   title: '策划数量',
  //   show: true,
  //   align: 'center',
  //   width: 180
  // },
  {
    dataIndex: 'costPrice',
    title: '成本价（CNY）',
    show: true,
    align: 'center',
    width: 180
  },
  {
    dataIndex: 'stock',
    title: '库存',
    show: true,
    align: 'center',
    width: 120
  },
  {
    dataIndex: 'length',
    title: '长（mm）',
    show: true,
    align: 'center',
    width: 100
  },
  {
    dataIndex: 'width',
    title: '宽（mm）',
    show: true,
    align: 'center',
    width: 100
  },
  {
    dataIndex: 'height',
    title: '高（mm）',
    show: true,
    align: 'center',
    width: 100
  },
  {
    dataIndex: 'weight',
    title: '重量（g）',
    show: true,
    align: 'center',
    width: 100
  },
]
// sku列表表头
const skuInfoHeader = computed(() => {
  return [...detailData.attrHeader, ...publishHead]
})
async function modalOpenFn({ row, commodityTypeList }) {
  detailData.row = row
  detailData.commodityTypeList = commodityTypeList
  modalOpen.value = !modalOpen.value;
  loading.value = true
  try {
    await getDetailFn()
  } catch (error) {
    console.error(error);
  }
  loading.value = false
  // console.log({ id, forbidSaleList, cacheGetArr, res });
}
async function getDetailFn() {
  let res = null;
  try {
    res = await getDetail(detailData.row.id);
    detailData.categoryAttributeList = res.data.categoryAttributeList.filter(i => !i.isAspect).filter(i => {
      // 以下属性需要过滤掉，其中包括不需要展示的属性，销售属性，视频等，写死的
      return !([11254,4191,85,31,4389,4080,8789,8790,4180,9024].includes(i.attributeId) || [100001,100002].includes(i.attributeComplexId))
    })
    res.data.productAttributeList = res.data.productAttributeList || []
    res.data.editor_json_11254 = res.data.productAttributeList.find(i => i.attributeId === 11254)?.attributeValue
    detailData.video.coverUrl = res.data.productAttributeList.find(i => i.attributeComplexId === 100002)?.attributeValue
    detailData.video.videoList = res.data.productAttributeList.filter(i => i.attributeComplexId === 100001);
    // 从属性中找出全部的销售属性
    let aspectAll = res.data.categoryAttributeList.filter(i => i.isAspect)
    // 剔除掉所有依赖于其他主题的属性
    let comboIdList = res.data.skuAttributeUseList.filter(i => i.comboId).map(i => i.comboId)
    let variantTheme = res.data.skuAttributeUseList.filter(i => !comboIdList.includes(i.attributeId)).map(item => {
      // 找出变种主题
      let obj = {...item};
      // 变种主题的变种属性列表，一个主题可能有多个变种属性
      obj.variantAttr = [];
      // 一般变种主题的变种属性就是它的自身
      let attr = _.cloneDeep(obj);
      // 找出依赖于该主题的主题，将其作为变种属性
      let comboList = res.data.skuAttributeUseList.filter(i => i.attributeId === item.comboId);
      obj.variantAttr.push(attr, ...comboList);
      // 遍历sku找出变种属性的值
      obj.attributeValue = res.data.skuList.map(i => {
        let value = {};
        obj.variantAttr.forEach(a => {
          let skuAttr = i.skuAttributeList.find(skua => skua.attributeId === a.attributeId);
          value[a.attributeId] = skuAttr.attributeValue;
        });
        return value;
      });
      // 生成变种属性表头
      obj.variantHeader = []
      obj.variantAttr.forEach(i => {
        let head = {
          title: i.attributeName,
          dataIndex: String(i.attributeId),
          key: String(i.attributeId),
        }
        obj.variantHeader.push(head)
      })
      return obj
    })
    // let variantTheme = res.data.skuAttributeUseList.filter(i => !i.comboId).map(item => {
    //   // 找出变种主题
    //   let obj = {...item};
    //   // 变种主题的变种属性列表，一个主题可能有多个变种属性
    //   obj.variantAttr = [];
    //   // 一般变种主题的变种属性就是它的自身
    //   let attr = _.cloneDeep(obj);
    //   // 找出依赖于该主题的主题，将其作为变种属性
    //   let comboList = res.data.skuAttributeUseList.filter(i => i.comboId === item.attributeId);
    //   obj.variantAttr.push(attr, ...comboList);
    //   // 遍历sku找出变种属性的值
    //   obj.attributeValue = res.data.skuList.map(i => {
    //     let value = {};
    //     obj.variantAttr.forEach(a => {
    //       let skuAttr = i.skuAttributeList.find(skua => skua.attributeId === a.attributeId);
    //       value[a.attributeId] = skuAttr.attributeValue;
    //     });
    //     return value;
    //   });
    //   // 生成变种属性表头
    //   obj.variantHeader = []
    //   obj.variantAttr.forEach(i => {
    //     let head = {
    //       title: i.attributeName,
    //       dataIndex: String(i.attributeId),
    //       key: String(i.attributeId),
    //     }
    //     obj.variantHeader.push(head)
    //   })
    //   return obj
    // })
    // console.log({variantTheme});
    detailData.variantTheme = variantTheme
    // 生成变种信息列表中的变种表头
    let variantAttr = []    // 所有主题变种
    detailData.variantTheme.forEach(item => {
      variantAttr = [...variantAttr, ...item.variantAttr];
    });
    detailData.attrHeader = variantAttr.map(item => {
      let head = {
        align: 'center',
        title: item.attributeName,
        dataIndex: String(item.attributeId),
        width: 150,
        key: String(item.attributeId),
      }
      return head;
    })
    // 生成展示用的无属性值的主题
    detailData.variantAttr = aspectAll.filter(i => {
      return !(detailData.attrHeader.some(head => head.key === String(i.attributeId)))
    })
    // 将sku数据中加入变种值
    res.data.skuList.forEach(item => {
      item.skuAttributeList.forEach(i => {
        item[i.attributeId] = i.attributeValue;
      })
    })

    detailData.data = res.data;
  } catch (error) {
    console.error(error);
  }
  return res;
}
function closeModalFn() {
  modalOpen.value = false;
}

defineExpose({
  modalOpenFn
})
</script>
<style lang="less" scoped>
.dialog-box {
  height: 100%;
  overflow-y: auto;
  .ant-spin-container {
    display: flex;
    flex-direction: column;
  }
}
:deep(.ant-image-img) {
  width: 118px;
  height: 118px;
}
:deep(.ant-tag) {
  margin-bottom: 6px;
}
:deep(.ant-spin-nested-loading) {
  width: 100%;
}
:deep(.ant-descriptions) {
  width: 100%;
  // background: red;
  &.devConsultLink {
    .ant-descriptions-item-content {
      flex-direction: column;
      a {
        width: 100%;
      }
    }
  }
  &.meansChineseDescription {
    .ant-descriptions-item-label {
      white-space: nowrap;
    }
    .ant-descriptions-item-content {
      max-width: calc(100% - 100px);
      .pre {
        word-wrap:break-word; 
        word-break:break-all;
      }
    }
  }

  .attribute-box {
    max-height: 500px;
    width: 100%;
    margin: 30px 60px;
    display: flex;
    flex-wrap: wrap;
    // padding: 20px;
    overflow-y: auto;
    .attribute-item {
      width: 50%;
      display: flex;
      margin-bottom: 10px;
      .attribute-item-label {
        width: 300px;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 6px;
      }
      .attribute-item-value {
        margin-left: 10px;
      }
    }
  }
  .video-item {
    display: flex;
    flex-wrap: wrap;
    .items {
      position: relative;
      margin-right: 20px;
      margin-bottom: 40px;
    }
  }
}
:deep(.ant-card) {
  margin-bottom: 10px;
}
.variantAttr-list {
  width: 100%;
  padding: 10px;
}
.img-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .img-item {
    margin: 0 10px 10px 0;
  }
}
</style>