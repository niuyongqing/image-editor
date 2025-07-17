<template>
    <div id="OzonVariantInfoCont">
        <a-card title="产品信息" class="text-left mt-5 text-16px">
            <a-card title="变种信息" class="text-left mx-50 text-16px">
                <div class="flex mb-2.5">
                    <a-checkbox-group @change="changeHeade" v-model:value="addHeaderList" :options="plainOptions">
                    </a-checkbox-group>
                    <!-- <a-button type="primary" :disabled="custAttr.length == 0" @click="attrVisible = true"
                        class="mx-2.5">添加自定义变种属性</a-button> -->
                </div>
                <a-table bordered :columns="filteredHeaderList" :data-source="tableData" :pagination="false">
                    <template #headerCell="{ column }">
                        <template v-if="column.dataIndex === 'colorImg'">
                            <span><span style="color: #ff0a37">*</span> {{ column.title }}</span>
                            <a-dropdown>
                                <a class="ant-dropdown-link" @click.prevent>
                                    批量
                                    <DownOutlined />
                                </a>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item @click="bigImgvisible = true" :preview="{ visible: false }">
                                            查看大图
                                            <div style="display: none">
                                                <a-image-preview-group style="width: 90% !important;"
                                                    :preview="{ visible: bigImgvisible, onVisibleChange: vis => (bigImgvisible = vis) }">
                                                    <a-image v-for="(item, index) in tableData" :key="index"
                                                        :src="item.colorImg.length > 0 ? processImageSource(item.colorImg[0]?.url) : ''" />
                                                </a-image-preview-group>
                                            </div>
                                        </a-menu-item>
                                        <a-menu-item @click="changeImgSize">
                                            批量改图片尺寸
                                        </a-menu-item>
                                        <a-menu-item @click="changeImgTranslation">
                                            图片翻译
                                        </a-menu-item>
                                        <a-sub-menu key="sub1" title="添加水印">
                                            <a-menu-item v-for="item in watermark" :key="item"
                                                @click="changeImgWater(item)">
                                                {{ item.title }}
                                            </a-menu-item>
                                        </a-sub-menu>
                                        <a-menu-item @click="clearImg">
                                            清空图片
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </template>
                        <template v-if="column.dataIndex === 'sellerSKU'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span><a class="ml-1.25" @click="batchPrice">批量</a>
                        </template>
                        <template v-if="column.dataIndex === 'oldPrice'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span><a class="ml-1.25" @click="batcholdPricebatchPrice">批量</a>
                        </template>
                        <template v-if="column.dataIndex === 'minPrice'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'quantity'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span><a class="ml-1.25" @click="batchStock">批量</a>
                        </template>
                        <template v-if="column.dataIndex === 'packageLength'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}(mm)</span><a class="ml-1.25" @click="batchPackLength">批量</a>
                        </template>
                    </template>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'colorImg'">
                            <a-image v-if="record.colorImg.length > 0" style="position: relative;" :width="100"
                                :src="processImageSource(record.colorImg[0].url)" />
                            <div v-if="record.colorImg.length > 0" style="position: absolute;top:5px;right: 5px">
                                <AsyncIcon icon="CloseCircleOutlined" size="20px" color="black"
                                    @click="record.colorImg = []" />
                            </div>
                            <a-upload name="file" v-if="record.colorImg.length == 0" class="h-20 w-20 headerImg"
                                :headers="headers" accept=".jpg,.jpeg,.png" :action="uploadUrl" :showUploadList="false"
                                list-type="picture-card" @change="(e) => handleChangeColroImg(e, record)"
                                :max-count="1">
                                <div>
                                    <AsyncIcon icon="PlusOutlined" />
                                    <div>上传图片</div>
                                </div>
                            </a-upload>
                        </template>
                        <template v-if="column.dataIndex === 'skuTitle'">
                            <a-input v-model:value="record.skuTitle" size="middle"></a-input>
                        </template>
                        <template v-if="column.dataIndex === 'secondName'">
                            <span>{{ record.secondName }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'sellerSKU'">
                            <a-input disabled v-model:value="record.sellerSKU" size="middle"
                                @change="sellerSKUChange(record)"></a-input>
                        </template>
                        <template v-if="!otherHeader.includes(column.dataIndex)">
                            <a-input v-if="column.selectType === 'input'" size="middle"
                                v-model:value="record[column.dataIndex]"></a-input>
                            <a-select v-if="column.selectType === 'select'" size="middle"
                                v-model:value="record[column.dataIndex]" style="width: 200px"
                                :options="column.options"></a-select>
                            <a-select v-if="column.selectType === 'multSelect'" size="middle" :maxTagCount="2"
                                v-model:value="record[column.dataIndex]" style="width: 200px" :options="column.options"
                                mode="tags"></a-select>
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                            <a-input-number style="width: 80%" size="middle" v-model:value="record.price"
                                @blur="judgeMax(record)"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'oldPrice'">
                            <a-input-number style="width: 80%" size="middle" v-model:value="record.oldPrice"
                                @blur="judgeMax(record)"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'minPrice'">
                            <a-input-number disabled style="width: 80%" size="middle"
                                v-model:value="record.minPrice"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'quantity'">
                            <span>{{ record.quantity }}</span>
                            <AsyncIcon style="margin-left: 10px;" icon="EditOutlined" @click="batchStock(record)">
                            </AsyncIcon>
                        </template>
                        <template v-if="column.dataIndex === 'packageLength'">
                            <div>
                                <div style="display: flex">
                                    长度：
                                    <a-input-number controls-position="right" size="middle" style="width: 80%"
                                        v-model:value="record.packageLength" placeholder="长度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    宽度：
                                    <a-input-number controls-position="right" size="middle" style="width: 80%"
                                        v-model:value="record.packageWidth" placeholder="宽度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    高度：
                                    <a-input-number controls-position="right" size="middle" style="width: 80%"
                                        v-model:value="record.packageHeight" placeholder="高度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    重量：
                                    <a-input-number controls-position="right" size="middle" style="width: 80%"
                                        v-model:value="record.packageWeight" :precision="0" placeholder="重量">
                                        <template #addonAfter>g</template>
                                    </a-input-number>
                                </div>
                            </div>
                        </template>
                    </template>
                </a-table>
            </a-card>
            <a-card title="变种图片" class="text-left mx-50 mt-5">
                <div>
                    <div w-full ml-25px>
                        <div>
                            <a-tag color="warning" class="text-16px">！说明</a-tag>
                            <span style="color: #9fa0a2" class="text-16px">
                                第一张图片默认为主图，点击图片拖动，即可调整图片顺序！
                                单张不超过2M，只支持jpg、.png、.jpeg格式；普通分类图片尺寸为200*200-4320*7680，服装、鞋靴和饰品类目-最低分辨率为900*1200，建议纵横比为3：4；服装、鞋靴和配饰类目，背景应为灰色(#f2f3f5)</span>
                        </div>
                        <div flex justify-end items-center mt-15px>
                            <a-dropdown>
                                <a-button type="link" link style="width: 90px; height: 31px;">
                                    普通水印
                                    <DownOutlined />
                                </a-button>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item v-for="item in watermark" :key="item"
                                            @click="handleWatermark(item)">
                                            {{ item.title }}
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                            <span pl-10px>|</span>
                            <a-dropdown>
                                <a-button type="link" style="width: 90px; height: 31px; margin-left: 10px;">
                                    编辑图片
                                    <DownOutlined />
                                </a-button>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item @click="handleEditImagesSize">
                                            批量修改图片尺寸
                                        </a-menu-item>
                                        <a-menu-item @click="handleImageTranslation">
                                            图片翻译
                                        </a-menu-item>
                                        <a-menu-item @click="clearAllImages">
                                            清空图片
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                            <span pl-10px>|</span>
                            <a-button type="link" style="width: 90px; height: 31px; margin-right: 70px;"
                                :loading="downloadLoading" @click="handleExportAllImages">
                                <DownloadOutlined /> 导出全部图片
                            </a-button>
                        </div>
                    </div>

                    <div v-for="item in tableData" :key="item.id">
                        <div v-if="tableData.length > 0">
                            <a-card class="mb-2.5 ml-2.5" :bordered="false">

                                <SkuDragUpload v-model:file-list="item.imageUrl" :maxCount="30" :showUploadList="false"
                                    accept=".jpg,.png" :api="uploadImage" :waterList="watermark">
                                    <template #default>
                                        <div flex flex-col w-full justify-start mb-4px text-left>
                                            <p>
                                                <a-tag color="#00AEB3">说明！</a-tag>
                                                <span class="text-#999 text-16px"> 第一张图片默认为主图，点击图片拖动，即可调整图片顺序。
                                                </span>
                                            </p>
                                        </div>
                                    </template>
                                    <template #variantInfo>
                                        <!-- 变种主题信息 -->
                                        <!-- <div v-for="(nameItem, nameIndex) in skuThemeNames(item)" :key="nameIndex">
                                            {{ nameItem[0] }}: {{ item[nameItem[0]] }}
                                        </div> -->
                                    </template>
                                    <template #skuInfo>
                                        {{ `【${item.imageUrl.length}/30】图片 ` }}
                                        <a-dropdown>
                                            <a-button type="link" link style="width: 90px; height: 31px;">
                                                图片应用到
                                                <DownOutlined />
                                            </a-button>
                                            <template #overlay>
                                                <a-menu>
                                                    <a-menu-item @click="applyAllImage(item)">
                                                        所有变种
                                                    </a-menu-item>
                                                    <!-- <a-menu-item v-for="item in applyMenuList" :key="item.value"
                                                        @click="applyImage(item)">
                                                        <span>同</span>
                                                        <span px-3px>{{ item.title }}</span>
                                                        <span>的变种</span>
                                                    </a-menu-item> -->
                                                </a-menu>
                                            </template>
                                        </a-dropdown>

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
        <!-- 图片翻译弹窗 -->
        <ImageTranslation ref="imageTranslationRef"></ImageTranslation>
        <!-- 批量编辑图片 -->
        <bacthSkuEditImg ref="bacthSkuEditImgRef"></bacthSkuEditImg>
        <!-- 批量修改颜色样本大小 -->
        <bacthEditColorImg ref="bacthEditColorImgRef"></bacthEditColorImg>
        <!-- 颜色样本翻译 -->
        <colorImgTranslation ref="colorImgTranslationRef"></colorImgTranslation>
    </div>
</template>

<script setup name='OzonVariantInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message, Modal } from "ant-design-vue";
import { productWarehouse } from "../../config/api/product"
import SelectAttr from '../../productPublish/comm/SelectAttr.vue';
import batchEditModal from "~/pages/ozon/config/component/batchEditModal/index.vue"
import { editHead, otherList } from '../../config/tabColumns/skuHead';
import { updatePrice, processAttributesCache, checkData, rearrangeColorFields, processImageSource } from "../../config/commJs/index"
import { useOzonProductStore } from '~@/stores/ozon-product'
import { scaleApi, watermarkListApi, watermarkApi } from "~/api/common/water-mark";
import EditProdQuantity from '../../productPublish/comm/EditProdQuantity.vue';
import SkuDragUpload from "@/pages/ozon/config/component/skuDragImg/index.vue"
import bacthSkuEditImg from "@/pages/ozon/config/component/skuDragImg/bacthSkuEditImg.vue"
import ImageTranslation from "@/pages/ozon/config/component/skuDragImg/imageTranslation.vue"
import { uploadImage } from '@/pages/ozon/config/api/draft';
import { debounce } from "lodash";
import { DownOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { imageUrlUpload,downloadAllImage } from '@/pages/sample/acquisitionEdit/js/api.js'
import colorImgTranslation from "./colorImgTranslation.vue";
import bacthEditColorImg from "./bacthEditColorImg.vue";
import download from '~@/api/common/download';

const props = defineProps({
    productDetail: Object,
});
const downloadLoading = ref(false); //导出按钮loading
const bacthSkuEditImgRef = ref();
const imageTranslationRef = ref();
const bacthEditColorImgRef = ref();
const colorImgTranslationRef = ref();
const bigImgvisible = ref(false);

const batchPriceVis = ref(false)
const batchOldPriceVis = ref(false)
const editQuantityVis = ref(false)
const editLengthRangeVis = ref(false)
const batchOpen = ref(false)
const newAttribute = ref([])
const custAttr = ref([]) //可控制属性
const batchTitle = ref("")
const batchType = ref('')
const quantityRow = ref({})
const tableData = ref([])
const themeBtns = ref([])
const requiredList = ref([]) //必填变种主题 
const attributeList = ref([]); //变种主题卡片
const editRes = ref({})
const editStockList = ref([]) //仓库数据
const rowOldPrice = ref("")
const rowPrice = ref("")
const headerList = ref(editHead) //动态表头
const addHeaderList = ref([])
const plainOptions = [
    {
        label: '颜色样本',
        value: 'colorImg',
    },
    // {
    //     label: '设置SKU标题',
    //     value: 'skuTitle',
    // },
]
const isConform = ref(false)
const attrVisible = ref(false)
const otherHeader = otherList
const watermark = ref([])
const watermarkValue = ref("")
const cropWidth = ref(800)
const cropHeight = ref(800)
const shopCode = ref("")
const selectAll = ref(false)
const imgHeaderList = ref([])
const uploadUrl =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/file/upload/img"
const headers = {
    'Authorization': 'Bearer ' + useAuthorization().value,
}

const filteredHeaderList = computed(() => {
    return headerList.value.filter((item) => item.show === true);
})
const handleChangeColroImg = (info, record) => {
    if (info.file.status === 'done') {
        record.colorImg.push(
            {
                name: info.file.response.originalFilename,
                url: '/prod-api' + info.file.response.url,
                checked: false,
                width: info.file.response.width,
                height: info.file.response.height,
            }
        )
    }
    if (info.file.status === 'error') {
        message.error('图片上传有误！');
    }
}

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
                align: "center"
            };
            const index = headerList.value.findIndex(item => item.dataIndex === 'sellerSKU');
            headerList.value.splice(index + 1, 0, obj);
        }
    });
    const displayAttr = useOzonProductStore().attributes
    const idMap = new Map();
    list.forEach(item => {
        idMap.set(item.id, true);
    });

    displayAttr.forEach(item => {
        item.show = idMap.has(item.id) ? false : true
    });
}

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
                show: true,
                align: 'center'
            };
            if (item == "colorImg") {
                headerList.value.unshift(obj);
            } else if (item == "skuTitle") {
                let skuIndex = headerList.value.findIndex(item => item.title === 'SKU');
                headerList.value.splice(skuIndex + 1, 0, obj);
            }
            else {
                headerList.value.push(obj)
            }
        }
    });
}

