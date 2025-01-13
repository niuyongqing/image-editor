<template>
    <div id="productListCont">
        <a-modal :open="prodListVisible" :maskClosable="false" @cancel="handleCancel" :width="'40%'" :keyboard="false"
            title="修改价格" :footer="null">
            <a-table :columns="columns" :data-source="childList" :pagination="false">
                <template #bodyCell="{ column, record }">
                    <div v-if="column.dataIndex === 'name'" class="flex">
                        <div class="flex text-left items-center">
                            <a-image style="width: 100px; height: 100px;" :src="record.primaryImage ? record.primaryImage : record.images[0]
                                ">
                            </a-image>
                            <div style="margin-left: 10px; display: block">
                                <a-tooltip class="item">
                                    <template #title>
                                        <span>{{ record.name }}</span>
                                    </template>
                                    <div class="w-100 truncate">{{ record.name }}</div>
                                </a-tooltip>
                                <div style="color: #999; float: left">
                                    产品ID：<a style="color: #1677ff" href="#" @click="jumpTo(record.sku)">{{
                                        record.sku }}</a>
                                </div>
                                <br />
                                <div style="color: #999; float: left">
                                    店铺: {{ record.simpleName }}
                                </div>
                                <br />
                                <br />
                                <div :style="{
                                    color: record.remarkColor ? 'green' : 'red',
                                    float: 'left',
                                }">
                                    备注:{{ record.remark }}
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
                            <div>
                                SKU: {{ record.offerId }}
                                <a-divider type="vertical"></a-divider>
                                促销活动价：<span style="color: #1677ff">{{
                                    record.marketingPrice ? record.marketingPrice : "暂未参加活动"
                                    }}</span>
                                <a-divider type="vertical"></a-divider>
                                库存：
                                <a-tooltip style="margin-right: 10px" effect="dark" placement="top"
                                    v-if="record.warehouse">
                                    <template #title>
                                        <div v-for="(item, index) in record.warehouse" :key="index">
                                            <span>{{ item.warehouseName }}</span>:
                                            <span>{{ item.present ? item.present : 0 }}</span>
                                        </div>
                                    </template>
                                    <span style="color: #1677ff">{{ record.stock }}</span>
                                </a-tooltip>
                                <span v-else style="color: #1677ff; margin-right: 10px">{{
                                    record.stock
                                    }}</span>
                            </div>
                            <div>
                                最低价：<span style="color: #1677ff" v-if="record.minPrice">CNY {{
                                    record.minPrice
                                    }}</span><span v-if="!record.minPrice">---</span>
                                <a-divider type="vertical"></a-divider>
                                原价：<span style="color: #1677ff">CNY {{
                                    record.oldPrice
                                }}</span>
                                <a-divider type="vertical"></a-divider>
                                当前售价：<span style="color: #1677ff">CNY {{
                                    record.price
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
                                    <span v-else>{{ 0.0 }}分</span>
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
                </template>
            </a-table>
        </a-modal>
    </div>
</template>

<script setup name='productList'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
const props = defineProps({
    prodListVisible: Boolean,
    childList: Array,
});
const emit = defineEmits(["handleProductListClose"]);
const columns = [
    {
        title: "标题/产品ID",
        dataIndex: "name",
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "state", // state
        align: "center",
        width: "100",
    },
    {
        title: "SKU信息",
        dataIndex: "sku",
        align: "center",
        width: "700",
    },

    {
        title: "时间",
        dataIndex: "createdAt",
        align: "center",
        width: "260",
    },
]
const handleCancel = () => {
    emit("handleProductListClose")
}
const timestampToDateTime = (timestamp) => {
    if (timestamp == null || timestamp == "") {
        return "无";
    }
    return timestamp;
}
</script>
<style lang="less" scoped></style>