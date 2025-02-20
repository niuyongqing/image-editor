<template>
    <div id="productCont" :loding="loading">
        <a-card class="mt-2.5">
            <a-form ref="ruleForm" :model="formData" class="form-padding">
                <a-form-item label="店铺账号：">
                    <selectComm style="margin-left: 10px" :options="shopAccount" :fieldObj="shopObj"
                        @backSelectAll="selectAll" @backSelectItem="selectItem"></selectComm>
                </a-form-item>
                <a-form-item label="搜索类型:">
                    <div class="fBox flex align-start ml-[10px]">
                        <a-button @click="selectTypes(item.prop)" class="mr-[10px]"
                            :type="item.prop === actives ? 'primary' : ''" v-for="(item, index) in searchType"
                            :key="index">{{ item.label }}</a-button>
                    </div>
                </a-form-item>
                <a-form-item label="搜索内容：">
                    <div class="searchs flex">
                        <div class="searchInputs flex align-start ml-[10px]">
                            <a-input v-if="actives == 1" style="width: 400px;" v-model:value="formData.name"
                                placeholder="请输入标题查询" allowClear @clear="onSubmit"></a-input>
                            <a-input v-if="actives == 2" style="width: 400px;" v-model:value="formData.sku" allowClear
                                @clear="onSubmit" placeholder="请输入SKU查询,多个SKU间用逗号隔开，最多支持200个"></a-input>
                            <a-input v-if="actives == 3" style="width: 400px;" allowClear
                                v-model:value="formData.offerId" @clear="onSubmit"
                                placeholder="请输入产品ID查询,多个ID间用逗号隔开，最多支持200个"></a-input>
                        </div>
                        <a-button type="primary" class="ml-[10px]" @click="onSubmit(true)">查询</a-button>
                        <a-button type="link" class="ml-[10px]" @click="advancedType = !advancedType">高级搜索</a-button>
                    </div>
                </a-form-item>
                <a-form-item v-if="advancedType">
                    <a-form :model="advancedForm" ref="formRef" class="text-left w-133 ml-20 py-5"
                        style="background-color: rgb(245, 245, 245);" :labelAlign="'right'" :labelCol="{ span: 7 }">
                        <a-form-item label="售价：">
                            <a-input style="width: 150px;" v-model:value="advancedForm.minPrice" allowClear></a-input>
                            <span class="mx-2.5">-</span>
                            <a-input style="width: 150px;" v-model:value="advancedForm.maxPrice" allowClear></a-input>
                        </a-form-item>
                        <a-form-item label="原价：">
                            <a-input style="width: 150px;" v-model:value="advancedForm.minOldPrice"
                                allowClear></a-input>
                            <span class="mx-2.5">-</span>
                            <a-input style="width: 150px;" v-model:value="advancedForm.maxOldPrice"
                                allowClear></a-input>
                        </a-form-item>
                        <a-form-item label="总库存：">
                            <a-input style="width: 150px;" v-model:value="advancedForm.minStock" allowClear></a-input>
                            <span class="mx-2.5">-</span>
                            <a-input style="width: 150px;" v-model:value="advancedForm.maxStock" allowClear></a-input>
                        </a-form-item>
                        <a-form-item label="备注：">
                            <a-select ref="select" v-model:value="advancedForm.isRemark" style="width: 150px">
                                <a-select-option value="1">有备注</a-select-option>
                                <a-select-option value="0">无备注</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item>
                            <a-select ref="select" v-model:value="advancedForm.timeSort" class="ml-6.5"
                                style="width: 120px">
                                <a-select-option value="update_time">更新时间</a-select-option>
                                <a-select-option value="created_time">创建时间</a-select-option>
                            </a-select>
                            <a-range-picker class="ml-2.5" style="width: 320px;" v-model:value="advancedForm.time" />
                        </a-form-item>
                        <a-form-item>
                            <div class="text-right mr-15">
                                <a-button type="link" @click="resetForm(1)">取消</a-button>
                                <a-button type="link" class="mx-2.5" @click="resetForm">重置</a-button>
                                <a-button type="primary" @click="onSubmit(true)">搜索</a-button>
                            </div>
                        </a-form-item>
                    </a-form>
                </a-form-item>
                <a-form-item label="排序方式：">
                    <div class="flex align-start">
                        <a-button v-for="item in strList" :key="item.prop" style="margin: 0 10px;"
                            :type="item.prop === active.prop ? 'primary' : ''" @click="storChange(item)">
                            <span>{{ item.label }}</span>
                            <AsyncIcon icon="CaretUpOutlined"
                                v-if="item.prop === active.prop && active.type == 'bottom'" />
                            <AsyncIcon icon="CaretDownOutlined"
                                v-if="item.prop === active.prop && active.type == 'top'" />
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
        <a-card style="margin: 10px 0">
            <div style="width: 100%; height: 38px">
                <a-row :gutter="10" class="mb8">
                    <a-col :span="1.5">
                        <a-button type="primary" @click="add()">新增站点产品</a-button>
                    </a-col>
                    <a-col :span="1.5">
                        <a-dropdown :disabled="selectedRows.length === 0">
                            <template #overlay>
                                <a-menu @click="handleMenuClick">
                                    <a-menu-item key="title">
                                        批量修改标题
                                    </a-menu-item>
                                    <a-menu-item key="vat">
                                        批量修改税额
                                    </a-menu-item>
                                    <a-menu-item key="stock">
                                        批量修改库存
                                    </a-menu-item>
                                    <a-menu-item key="price">
                                        批量修改售价
                                    </a-menu-item>
                                    <a-menu-item key="oldPrice">
                                        批量修改原价
                                    </a-menu-item>
                                    <a-menu-item key="minPrice">
                                        批量修改最低价
                                    </a-menu-item>
                                    <a-menu-item key="weight">
                                        批量修改重量
                                    </a-menu-item>
                                    <a-menu-item key="size">
                                        批量修改尺寸
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <a-button>
                                批量操作
                            </a-button>
                        </a-dropdown>
                    </a-col>
                    <a-col :span="1.5">
                        <a-button type="primary" @click="addRemark()"
                            :disabled="selectedRows.length === 0">批量修改备注</a-button>
                    </a-col>
                    <a-col :span="1.5">
                        <a-button type="primary" @click="edit" :disabled="selectedRows.length !== 1">编 辑</a-button>
                    </a-col>
                    <a-col :span="1.5">
                        <a-button type="primary" @click="copy" :disabled="selectedRows.length === 0">复 制</a-button>
                    </a-col>
                    <a-col :span="1.5">
                        <a-button type="primary" @click="sync" :loading="syncLoading">同步店铺商品</a-button>
                    </a-col>
                    <a-col :span="1.5">
                        <a-button type="primary" @click="syncOne" :disabled="selectedRows.length === 0"
                            :loading="syncLoading">同步当前商品</a-button>
                    </a-col>
                    <a-col :span="1.5">
                        <a-popconfirm title="确定下架吗？" @confirm="deactivate">
                            <a-button type="primary" :disabled="selectedRows.length === 0"
                                :loading="deactivateLoading">批量归档</a-button>
                        </a-popconfirm>
                    </a-col>
                    <a-col :span="1.5">
                        <a-button type="primary" @click="syncHisAttr()" :loading="syncLoading">同步历史分类</a-button>
                    </a-col>
                    <a-col :span="1.5">
                        <a-popconfirm title="删除代表该产品在ozon平台删除，确定删除吗？" @confirm="deleteItem">
                            <a-button type="primary" danger :disabled="selectedRows.length === 0"
                                :loading="delLoading">删 除</a-button>
                        </a-popconfirm>
                    </a-col>
                    <a-col :span="1.5">
                        <a-button type="primary" @click="shopSetVisible = true">
                            <AsyncIcon icon="SettingOutlined" />
                            店铺设置
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <div class="flex items-baseline justify-between">
                <a-tabs v-model:activeKey="activeName" type="card" style="width: 800px;" @tab-click="handleClick">
                    <a-tab-pane :key="item.name" v-for="item in tabList" :tab="item.label + `(${item.value})`">
                    </a-tab-pane>
                </a-tabs>
                <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
                    v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize"
                    :total="paginations.total" class="pages" :show-quick-jumper="true" @change="getList"
                    :showSizeChanger="true" :pageSizeOptions="[50, 100, 200]" />
            </div>
            <div class="outContent" v-loading="loading">
                <div class="topHeader">
                    <a-checkbox style="margin-right: 90px;" v-model:checked="allChecked"
                        @change="allChangeBox"></a-checkbox>
                    <a-table style="width: 100%;height: 39px;" class="fixedTable" :columns="dropCol">
                    </a-table>
                </div>
                <div v-if="selectedRows.length != 0" class="h-7.5 pl-5 lh-7.5 text-left"
                    style="background-color: #ffffcd;">
                    已选中{{ selectedRows.length }}条数据
                </div>
                <div v-if="tableData.length == 0">
                    <a-empty class="flex flex-col justify-center" :image-size="200" style="height: 100vh;"></a-empty>
                </div>
                <div v-else v-for="(tbItem, index) in tableData" :key="tbItem.id" class="loopTable">
                    <div class="loopTable-head" :key="tbItem.id">
                        <a-checkbox v-model:checked="tbItem.tabAllChecked" @change="changeBox($event, tbItem, index)"
                            class="mr-[10px]"></a-checkbox><span>总产品({{
                                tbItem.count }})</span>
                    </div>
                    <a-table :data-source="tbItem.children" style="width: 100%;" row-key="id" :showHeader="false"
                        bordered :columns="dropCol" :pagination="false" :data-index="index" ref="OzonProduct">
                        <template #bodyCell="{ column, record }">
                            <div v-if="column.dataIndex === 'name'" class="flex">
                                <a-checkbox style="margin:0 10px;" @change="handelChecked($event, tbItem, record)"
                                    v-model:checked="record.checked"></a-checkbox>
                                <div class="flex text-left items-center">
                                    <a-image style="width: 100px; height: 100px;" :src="record.primaryImage ? record.primaryImage : record.images[0]
                                        ">
                                    </a-image>
                                    <div style="margin-left: 10px; display: block">
                                        <a-tooltip class="item">
                                            <template #title>
                                                <span>{{ record.name }}</span>
                                            </template>
                                            <div class="w-110 truncate">{{ record.name }}</div>
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
                                        <div style="color: #428bca; float: left; cursor: pointer" @click="
                                            showChildren(
                                                record.account,
                                                tbItem.attributeId,
                                                record.typeId
                                            )
                                            ">
                                            已合并:{{ tbItem.count }}
                                        </div>
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
                                        <AsyncIcon style="cursor: pointer; color: #1677ff" icon="EditOutlined" v-if="
                                            record.state != '审核不通过' && record.state != '已归档'
                                        " @click="editStock(record)"></AsyncIcon>
                                    </div>
                                    <div>
                                        最低价：<span style="color: #1677ff"
                                            v-if="record.minPrice && !(minPriceVisible && itemId == record.id)">CNY {{
                                                record.minPrice
                                            }}</span><span v-if="!record.minPrice">---</span>
                                        <div v-if="minPriceVisible" class="inline-block">
                                            <a-input type="number" class="mr-2.5 w-30" v-model:value="record.minPrice"
                                                placeholder="请输原价格"></a-input>
                                            <a-button class="mr-2.5" @click="minPriceVisible = false">取消</a-button>
                                            <a-button type="primary" :loading="loading"
                                                @click="checkOldPrice(record, '', '', record.minPrice)">确定</a-button>
                                        </div>
                                        <AsyncIcon v-if="!(minPriceVisible && itemId == record.id) && record.minPrice"
                                            style="cursor: pointer; color: #1677ff" icon="EditOutlined"
                                            @click="handelEditminPrice(record)">
                                        </AsyncIcon>
                                        <a-divider type="vertical"></a-divider>
                                        原价：<span style="color: #1677ff"
                                            v-if="!(singleVisible && itemId == record.id)">{{ record.currencyCode }} {{
                                                record.oldPrice
                                            }}</span>
                                        <div v-else class="inline-block">
                                            <a-input type="number" class="mr-2.5 w-30" v-model:value="record.oldPrice"
                                                placeholder="请输原价格"></a-input>
                                            <a-button class="mr-2.5" @click="singleVisible = false">取消</a-button>
                                            <a-button type="primary" :loading="loading"
                                                @click="checkOldPrice(record, record.oldPrice)">确定</a-button>
                                        </div>
                                        <AsyncIcon v-if="!(singleVisible && itemId == record.id)"
                                            style="cursor: pointer; color: #1677ff" icon="EditOutlined"
                                            @click="handelEditPrice(record)">
                                        </AsyncIcon>
                                        <a-divider type="vertical"></a-divider>
                                        当前售价：<span style="color: #1677ff"
                                            v-if="!(priceVisible && itemId == record.id)">{{ record.currencyCode }} {{
                                                record.price
                                            }}</span>
                                        <div v-else class="inline-block">
                                            <a-input type="number" class="mr-2.5 w-30" v-model:value="record.price"
                                                placeholder="请输原价格"></a-input>
                                            <a-button class="mr-2.5" @click="priceVisible = false">取消</a-button>
                                            <a-button type="primary" :loading="loading"
                                                @click="checkOldPrice(record, '', record.price)">确定</a-button>
                                        </div>
                                        <AsyncIcon v-if="!(priceVisible && itemId == record.id)" icon="EditOutlined"
                                            style="cursor: pointer; color: #1677ff" @click="editSinglePrice(record)">
                                        </AsyncIcon>
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
                                                                        :overlayInnerStyle="{ width: '300px' }"
                                                                        color="#fff">
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
                                                                        :overlayInnerStyle="{ width: '300px' }"
                                                                        color="#fff">
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
                                                                        :overlayInnerStyle="{ width: '300px' }"
                                                                        color="#fff">
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
                                                                        :overlayInnerStyle="{ width: '300px' }"
                                                                        color="#fff">
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
                            <div v-if="column.dataIndex === 'errorInfo'">
                                <div v-if="record.errorInfo != null">
                                    <div style="display: flex">
                                        <div>商品状态描述:</div>
                                        <div style="margin-left: 20px; color: red">
                                            {{ record.errorInfo.stateDescription }}
                                        </div>
                                    </div>
                                    <div style="display: flex">
                                        <div>
                                            详细描述:
                                            <a-popover :overlayInnerStyle="{ width: '1000px' }" trigger="click">
                                                <template #content>
                                                    <a-table :pagination="false" :data-source="record.errorInfo.itemErrors &&
                                                        record.errorInfo.itemErrors
                                                        " bordered :scroll="{ x: 200, y: 300 }"
                                                        :columns="errorColumns">
                                                    </a-table>
                                                </template>
                                                <a-button type="primary" :disabled="record.errorInfo.itemErrors &&
                                                    record.errorInfo.itemErrors.length == 0
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
                                <a-row :gutter="3">
                                    <a-col :span="6">
                                        <a-button @click.stop="edit(record)" type="text" style="color: #0b56fa"
                                            v-if="record.state !== '已归档'">编辑</a-button>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button @click.stop="syncOne(record)" type="text" style="color: #67c23a"
                                            v-if="record.state !== '已归档'">同步</a-button>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button @click.stop="copy(record)" type="text" v-if="record.state !== '已归档'"
                                            style="color: #0d9888">复制</a-button>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-popconfirm ok-text="YES" cancel-text="NO" title="归档吗？"
                                            @confirm="deactivate(record)">
                                            <a-button type="text" v-if="record.state !== '已归档'"
                                                style="color: #e6a23c">归档</a-button>
                                        </a-popconfirm>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button type="text" @click="addRemark(record)">备注</a-button>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-popconfirm ok-text="YES" cancel-text="NO" title="删除代表该产品在ozon平台删除，确定删除吗？"
                                            @confirm="deleteItem(record)">
                                            <a-button v-if="
                                                record.sku === 'sku未创建' && record.state === '已归档'
                                            " type="text" style="color: red">删除</a-button>
                                        </a-popconfirm>
                                    </a-col>
                                </a-row>
                            </div>
                        </template>
                    </a-table>
                </div>
            </div>

            <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
                v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize" :total="paginations.total"
                class="pages" :show-quick-jumper="true" @change="getList" :showSizeChanger="true"
                :pageSizeOptions="[50, 100, 200]" />
        </a-card>
        <a-back-top :visibility-height="0" style="margin-right: 10px;" @click="backToTop" />
        <!-- 备注 -->
        <editRemark :remarkVisible="remarkVisible" :remarkId="remarkId" @backCloseRemark="backCloseRemark"></editRemark>
        <!-- 统一修改价格库存等 -->
        <editPriceModal :selectedRows="selectedRows" :editPriceVisible="editPriceVisible"
            @handleEditPriceClose="handleEditPriceClose" :editStockList="editStockList" :defType="defType">
        </editPriceModal>
        <!-- 库存 -->
        <editQuantity :editQuantityVis="editQuantityVis" :editStockList="editStockList" :selectOzonId="selectOzonId"
            @backCloseQuantity="backCloseQuantity"></editQuantity>
        <!-- 进度条 -->
        <progressBar :showOpen="showOpen" @handleProgressBarClose="handleProgressBarClose" :percentage="percentage">
        </progressBar>
        <!-- 复制 -->
        <copyProduct :copyProductVis="copyProductVis" :copyList="copyList"
            @handleCopyProductClose="handleCopyProductClose">
        </copyProduct>
        <!-- 已合并 -->
        <productList @handleProductListClose="handleProductListClose" :childList="childList"
            :prodListVisible="prodListVisible">
        </productList>
        <!-- 店铺设置 -->
        <shopSetModal :shopSetVisible="shopSetVisible" :shopCurryList="shopCurryList" @handleShopSetClose="shopSetVisible = false"
        @refreshShopSet="getShopSet"
        ></shopSetModal>
    </div>