// 批量修改售价
const batchPrice = () => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    batchOpen.value = true
    batchTitle.value = "批量修改售价"
    batchType.value = 'price'
}
// 修改售价
const backPrice = (e) => {
    tableData.value[0].price = e
}

// 批量修改SKU
const batchSKU = () => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    batchOpen.value = true
    batchTitle.value = "批量修改SKU"
    batchType.value = 'sku'
}

// 修改 SKU 时同步修改 warehouseList 里的 offerId
const sellerSKUChange = debounce(record => {
    record.warehouseList.forEach(item => {
        item.offerId = record.sellerSKU
    })
}, 200)

// 批量修改库存
const batchStock = (row = {}) => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    quantityRow.value = row;
    editQuantityVis.value = true;
}

const backQuantity = (e, copyList) => {
    // 生成仓库条目函数（过滤空值并映射结构）
    const createWarehouseEntries = (offerId, copyList) =>
        copyList[0].children
            .filter(item => item.stock != null && item.stock !== "")
            .map(item => ({
                offerId,
                warehouseId: item.warehouseId,
                present: item.stock,
                warehouseName: item.name
            }));

    // 按仓库ID去重函数
    const deduplicateByWarehouseId = (entries) =>
        Array.from(new Map(entries.map(item => [item.warehouseId, item])).values());
    tableData.value[0].quantity = e
    const entries = createWarehouseEntries(tableData.value[0].sellerSKU, copyList);
    tableData.value[0].warehouseList = deduplicateByWarehouseId(entries)
}

