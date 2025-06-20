<template>
  <a-table
    :columns="dropCol"
    :data-source="tableData"
    :defaultExpandedRowKeys="keyIds"
    :defaultExpandAllRows="true"
    rowKey="id"
    :row-selection="rowSelection"
  >
    <template #bodyCell="{ column }">
      <template v-if="column.dataIndex === 'name'">
        <span>总产品</span>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <a-table :columns="dropCol" :data-source="record.son" 
         :pagination="false" :showHeader="false" >
                <template #bodyCell="{ column, record }">
                    <div v-if="column.dataIndex === 'name'" class="flex">
                        <a-checkbox style="margin:0 10px;" @change="handelChecked($event, record)"
                            v-model:checked="record.checked"></a-checkbox>
                        <div class="flex text-left items-center">
                            <a-image style="width: 100px; height: 100px;" :src="record.primaryImage && record.primaryImage.length > 0 ? processImageSource(record.primaryImage[0]) : processImageSource(record.images[0])
                                ">
                            </a-image>
                            <div style="margin-left: 10px; display: block">
                                <a-tooltip class="item">
                                    <template #title>
                                        <span>{{ record.name }}</span>
                                    </template>
                                    <div class="truncate prodTitle">{{ record.name }}</div>
                                </a-tooltip>
                                <div style="color: #999; float: left">
                                    产品ID：
                                    <a-tooltip placement="top">
                                        <template #title>
                                            <span style="cursor: pointer" @click="copyText(record.sku)">复制</span>
                                        </template>
                                        <a style="color: #1677ff" href="#" @click="jumpTo(record.sku)">{{
                                            record.sku }}</a>
                                    </a-tooltip>

                                </div>
                                <br />
                                <div style="color: #999; float: left">
                                    店铺: {{ record.simpleName }}
                                </div>
                                <br />

                                <div :style="{
                                    color: record.remarkColor ? 'green' : 'red',
                                    float: 'left',
                                }">
                                    备注:{{ record.remark }}
                                </div>
                                <div style="color: red;" v-if="record.bathErrorInfo">
                                    失败原因:{{ record.bathErrorInfo }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="column.dataIndex === 'state'">
                        <a-tag :bordered="false" color="processing" v-if="record.state === '平台审核'">{{
                            record.state
                            }}</a-tag>
                        <a-tag :bordered="false" color="success" v-if="record.state === '在售'">{{ record.state
                            }}</a-tag>
                        <a-tag :bordered="false" color="warning" v-if="record.state === '审核不通过'">{{ record.state
                            }}</a-tag>
                        <a-tag :bordered="false" color="error" v-if="record.state === '准备出售'">{{ record.state
                            }}</a-tag>
                        <a-tag :bordered="false" color="default" v-if="record.state === '已归档'">{{ record.state
                            }}</a-tag>
                    </div>
                    <div v-if="column.dataIndex === 'sku'" style="text-align: left">
                        <div>
                            <div style="color: #1677ff;cursor: pointer">
                                <a-tooltip placement="topLeft">
                                    <template #title>
                                        <span style="cursor: pointer" @click="copyText(record.offerId)">复制</span>
                                    </template>
                                    <div>{{ record.offerId }}</div>
                                </a-tooltip>
                            </div>
                            <div style="color: #428bca; cursor: pointer" @click="
                                showChildren(
                                    record.account,
                                    record.typeId
                                )
                                ">
                            </div>
                            <div>
                                促销活动价：<span style="color: #1677ff">{{
                                    record.marketingPrice ? record.marketingPrice : "暂未参加活动"
                                    }}</span>
                            </div>
                            <div>
                                <div style="display: flex">
                                    <span>内容质量分:</span>
                                    <div v-if="record.productsScore">
                                        <a-popover placement="right" :overlayInnerStyle="{ width: '400px' }"
                                            trigger="click">
                                            <template #content>
                                                <div class="scoreItem">
                                                    <div class="flex justify-between">
                                                        <div>
                                                            <span style="font-weight: bold">
                                                                搜索属性</span>
                                                            <a-tooltip placement="right"
                                                                :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                                                <template #title>
                                                                    <span class="m-2.5 font-black text-black">{{
                                                                        discLists[0].title }}
                                                                    </span>
                                                                    <br />
                                                                    <div v-for="(e, ind) in discLists[0].list"
                                                                        :key="ind"
                                                                        class="m-2.5 flex justify-between text-black">
                                                                        <span>{{ e.sock }}</span><span>{{
                                                                            e.disc }}</span>
                                                                    </div>
                                                                </template>
                                                                <AsyncIcon icon="QuestionCircleOutlined"
                                                                    class="ml-2.5" />
                                                            </a-tooltip>
                                                        </div>
                                                        <div>
                                                            <span>分数:</span><span>{{
                                                                record.productsScore[0].groups[0].score
                                                                }}分</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style="color: #999">至少填写{{
                                                            record.productsScore[0].groups[0]
                                                                .improveAtLeast
                                                        }}个属性可得最大分数</span>
                                                        <ul>
                                                            <li v-for="(item, index) in record
                                                                .productsScore[0].groups[0]
                                                                .improveAttributes" :key="index">
                                                                {{ item.name }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div class="scoreItem">
                                                    <div class="flex justify-between">
                                                        <div><span style="font-weight: bold">其他属性</span>
                                                            <a-tooltip placement="right"
                                                                :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                                                <template #title>
                                                                    <span class="m-2.5 font-black text-black">{{
                                                                        discLists[1].title }}
                                                                    </span>
                                                                    <br />
                                                                    <div v-for="(e, ind) in discLists[1].list"
                                                                        :key="ind"
                                                                        class="m-2.5 flex justify-between text-black">
                                                                        <span>{{ e.sock }}</span><span>{{
                                                                            e.disc }}</span>
                                                                    </div>
                                                                </template>
                                                                <AsyncIcon icon="QuestionCircleOutlined"
                                                                    class="ml-2.5" />
                                                            </a-tooltip>
                                                        </div>
                                                        <div>
                                                            <span>分数:</span><span>{{
                                                                record.productsScore[0].groups[1].score
                                                                }}分</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style="color: #999">至少填写{{
                                                            record.productsScore[0].groups[1]
                                                                .improveAtLeast
                                                        }}个属性可得最大分数</span>
                                                        <ul>
                                                            <li v-for="(item, index) in record
                                                                .productsScore[0].groups[1]
                                                                .improveAttributes" :key="index">
                                                                {{ item.name }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div class="scoreItem">
                                                    <div class="flex justify-between">
                                                        <div><span style="font-weight: bold">描述和丰富内容</span>
                                                            <a-tooltip placement="right"
                                                                :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                                                <template #title>
                                                                    <span class="m-2.5 font-black text-black">{{
                                                                        discLists[2].title }}
                                                                    </span>
                                                                    <br />
                                                                    <div v-for="(e, ind) in discLists[2].list"
                                                                        :key="ind"
                                                                        class="m-2.5 flex justify-between text-black">
                                                                        <span>{{ e.sock }}</span><span>{{
                                                                            e.disc }}</span>
                                                                    </div>
                                                                </template>
                                                                <AsyncIcon icon="QuestionCircleOutlined"
                                                                    class="ml-2.5" />
                                                            </a-tooltip>
                                                        </div>
                                                        <div>
                                                            <span>分数:</span><span>{{
                                                                record.productsScore[0].groups[2].score
                                                                }}分</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style="color: #999">至少填写{{
                                                            record.productsScore[0].groups[2]
                                                                .improveAtLeast
                                                        }}个属性可得最大分数</span>
                                                        <ul>
                                                            <li v-for="(item, index) in record
                                                                .productsScore[0].groups[2]
                                                                .improveAttributes" :key="index">
                                                                {{ item.name }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div class="scoreItem">
                                                    <div class="flex justify-between">
                                                        <div><span style="font-weight: bold">图片和视频</span>
                                                            <a-tooltip placement="right"
                                                                :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                                                <template #title>
                                                                    <span class="m-2.5 font-black text-black">{{
                                                                        discLists[3].title }}
                                                                    </span>
                                                                    <br />
                                                                    <div v-for="(e, ind) in discLists[3].list"
                                                                        :key="ind"
                                                                        class="m-2.5 flex justify-between text-black">
                                                                        <span>{{ e.sock }}</span><span>{{
                                                                            e.disc }}</span>
                                                                    </div>
                                                                </template>
                                                                <AsyncIcon icon="QuestionCircleOutlined"
                                                                    class="ml-2.5" />
                                                            </a-tooltip>
                                                        </div>
                                                        <div>
                                                            <span>分数:</span><span>{{
                                                                record.productsScore[0].groups[3].score
                                                                }}分</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style="color: #999">至少填写{{
                                                            record.productsScore[0].groups[3]
                                                                .improveAtLeast
                                                        }}个属性可得最大分数</span>
                                                        <ul>
                                                            <li>Ozon视频： 链接</li>
                                                            <li>Ozon.视频封面：链接</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </template>
                                            <span style="margin-left: 10px;color: #1677ff;cursor: pointer;">{{
                                                record.productsScore[0].rating
                                                }}分</span>
                                        </a-popover>
                                    </div>
                                    <span v-else class="ml-2.5">{{ 0.0 }}分</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="column.dataIndex === 'price'">
                        <span style="color: #1677ff" v-if="!(priceVisible && itemId == record.id)">{{
                            record.currencyCode }} {{
                                record.price
                            }}</span>
                        <div v-else class="inline-block">
                            <a-input type="number" class="mr-2.5 w-30" v-model:value="record.price"
                                placeholder="请输原价格"></a-input>
                            <a-button class="mr-2.5" @click="priceVisible = false">取消</a-button>
                            <a-button type="primary" :loading="loading" @click="checkOldPrice(record)">确定</a-button>
                        </div>
                        <AsyncIcon v-if="!(priceVisible && itemId == record.id)" icon="EditOutlined"
                            style="cursor: pointer; color: #1677ff" @click="editSinglePrice(record)">
                        </AsyncIcon>

                    </div>
                    <div v-if="column.dataIndex === 'oldPrice'">
                        <span style="color: #1677ff" v-if="!(singleVisible && itemId == record.id)">{{
                            record.currencyCode }} {{
                                record.oldPrice
                            }}</span>
                        <div v-else class="inline-block">
                            <a-input type="number" class="mr-2.5 w-30" v-model:value="record.oldPrice"
                                placeholder="请输原价格"></a-input>
                            <a-button class="mr-2.5" @click="singleVisible = false">取消</a-button>
                            <a-button type="primary" :loading="loading" @click="checkOldPrice(record)">确定</a-button>
                        </div>
                        <AsyncIcon v-if="!(singleVisible && itemId == record.id)"
                            style="cursor: pointer; color: #1677ff" icon="EditOutlined"
                            @click="handelEditPrice(record)">
                        </AsyncIcon>
                    </div>
                    <div v-if="column.dataIndex === 'minPrice'">
                        <span style="color: #1677ff"
                            v-if="record.minPrice && !(minPriceVisible && itemId == record.id)">CNY {{
                                record.minPrice
                            }}</span><span v-if="!record.minPrice">---</span>
                        <div v-if="minPriceVisible && itemId == record.id" class="inline-block">
                            <a-input type="number" class="mr-2.5 w-30" v-model:value="record.minPrice"
                                placeholder="请输原价格"></a-input>
                            <a-button class="mr-2.5" @click="minPriceVisible = false">取消</a-button>
                            <a-button type="primary" :loading="loading" @click="checkOldPrice(record)">确定</a-button>
                        </div>
                        <AsyncIcon v-if="!(minPriceVisible && itemId == record.id) && record.minPrice"
                            style="cursor: pointer; color: #1677ff" icon="EditOutlined"
                            @click="handelEditminPrice(record)">
                        </AsyncIcon>
                    </div>
                    <div v-if="column.dataIndex === 'stock'">
                        <a-tooltip style="margin-right: 10px" effect="dark" placement="top" v-if="record.warehouseList">
                            <template #title>
                                <div v-for="(item, index) in record.warehouseList" :key="index">
                                    <span>{{ item.warehouseName }}</span>:
                                    <span>{{ item.present ? item.present : 0 }}</span>
                                </div>
                            </template>
                            <span style="color: #1677ff">{{ record.stock }}</span>
                        </a-tooltip>
                        <span v-else style="color: #1677ff; margin-right: 10px">{{
                            record.stock
                            }}</span>
                        <AsyncIcon style="cursor: pointer; color: #1677ff" icon="EditOutlined" v-if="
                            record.state != '审核不通过' && record.state != '已归档'
                        " @click="editStock(record)"></AsyncIcon>
                    </div>
                    <div v-if="column.dataIndex === 'errorInfo'">
                        <div v-if="record.errors != null">
                            <div style="display: flex">
                                <div>
                                    详细描述:
                                    <a-popover :overlayInnerStyle="{ width: '1000px' }" trigger="click">
                                        <template #content>
                                            <a-table :pagination="false" :data-source="record.errors
                                                " bordered :scroll="{ x: 200, y: 300 }" :columns="errorColumns">
                                            </a-table>
                                        </template>
                                        <a-button type="primary" :disabled="record.errors &&
                                            record.errors.length == 0
                                            " style="margin-left: 20px">更多信息</a-button>
                                    </a-popover>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="column.dataIndex === 'createdAt'"
                        style="display: flex;flex-direction: column;align-items: flex-start;">
                        <div>
                            创建时间：<span style="color: #9e9f9e">{{
                                timestampToDateTime(record.createdTime)
                                }}</span>
                        </div>
                        <div>
                            更新时间：<span style="color: #9e9f9e">{{
                                timestampToDateTime(record.updatedTime)
                                }}</span>
                        </div>
                    </div>
                    <div v-if="column.dataIndex === 'option'">
                        <a-row>
                            <a-col :span="11" v-if="record.state !== '已归档'">
                                <a-button @click.stop="edit(record)" type="text" style="color: #0b56fa">编辑</a-button>
                            </a-col>
                            <a-col :span="11">
                                <a-dropdown>
                                    <a class="ant-dropdown-link">
                                        更多
                                        <DownOutlined />
                                    </a>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item style="color: #67c23a" @click="syncOne(record)">
                                                同步
                                            </a-menu-item>
                                            <a-menu-item style="color: #0d9888" @click="copyItems(record)">
                                                复制
                                            </a-menu-item>
                                            <a-popconfirm ok-text="YES" cancel-text="NO" title="归档吗？"
                                                @confirm="deactivate(record)">
                                                <a-menu-item v-if="record.state !== '已归档'" type="text"
                                                    style="color: #e6a23c">归档</a-menu-item>
                                            </a-popconfirm>
                                            <a-menu-item @click="addRemark(record)">
                                                备注
                                            </a-menu-item>
                                            <a-popconfirm ok-text="YES" cancel-text="NO" title="删除代表该产品在ozon平台删除，确定删除吗？"
                                                @confirm="deleteItem(record)">
                                                <a-menu-item type="text" v-if="
                                                    record.sku === 'sku未创建' && record.state === '已归档'
                                                " style="color: red">删除</a-menu-item>
                                            </a-popconfirm>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </a-col>
                        </a-row>
                    </div>
                </template>
            </a-table>
    </template>
  </a-table>
</template>
<script setup lang="js">
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import {
    accountCache, list, batchArchive, syncOneProduct, syncHistoryCategory, mergeList, asyncProgress,
    updatePrices, productWarehouse, del, syncShopProductAll, syncShopProduct,
    byState
} from '../config/api/product';
import tableHead from "../config/tabColumns/product"
import { SettingOutlined, EditOutlined, ReloadOutlined, CloudUploadOutlined, DownloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { processImageSource } from "~/pages/ozon/config/commJs/index";
import { title } from "process";
import { ch } from "./mock";
import { deepClone } from '~@/utils'
const dropCol = tableHead
const tableData = ref([])
const shopAccount = ref([])
const tabQuantity = ref([])
const priceVisible = ref(false)
const singleVisible = ref(false)
const minPriceVisible = ref(false)
const editQuantityVis = ref(false)
const keyIds = ref(["1130903580077854720"])
const advancedForm = reactive({
    minPrice: "",
    maxPrice: "",
    minOldPrice: "",
    maxOldPrice: "",
    minStock: null,
    maxStock: null,
    // isRemark: "",
    timeSort: "update_time",
    time: []
})
const formData = reactive({
    id: "",
    account: "",
    sku: "",
    name: "",
    prop: "created_time",
    order: "desc",
    state: ""
})
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0,
});

const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
});

// 店铺数据
const getAccount = () => {
    accountCache().then(async (res) => {
        if (res.data) {
            shopAccount.value = res?.data ?? [];
            await getList();
        }
    });
}
const timestampToDateTime = (timestamp) => {
    if (timestamp == null || timestamp == "") {
        return "无";
    }
    return timestamp;
}

// 获取店铺数据
const getList = async (isSearch = false) => {
    if (advancedForm.minPrice > advancedForm.maxPrice) {
        message.error("最大售价必须大于最小售价！");
        return;
    }
    if (advancedForm.minOldPrice > advancedForm.maxOldPrice) {
        message.error("最大原价必须大于最小原价！");
        return;
    }
    if (advancedForm.minStock > advancedForm.maxStock) {
        message.error("最大库存必须大于最小库存！");
        return;
    }
    // loading.value = true;
    let params = {
        ...formData,
        ...advancedForm,
        startDateTime: advancedForm.time.length ? dayjs(advancedForm.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
        endDateTime: advancedForm.time.length ? dayjs(advancedForm.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
        pageNum: paginations.pageNum,
        pageSize: paginations.pageSize,
        isSearch
    }
    await list(params)
        .then((res) => {
            const rest =
                res?.data?.map((item) => {
                    item.show = false;
                    item.children.forEach(e => {
                        e.errors = e?.errors?.map(el => {
                            return {
                                attributeName: el?.texts?.attributeName,
                                description: el?.texts?.description,
                                message: el?.texts?.message
                            }
                        })
                    })
                    item["son"] = item.children
                    delete item.children
                    return item;
                }) ?? [];
                tableData.value = deepClone(rest)
                keyIds.value = res?.data.map(item => item.id)
        })
        .finally(() => {
            // loading.value = false;
        });
    console.log('tableData', keyIds.value);
    byState(params).then(res => {
        tabQuantity.value = res?.data?.rows0 ?? [];
        paginations.total = res?.data?.total ?? 0;
    })

}

onMounted(() => {
    getAccount()
})
</script>
<style lang="less" scoped></style>