</template>

<script setup lang="js">
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import {
    accountCache, list, batchArchive, syncOneProduct, syncHistoryCategory, mergeList, asyncProgress,
    updatePrices, productWarehouse, del, syncShopProductAll, syncShopProduct
} from '../config/api/product';
import { warehouseList } from "../config/api/storeManagement"
import { shopCurrency } from "../config/api/product"
import { tabDicList, attrList } from "../config/commDic/defDic"
import tableHead from "../config/tabColumns/product"
import { message } from "ant-design-vue";
import editRemark from "./comm/editRemark.vue";
import editPriceModal from "./comm/editPriceModal.vue";
import editQuantity from "./comm/editQuantity.vue";
import progressBar from "../config/component/progressBar/index.vue"
import productList from "./comm/productList.vue";
import copyProduct from "./comm/copyProduct.vue";
import shopSetModal from "./comm/shopSetModal.vue";

const OzonProduct = ref(null)
const formRef = ref(null)
const formData = reactive({
    offerId: "",
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
const advancedForm = reactive({
    minPrice: "",
    maxPrice: "",
    minOldPrice: "",
    maxOldPrice: "",
    minStock: null,
    maxStock: null,
    isRemark: "",
    timeSort: "update_time",
    time: []
})
const dropCol = tableHead
let tabList = tabDicList
let discLists = attrList
const advancedType = ref(false)
const loading = ref(false)
const allChecked = ref(false)
const syncLoading = ref(false)
const deactivateLoading = ref(false)
const delLoading = ref(false)
const remarkVisible = ref(false)
const editPriceVisible = ref(false)
const singleVisible = ref(false)
const priceVisible = ref(false)
const minPriceVisible = ref(false)
const editQuantityVis = ref(false)
const showOpen = ref(false)
const prodListVisible = ref(false)
const copyProductVis = ref(false)
const shopSetVisible = ref(false)
const interval = ref(null)
const percentage = ref(0)
const defType = ref([])
const itemId = ref()
const remarkId = ref([])
const shopAccount = ref([])
const tableData = ref([])
const activeName = ref(" ")
const tabQuantity = ref([])
const stockShops = ref([])
const selectedRows = ref([])
const syncOneList = ref([])
const selectOzonId = ref([])
const editStockList = ref([])
const childList = ref([])
const copyList = ref([])
const storeOption = ref([])
const shopCurryList = ref([])
const errorColumns = [
    {
        title: "错误字段",
        dataIndex: "attributeName",
        width: 200
    },
    {
        title: "错误描述1",
        dataIndex: "description",
        width: 200
    },
    {
        title: "错误描述2",
        dataIndex: "message",
        width: 200
    }
]
const actives = ref(1);
const sortObj = reactive({
    sortField: "created_time",
    sortType: "desc"
})
const searchType = [
    {
        label: "标题",
        prop: 1,
    },
    {
        label: "SKU",
        prop: 2,
    },
    {
        label: "产品ID",
        prop: 3,
    },
]
const shopObj = {
    fieldKey: "account",
    fieldLabel: "simpleName",
}
const active = ref({
    label: "按创建时间",
    value: "created_time",
    type: "top",
    prop: 1,
    isDefault: true,
}); // 默认按下单时间查询
const strList = ref([
    {
        label: "按创建时间",
        value: "created_time",
        type: "top",
        prop: 1,
        isDefault: true,
    },
    {
        label: "按更新时间",
        type: "bottom",
        value: "update_tiem",
        prop: 2,
        isDefault: false,
    },
    {
        label: "按售价",
        value: "old_price",
        type: "top",
        prop: 3,
        isDefault: false,
    },
    {
        label: "按总库存量",
        value: "stock",
        type: "top",
        prop: 4,
        isDefault: false,
    },
]);
// 店铺数据
const getAccount = () => {
    accountCache().then((res) => {
        if (res.data) {
            shopAccount.value = res?.data ?? [];
            getList();
        }
    });
}
// 店铺单选多选
const selectAll = () => {
    formData.account = ""
    getList();
}
const selectItem = (val) => {
    formData.account = val
    getList();
}
const backToTop = () => {
    let elements = document.getElementsByClassName('ant-layout-content');
    if (elements) {
        elements[0].scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
// 搜索内容
const selectTypes = (index) => {
    actives.value = index;
    switch (index) {
        case 1:
            formData.sku = "";
            formData.offerId = "";
            break;
        case 2:
            formData.name = "";
            formData.offerId = "";
            break;
        case 3:
            formData.sku = "";
            formData.name = "";
            break;
        default:
            break;
    }
}

// 高级搜索重置
const resetForm = (type = 0) => {
    formData.sku = "";
    formData.offerId = "";
    formData.name = "";
    advancedForm.minPrice = ""
    advancedForm.maxPrice = ""
    advancedForm.minOldPrice = ""
    advancedForm.maxOldPrice = ""
    advancedForm.minStock = null
    advancedForm.maxStock = null
    advancedForm.isRemark = ""
    advancedForm.timeSort = "update_time"
    advancedForm.time = []
    advancedType.value = type == 1 ? false : true
}


// 排序方式
const storChange = (val) => {
    val.type = val.type === "top" ? "bottom" : "top";
    active.value = val;
    sortObj.sortField = val.sortField
    sortObj.sortType = val.type === "top" ? "asc" : "desc"
    getList();
};

// 表单搜索
const onSubmit = (type = false) => { getList(type) }

// 标签页切换
const handleClick = activeKey => {
    formData.state = activeKey
    getList()
}
// 提取去重逻辑
const uniqueArray = (arr1, arr2) => [...new Set([...arr1, ...arr2])];
// 公共处理批量所需的数据格式
const commFn = (tableItem, type = 'single', record = {}) => {
    const existingItem = syncOneList.value.find((e) => e.account === tableItem.account);
    if (existingItem) {
        const offerIdsToAdd = type === 'single' ? [record.offerId] : tableItem.children.map((el) => el.offerId);
        const productIdsToAdd = type === 'single' ? [record.id] : tableItem.children.map((el) => el.id);

        existingItem.offerIds = uniqueArray(existingItem.offerIds, offerIdsToAdd);
        existingItem.productIds = uniqueArray(existingItem.productIds, productIdsToAdd);
    } else {
        const newOfferIds = type === 'single' ? [record.offerId] : [...new Set(tableItem.children.map((e) => e.offerId))];
        const newProductIds = type === 'single' ? [record.id] : [...new Set(tableItem.children.map((e) => e.id))];

        const newObj = {
            account: tableItem.account,
            offerIds: newOfferIds,
            productIds: newProductIds
        };
        syncOneList.value.push(newObj);
    }

    console.log('syncOneList', syncOneList.value);

}


//单个选择
const handelChecked = (e, tbItem, record) => {
    if (e.target.checked) {
        selectedRows.value.push(record)
        commFn(tbItem, 'single', record)
    } else {
        selectedRows.value = selectedRows.value.filter(item => item.id !== record.id);
        syncOneList.value = syncOneList.value.map(item => {
            if (item.account === record.account) {
                item.offerIds = item.offerIds.filter(id => !(id == record.offerId));
                item.productIds = item.productIds.filter(id => !(id == record.id));
            }
            return item;
        });
    }
    const checkItem = tbItem.children.every((child) =>
        child.checked
    );
    tbItem.tabAllChecked = checkItem
}

// 数据全选
const allChangeBox = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
        // 清空 selectedRows
        if (selectedRows.value.length > 0) {
            selectedRows.value = [];
        }
        // 遍历 tableData 并添加符合条件的子元素
        tableData.value.forEach((item) => {
            item.tabAllChecked = true;
            item.children.forEach((child) => {
                child.checked = true;
                selectedRows.value.push(child);
            });
            commFn(item, 'multiple')
        });
        console.log('syncOneList', syncOneList.value);

    } else {
        // 取消选中时，移除所有相关子元素
        tableData.value.forEach((item) => {
            item.tabAllChecked = false;
            item.children.forEach((child) => {
                child.checked = false;
                selectedRows.value = selectedRows.value.filter(row => row.id !== child.id);
            });
        });
    }
    console.log('selectedRows*-*', selectedRows.value);

}

// 总产品全选
const changeBox = (e, tbItem, index) => {
    tbItem.children.forEach((child) => child.checked = tbItem.tabAllChecked);
    allChecked.value = tableData.value.every(item => item.tabAllChecked)
    if (tbItem.tabAllChecked) {
        tbItem.children.forEach((child) => selectedRows.value.push(child));
        commFn(tbItem, 'multiple')
    } else {
        tbItem.children.forEach((child) => selectedRows.value = selectedRows.value.filter(item => item.id !== child.id));
        syncOneList.value = syncOneList.value.map(item => {
            if (item.account === tbItem.account) {
                const childrenOfferIds = tbItem.children.map(child => child.offerId);
                const childrenProductIds = tbItem.children.map(child => child.id);
                item.offerIds = item.offerIds.filter(id => !childrenOfferIds.includes(id));
                item.productIds = item.productIds.filter(id => !childrenProductIds.includes(id));
            }
            return item;
        });
    }
}


const showChildren = (account, id, typeId) => {
    if (!id) return;
    let params = {
        account,
        attributeId: id,
        categoryId: typeId,
    };
    mergeList(params).then((res) => {
        prodListVisible.value = true;
        childList.value = res?.data || [];
    });
}
// 控制错误信息
const displayedStatus = (row) => {
    return row.show
        ? row.status.itemErrors
        : row.status.itemErrors.slice(0, 3);
}
// 商品ID跳转
const jumpTo = (sku) => {
    if (sku == "sku未创建") return;
    const url = `https://ozon.ru/context/detail/id/${sku}`;
    window.open(url, "_blank");
}

const getStore = () => {
    let params = {
        account: stockShops.value,
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
            }) ?? [];
    });
}
const getEditStore = (account) => {
    let params = {
        name: "",
        status: "created",
        account,
        startCreateDate: "",
        endCreateDate: "",
    };
    warehouseList(params).then((res) => {
        storeOption.value =
            res?.rows?.map((item) => {
                return {
                    value: item.warehouseId,
                    label: item.name,
                };
            }) || [];
    });
}