//批量修改原价
const batcholdPricebatchPrice = () => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    batchOpen.value = true
    batchTitle.value = "批量修改原价"
    batchType.value = 'oldPrice'
}
// 修改原价
const backOldPrice = (e) => {
    tableData.value[0].oldPrice = e
}

const batchPackLength = () => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    batchOpen.value = true
    batchTitle.value = "批量修改尺寸"
    batchType.value = 'packLength'
}

const backBatchLength = (e) => {
    tableData.value[0].packageLength = e.packageLength
    tableData.value[0].packageWidth = e.packageWidth
    tableData.value[0].packageHeight = e.packageHeight
    tableData.value[0].packageWeight = e.packageWeight
}
const backValue = (batchFields) => {
    switch (batchType.value) {
        case 'sku':
            tableData.value.forEach((item) => {
                item.sellerSKU = batchFields.batchValue;
                item.warehouseList.forEach(warehouse => {
                    warehouse.offerId = item.sellerSKU
                })
            });
            break;
        case 'price':
            updatePrice(tableData.value, 'price', batchFields);
            break;
        case 'oldPrice':
            updatePrice(tableData.value, 'oldPrice', batchFields);
            break;
        case 'packLength':
            tableData.value.forEach((item) => {
                Object.assign(item, batchFields.packageSize);
            });
            break;
        default:
            break;
    }
    batchOpen.value = false;
}

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
}

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
            title: '错误提示',
            content: '售价不能大于原价！'
        })
    }

}

