<!-- 批量编辑 -->
<template>
  <div class="text-left">
    <a-card
      title="选择批量编辑的信息"
      class="mb-4 pb-4"
    >
      <div class="h-40 flex">
        <a-checkbox
          v-model:checked="ultraCheckAll"
          :indeterminate="ultraIsIndeterminate"
          class="font-bold h-fit"
          @change="e => handleUltraCheckAllChange(e, i)"
          >全部</a-checkbox
        >
        <div
          v-for="(group, i) in attrGroupList"
          :key="i"
          class="ml-16"
        >
          <a-checkbox
            v-model:checked="group.checkAll"
            :indeterminate="group.isIndeterminate"
            class="font-bold"
            @change="e => handleCheckAllChange(e, i)"
            >{{ group.title }}</a-checkbox
          >
          <br />
          <a-checkbox-group
            v-model:value="group.checkedList"
            style="writing-mode: vertical-lr"
            @change="values => handleCheckedChange(values, i)"
          >
            <a-checkbox
              v-for="item in group.attrList"
              :value="item.value"
              :key="item.value"
              style="writing-mode: horizontal-tb"
            >
              <span
                class="inline-block w-20 align-middle truncate"
                :title="item.label"
                >{{ item.label }}</span
              >
            </a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
    </a-card>

    <div class="flex justify-between mb-4">
      <div class="flex">
        <a-tag
          color="blue"
          class="h-fit"
          >说明</a-tag
        >
        <div class="text-#999">
          <span> 1、点击表格中的内容，可进行编辑操作！ </span><br />
          <span> 2、若设置了SKU标题，则以SKU标题为准！ </span>
        </div>
      </div>
      <div>
        <!-- <a-dropdown>
          <a-button size="middle">
            一键翻译
            <DownOutlined />
          </a-button>
          <template #overlay>
            <a-menu @click="translate">
              <a-menu-item key="1"> 中文 —> 俄语 </a-menu-item>
              <a-menu-item key="2"> 英文 —> 俄语 </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown> -->

        <a-button
          type="primary"
          size="middle"
          class="ml-4"
          @click="submit"
          >保存</a-button
        >
      </div>
    </div>

    <!-- TABLE -->
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      bordered
      row-key="gatherProductId"
      :scroll="{ x: 'max-content' }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.title === '产品标题'">
          <div border="0 b white solid">{{ column.title }}</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="修改"><FormOutlined @click="titleModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === '产品描述'">
          <div border="0 b white solid">{{ column.title }}</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="修改"><FormOutlined @click="descModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === 'VAT'">
          <div border="0 b white solid">{{ column.title }}</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="修改"><FormOutlined @click="VATModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === '变种SKU'">
          <div border="0 b white solid">{{ column.title }}</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="一键生成"><FormOutlined @click="SKUCodeModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === 'SKU标题'">
          <div border="0 b white solid">{{ column.title }}</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="一键生成"><FormOutlined @click="SKUTitleModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === '售价'">
          <div border="0 b white solid">{{ column.title }}</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="修改"><FormOutlined @click="priceModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === '原价'">
          <div border="0 b white solid">{{ column.title }}</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="修改"><FormOutlined @click="oldPriceModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === '库存'">
          <div border="0 b white solid">{{ column.title }}</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="修改"><FormOutlined @click="stockModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === '尺寸'">
          <div border="0 b white solid">{{ column.title }}(mm) (长*宽*高)</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="修改"><FormOutlined @click="sizeModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="column.title === '重量'">
          <div border="0 b white solid">{{ column.title }}(g)</div>
          <a-space
            size="large"
            class="text-base"
          >
            <a-tooltip title="修改"><FormOutlined @click="weightModalOpen = true" /></a-tooltip>
            <a-tooltip title="还原"><UndoOutlined @click="restore(column.key)" /></a-tooltip>
            <a-tooltip title="删除"><DeleteOutlined @click="del(column.key)" /></a-tooltip>
          </a-space>
        </template>
        <template v-else-if="['mainImage', 'images', 'attrName'].includes(column.key)">
          <div>{{ column.title }}</div>
          <br />
        </template>
      </template>

      <template #bodyCell="{ column, record, index }">
        <template v-if="column.title === '图片'">
          <a-image
            :width="80"
            :src="record.mainImage"
            class="rounded-md max-h-30"
          />
          <a-button
            v-if="record.sourceUrlList && record.sourceUrlList[0]"
            type="link"
            class="block"
            @click="goSource(record.sourceUrlList[0])"
            >{{ record.gatherPlatformName }}</a-button
          >
        </template>
        <template v-else-if="column.title === '产品标题'">
          <a-textarea
            v-if="cellAddress === `${index}_${column.key}`"
            v-model:value="record.title"
            :id="`${index}_${column.key}`"
            :rows="4"
            show-count
            :maxlength="255"
            @blur="cellAddress = ''"
          />
          <div
            v-else
            class="min-h-6"
            @click="cellActived(index, column.key)"
          >
            {{ record.title }}
          </div>
          <div class="text-gray">「{{ record.simpleName }}」</div>
        </template>
        <template v-else-if="column.title === '产品描述'">
          <a-textarea
            v-if="cellAddress === `${index}_${column.key}`"
            v-model:value="record.detailDesc"
            :id="`${index}_${column.key}`"
            :rows="4"
            show-count
            :maxlength="6000"
            @blur="cellAddress = ''"
          />
          <div
            v-else
            class="min-h-6"
            @click="cellActived(index, column.key)"
          >
            {{ record.detailDesc.slice(0, 255) }}
          </div>
        </template>
        <template v-else-if="column.title === 'VAT'">
          <a-select
            v-model:value="record.VAT"
            :options="VAT_OPTIONS"
            class="w-20"
          />
        </template>
        <template v-else-if="column.title === '变种图片'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            cursor-pointer
            min-h-7
            @click="showImagesModal(record, item)"
          >
            <FormOutlined class="text-base" />&nbsp;&nbsp;({{ item.images.length }}张)
          </div>
        </template>
        <template v-else-if="column.title === '变种名称'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            :title="item.attrName"
            class="text-gray cursor-not-allowed min-h-7 truncate"
          >
            {{ item.attrName }}
          </div>
        </template>
        <template v-else-if="column.title === '变种SKU'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            min-h-7
          >
            <a-input
              v-if="cellAddress === `${index}_${column.key}_${i}`"
              v-model:value="item.offerId"
              :id="`${index}_${column.key}_${i}`"
              @blur="cellAddress = ''"
            />
            <div
              v-else
              class="h-6 truncate"
              :title="item.offerId"
              @click="cellActived(index, column.key, i)"
            >
              {{ item.offerId }}
            </div>
          </div>
        </template>
        <template v-else-if="column.title === 'SKU标题'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            min-h-7
          >
            <a-input
              v-if="cellAddress === `${index}_${column.key}_${i}`"
              v-model:value="item.skuTitle"
              :id="`${index}_${column.key}_${i}`"
              @blur="cellAddress = ''"
            />
            <div
              v-else
              class="h-6 truncate"
              :title="item.skuTitle"
              @click="cellActived(index, column.key, i)"
            >
              {{ item.skuTitle }}
            </div>
          </div>
        </template>
        <template v-else-if="column.title === '售价'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            min-h-7
          >
            <a-input-number
              v-if="cellAddress === `${index}_${column.key}_${i}`"
              v-model:value="item.price"
              :id="`${index}_${column.key}_${i}`"
              :precision="2"
              :min="0"
              :max="99999"
              :controls="false"
              @blur="cellAddress = ''"
            />
            <div
              v-else
              class="h-6"
              @click="cellActived(index, column.key, i)"
            >
              {{ item.price }}
            </div>
          </div>
        </template>
        <template v-else-if="column.title === '原价'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            min-h-7
          >
            <a-input-number
              v-if="cellAddress === `${index}_${column.key}_${i}`"
              v-model:value="item.oldPrice"
              :id="`${index}_${column.key}_${i}`"
              :precision="2"
              :min="0"
              :max="99999"
              :controls="false"
              @blur="cellAddress = ''"
            />
            <div
              v-else
              class="h-6"
              @click="cellActived(index, column.key, i)"
            >
              {{ item.oldPrice }}
            </div>
          </div>
        </template>
        <template v-else-if="column.title === '库存'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            min-h-7
          >
            {{ item.stock || 0 }}&nbsp;&nbsp;<FormOutlined
              class="text-base"
              @click="showSingleStockModal(record, item)"
            />
          </div>
        </template>
        <template v-else-if="column.title === '尺寸'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            min-h-7
          >
            <div v-if="cellAddress === `${index}_${column.key}_${i}`">
              <a-input-number
                v-model:value="item.depth"
                :id="`${index}_${column.key}_${i}`"
                :precision="0"
                :controls="false"
                class="w-14 mr-3"
              />
              <a-input-number
                v-model:value="item.width"
                :precision="0"
                :controls="false"
                class="w-14 mr-3"
              />
              <a-input-number
                v-model:value="item.height"
                :precision="0"
                :controls="false"
                class="w-14 mr-3"
              />
              <CheckOutlined
                class="text-base"
                @click="cellAddress = ''"
              />
            </div>
            <div
              v-else
              class="h-6"
              @click="cellActived(index, column.key, i)"
            >
              <span v-if="item.depth && item.width && item.height">{{ `${item.depth} * ${item.width} * ${item.height}` }}</span>
            </div>
          </div>
        </template>
        <template v-else-if="column.title === '重量'">
          <div
            v-for="(item, i) in record.skuList"
            :key="`${column.key}_${i}`"
            :border="i === record.skuList.length - 1 ? '' : '0 b white solid'"
            min-h-7
          >
            <a-input-number
              v-if="cellAddress === `${index}_${column.key}_${i}`"
              v-model:value="item.weight"
              :id="`${index}_${column.key}_${i}`"
              :precision="2"
              :controls="false"
              @blur="cellAddress = ''"
            />
            <div
              v-else
              class="h-6"
              @click="cellActived(index, column.key, i)"
            >
              {{ item.weight }}
            </div>
          </div>
        </template>
        <template v-else-if="column.title === '操作'">
          <a-button
            type="link"
            @click="removeRecord(record.id)"
            >移除</a-button
          >
        </template>
      </template>
    </a-table>

    <!-- 弹窗 -->
    <TitleModal
      v-model:open="titleModalOpen"
      ref="title_modal"
      @ok="titleOk"
    />

    <DescModal
      v-model:open="descModalOpen"
      ref="desc_modal"
      @ok="descOk"
    />

    <VATModal
      v-model:open="VATModalOpen"
      ref="VAT_modal"
      @ok="VATOk"
    />

    <VariantImageModal
      v-model:open="variantImageModalOpen"
      :raw-variant-images="curVariantImages"
      :cooked-attr-name-list="cookedAttrNameList"
      @ok="variantImageOk"
    />

    <SKUCodeModal
      v-model:open="SKUCodeModalOpen"
      ref="SKU_code_modal"
      @ok="SKUCodeOk"
    />

    <SKUTitleModal
      v-model:open="SKUTitleModalOpen"
      :attr-count-max-length="attrCountMaxLength"
      ref="SKU_title_modal"
      @ok="SKUTitleOk"
    />

    <PriceModal
      v-model:open="priceModalOpen"
      ref="price_modal"
      @ok="priceOk"
    />

    <OldPriceModal
      v-model:open="oldPriceModalOpen"
      ref="old_price_modal"
      @ok="oldPriceOk"
    />

    <StockModal
      v-model:open="stockModalOpen"
      v-model:is-single="isSingle"
      :account-options="accountOptions"
      :warehouse-table-data="warehouseTableData"
      :single-SKU-warehouse-table-data="singleSKUWarehouseTableData"
      :cooked-attr-name-list="cookedAttrNameList"
      @ok="stockOk"
    />

    <SizeModal
      v-model:open="sizeModalOpen"
      ref="size_modal"
      @ok="sizeOk"
    />

    <WeightModal
      v-model:open="weightModalOpen"
      ref="weight_modal"
      @ok="weightOk"
    />
  </div>