// 批量修改库存、重量、尺寸等
const handleMenuClick = (e) => {
    console.log('e', e);
    defType.value = e.keyPath
    editPriceVisible.value = true;
    // selectOzonId.value = syncOneList.value;
    // console.log('selectedRows',selectedRows.value);

    for (let i = 0; i < selectedRows.value.length; i++) {
        if (selectedRows.value[i].state == "已归档") {
            message.error("归档商品不可修改库存，请取消！");
            return;
        }
    }
    stockShops.value = syncOneList.value.map((e) => e.account);
    getStore();

}


// 批量修改库存
const editStock = (row = {}) => {
    let stockObj = {
        account: row.account,
        offerIds: [row.offerId],
    };
    stockShops.value.push(row.account);
    selectOzonId.value.push(stockObj);
    getStore();
    editQuantityVis.value = true
}

const backCloseQuantity = () => {
    getList();
    stockShops.value = []
    selectOzonId.value = []
    syncOneList.value = []
    selectOzonId.value = []
    editQuantityVis.value = false
}

// 修改单个价格
const checkOldPrice = (row, oldPrice = "", price = "", minPrice = "") => {
    let params = {
        offerIds: row.offerIds,
        oldPrice,
        price,
        productIds: row.productIds,
        minPrice,
        account: row.account
    }
    updatePrices(params).then((res) => {
        message.success(res.msg);
    }).finally(() => {
        getList()
        singleVisible.value = false
        priceVisible.value = false
        minPriceVisible.value = false
        itemId.value = ""
    });
}