const submitForm = () => {
    const isEmpty = (value) => value == null || value === '' || value === 0;
    const validations = [
        { check: (row) => row.imageUrl == null, text: '请上传变体图片！' },
        { check: (row) => row.imageUrl.length === 0, text: '请上传变体图片，变体图片最少一张！' },
        { check: (row) => isEmpty(row.sellerSKU), text: '请填写SKU编号！' },
        { check: (row) => isEmpty(row.price), text: '请填写售价！' },
        { check: (row) => isEmpty(row.oldPrice), text: '请填写原价！' },
        { check: (row) => isEmpty(row.quantity), text: '请填写库存！' },
        {
            check: (row) => [row.packageHeight, row.packageLength, row.packageWeight, row.packageWidth]
                .some(v => v == null),
            message: '请填写SKU包装信息！'
        }
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
}
// 抛出数据和方法，可以让父级用ref获取
defineExpose({
    tableData,
    submitForm
})

// 点击水印
const handleWatermark = async (item) => {
    for (const tabbleItem of tableData.value) {
        const fileList = tabbleItem.imageUrl || [];
        if (fileList.length === 0) {
            continue;
        }
        const netPathList = fileList.filter((file) => file.url.includes('http')).map((item) => {
            return item.url
        });
        // 只有本地图片
        if (netPathList.length === 0) {
            const imagePathList = fileList.filter((file) => !file.url.includes('http')).map((item) => {
                return item.url
            });
            const waterRes = await watermarkApi({
                imagePathList: imagePathList, //
                id: item.id,
            });
            if (waterRes.code === 200) {
                const data = waterRes.data || [];
                data.forEach((item) => {
                    fileList.forEach(v => {
                        if (item.originalFilename === v.url) {
                            v.url = item.url
                            v.name = item.newFileName
                            v.checked = false
                        }
                    })
                })
            }
        } else {
            // 有网络图片
            console.log('有网络图片');
            const fileList = tabbleItem.imageUrl || [];
            for (let index = 0; index < fileList.length; index++) {
                const fileItem = fileList[index];
                try {
                    let netImgs = [];
                    const url = fileItem.url;
                    if (url.includes('http')) {
                        let res = await imageUrlUpload({ url });
                        netImgs.push(res.data);
                        fileList.forEach(i => {
                            if (i.url === url) {
                                i.url = res.data.url
                            }
                        });
                        const waterRes = await watermarkApi({
                            imagePathList: netImgs.map((img) => img.url),
                            id: item.id,
                        });
                        if (waterRes.code === 200) {
                            const data = waterRes.data || [];
                            data.forEach((_item) => {
                                fileList.forEach(v => {
                                    if (_item.originalFilename.includes(v.url)) {
                                        v.url = _item.url
                                        v.name = _item.newFileName
                                        v.checked = false
                                    }
                                });
                            })
                        }
                    } else {
                        const imagePathList = fileList.filter((file) => !file.url.includes('http')).map((item) => {
                            return item.url
                        });
                        const waterRes = await watermarkApi({
                            imagePathList: imagePathList, //
                            id: item.id,
                        });
                        if (waterRes.code === 200) {
                            const data = waterRes.data || [];
                            data.forEach((item) => {
                                fileList.forEach(v => {
                                    if (item.originalFilename === v.url) {
                                        v.url = item.url
                                        v.name = item.newFileName
                                        v.checked = false
                                    }
                                })
                            })
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }
};

// 导出全部图片
const handleExportAllImages = async () => {
    try {
        const imageList = tableData.value
            .map(item => item.imageUrl)
            .map((imgItem) => imgItem
                .map((i) => i.url
                    .replace(import.meta.env.VITE_APP_BASE_API, "")));
        if (imageList.flat().length === 0) {
            message.warning('请先添加图片！');
            return;
        }
        downloadLoading.value = true;
        let res = await downloadAllImage({ imageList: imageList.flat() });
        message.success('导出成功');
        download.name(res.data)
        downloadLoading.value = false;
    } catch (error) {
        console.error(error)
    }
};

//  图片应用到所有变种
const applyAllImage = (item) => {
    tableData.value.forEach((tableItem) => {
        tableItem.imageUrl = cloneDeep(item.imageUrl)
    })
};

//  图片应用到同主题的变种
const applyImage = (item) => {
    const titles = item.title.split('-');
    console.log('item', item, titles);
    console.log('applyImage', tableData.value);
    const tableDataList = tableData.value.filter((tableItem) => {
        return titles.includes(String(tableItem.id))
    })
};

//  批量修改图片尺寸
const handleEditImagesSize = () => {
    bacthSkuEditImgRef.value.showModal(tableData.value)
};


//  图片翻译弹窗
const handleImageTranslation = () => {
    imageTranslationRef.value.showModal(tableData.value)
};

// 清空图片
const clearAllImages = () => {
    tableData.value.forEach((tableItem) => {
        tableItem.imageUrl = []
    })
};
// const skuThemeNames = (item) => {
//   const tableColumns = attributeList.value[0]?.tableColumns;
//   const themeNames = tableColumns?.map((column) => {
//     return column.title
//   }).filter((nameItem) => nameItem !== '操作')
//   const obj = pick(item, themeNames)
//   const entries = Object.entries(obj);
//   return entries
// };



// 颜色样本- 批量改图片尺寸
const changeImgSize = () => {
    bacthEditColorImgRef.value.showModal(tableData.value)
}
// 颜色样本- 添加水印
const changeImgWater = async (item) => {
    for (const tabbleItem of tableData.value) {
        const fileList = tabbleItem.colorImg || [];
        if (fileList.length === 0) {
            continue;
        }
        const netPathList = fileList.filter((file) => file.url.includes('http')).map((item) => {
            return item.url
        });
        // 只有本地图片
        if (netPathList.length === 0) {
            const imagePathList = fileList.filter((file) => !file.url.includes('http')).map((item) => {
                return item.url
            });
            const waterRes = await watermarkApi({
                imagePathList: imagePathList, //
                id: item.id,
            });
            if (waterRes.code === 200) {
                const data = waterRes.data || [];
                data.forEach((item) => {
                    fileList.forEach(v => {
                        if (item.originalFilename === v.url) {
                            v.url = item.url
                            v.name = item.newFileName
                            v.checked = false
                        }
                    })
                })
            }
        } else {
            // 有网络图片
            console.log('有网络图片');
            const fileList = tabbleItem.colorImg || [];
            for (let index = 0; index < fileList.length; index++) {
                const fileItem = fileList[index];
                try {
                    let netImgs = [];
                    const url = fileItem.url;
                    if (url.includes('http')) {
                        let res = await imageUrlUpload({ url });
                        netImgs.push(res.data);
                        fileList.forEach(i => {
                            if (i.url === url) {
                                i.url = res.data.url
                            }
                        });
                        const waterRes = await watermarkApi({
                            imagePathList: netImgs.map((img) => img.url),
                            id: item.id,
                        });
                        if (waterRes.code === 200) {
                            const data = waterRes.data || [];
                            data.forEach((_item) => {
                                fileList.forEach(v => {
                                    if (_item.originalFilename.includes(v.url)) {
                                        v.url = _item.url
                                        v.name = _item.newFileName
                                        v.checked = false
                                    }
                                });
                            })
                        }
                    } else {
                        const imagePathList = fileList.filter((file) => !file.url.includes('http')).map((item) => {
                            return item.url
                        });
                        const waterRes = await watermarkApi({
                            imagePathList: imagePathList, //
                            id: item.id,
                        });
                        if (waterRes.code === 200) {
                            const data = waterRes.data || [];
                            data.forEach((item) => {
                                fileList.forEach(v => {
                                    if (item.originalFilename === v.url) {
                                        v.url = item.url
                                        v.name = item.newFileName
                                        v.checked = false
                                    }
                                })
                            })
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }
}
// 颜色样本- 清空图片
const clearImg = () => {
    tableData.value.forEach((item) => {
        item.colorImg = [];
    });
}

const changeImgTranslation = () => {
    colorImgTranslationRef.value.showModal(tableData.value)
}


watch(() => useOzonProductStore().attributes, val => {
    if (val.length > 0) {
        // 提取变种主题
        let arr = val.filter((obj) => obj.isAspect);
        isConform.value = checkData(arr);

        let sortArr = rearrangeColorFields(arr)
        console.log('sortArr', sortArr);
        const {
            attributes, oldPrice, price, stock,
            offerId, images, colorImage, warehouseList,
            account, minPrice, primaryImage
        } = props.productDetail;
        rowOldPrice.value = oldPrice
        rowPrice.value = price
        getEditStore(account) //获取仓库
        let newImgList = []
        if (Array.isArray(primaryImage) && primaryImage.length != 0) {
            newImgList = [...new Set([...primaryImage, ...images])]
        } else {
            newImgList = [...new Set([...images])]
        }
        let imgList = []
        imgList = newImgList?.map(item => {
            return {
                url: processImageSource(item),
                checked: false,
            }
        })
        shopCode.value = account
        // 以下是过滤出自定义属性数据
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
                    a.attributeComplexId == "100001" ||
                    a.attributeComplexId == "100002"
                )
        )
        // 
        // 提取出变种主题的标头和对应的值
        if (sortArr.length > 0) {
            const attrs = attributes[0] && attributes[0].attributes;
            console.log('attrs', attrs, sortArr);
            // const idsInA = sortArr.map(item => item.id);
            // let comAttrList = [10096,10097];
            // let comAttrs = [4295,9533];
            // let isInclude = comAttrList.every(id => idsInA.includes(id));
            // let isIncludes = comAttrs.every(id => idsInA.includes(id));
            // console.log('isInclude',isInclude);

            if (attrs) {
                let attrHeaderList = [];
                // const attrsMap = new Map(attrs.map(attr => [attr.id, attr])); // 将attrs转为Map提高查询效率
                const bMap = new Map();
                attrs.forEach(item => bMap.set(item.id, item));
                sortArr.forEach((sortItem) => {
                    const attrItem = bMap.get(sortItem.id);
                    const { selectType, name: sortName, options } = sortItem;
                    if (attrItem) {
                        // 处理多选或单选类型
                        if (selectType === "multSelect" || selectType === "select") {
                            const matchedValues = [];
                            attrItem.values.forEach((valueItem) => {
                                if (!options) return; // 无选项可匹配时跳过
                                const matchedOption = options.find(opt => opt.id === valueItem.dictionaryValueId);
                                if (matchedOption) {
                                    // console.log('matchedOption',matchedOption);
                                    matchedValues.push(matchedOption.value);
                                    // editRes.value[sortName] = matchedOption.value; // 注: 会保留最后一次匹配的值
                                }

                                if (matchedValues.length > 0) {
                                    editRes.value[sortName] = matchedValues.join(',');
                                }
                            });
                        }
                        // 处理其他类型
                        else {
                            const validValue = attrItem.values.find(value => value.value !== "");
                            if (validValue) {
                                editRes.value[sortName] = validValue.value;
                            }

                        }
                        // 添加表头配置（确保每个sortItem只添加一次）
                        attrHeaderList.push({
                            title: sortName,
                            dataIndex: sortName,
                            show: true,
                            align: 'center'
                        });
                    }
                    // else if (isInclude || isIncludes) {
                    //     editRes.value[sortName] = ""
                    //     // 添加表头配置（确保每个sortItem只添加一次）
                    //     attrHeaderList.push({
                    //         title: sortName,
                    //         dataIndex: sortName,
                    //         show: true,
                    //         align: 'center'
                    //     });
                    // }
                    if (!attrItem) return; // 无匹配项则跳过
                    const exists = imgHeaderList.value.some(item => item.title === sortName);
                    if (!exists) {
                        imgHeaderList.value.push({
                            title: sortName
                        })
                    }
                });
                let colorObj = {};
                let colorHead = [];
                if (colorImage.length > 0) {
                    colorObj = {
                        title: "颜色样本",
                        dataIndex: "colorImg",
                        selectType: "url",
                        type: 1,
                        show: true,
                        align: 'center',
                    };
                    addHeaderList.value.push("colorImg");
                    colorHead.push(colorObj);
                }
                attrHeaderList = colorImage
                    ? [...colorHead, ...attrHeaderList]
                    : attrHeaderList;
                headerList.value = [...attrHeaderList, ...headerList.value]
            }
        }
        let colorImageObj = {};
        if (colorImage) {
            colorImageObj = {
                url: processImageSource(colorImage),
                name: colorImage.split('/').pop(),
            };
        }
        let item = {
            packageLength: attributes && attributes[0].depth,
            packageWidth: attributes && attributes[0].width,
            packageHeight: attributes && attributes[0].height,
            packageWeight: attributes && attributes[0].weight,
            oldPrice,
            price,
            minPrice,
            warehouseList: warehouseList && warehouseList,
            quantity: stock,
            sellerSKU: offerId,
            imageUrl: imgList,
            colorImg: colorImage.length > 0 ? [colorImageObj] : [],
        };
        console.log('editRes', editRes.value);
        Object.assign(item, editRes.value);
        tableData.value.push(item)
        console.log("tableData", item);
    }
})
onMounted(() => {
    getWatermark();
});
</script>
<style lang="less" scoped></style>