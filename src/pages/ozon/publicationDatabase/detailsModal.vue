<template>
  <div id="publicationDatabase_detailsModal" class="publicationDatabase_detailsModal">
    <a-modal 
      v-model:open="modalOpen" 
      :style="{ top: '10px', padding: 0, height: '99vh' }"
      :bodyStyle="{ height: 'calc(95vh - 100px)', 'overflow-y': 'auto' }" 
      :title="'产品详情'" 
      :maskClosable="false"
      width="95%"
    >
      <a-spin :spinning="loading" class="dialog-box">
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
          <a-descriptions-item label="产品分类">
            <a-tag color="success" v-if="detailData.row.classify">{{ detailData.row.classify }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="品牌">
            <div>{{ detailData.data.productAttributeList?.find(i => i.attributeId === 85)?.attributeValue || '无品牌' }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="VAT">
            <div>{{ detailData.data.vat }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="制造国">
            <div>{{ detailData.data.productAttributeList?.find(i => i.attributeId === 4389)?.attributeValue || '无' }}</div>
          </a-descriptions-item>
        </a-descriptions>
        
        <a-descriptions title="">
          <a-descriptions-item label="竞品参考链接">
            <div class="url-item" v-for="(item, index) in detailData.data.purchaseLinkUrls?.split(',')" :key="item">
              {{ `${index + 1}、 ` }}<a target="_blank" :href="item">{{ item }}</a>
            </div>
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="">
          <a-descriptions-item label="采购链接">
            <div class="url-item" v-for="(item, index) in detailData.data.purchaseLinkUrls?.split(',')" :key="item">
              {{ `${index + 1}、 ` }}<a target="_blank" :href="item">{{ item }}</a>
            </div>
          </a-descriptions-item>
        </a-descriptions>
        
        <a-descriptions title="">
          <a-descriptions-item label="产品属性">
            <div class="attribute-box">
              <div class="attribute-item" v-for="(item, index) in detailData.categoryAttributeList" :key="item.attributeId">
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
        
        <a-descriptions title="">
          <a-descriptions-item label="产品描述">
            <div>{{ detailData.data.productAttributeList?.find(i => i.attributeId === 4191)?.attributeValue || '无' }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="JSON富文本">
            <div v-if="detailData.data.editor_json_11254">
              <MobileJSONEditor :jsonContent="detailData.data.editor_json_11254" :shop="''"></MobileJSONEditor>
            </div>
            <div v-else>{{ '无' }}</div>
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="">
          <a-descriptions-item label="封面视频">
            <video controls :src="detailData.video.coverUrl" class="avatar" width="200px" height="200px">
            </video>
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="">
          <a-descriptions-item label="详情描述视频">
            <div class="video-item">
              <div class="items" v-for="(item, index) in detailData.video.videoList" :key="index">
                <video controls :src="item.attributeValue" class="avatar" width="200px" height="200px">
                </video>
              </div>
            </div>
          </a-descriptions-item>
        </a-descriptions>
        <a-card title="变种属性" style="width: 90%">
          <div class="variantAttr-list">
            变种主题：
            <span 
              v-for="item in detailData.variantAttr" 
              :key="item.attributeId"
              style="margin-left: 20px;"
            >{{ item.attributeName }}</span>
          </div>
          <div>
            <a-card 
              v-for="(theme, index) in detailData.variantTheme"
              :key="theme.attributeId"
              :title="`变种主题${index +1}：${theme.attributeName}`" 
            >
              <a-table :columns="theme.variantHeader" :data-source="theme.attributeValue" :pagination="false"></a-table>
            </a-card>
          </div>
        </a-card>
        <a-card title="变种信息" style="width: 90%">
          <a-table :columns="skuInfoHeader" :data-source="detailData.data.skuList" :pagination="false"></a-table>
        </a-card>
        <a-card title="图片信息" style="width: 90%">
          <div v-for="item in detailData.data.skuList">
            <div>
              <div v-for="head in detailData.attrHeader" :key="head.key">{{ `${head.title}：${item[head.key]}` }}</div>
              <a-image
                :width="200"
                :src="item.subImages"
              />
            </div>
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
import MobileJSONEditor from './common/MobileJSONEditor.vue';
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
    dataIndex: 'sellerSKU',
    title: 'SKU',
    show: true,
    align: 'center',
    width: 180
  },
  {
    dataIndex: 'price',
    title: '售价',
    show: true,
    align: 'center',
    width: 180
  },
  {
    dataIndex: 'oldPrice',
    title: '原价',
    show: true,
    align: 'center',
    width: 180
  },
  {
    dataIndex: 'quantity',
    title: '库存',
    show: true,
    align: 'center',
    width: 120
  },
  {
    dataIndex: 'packageLength',
    title: '尺寸',
    show: true,
    align: 'center',
    width: 600
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
      return !([11254,4191,85,31,4389,4080,8789,8790,4180,9024].includes(i.attributeId) || [100001,100002].includes(i.attributeComplexId))
    })
    res.data.editor_json_11254 = res.data.productAttributeList.find(i => i.attributeId === 11254)?.attributeValue
    // res.data.editor_json_11254 = '{"content":[{"widgetName":"raShowcase","type":"roll","blocks":[{"imgLink":"","img":{"src":"https://cdn1.ozone.ru/s3/multimedia-1-x/7766489697.jpg","srcMobile":"https://cdn1.ozone.ru/s3/multimedia-1-x/7766489697.jpg","alt":"","position":"width_full","positionMobile":"width_full"}},{"imgLink":"","img":{"src":"https://cdn1.ozone.ru/s3/multimedia-1-q/7766489618.jpg","srcMobile":"https://cdn1.ozone.ru/s3/multimedia-1-q/7766489618.jpg","alt":"","position":"width_full","positionMobile":"width_full"}},{"imgLink":"","img":{"src":"https://cdn1.ozone.ru/s3/multimedia-1-m/7766489506.jpg","srcMobile":"https://cdn1.ozone.ru/s3/multimedia-1-m/7766489506.jpg","alt":"","position":"width_full","positionMobile":"width_full"}}]},{"widgetName":"raTextBlock","theme":"default","gapSize":"m","padding":"type2","title":{"size":"size5","ocolor":"color1","align":"left","content":["第三方鬼地方个"]},"text":{"size":"size2","color":"color1","align":"left","content":["水电费更好地焚膏继晷好几个号快回家"]}},{"widgetName":"raShowcase","type":"roll","blocks":[{"imgLink":"","img":{"src":"/profile/upload/shopeeFile/2025-10-05/2025/10/05/lQDPJxHaDxRywY3NAtDNAtCwWDR21kByfYEHIorYnsdDAA_720_720_20251005162815A001.jpg","srcMobile":"/profile/upload/shopeeFile/2025-10-05/2025/10/05/lQDPJxHaDxRywY3NAtDNAtCwWDR21kByfYEHIorYnsdDAA_720_720_20251005162815A001.jpg","alt":"","position":"width_full","positionMobile":"width_full","widthMobile":720,"heightMobile":720}}]},{"widgetName":"raTextBlock","theme":"default","gapSize":"m","padding":"type2","title":{"size":"size5","ocolor":"color1","align":"left","content":["的修复好的方式退回梵蒂冈"]},"text":{"size":"size2","color":"color1","align":"left","content":["Материал: акрил","Размер: 4,5*4,5 см","В комплекте: 2 шт."]}}],"version":0.3}'
    detailData.video.coverUrl = res.data.productAttributeList.find(i => i.attributeComplexId === 100002)?.attributeValue
    detailData.video.videoList = res.data.productAttributeList.filter(i => i.attributeComplexId === 100001);
    // 从属性中找出全部的销售属性
    let aspectAll = res.data.categoryAttributeList.filter(i => i.isAspect)
    let variantTheme = res.data.skuList[0].skuAttributeList.map(item => {
      // 找出变种主题
      let obj = aspectAll.find(i => i.attributeId === item.attributeId);
      // 变种主题的变种属性列表，一个主题可能有多个变种属性
      obj.variantAttr = []
      // 一般变种主题的变种属性就是它的自身
      let attr = _.cloneDeep(obj)
      obj.variantAttr.push(attr)
      // 遍历sku找出变种属性的值
      obj.attributeValue = res.data.skuList.map(i => {
        let value = {}
        obj.variantAttr.forEach(a => {
          let skuAttr = i.skuAttributeList.find(skua => skua.attributeId === a.attributeId)
          value[a.attributeId] = skuAttr.attributeValue;
        })
        return value;
      })
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
:deep(.ant-image-img) {
  width: 198px;
  height: 198px;
}
:deep(.ant-tag) {
  margin-bottom: 6px;
}
:deep(.ant-spin-nested-loading) {
  width: 100%;
}
:deep(.ant-descriptions) {
  width: 100%;
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
    // padding: 20px;
    overflow-y: auto;
    .attribute-item {
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
</style>