const editSinglePrice = item => {
    priceVisible.value = true
    itemId.value = item.id
}

// 批量修改价格
// const editPrice = (row = {}) => {
//     console.log('row',row);

//     let priceObj = {
//         account: row.account,
//         offerIds: [row.offerId],
//     };
//     selectOzonId.value.push(priceObj);
//     editPriceVisible.value = true;
// }

const handelEditPrice = item => {
    singleVisible.value = true
    itemId.value = item.id
}
const handelEditminPrice = item => {
    minPriceVisible.value = true
    itemId.value = item.id
}

// 关闭已合并弹窗
const handleProductListClose = () => {
    prodListVisible.value = false;
    childList.value = [];
}
// 关闭价格
const handleEditPriceClose = () => {
    selectOzonId.value = [];
    selectedRows.value = [];
    syncOneList.value = [];
    editPriceVisible.value = false;
    // getList();
    console.log('tableData', tableData.value);
    tableData.value.forEach(item => {
        item.tabAllChecked = false
        item.children.forEach(child => {
            child.checked = false
        })
    })
}
// 修改备注
const addRemark = (row = {}) => {
    remarkVisible.value = true;
    if (Object.keys(row).length == 0) {
        remarkId.value = syncOneList.value;
    } else {
        let remarkObj = {
            account: row.account,
            offerIds: [row.offerId],
        };
        remarkId.value.push(remarkObj);
    }
}
// 备注弹窗关闭
const backCloseRemark = () => {
    remarkVisible.value = false;
    selectedRows.value = [];
    remarkId.value = [];
    syncOneList.value = [];
    getList();
}