</template>

<script setup>
  import { DownOutlined, FormOutlined, UndoOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue'
  import { cloneDeep } from 'lodash'
  import { batchQueryDetailApi, batchUpdateProductApi } from '../config/api/batch-edit'

  import TitleModal from './components/TitleModal.vue'
  import DescModal from './components/DescModal.vue'
  import VATModal from './components/VATModal.vue'
  import VariantImageModal from './components/VariantImageModal.vue'
  import SKUCodeModal from './components/SKUCodeModal.vue'
  import SKUTitleModal from './components/SKUTitleModal.vue'
  import PriceModal from './components/PriceModal.vue'
  import OldPriceModal from './components/OldPriceModal.vue'
  import StockModal from './components/StockModal.vue'
  import SizeModal from './components/SizeModal.vue'
  import WeightModal from './components/WeightModal.vue'
  import { message } from 'ant-design-vue'

  // 取出产品 id
  const ids = JSON.parse(localStorage.getItem('ids'))

  // 关联的结对变种属性
  const TWINS = [
    [10096, 10097], // [商品颜色, 颜色名称]
    [4295, 9533] // [俄罗斯尺码, 制造商尺码]
  ]
  // 需要备份的字段
  const COPY_KEY_LIST = ['title', 'detailDesc', 'VAT', 'skuList']

  /** 获取产品详情 */
  const tableData = ref([])
  const accountOptions = ref([])
  const warehouseTableData = ref([])
  getDetails()
  function getDetails() {
    batchQueryDetailApi({ ids }).then(res => {
      const data = res.data || []
      const accountList = []
      const list = data.map(item => {
        accountList.push(item.account)
        let mainImage = item.primaryImage || item.skuList[0].primaryImage?.[0] || ''
        if (mainImage && !mainImage.includes('http')) {
          mainImage = import.meta.env.VITE_APP_BASE_API + mainImage
        }
        item.skuList.forEach(sku => {
          if (sku.attributes) {
            const variantList = sku.attributes.filter(attr => attr.isVariant)

            let variantIds = variantList.map(variant => variant.id)
            let cookedAttrNameList = []
            let cookedAttrValueList = []
            TWINS.forEach(twin => {
              if (twin.every(id => variantIds.includes(id))) {
                // 移除对应 id
                variantIds = variantIds.filter(id => !twin.includes(id))
                // 添加联结属性
                const attrNameList = []
                const attrValueList = []
                twin.forEach(id => {
                  const obj = variantList.find(variant => variant.id === id)
                  attrNameList.push(obj.attributeName)
                  attrValueList.push(obj.values[0].value)
                })
                cookedAttrNameList.push(attrNameList.join('-'))
                cookedAttrValueList.push(attrValueList.join(','))
              }
            })
            variantList
              .filter(variant => variantIds.includes(variant.id))
              .forEach(variant => {
                cookedAttrNameList.push(variant.attributeName)
                cookedAttrValueList.push(variant.values[0].value)
              })

            sku.cookedAttrNameList = cookedAttrNameList
            sku.cookedAttrValueList = cookedAttrValueList
            sku.attrName = sku.cookedAttrValueList.join('/')
          }
        })
        const obj = {
          ...item,
          title: item.name,
          mainImage,
          VAT: item.vat
        }

        // 备份数据
        COPY_KEY_LIST.forEach(key => {
          obj[`${key}Copy`] = key !== 'skuList' ? obj[key] : cloneDeep(obj.skuList)
        })

        return obj
      })

      const uniqueAccountList = Array.from(new Set(accountList)) // 去重后的账号列表
      // 批量修改库存用的店铺列表
      accountOptions.value = uniqueAccountList.map(account => {
        const obj = list.find(item => item.account === account)

        return {
          label: obj.simpleName,
          value: account
        }
      })

      // 批量修改库存的仓库列表
      const tempList = accountOptions.value.map(item => {
        const obj = {
          ...item,
          warehouseObj: {}
        }
        list.forEach(el => {
          el.skuList[0].warehouseList.forEach(warehouse => {
            if (!obj.warehouseObj[warehouse.warehouseId]) {
              obj.warehouseObj[warehouse.warehouseId] = warehouse.warehouseName
            }
          })
        })

        return obj
      })
      tempList.forEach(item => {
        Object.entries(item.warehouseObj).forEach(entry => {
          warehouseTableData.value.push({
            account: item.value,
            shopName: item.label,
            warehouseId: entry[0],
            warehouseName: entry[1],
            stock: null,
            total: 0
          })
        })
      })

      tableData.value = list
    })
  }
  // 变种主题数量(max)
  const attrCountMaxLength = computed(() => {
    const attrCountList = []
    tableData.value.forEach(item => {
      item.skuList.forEach(sku => {
        attrCountList.push(sku.cookedAttrValueList?.length || 0)
      })
    })

    return Math.max(...attrCountList)
  })

  /** 选择批量编辑的信息 checkbox */
  // 超级全选
  let ultraCheckAll = false
  let ultraIsIndeterminate = false
  // 属性分组列表
  const attrGroupList = ref([
    {
      title: '产品信息',
      attrList: [
        { label: '产品描述', value: 'detailDesc' },
        { label: 'VAT', value: 'VAT' }
      ],
      isIndeterminate: false,
      checkAll: false,
      checkedList: []
    },
    {
      title: '变种信息',
      attrList: [
        { label: '变种图片', value: 'images' },
        { label: 'SKU标题', value: 'skuTitle' },
        { label: '售价', value: 'price' },
        { label: '原价', value: 'oldPrice' },
        { label: '库存', value: 'stock' },
        { label: '尺寸', value: 'size' },
        { label: '重量', value: 'weight' }
      ],
      isIndeterminate: false,
      checkAll: false,
      checkedList: ['images', 'price', 'stock', 'size', 'weight'] // 塞个初始值
    }
  ])

  // 超级无敌叼霸天全选
  function handleUltraCheckAllChange(e) {
    if (e.target.checked) {
      attrGroupList.value.forEach(item => {
        item.checkAll = true
        item.isIndeterminate = false
        item.checkedList = item.attrList.map(attr => attr.value)
      })
    } else {
      attrGroupList.value.forEach(item => {
        item.checkAll = false
        item.isIndeterminate = false
        item.checkedList = []
      })
    }
    ultraIsIndeterminate = false
  }
  // 大哥的被动切换
  function toggleUltraCheckAll() {
    ultraCheckAll = attrGroupList.value.every(item => item.checkAll)

    const uncheckAll = attrGroupList.value.every(item => !item.checkAll)
    const hasIsIndeterminate = attrGroupList.value.some(item => item.isIndeterminate)
    ultraIsIndeterminate = hasIsIndeterminate || !(ultraCheckAll || uncheckAll)
  }

  // 属性分组全选
  function handleCheckAllChange(e, i) {
    attrGroupList.value[i].checkedList = e.target.checked ? attrGroupList.value[i].attrList.map(attr => attr.value) : []
    attrGroupList.value[i].isIndeterminate = false

    toggleUltraCheckAll()
  }
  // 属性勾选变动
  function handleCheckedChange(values, i) {
    const checkedCount = values.length
    attrGroupList.value[i].checkAll = checkedCount === attrGroupList.value[i].attrList.length
    attrGroupList.value[i].isIndeterminate = checkedCount > 0 && checkedCount < attrGroupList.value[i].attrList.length

    toggleUltraCheckAll()
  }

  /** TABLE */
  // 店小蜜上的表格背景颜色
  const COLOR_LIST = [
    { headerColor: '#f9c6c6', bodyColor: '#fef4f4' },
    { headerColor: '#a3d0f0', bodyColor: '#e5f1ff' },
    { headerColor: '#9ce6c9', bodyColor: '#e1faf0' },
    { headerColor: '#f0eea3', bodyColor: '#ffffe5' }
  ]

  const WHOLE_COLUMNS = [
    {
      title: '产品信息',
      children: [
        { title: '图片', key: 'mainImage', width: 90 },
        { title: '产品标题', key: 'title', width: 200 },
        { title: '产品描述', key: 'detailDesc', width: 200 },
        { title: 'VAT', key: 'VAT', width: 100 }
      ]
    },
    {
      title: '变种信息',
      children: [
        { title: '变种图片', key: 'images', width: 100 },
        { title: '变种名称', key: 'attrName', width: 120 },
        { title: '变种SKU', key: 'offerId', width: 120 },
        { title: 'SKU标题', key: 'skuTitle', width: 120 },
        { title: '售价', key: 'price', width: 80 },
        { title: '原价', key: 'oldPrice', width: 80 },
        { title: '库存', key: 'stock', width: 80 },
        { title: '尺寸', key: 'size', width: 150 },
        { title: '重量', key: 'weight', width: 80 }
      ]
    },
    { title: '操作', key: 'operation', width: 60 }
  ]

  // 给每列 column 添加上背景色
  for (let i = 0; i < WHOLE_COLUMNS.length - 1; i++) {
    WHOLE_COLUMNS[i].customHeaderCell = () => ({ style: { backgroundColor: COLOR_LIST[i].headerColor } })
    WHOLE_COLUMNS[i].children.forEach(item => {
      item.customHeaderCell = () => ({ style: { backgroundColor: COLOR_LIST[i].bodyColor } })
      if (['变种名称', '变种SKU', 'SKU标题'].includes(item.title)) {
        item.customCell = () => ({ style: { backgroundColor: COLOR_LIST[i].bodyColor, maxWidth: '200px' } })
      } else {
        item.customCell = () => ({ style: { backgroundColor: COLOR_LIST[i].bodyColor } })
      }
    })
  }

  // 常驻的列
  const PERMANENT_ATTR = ['mainImage', 'title', 'attrName', 'offerId']
  // 展示的列, 根据 CheckBox 勾选的值来过滤出
  const columns = computed(() => {
    // 勾选的属性
    const allAttrCheckedList = []
    attrGroupList.value.forEach(item => {
      allAttrCheckedList.push(...item.checkedList)
    })
    const allAttrList = [...PERMANENT_ATTR, ...allAttrCheckedList]
    const list = WHOLE_COLUMNS.map(item => {
      if (item.children) {
        const children = item.children.filter(child => allAttrList.includes(child.key))
        return {
          ...item,
          children
        }
      } else {
        return item
      }
    })

    return list
  })

  const VAT_OPTIONS = [
    { label: '免税', value: '0' },
    { label: '10%', value: '0.1' },
    { label: '20%', value: '0.2' }
  ]

  // 在 SKUList 里的字段
  const SKU_ATTR_LIST = ['images', 'offerId', 'skuTitle', 'price', 'oldPrice', 'stock', 'size', 'weight']

  // 还原一列值
  function restore(key) {
    if (SKU_ATTR_LIST.includes(key)) {
      // 变种信息
      if (key === 'size') {
        tableData.value.forEach(item => {
          item.skuList.forEach((SKU, i) => {
            SKU.depth = item.skuListCopy[i].depth
            SKU.width = item.skuListCopy[i].width
            SKU.height = item.skuListCopy[i].height
          })
        })
      } else {
        tableData.value.forEach(item => {
          item.skuList.forEach((SKU, i) => {
            SKU[key] = item.skuListCopy[i][key]
          })
        })
      }
    } else {
      // 产品信息
      tableData.value.forEach(item => {
        item[key] = item[`${key}Copy`]
      })
    }
  }
  // 删除一列值
  function del(key) {
    if (SKU_ATTR_LIST.includes(key)) {
      // 变种信息
      if (key === 'size') {
        tableData.value.forEach(item => {
          item.skuList.forEach(SKU => {
            SKU.depth = 0
            SKU.width = 0
            SKU.height = 0
          })
        })
      } else {
        tableData.value.forEach(item => {
          item.skuList.forEach(SKU => {
            SKU[key] = Array.isArray(SKU[key]) ? [] : ''
          })
        })
      }
    } else {
      // 产品信息
      tableData.value.forEach(item => {
        item[key] = ''
      })
    }
  }

  // 跳转到来源
  function goSource(src) {
    window.open(src)
  }

  // 单元格地址(用来匹配正在编辑的那个单元格或者单元格里的某一项)
  const cellAddress = ref('')
  /**
   * 点击单元格内容激活编辑状态
   * @param {number} index 每行的索引
   * @param {string} key 每列的 key
   * @param? {number} i 单元格内 v-for 循环出来的索引
   */
  function cellActived(index, key, i) {
    cellAddress.value = i === undefined ? `${index}_${key}` : `${index}_${key}_${i}`

    nextTick(() => {
      document.getElementById(cellAddress.value).focus()
    })
  }

  // 产品标题弹窗
  const titleModalOpen = ref(false)
  const titleModalRef = useTemplateRef('title_modal')

  function titleOk() {
    titleModalRef.value.modify(tableData.value)
  }

  // 产品描述弹窗
  const descModalOpen = ref(false)
  const descModalRef = useTemplateRef('desc_modal')

  function descOk() {
    descModalRef.value.modify(tableData.value)
  }

  // VAT 弹窗
  const VATModalOpen = ref(false)
  const VATModalRef = useTemplateRef('VAT_modal')

  function VATOk() {
    VATModalRef.value.modify(tableData.value)
  }

  // 打开变种图片弹窗
  const variantImageModalOpen = ref(false)
  let curRecord = {}
  let curItem = {}
  const curVariantImages = ref([])
  const cookedAttrNameList = ref([])

  function showImagesModal(record, item) {
    variantImageModalOpen.value = true

    curRecord = record
    curItem = item
    curVariantImages.value = item.images || []
    cookedAttrNameList.value = item.cookedAttrNameList
  }

  function variantImageOk(params) {
    const { confirmKey, variantImages } = params
    const images = variantImages.map(item => item.url)
    if (confirmKey === 'applyAll') {
      curRecord.skuList.forEach(item => {
        item.images = images
      })
    } else if (confirmKey === 'applySelf') {
      curItem.images = images
    } else {
      const index = curItem.cookedAttrNameList.findIndex(attrName => attrName === confirmKey)
      const attrValue = curItem.cookedAttrValueList[index]
      curRecord.skuList.forEach(item => {
        if (item.cookedAttrValueList.includes(attrValue)) {
          item.images = images
        }
      })
    }

    curRecord = {}
    curItem = {}
  }

  // 变种 SKU 弹窗
  const SKUCodeModalOpen = ref(false)
  const SKUCodeModalRef = useTemplateRef('SKU_code_modal')

  function SKUCodeOk() {
    SKUCodeModalRef.value.submit(tableData.value)
  }

  // SKU 标题 弹窗
  const SKUTitleModalOpen = ref(false)
  const SKUTitleModalRef = useTemplateRef('SKU_title_modal')

  function SKUTitleOk() {
    SKUTitleModalRef.value.submit(tableData.value)
  }

  // 售价弹窗
  const priceModalOpen = ref(false)
  const priceModalRef = useTemplateRef('price_modal')

  function priceOk() {
    priceModalRef.value.modify(tableData.value)
  }

  // 原价弹窗
  const oldPriceModalOpen = ref(false)
  const oldPriceModalRef = useTemplateRef('old_price_modal')

  function oldPriceOk() {
    oldPriceModalRef.value.modify(tableData.value)
  }

  // 打开修改库存弹窗
  const stockModalOpen = ref(false)
  const isSingle = ref(false)
  const singleSKUWarehouseTableData = ref([]) // 单个 SKU 仓库列表数据

  function showSingleStockModal(record, item) {
    isSingle.value = true
    curRecord = record
    curItem = item
    cookedAttrNameList.value = item.cookedAttrNameList
    singleSKUWarehouseTableData.value = item.warehouseList.map(warehouse => {
      return {
        account: record.account,
        shopName: record.simpleName,
        warehouseId: warehouse.warehouseId,
        warehouseName: warehouse.warehouseName,
        stock: warehouse.present,
        total: warehouse.present
      }
    })

    stockModalOpen.value = true
  }

  function stockOk(key) {
    if (key) {
      if (key === 'applyAll') {
        curRecord.skuList.forEach(item => {
          // ?? stock 该赋什么值存疑
          item.stock = 0
          singleSKUWarehouseTableData.value.forEach(warehouse => {
            item.stock += warehouse.stock

            item.warehouseList.forEach(el => {
              if (el.warehouseId === warehouse.warehouseId) {
                el.present = warehouse.stock
              }
            })
          })
        })
      } else if (key === 'applySelf') {
        curItem.stock = 0
        singleSKUWarehouseTableData.value.forEach(warehouse => {
          curItem.stock += warehouse.stock

          curItem.warehouseList.forEach(el => {
            if (el.warehouseId === warehouse.warehouseId) {
              el.present = warehouse.stock
            }
          })
        })
      } else {
        const index = curItem.cookedAttrNameList.findIndex(attrName => attrName === key)
        const attrValue = curItem.cookedAttrValueList[index]
        curRecord.skuList.forEach(item => {
          if (item.cookedAttrValueList.includes(attrValue)) {
            item.stock = 0
            singleSKUWarehouseTableData.value.forEach(warehouse => {
              item.stock += warehouse.stock

              item.warehouseList.forEach(el => {
                if (el.warehouseId === warehouse.warehouseId) {
                  el.present = warehouse.stock
                }
              })
            })
          }
        })
      }

      curRecord = {}
      curItem = {}
      isSingle.value = false
    } else {
      warehouseTableData.value.forEach(warehouse => {
        tableData.value.forEach(item => {
          if (item.account === warehouse.account) {
            item.skuList.forEach(sku => {
              sku.warehouseList.forEach(el => {
                if (String(el.warehouseId) === warehouse.warehouseId) {
                  sku.stock = warehouse.stock
                  el.present = warehouse.stock
                }
              })
            })
          }
        })
      })
    }
  }

  // 尺寸弹窗
  const sizeModalOpen = ref(false)
  const sizeModalRef = useTemplateRef('size_modal')

  function sizeOk() {
    sizeModalRef.value.modify(tableData.value)
  }

  // 重量弹窗
  const weightModalOpen = ref(false)
  const weightModalRef = useTemplateRef('weight_modal')

  function weightOk() {
    weightModalRef.value.modify(tableData.value)
  }

  // 移除
  function removeRecord(id) {
    tableData.value = tableData.value.filter(item => item.id !== id)
  }

  /** 翻译 */
  function translate({ key }) {
    console.log(key)
  }

  /** 保存 */
  function submit() {
    // 校验属性非空 (不可为空: [产品标题, 变种SKU, 售价, 尺寸, 重量])
    let flag = false
    loop: for (const item of tableData.value) {
      if (!item.title) {
        flag = true
        break loop
      }
      for (const sku of item.skuList) {
        if (!sku.offerId || !sku.price || !sku.depth || !sku.width || !sku.height || !sku.weight) {
          flag = true
          break loop
        }
      }
    }
    if (flag) {
      message.warning('产品标题, 变种SKU, 售价, 尺寸, 重量 不可为空, 请修改后保存')

      return
    }

    const params = cloneDeep(tableData.value)
    params.forEach(item => {
      item.name = item.title
      item.vat = item.VAT
      item.skuList.forEach(sku => {
        delete sku.cookedAttrNameList
        delete sku.cookedAttrValueList
        delete sku.attrName
      })

      // 删除辅助的属性
      delete item.mainImage
      delete item.title
      delete item.VAT
      // 删除备份数据
      COPY_KEY_LIST.forEach(key => {
        delete item[`${key}Copy`]
      })
    })

    batchUpdateProductApi(params).then(res => {
      message.success('修改成功')
      // localStorage.removeItem('ids')
      // setTimeout(() => {
      //   window.close()
      // }, 2000)
    })
  }
</script>

<style lang="less" scoped>
  :deep(.ant-table-cell-row-hover) {
    opacity: 0.8;
  }

  // border 颜色
  :deep(:where(.css-dev-only-do-not-override-1mphclt).ant-table-wrapper .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > thead > tr:not(:last-child) > th),
  :deep(:where(.css-dev-only-do-not-override-1mphclt).ant-table-wrapper .ant-table-thead > tr > th),
  :deep(:where(.css-dev-only-do-not-override-1mphclt).ant-table-wrapper .ant-table.ant-table-bordered .ant-table-tbody > tr > td) {
    border-bottom: 1px solid #fff;
  }

  :deep(:where(.css-dev-only-do-not-override-1mphclt).ant-table-wrapper .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > thead > tr > th),
  :deep(:where(.css-dev-only-do-not-override-1mphclt).ant-table-wrapper .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > tbody > tr > td) {
    border-inline-end: 1px solid #fff;
    vertical-align: top;
  }
</style>
