<template>
    <div id="OzonVariantInfoCont">
        <a-card title="产品信息" class="text-left mt-5 text-16px">
            <a-card title="变种信息" class="text-left text-16px z-11 relative">
                <div class="flex mb-2.5">
                    <a-checkbox-group @change="changeHeade" v-model:value="addHeaderList" :options="plainOptions">
                    </a-checkbox-group>
                    <!-- <a-button type="primary" :disabled="custAttr.length == 0" @click="attrVisible = true"
                        class="mx-2.5">添加自定义变种属性</a-button> -->
                </div>
                <a-table bordered :columns="filteredHeaderList" :data-source="tableData" :pagination="false">
                    <template #headerCell="{ column }">
                        <template v-if="column.dataIndex === 'colorImg'">
                            <div><span style="color: #ff0a37">*</span> {{ column.title }}</div>
                            <a-dropdown>
                                <a class="ant-dropdown-link" @click.prevent>
                                    (批量
                                    <DownOutlined />)
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
                            <div class="flex flex-col min-w-25">
                                <span><span style="color: #ff0a37;">*</span>
                                    {{ column.title }}</span><a class="ml-1.25" @click="batchPrice">批量</a>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'oldPrice'">
                            <div class="flex flex-col min-w-25">
                                <span><span style="color: #ff0a37;">*</span>
                                    {{ column.title }}</span><a class="ml-1.25" @click="batcholdPricebatchPrice">批量</a>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'minPrice'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'quantity'">
                            <div class="flex flex-col min-w-25">
                                <span><span style="color: #ff0a37;">*</span>
                                    {{ column.title }}</span><a class="ml-1.25" @click="batchStock">批量</a>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'packageLength'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}(mm)</span><a class="ml-1.25" @click="batchPackLength">批量</a>
                                <p>长*宽*高*重量</p>
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
                            <a-input class="min-w-200px" v-model:value="record.skuTitle" :title="record.skuTitle" size="middle"></a-input>
                        </template>
                        <template v-if="column.dataIndex === 'secondName'">
                            <span class="min-w-200px">{{ record.secondName }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'sellerSKU'">
                            <a-input disabled v-model:value="record.sellerSKU" size="middle"
                                @change="sellerSKUChange(record)"></a-input>
                        </template>
                        <template v-if="!otherHeader.includes(column.dataIndex)">
                            <a-input v-if="column.selectType === 'input'" size="middle"
                                v-model:value="record[column.dataIndex]" class="min-w-200px"></a-input>
                            <a-select v-if="column.selectType === 'select'" size="middle"
                                v-model:value="record[column.dataIndex]" class="min-w-200px"
                                :options="column.options"></a-select>
                            <a-select v-if="column.selectType === 'multSelect'" size="middle" :maxTagCount="2"
                                v-model:value="record[column.dataIndex]" class="min-w-200px" :options="column.options"
                                mode="tags"></a-select>
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                            <a-input-number class="w-full" size="middle" v-model:value="record.price"
                                @blur="judgeMax(record)"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'oldPrice'">
                            <a-input-number class="w-full" size="middle" v-model:value="record.oldPrice"
                                @blur="judgeMax(record)"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'minPrice'">
                            <a-input-number disabled class="w-full" size="middle"
                                v-model:value="record.minPrice"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'quantity'">
                            <span>{{ record.quantity }}</span>
                            <AsyncIcon style="margin-left: 10px;" icon="EditOutlined" @click="batchStock(record)">
                            </AsyncIcon>
                        </template>
                        <template v-if="column.dataIndex === 'packageLength'">
                            <div class="flex">
                                <div>
                                    <a-input-number controls-position="right" size="middle"
                                        v-model:value="record.packageLength" placeholder="长度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div class="ml-2.5">
                                    <a-input-number controls-position="right" size="middle"
                                        v-model:value="record.packageWidth" placeholder="宽度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div class="ml-2.5">
                                    <a-input-number controls-position="right" size="middle"
                                        v-model:value="record.packageHeight" placeholder="高度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div class="ml-2.5">
                                    <a-input-number controls-position="right" size="middle"
                                        v-model:value="record.packageWeight" :precision="0" placeholder="重量">
                                        <template #addonAfter>g</template>
                                    </a-input-number>
                                </div>
                            </div>
                        </template>
                    </template>
                </a-table>
            </a-card>
            <!-- 图片信息 -->
            <ImageInfo :data-source="tableData" :water-mark-options="watermark" :attr-list="attrList" />
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
import { watermarkListApi, watermarkApi } from "~/api/common/water-mark";
import EditProdQuantity from '../../productPublish/comm/EditProdQuantity.vue';
import { uploadImage } from '@/pages/ozon/config/api/draft';
import { debounce } from "lodash";
import { DownOutlined } from '@ant-design/icons-vue';
import { imageUrlUpload } from '@/pages/sample/acquisitionEdit/js/api.js'
import colorImgTranslation from "./colorImgTranslation.vue";
import bacthEditColorImg from "./bacthEditColorImg.vue";
import { v4 as uuidv4 } from 'uuid'
import ImageInfo from '@/pages/ozon/config/component/image-info/index.vue'

const props = defineProps({
    productDetail: Object,
});


const bacthEditColorImgRef = ref();
const colorImgTranslationRef = ref();
const bigImgvisible = ref(false);



const editQuantityVis = ref(false)

const batchOpen = ref(false)
const newAttribute = ref([])
const custAttr = ref([]) //可控制属性
const batchTitle = ref("")
const batchType = ref('')
const quantityRow = ref({})
const tableData = ref([])
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
const shopCode = ref("")

const uploadUrl =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/file/upload/img"
const headers = {
    'Authorization': 'Bearer ' + useAuthorization().value,
}

// 监听 attributeList, 获取变种名列表
const attrList = ref([])
watch(() => attributeList.value, () => {
  attrList.value = attributeList.value.map(item => item.tableColumns.slice(0, -1).map(column => column.title))
})

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


const batchPackLength = () => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    batchOpen.value = true
    batchTitle.value = "批量修改尺寸"
    batchType.value = 'packLength'
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
                id: uuidv4()
            }
        })
        shopCode.value = account
        // 以下是过滤出自定义属性数据
        // const newAttributesCache = processAttributesCache(val);
        // const list = newAttributesCache.filter((a) => !a.isRequired);
        // custAttr.value = list.filter(
        //     (a) =>
        //         !(a.isAspect && !a.isRequired) &&
        //         !(a.isAspect && a.isCollection) &&
        //         !(
        //             a.id === 4080 ||
        //             a.id == 8229 ||
        //             a.id == 8789 ||
        //             a.id == 8790 ||
        //             a.id == 4180 ||
        //             a.id == 4191 ||
        //             a.id == 11254 ||
        //             a.id == 9024
        //         ) &&
        //         !(
        //             a.attributeComplexId == "100001" ||
        //             a.attributeComplexId == "100002"
        //         )
        // )
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
                });
                let colorObj = {};
                let colorHead = [];
                if (colorImage != null && colorImage.length > 0) {
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
        // console.log('editRes', editRes.value);
        Object.assign(item, editRes.value);
        tableData.value.push(item)
        // console.log("tableData", item);
    }
})
onMounted(() => {
    getWatermark();
});
</script>
<style lang="less" scoped></style>