<template>
    <div id="OzonVariantInfoCont">
        <a-card title="产品信息" style="text-align: left;">
            <a-card title="变种信息" style="text-align: left;">
                <div class="flex mb-2.5">
                    <a-checkbox-group @change="changeHeade" v-model:value="addHeaderList" :options="plainOptions">
                    </a-checkbox-group>
                    <a-button type="primary" class="mx-2.5">添加自定义变种属性</a-button>
                </div>
                <a-table bordered :columns="filteredHeaderList" :data-source="tableData" :pagination="false">
                    <template #headerCell="{ column }">
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
                            <a-upload v-model:file-list="record.colorImg" 
                                list-type="picture-card"
                                class="avatar-uploader"
                                :show-upload-list="false" 
                                :maxCount="1" accept=".jpg,.jpeg,.png"
                                :action="uploadUrl" 
                                :before-upload="beforeUpload" 
                                @change="handleChange"
                                :headers="imgHeaders">
                                <div v-if="record.colorImg.length > 0" class="mt-5">
                                    <img style="width: 100px;height: 100px;" :src="record.colorImg[0]?.url"
                                        alt="avatar" />
                                    <span>{{ record.colorImg[0]?.name }}</span>
                                </div>
                                <div v-else>
                                    <div class="ant-upload-text">Upload</div>
                                </div>
                            </a-upload>
                        </template>
                        <template v-if="column.dataIndex === 'skuTitle'">
                            <a-input v-model:value="record.skuTitle"></a-input>
                        </template>
                        <template v-if="column.dataIndex === 'secondName'">
                            <span>{{ record.secondName }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'sellerSKU'">
                            <a-input v-model:value="record.sellerSKU"></a-input>
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                            <a-input-number style="width: 80%" v-model:value="record.price"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'oldPrice'">
                            <a-input-number style="width: 80%" v-model:value="record.oldPrice"></a-input-number>
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
                                    <a-input-number controls-position="right" style="width: 80%"
                                        v-model:value="record.packageLength" placeholder="长度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    宽度：
                                    <a-input-number controls-position="right" style="width: 80%"
                                        v-model:value="record.packageWidth" placeholder="宽度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    高度：
                                    <a-input-number controls-position="right" style="width: 80%"
                                        v-model:value="record.packageHeight" placeholder="高度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    重量：
                                    <a-input-number controls-position="right" style="width: 80%"
                                        v-model:value="record.packageWeight" placeholder="重量"
                                        @blur="handleInput(record.packageWeight, record)">
                                        <template #addonAfter>g</template>
                                    </a-input-number>
                                </div>
                            </div>
                        </template>
                    </template>
                </a-table>
            </a-card>
        </a-card>
        <!-- 改售价 -->
        <batchPriceModal :batchPriceVis="batchPriceVis" @backPrice="backPrice" :rowPrice="rowPrice"
            @handleBatchPriceModalClose="batchPriceVis = false"></batchPriceModal>
        <!-- 改原价 -->
        <batcholdPriceModal :batchOldPriceVis="batchOldPriceVis" :rowOldPrice="rowOldPrice"
            @handleBatcholdPriceModalClose="batchOldPriceVis = false" @backOldPrice="backOldPrice"></batcholdPriceModal>
        <!-- 库存 -->
        <editQuantity :quantityRow="quantityRow" :editStockList="editStockList" :editQuantityVis="editQuantityVis"
            @backQuantity="backQuantity" @backCloseQuantity="editQuantityVis = false">
        </editQuantity>
        <!-- 尺寸 -->
        <OzonBatchLength :editLengthRangeVis="editLengthRangeVis" @backBatchLength="backBatchLength"
            @backCloseBatchLength="editLengthRangeVis = false"></OzonBatchLength>
    </div>
</template>

<script setup name='OzonVariantInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message } from "ant-design-vue";
import batchPriceModal from './batchPriceModal.vue';
import batcholdPriceModal from './batcholdPriceModal.vue';
import editQuantity from './editQuantity.vue';
import OzonBatchLength from './OzonBatchLength.vue';
import { productWarehouse } from "../../config/api/product"

const props = defineProps({
    productDetail: Object,
    attributesCache: Array
});
const batchPriceVis = ref(false)
const batchOldPriceVis = ref(false)
const editQuantityVis = ref(false)
const editLengthRangeVis = ref(false)
const quantityRow = ref({})
const tableData = ref([])
const themeBtns = ref([])
const editRes = ref([])
const editStockList = ref([]) //仓库数据
const rowOldPrice = ref("")
const rowPrice = ref("")
const headerList = ref([
    {
        dataIndex: 'sellerSKU',
        title: 'SKU',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'price',
        title: '售价',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'oldPrice',
        title: '原价',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'quantity',
        title: '库存',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'packageLength',
        title: '尺寸',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'options',
        title: '操作',
        show: true,
        align: 'center'
    }
]) //动态表头
const addHeaderList = ref([])
const plainOptions = [
    {
        label: '颜色样本',
        value: 'colorImg',
    },
    {
        label: '设置SKU标题',
        value: 'skuTitle',
    },
]
const uploadUrl =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/file/upload/img"
const imgHeaders = {
    Authorization: useAuthorization().value,
}

const filteredHeaderList = computed(() => {
    return headerList.value.filter((item) => item.show === true);
})

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
                // this.$set(headerList.value, headerList.value.length, obj);
            }
        }
    });
}