const handleCopyProductClose = () => {
    copyList.value = []
    copyProductVis.value = false
    getList();
}

// 复制
const copy = (row) => {
    if (syncOneList.value.length == 0) {
        copyList.value.push({
            account: row.account,
            offerIds: [row.offerId],
        });
    } else {
        copyList.value = syncOneList.value;
    }
    copyProductVis.value = true
}
// 下架商品
const deactivate = (row = {}) => {
    let id = [];
    if (Object.keys(row).length == 0) {
        for (let i = 0; i < selectedRows.value.length; i++) {
            if (selectedRows.value[i].state == "已归档") {
                message.error("已归档商品不可重复归档，请取消！");
                return;
            }
        }
        id = syncOneList.value;
    } else {
        id.push({
            account: row.account,
            productIds: [row.id],
        });
    }
    let hasEmptyData = false;
    id.forEach((item) => {
        hasEmptyData = item.productIds.some((id) => id === "");
    });
    if (hasEmptyData) {
        message.error("产品ID为空,请同步后归档！");
        return;
    }
    console.log("hasEmptyData", hasEmptyData);

    deactivateLoading.value = true;
    batchArchive({ productArchive: id })
        .then((res) => {
            message.success(res.msg);
        })
        .finally(() => {
            getList();
            deactivateLoading.value = false;
            syncOneList.value = [];
        });
}
// 单个和批量删除
const deleteItem = (row = {}) => {
    let id = [];
    if (Object.keys(row).length == 0) {
        id = syncOneList.value;
    } else {
        id.push({
            account: row.account,
            offerIds: [row.offerId],
        });
    }

    delLoading.value = true;
    del({
        products: id,
    }).then((res) => {
        message.success(res.msg);
    }).finally(() => {
        getList();
        delLoading.value = false;
        syncOneList.value = [];
    });
}

const add = () => {
    window.open("productPublish", '_blank');
}
const edit = (row = {}) => {
    let newRow = Object.keys(row).length != 0 ? row : selectedRows.value[0];
    console.log('newRow', newRow);

    window.open("editProductPublish" + `?id=${newRow.id}&account=${newRow.account}`, '_blank');
}
const sync = () => {
    syncLoading.value = true;
    showOpen.value = true;
    if (formData.account == null || formData.account == "") {
        syncShopProductAll()
            .then((res) => {
                interval.value = setInterval(() => {
                    asyncProgress(res.msg).then(res => {
                        percentage.value = parseInt(res.data);
                        if (res.data >= 100) {
                            clearInterval(interval.value)
                        }
                    })
                }, 5000);
            })
        //     .catch(() => {
        //         percentage.value = 0;
        //     })
        //     .finally(() => {
        //         syncLoading.value = false;
        //         showOpen.value = false;
        //         getList();
        //         setTimeout(() => {
        //             percentage.value = 0;
        //         }, 300);
        //     });


    } else {
        syncShopProduct({ account: formData.account })
            .then((res) => {
                percentage.value = 100;
            })
            .catch(() => {
                percentage.value = 0;
            })
            .finally(() => {
                syncLoading.value = false;
                showOpen.value = false;
                getList();
                setTimeout(() => {
                    percentage.value = 0;
                }, 300);
            });
    }
}