const handleInput = (packageWeight, row) => {
    row.packageWeight = packageWeight.split(".")[0];
}

// 批量修改售价
const batchPrice = () => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    batchPriceVis.value = true
}
// 修改售价
const backPrice = (e) => {
    console.log('e***', e);
    tableData.value[0].price = e
}

// 批量修改SKU
const batchSKU = () => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    this.$prompt("", "批量修改SKU", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // inputPattern: /^\d+(.\d{1,2})?$/,
        inputErrorMessage: "",
    }).then(({ value }) => {
        tableData.value.forEach((value1) => {
            value1.sellerSKU = value;
            ++this.refreshKey;
        });
        this.$forceUpdate();
    });
}
// 批量修改库存
const batchStock = (row = {}) => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    quantityRow.value = row;
    editQuantityVis.value = true;
}

const backQuantity = (e) => {
    tableData.value[0].quantity = e
}

//批量修改原价
const batcholdPricebatchPrice = () => {
    if (tableData.value.length == 0) {
        message.warning("请先添加sku！");
        return;
    }
    batchOldPriceVis.value = true
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
    editLengthRangeVis.value = true;
}

const backBatchLength = (e) => {
    tableData.value[0].packageLength = e.packageLength
    tableData.value[0].packageWidth = e.packageWidth
    tableData.value[0].packageHeight = e.packageHeight
    tableData.value[0].packageWeight = e.packageWeight
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

const beforeUpload = (file, fileList) => {
    console.log('file, fileList', file, fileList);
    console.log('useAuthorization', useAuthorization().value);

}

const handleChange = (e) => {
    if (e.file.status === 'done') {
        message.success("上传成功！");
        tableData.value[0].colorImg = [{
            url: e?.file?.response?.url,
            name: e?.file?.response?.originalFilename
        }]
    } else if (e.file.status === 'error') {
        message.error("上传有误，请重新上传");
    }
}

watch(() => props.attributesCache, val => {
    if (val.length > 0) {
        themeBtns.value = val.filter(
            (obj) => obj.isAspect && obj.isRequired === false
        );

        // 过滤必填项的变种主题
        // let requiredList = this.attributes.filter(
        //   (obj) => obj.isAspect && obj.isRequired && obj.isCollection
        // );
        let requiredList = val.filter(
            (obj) => obj.isAspect && obj.isRequired
        );
        const {
            attributes,
            oldPrice,
            price,
            stock,
            offerId,
            images,
            colorImage,
            warehouse,
            account
        } = props.productDetail;
        rowOldPrice.value = oldPrice
        rowPrice.value = price
        getEditStore(account)
        // let imageUrls = images.slice(0, 15).map((item) => {
        //     return {
        //         url: item,
        //     };
        // });

        //!
        if (requiredList.length > 0 || themeBtns.value.length > 0) {
            const combinedList = requiredList.concat(themeBtns.value);
            const attrs = attributes[0] && attributes[0].attributes;
            if (attrs) {
                const headerList = [];
                combinedList.forEach((item) => {
                    const attrItem = attrs.find(
                        // (attr) => attr.attribute_id === item.id
                        (attr) => attr.id === item.id
                    );
                    if (attrItem) {
                        const value = attrItem.values.find(
                            (value) => value.value !== ""
                        );
                        if (value) {
                            editRes.value[item.name] = value.value;
                            // 在forEach中创建headerList
                            headerList.push({ prop: item.name, label: item.name });
                        }
                    }
                });
                let colorObj = {};
                let colorHead = [];

                if (colorImage) {
                    colorObj = {
                        prop: "颜色样本",
                        label: "颜色样本",
                        selectType: "url",
                        type: 1,
                        options: null,
                    };
                    addHeaderList.value.push("颜色样本");
                    colorHead.push(colorObj);
                }
                headerList.value = colorImage
                    ? [...colorHead, ...headerList]
                    : headerList;
            }
        }
        let colorImageObj = {};
        if (colorImage) {
            colorImageObj = {
                url: colorImage,
                name: colorImage.substring(colorImage.lastIndexOf("/") + 1),
            };
        }
        let item = {
            packageLength: attributes && attributes[0].depth,
            packageWidth: attributes && attributes[0].width,
            packageHeight: attributes && attributes[0].height,
            packageWeight: attributes && attributes[0].weight,
            oldPrice,
            price,
            warehouseId: warehouse && warehouse[0].warehouseId,
            warehouseName: warehouse && warehouse[0].warehouseName,
            quantity: stock,
            sellerSKU: offerId,
            colorImg: colorImage ? [colorImageObj] : [],
        };

        Object.assign(item, editRes.value);
        // this.$set(this.tableData, 0, item);
        tableData.value.push(item)
        console.log("tableData", tableData.value);
    }
})
</script>
<style lang="less" scoped></style>