const handleProgressBarClose = () => {
    showOpen.value = false;
    getList();
}

const syncOne = (record = {}) => {
    let id = [];
    let obj = {};
    if (syncOneList.value.length == 0) {
        obj = {
            account: record.account,
            // offerIds: [record.offerId],
            productIds: [record.id]
        };
        id.push(obj);
    } else {
        id = syncOneList.value;
    }
    syncLoading.value = true;
    syncOneProduct({ syncList: id })
        .then((res) => {
            message.success(res.msg);
        })
        .finally(() => {
            syncLoading.value = false;
            syncOneList.value = [];
            getList();
        });
}

// 同步历史分类
const syncHisAttr = () => {
    if (!formData.account) {
        message.error("请先选择店铺后同步历史分类！");
        return;
    }
    syncLoading.value = true;
    syncHistoryCategory({
        account: formData.account,
    })
        .then((res) => {
            message.success(res.msg);
        })
        .finally(() => {
            syncLoading.value = false;
            getList();
        });
}

const timestampToDateTime = (timestamp) => {
    if (timestamp == null || timestamp == "") {
        return "无";
    }
    return timestamp;
}

// 获取店铺数据
const getList = (isSearch = false) => {
    loading.value = true;
    let params = {
        ...formData,
        ...advancedForm,
        pageNum: paginations.pageNum,
        pageSize: paginations.pageSize,
        isSearch
    }
    list(params)
        .then((res) => {
            tableData.value =
                res?.rows[0]?.productList?.map((item) => {
                    item.show = false;
                    return item;
                }) ?? [];
            tabQuantity.value = res?.rows[0]?.quantity ?? [];
            paginations.total = res?.total ?? 0;
        })
        .finally(() => {
            loading.value = false;
        });
}

const getShopSet = () => {
    shopCurrency().then(res => {
        shopCurryList.value = res?.data ?? []
    })
}   
watch(tabQuantity, (newValue, oldValue) => {
    if (tabQuantity.length == 0) {
        tabList = tabDicList
    } else {
        for (let i = 0; i < tabList.length; i++) {
            for (let j = 0; j < tabQuantity.value.length; j++) {
                if (tabList[i].label === tabQuantity.value[j].state) {
                    tabList[i].value = tabQuantity.value[j].count;
                    break;
                }
            }
        }
    }
})
onMounted(() => {
    getAccount()
    getShopSet()
})
</script>
<style lang="less" scoped>
.outContent {
    border: 1px solid #ccc;
    width: 100%;

    .el-loading-mask {
        top: -5%;
    }
}

:deep(.topHeader) {
    display: flex;
    //background-color: #fff;
    padding: 0 0 0 20px;
    height: 40px;
    align-items: center;
    border-bottom: 1px solid #ccc;

    .ant-spin-nested-loading {
        width: 100%;
    }

    .ant-table {
        .ant-table-thead tr th {
            background-color: #fff !important;
        }

        .ant-table-tbody {
            display: none;
        }
    }

    div {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
}

.loopTable {
    display: flex;
    flex-direction: column;
    align-items: baseline;

    &-head {
        width: -webkit-fill-available;
        // background-color: #f5f5f5;
        height: 50px;
        display: flex;
        padding-left: 20px;
        align-items: center;

        .el-checkbox {
            margin-right: 20px;
        }
    }

    .el-table {
        border-bottom: none;
    }
}

:deep(.fixedTable) {
    height: 38px;

    table {
        height: 38px;
    }
}
</style>