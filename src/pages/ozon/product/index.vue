<template>
  <div id="productCont">
    <a-card class="mt-2.5">
      <a-form ref="ruleForm" :model="formData" class="form-padding">
        <a-form-item label="店铺账号：">
          <selectComm style="margin-left: 10px" :options="shopAccount" :fieldObj="shopObj" @backSelectAll="selectAll"
            @backSelectItem="selectItem"></selectComm>
        </a-form-item>
        <a-form-item label="搜索类型:">
          <div class="fBox flex align-start ml-2.5">
            <a-button @click="selectTypes(item.prop)" class="mr-2.5" :type="item.prop === actives ? 'primary' : ''"
              v-for="(item, index) in searchType" :key="index">{{ item.label }}</a-button>
          </div>
        </a-form-item>
        <a-form-item label="搜索内容：">
          <div class="searchs flex">
            <div class="searchInputs flex align-start ml-2.5">
              <a-input v-if="actives == 1" style="width: 400px" v-model:value="formData.name" placeholder="请输入标题查询"
                allowClear @clear="onSubmit"></a-input>
              <a-input v-if="actives == 2" style="width: 400px" v-model:value="formData.sku" allowClear
                @clear="onSubmit" placeholder="请输入SKU查询,多个SKU间用逗号隔开，最多支持200个"></a-input>
              <a-input v-if="actives == 3" style="width: 400px" allowClear v-model:value="formData.id" @clear="onSubmit"
                placeholder="请输入产品ID查询,多个ID间用逗号隔开，最多支持200个"></a-input>
            </div>
            <a-button type="primary" class="ml-2.5" @click="onSubmit(true)">查询</a-button>
            <a-button type="link" class="ml-2.5" @click="advancedType = !advancedType">高级搜索</a-button>
          </div>
        </a-form-item>
        <a-form-item v-if="advancedType">
          <a-form :model="advancedForm" ref="formRef" class="text-left w-133 ml-20 py-5"
            style="background-color: rgb(245, 245, 245)" :labelAlign="'right'" :labelCol="{ span: 7 }">
            <a-form-item label="售价：">
              <a-input-number style="width: 150px" :min="0" :max="99999999" :controls="false"
                v-model:value="advancedForm.minPrice" allowClear></a-input-number>
              <span class="mx-2.5">-</span>
              <a-input-number style="width: 150px" :min="0" :max="99999999" :controls="false"
                v-model:value="advancedForm.maxPrice" allowClear></a-input-number>
            </a-form-item>
            <a-form-item label="原价：">
              <a-input-number style="width: 150px" :min="0" :max="99999999" :controls="false"
                v-model:value="advancedForm.minOldPrice" allowClear></a-input-number>
              <span class="mx-2.5">-</span>
              <a-input-number style="width: 150px" :min="0" :max="99999999" :controls="false"
                v-model:value="advancedForm.maxOldPrice" allowClear></a-input-number>
            </a-form-item>
            <a-form-item label="总库存：">
              <a-input-number style="width: 150px" :min="0" :max="99999999" :controls="false"
                v-model:value="advancedForm.minStock" allowClear></a-input-number>
              <span class="mx-2.5">-</span>
              <a-input-number style="width: 150px" :min="0" :max="99999999" :controls="false"
                v-model:value="advancedForm.maxStock" allowClear></a-input-number>
            </a-form-item>
            <!-- <a-form-item label="备注：">
                            <a-select ref="select" v-model:value="advancedForm.isRemark" style="width: 150px">
                                <a-select-option value="1">有备注</a-select-option>
                                <a-select-option value="0">无备注</a-select-option>
                            </a-select>
                        </a-form-item> -->
            <a-form-item>
              <a-select ref="select" v-model:value="advancedForm.timeSearch" class="ml-6.5" style="width: 120px">
                <a-select-option value="update_time">更新时间</a-select-option>
                <a-select-option value="created_time">创建时间</a-select-option>
              </a-select>
              <a-range-picker class="ml-2.5" style="width: 320px" valueFormat="YYYY-MM-DD"
                v-model:value="advancedForm.time" />
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
            <a-button v-for="item in strList" :key="item.prop" style="margin: 0 10px"
              :type="item.prop === active.prop ? 'primary' : ''" @click="storChange(item)">
              <span>{{ item.label }}</span>
              <AsyncIcon icon="CaretUpOutlined" v-if="item.prop === active.prop && active.type == 'bottom'" />
              <AsyncIcon icon="CaretDownOutlined" v-if="item.prop === active.prop && active.type == 'top'" />
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin: 10px 0">
      <div style="width: 100%; height: 38px" class="flex justify-between">
        <!-- <a-row :gutter="10" class="mb8">
                    <a-col :span="1.5">
                        <a-button type="primary" @click="sync()" :loading="syncLoading">同步店铺商品</a-button>
                    </a-col>
                    <a-col :span="1.5">
                        <a-button type="primary" @click="syncOne()" :disabled="selectedRows.length === 0"
                            :loading="syncLoading">同步当前商品</a-button>
                    </a-col>
                </a-row> -->
        <div>
          <a-space :size="10">
            <a-dropdown :disabled="selectedRows.length === 0">
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="deactivate" v-if="activeName !== '已归档'">
                    批量归档
                  </a-menu-item>
                  <a-menu-item key="remark"> 批量备注 </a-menu-item>
                  <a-menu-item key="delete"> 批量删除 </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="price"> 批量修改售价 </a-menu-item>
                  <a-menu-item key="oldPrice"> 批量修改原价 </a-menu-item>
                  <a-menu-item key="stock"> 批量修改库存 </a-menu-item>
                  <a-menu-item key="all"> 全属性修改 </a-menu-item>
                </a-menu>
              </template>
              <a-button type="primary">
                批量操作
                <DownOutlined />
              </a-button>
            </a-dropdown>
            <a-button type="primary" @click="edit()" :disabled="selectedRows.length !== 1">编 辑</a-button>
            <a-button type="primary" @click="copyItems()" :disabled="selectedRows.length === 0">复 制</a-button>
            <a-button type="primary" @click="syncHisAttr()" :loading="syncLoading">同步历史分类</a-button>
            <!-- <a-dropdown trigger="click">
              <a-button type="primary">
                分类管理
                <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <typeTree v-model:current-class="currentClass" v-model:node-path="nodePath" platform="ozon"
                    @update:currentClass="updateCurrentClass" ref="typeTreeRef" @nodeClick="typeNodeClick">
                  </typeTree>
                </a-menu>
              </template>
            </a-dropdown> -->
          </a-space>
        </div>
        <div>
          <a-space :size="10">
            <a-button type="link" @click="shopSet">
              <AsyncIcon icon="SettingOutlined" />
              店铺设置
            </a-button>
            <a-button type="primary" @click="add()">创建产品</a-button>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleExport">
                  <a-menu-item key="page">按页导出</a-menu-item>
                  <a-menu-item key="number" :disabled="selectedRows.length === 0">按勾选导出</a-menu-item>
                </a-menu>
              </template>
              <a-button type="primary">
                导出产品
                <DownOutlined />
              </a-button>
            </a-dropdown>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleAsyncClick">
                  <a-menu-item key="All" :loading="syncLoading">同步全部产品</a-menu-item>
                  <a-menu-item key="single" :loading="syncLoading"
                    :disabled="selectedRows.length === 0">同步选中产品</a-menu-item>
                </a-menu>
              </template>
              <a-button type="primary">
                同步产品
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </a-space>
        </div>
      </div>
      <div class="flex items-baseline justify-between">
        <a-tabs v-model:activeKey="activeName" type="card" style="width: 800px" @tab-click="handleClick">
          <a-tab-pane :key="item.name" v-for="item in tabList" :tab="item.label + `(${item.value})`">
          </a-tab-pane>
        </a-tabs>
        <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
          v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize" :total="paginations.total"
          class="pages" :show-quick-jumper="true" @change="getList" :showSizeChanger="true"
          :pageSizeOptions="[50, 100, 200]" />
      </div>
      <div class="outContent" v-loading="loading">
        <div class="topHeader">
          <a-checkbox style="margin-right: 70px" v-model:checked="allChecked" @change="allChangeBox"></a-checkbox>
          <a-table style="width: 100%; height: 39px" class="fixedTable" :columns="dropCol">
          </a-table>
        </div>
        <div v-if="selectedRows.length != 0" class="h-7.5 pl-5 lh-7.5 text-left" style="background-color: #ffffcd">
          已选中{{ selectedRows.length }}条数据
        </div>
        <div v-if="tableData.length == 0">
          <a-empty class="flex flex-col justify-center" :image-size="200" style="height: 100vh"></a-empty>
        </div>
        <div v-else v-for="(tbItem, index) in tableData" :key="tbItem.id" class="loopTable">
          <div class="loopTable-head" :key="tbItem.id">
            <a-checkbox v-model:checked="tbItem.tabAllChecked" @change="changeBox($event, tbItem, index)"
              class="mr-2.5"></a-checkbox><span>总产品({{ tbItem.count }})</span>
          </div>
          <a-table :data-source="tbItem.children" style="width: 100%" row-key="id" :showHeader="false"
            :columns="dropCol" :pagination="false" :data-index="index" ref="OzonProduct">
            <template #bodyCell="{ column, record }">
              <div v-if="column.dataIndex === 'name'" class="flex">
                <a-checkbox style="margin: 0 10px" @change="handelChecked($event, tbItem, record)"
                  v-model:checked="record.checked"></a-checkbox>
                <div class="flex text-left items-center">
                  <a-image style="width: 100px; height: 100px" :src="processImageSource(
                    (record.primaryImage?.length && record.primaryImage[0]) ||
                    (record.images?.length && record.images[0]) ||
                    ''
                  )">
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
                        <a style="color: #1677ff" href="#" @click="jumpTo(record.sku)">{{ record.sku }}</a>
                      </a-tooltip>
                    </div>
                    <br />
                    <div style="color: #999; float: left">
                      店铺: {{ record.simpleName }}
                    </div>
                    <br />

                    <div :style="{
                      color: remarkColor(record.remarkColor),
                      float: 'left',
                    }">
                      备注:{{ record.remark }}
                    </div>
                    <br />
                    <div style="color: red;" v-if="record.bathErrorInfo">
                      失败原因: {{ record.bathErrorInfo }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="column.dataIndex === 'state'">
                <a-tag :bordered="false" :color="getStateColor(record.state)">
                  {{ record.state || " " }}
                </a-tag>
              </div>
              <div v-else-if="column.dataIndex === 'sku'" style="text-align: left">
                <div>
                  <div style="color: #1677ff; cursor: pointer">
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
                      tbItem.attributeId,
                      record.typeId
                    )
                    ">
                    已合并:{{ tbItem.count }}
                  </div>
                  <div>
                    促销活动价：<span style="color: #1677ff">{{
                      record.marketingPrice || "暂未参加活动"
                    }}</span>
                  </div>
                  <div>
                    <div style="display: flex">
                      <span>内容质量分:</span>
                      <div v-if="record.productsScore">
                        <a-popover placement="right" :overlayInnerStyle="{ width: '400px' }" trigger="click">
                          <template #content>
                            <div class="scoreItem">
                              <div class="flex justify-between">
                                <div>
                                  <span style="font-weight: bold">
                                    搜索属性</span>
                                  <a-tooltip placement="right" :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                    <template #title>
                                      <span class="m-2.5 font-black text-black">{{ discLists[0].title }}
                                      </span>
                                      <br />
                                      <div v-for="(e, ind) in discLists[0].list" :key="ind"
                                        class="m-2.5 flex justify-between text-black">
                                        <span>{{ e.sock }}</span><span>{{ e.disc }}</span>
                                      </div>
                                    </template>
                                    <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
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
                                <div>
                                  <span style="font-weight: bold">其他属性</span>
                                  <a-tooltip placement="right" :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                    <template #title>
                                      <span class="m-2.5 font-black text-black">{{ discLists[1].title }}
                                      </span>
                                      <br />
                                      <div v-for="(e, ind) in discLists[1].list" :key="ind"
                                        class="m-2.5 flex justify-between text-black">
                                        <span>{{ e.sock }}</span><span>{{ e.disc }}</span>
                                      </div>
                                    </template>
                                    <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
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
                                <div>
                                  <span style="font-weight: bold">描述和丰富内容</span>
                                  <a-tooltip placement="right" :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                    <template #title>
                                      <span class="m-2.5 font-black text-black">{{ discLists[2].title }}
                                      </span>
                                      <br />
                                      <div v-for="(e, ind) in discLists[2].list" :key="ind"
                                        class="m-2.5 flex justify-between text-black">
                                        <span>{{ e.sock }}</span><span>{{ e.disc }}</span>
                                      </div>
                                    </template>
                                    <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
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
                                <div>
                                  <span style="font-weight: bold">图片和视频</span>
                                  <a-tooltip placement="right" :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                    <template #title>
                                      <span class="m-2.5 font-black text-black">{{ discLists[3].title }}
                                      </span>
                                      <br />
                                      <div v-for="(e, ind) in discLists[3].list" :key="ind"
                                        class="m-2.5 flex justify-between text-black">
                                        <span>{{ e.sock }}</span><span>{{ e.disc }}</span>
                                      </div>
                                    </template>
                                    <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
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
                          <span style="
                              margin-left: 10px;
                              color: #1677ff;
                              cursor: pointer;
                            ">{{ record.productsScore[0].rating }}分</span>
                        </a-popover>
                      </div>
                      <span v-else class="ml-2.5">{{ 0.0 }}分</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="column.dataIndex === 'price'">
                <span style="color: #1677ff" v-if="!(priceVisible && itemId == record.id)">{{ record.currencyCode }} {{
                  record.price
                }}</span>
                <div v-else class="inline-block">
                  <a-input-number class="mr-2.5 w-30" v-model:value="record.price" placeholder="请输原价格" :min="0"
                    :precision="2"></a-input-number>
                  <a-button class="mr-2.5" @click="priceVisible = false">取消</a-button>
                  <a-button type="primary" @click="checkOldPrice(record)">确定</a-button>
                </div>
                <AsyncIcon v-if="!(priceVisible && itemId == record.id)" icon="EditOutlined"
                  style="cursor: pointer; color: #1677ff" @click="editSinglePrice(record)">
                </AsyncIcon>
              </div>
              <div v-else-if="column.dataIndex === 'oldPrice'">
                <span style="color: #1677ff" v-if="!(singleVisible && itemId == record.id)">{{ record.currencyCode }} {{
                  record.oldPrice }}</span>
                <div v-else class="inline-block">
                  <a-input-number class="mr-2.5 w-30" v-model:value="record.oldPrice" placeholder="请输原价格" :min="0"
                    :precision="2"></a-input-number>
                  <a-button class="mr-2.5" @click="singleVisible = false">取消</a-button>
                  <a-button type="primary" @click="checkOldPrice(record)">确定</a-button>
                </div>
                <AsyncIcon v-if="!(singleVisible && itemId == record.id)" style="cursor: pointer; color: #1677ff"
                  icon="EditOutlined" @click="handelEditPrice(record)">
                </AsyncIcon>
              </div>
              <div v-else-if="column.dataIndex === 'minPrice'">
                <span style="color: #1677ff" v-if="
                  record.minPrice && !(minPriceVisible && itemId == record.id)
                ">{{ record.currencyCode }} {{ record.minPrice }}</span><span v-if="!record.minPrice">---</span>
                <div v-if="minPriceVisible && itemId == record.id" class="inline-block">
                  <a-input-number class="mr-2.5 w-30" v-model:value="record.minPrice" placeholder="请输原价格" :min="0"
                    :precision="2"></a-input-number>
                  <a-button class="mr-2.5" @click="minPriceVisible = false">取消</a-button>
                  <a-button type="primary" @click="checkOldPrice(record)">确定</a-button>
                </div>
                <AsyncIcon v-if="
                  !(minPriceVisible && itemId == record.id) && record.minPrice
                " style="cursor: pointer; color: #1677ff" icon="EditOutlined" @click="handelEditminPrice(record)">
                </AsyncIcon>
              </div>
              <div v-else-if="column.dataIndex === 'stock'">
                <a-tooltip style="margin-right: 10px" effect="dark" placement="top" v-if="record.warehouseList">
                  <template #title>
                    <div v-for="(item, index) in record.warehouseList" :key="index">
                      <span>{{ item.warehouseName }}</span>:
                      <span>{{ item.present || 0 }}</span>
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
              <div v-else-if="column.dataIndex === 'errorInfo'">
                <div v-if="record.errors != null">
                  <div style="display: flex">
                    <div>
                      详细描述:
                      <a-popover :overlayInnerStyle="{ width: '1000px' }" trigger="click">
                        <template #content>
                          <a-table :pagination="false" :data-source="record.errors" bordered
                            :scroll="{ x: 200, y: 300 }" :columns="errorColumns">
                          </a-table>
                        </template>
                        <a-button type="primary" :disabled="record.errors && record.errors.length == 0"
                          style="margin-left: 20px">更多信息</a-button>
                      </a-popover>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="column.dataIndex === 'createdAt'" style="
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                ">
                <div>
                  创建时间：<span style="color: #9e9f9e">{{
                    timestampToDateTime(record.createTime)
                  }}</span>
                </div>
                <div>
                  更新时间：<span style="color: #9e9f9e">{{
                    timestampToDateTime(record.updateTime)
                  }}</span>
                </div>
              </div>
              <div v-else-if="column.dataIndex === 'option'">
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
                          <a-popconfirm ok-text="YES" cancel-text="NO" title="归档吗？" @confirm="deactivate(record)">
                            <a-menu-item v-if="record.state !== '已归档'" type="text"
                              style="color: #e6a23c">归档</a-menu-item>
                          </a-popconfirm>
                          <a-menu-item @click="addRemark(record)">
                            备注
                          </a-menu-item>
                          <a-popconfirm ok-text="YES" cancel-text="NO" title="删除代表该产品在ozon平台删除，确定删除吗？"
                            @confirm="deleteItem(record)">
                            <a-menu-item type="text" style="color: red">删除</a-menu-item>
                          </a-popconfirm>
                          <!-- v-if="
                                                            record.sku === 'sku未创建' && record.state === '已归档'
                                                        " -->
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </a-col>
                  <!-- <a-col :span="6">
                                        <a-button @click.stop="syncOne(record)" type="text"
                                            style="color: #67c23a">同步</a-button>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button @click.stop="copy(record)" type="text"
                                            style="color: #0d9888">复制</a-button>
                                    </a-col>
                                    <a-col :span="6" v-if="record.state !== '已归档'">
                                        <a-popconfirm ok-text="YES" cancel-text="NO" title="归档吗？"
                                            @confirm="deactivate(record)">
                                            <a-button type="text" style="color: #e6a23c">归档</a-button>
                                        </a-popconfirm>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-button type="text" @click="addRemark(record)">备注</a-button>
                                    </a-col>
                                    <a-col :span="6" v-if="
                                        record.sku === 'sku未创建' && record.state === '已归档'
                                    ">
                                        <a-popconfirm ok-text="YES" cancel-text="NO" title="删除代表该产品在ozon平台删除，确定删除吗？"
                                            @confirm="deleteItem(record)">
                                            <a-button type="text" style="color: red">删除</a-button>
                                        </a-popconfirm>
                                    </a-col> -->
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
    <a-back-top :visibility-height="0" style="margin-right: 10px" @click="backToTop" />
    <!-- 备注 -->
    <editRemark :remarkVisible="remarkVisible" :remarkId="remarkId" @backCloseRemark="backCloseRemark"></editRemark>
    <!-- 统一修改价格库存等 -->
    <editPriceModal :selectedRows="selectedRows" :editPriceVisible="editPriceVisible" :brandList="brandList"
      @handleEditPriceClose="handleEditPriceClose" :editStockList="editStockList" :defType="defType">
    </editPriceModal>
    <!-- 库存 -->
    <editQuantity :editQuantityVis="editQuantityVis" :editStockList="editStockList" :selectOzonId="selectOzonId"
      @backCloseQuantity="backCloseQuantity"></editQuantity>
    <!-- 进度条 -->
    <progressBar :showOpen="showOpen" :asyncErrData="asyncErrData" @handleProgressBarClose="handleProgressBarClose"
      :percentage="percentage">
    </progressBar>
    <!-- 复制 -->
    <copyProduct :copyProductVis="copyProductVis" :copyList="copyList" @handleCopyProductClose="handleCopyProductClose">
    </copyProduct>
    <!-- 已合并 -->
    <productList @handleProductListClose="handleProductListClose" :childList="childList"
      :prodListVisible="prodListVisible">
    </productList>
    <!-- 店铺设置 -->
    <shopSetModal :shopSetVisible="shopSetVisible" :shopCurryList="shopCurryList"
      @handleShopSetClose="shopSetVisible = false" @refreshShopSet="getShopSet"></shopSetModal>
  </div>
</template>

<script setup>
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import {
  accountCache,
  list,
  batchArchive,
  syncOneProduct,
  syncHistoryCategory,
  mergeList,
  asyncProgress,
  updatePrices,
  productWarehouse,
  del,
  syncShopProductAll,
  syncShopProduct,
  byState,
  shopAsyncProgress,
  exportProduct,
  shopCurrency,
  brandCategory
} from "../config/api/product";
import { warehouseList } from "../config/api/storeManagement";
import { tabDicList, attrList, colors } from "../config/commDic/defDic";
import tableHead from "../config/tabColumns/product";
import { message, Modal } from "ant-design-vue";
import editRemark from "./comm/editRemark.vue";
import editPriceModal from "./comm/editPriceModal.vue";
import editQuantity from "./comm/editQuantity.vue";
import progressBar from "../config/component/progressBar/index.vue";
import productList from "./comm/productList.vue";
import copyProduct from "./comm/copyProduct.vue";
import shopSetModal from "./comm/shopSetModal.vue";
import { processImageSource } from "~/pages/ozon/config/commJs/index";
import dayjs from "dayjs";
import { useClipboard } from "@v-c/utils";
import {
  SettingOutlined,
  EditOutlined,
  ReloadOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import download from "~/api/common/download";
import typeTree from '@/components/classificationTree/typeTree.vue';
import { updateCategoryProduct } from "~/pages/sample/dataAcquisition/js/api.js";

const { copy } = useClipboard();
const OzonProduct = ref(null);
const formRef = ref(null);
const formData = reactive({
  id: "",
  account: "",
  sku: "",
  name: "",
  prop: "create_time",
  order: "desc",
  state: "",
});
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const advancedForm = reactive({
  minPrice: null,
  maxPrice: null,
  minOldPrice: null,
  maxOldPrice: null,
  minStock: null,
  maxStock: null,
  // isRemark: "",
  timeSearch: "update_time",
  time: [],
});
const dropCol = tableHead;
let tabList = tabDicList;
let discLists = attrList;
const advancedType = ref(false);
const loading = ref(false);
const allChecked = ref(false);
const syncLoading = ref(false);
const deactivateLoading = ref(false);
const delLoading = ref(false);
const remarkVisible = ref(false);
const editPriceVisible = ref(false);
const singleVisible = ref(false);
const priceVisible = ref(false);
const minPriceVisible = ref(false);
const editQuantityVis = ref(false);
const showOpen = ref(false);
const prodListVisible = ref(false);
const copyProductVis = ref(false);
const shopSetVisible = ref(false);
const interval = ref(null);
const percentage = ref(0);
const defType = ref([]);
const itemId = ref();
const remarkId = ref([]);
const shopAccount = ref([]);
const tableData = ref([]);
const activeName = ref(" ");
const tabQuantity = ref([]);
const stockShops = ref([]);
const selectedRows = ref([]);
const syncOneList = ref([]);
const selectOzonId = ref([]);
const editStockList = ref([]);
const childList = ref([]);
const copyList = ref([]);
const storeOption = ref([]);
const shopCurryList = ref([]);
const asyncErrData = ref([]);
const brandList = ref([]);
const currentClass = ref('0');
const nodePath = ref('');
const errorColumns = [
  {
    title: "错误字段",
    dataIndex: "attributeName",
    width: 200,
  },
  {
    title: "错误描述1",
    dataIndex: "description",
    width: 200,
  },
  {
    title: "错误描述2",
    dataIndex: "message",
    width: 200,
  },
];
const actives = ref(1);
const sortObj = reactive({
  sortField: "create_time",
  sortType: "desc",
});
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
];
const shopObj = {
  fieldKey: "account",
  fieldLabel: "simpleName",
};
const active = ref({
  label: "按创建时间",
  value: "create_time",
  type: "top",
  prop: 1,
  isDefault: true,
}); // 默认按下单时间查询
const strList = ref([
  {
    label: "按创建时间",
    value: "create_time",
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
    value: "price",
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

const getStateColor = (state) => {
  const colorMap = {
    平台审核: "processing",
    在售: "success",
    审核不通过: "error",
    准备出售: "warning",
  };
  return colorMap[state] || "default";
};

// 批量移动分类
// async function typeNodeClick(node) {
//   if (selectedRows.value.length < 1) return message.warning('请选择商品！')
//   console.log("selectedRows",selectedRows.value);

//   try {
//     let ids = selectedRows.value.map(i => i.id);
//     let params = {
//       "ids": ids.join(), // 商品信息的唯一标识(多个用英文逗号分割)
//       "productCategoryId": node.id   //分类ID
//     }
//     await updateCategoryProduct(params)
//     getList()
//   } catch (error) {
//     console.error(error)
//   }
// };
// const updateCurrentClass = (value) => {
//   console.log(value);
// };

// 复制
const copyText = (text) => {
  copy(text);
  message.success(`复制成功：${text}`);
};

// 店铺数据
const getAccount = () => {
  accountCache().then((res) => {
    if (res.data) {
      shopAccount.value = res?.data ?? [];
      getList();
    }
  });
};
// 店铺单选多选
const selectAll = () => {
  formData.account = "";
  getList();
};
const selectItem = (val) => {
  formData.account = val;
  getList();
};
const backToTop = () => {
  let elements = document.getElementsByClassName("ant-layout-content");
  if (elements) {
    elements[0].scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

const remarkColor = (param) => {
  const findItem = colors.find((item) => {
    return item.id === param;
  });
  return findItem ? findItem.color : "#000000";
};

// 搜索内容
const selectTypes = (index) => {
  actives.value = index;
  switch (index) {
    case 1:
      formData.sku = "";
      formData.id = "";
      break;
    case 2:
      formData.name = "";
      formData.id = "";
      break;
    case 3:
      formData.sku = "";
      formData.name = "";
      break;
    default:
      break;
  }
};

// 高级搜索重置
const resetForm = (type = 0) => {
  formData.sku = "";
  formData.id = "";
  formData.name = "";
  advancedForm.minPrice = null;
  advancedForm.maxPrice = null;
  advancedForm.minOldPrice = null;
  advancedForm.maxOldPrice = null;
  advancedForm.minStock = null;
  advancedForm.maxStock = null;
  // advancedForm.isRemark = ""
  advancedForm.timeSearch = "update_time";
  advancedForm.time = [];
  advancedType.value = type == 1 ? false : true;
  paginations.pageNum = 1
  paginations.pageSize = 50
  getList();
};

// 排序方式
const storChange = (item) => {
  item.type = item.type === "top" ? "bottom" : "top";
  active.value = item;
  sortObj.sortField = item.value;
  sortObj.sortType = item.type === "top" ? "desc" : "asc";
  formData.order = item.type === "top" ? "desc" : "asc";
  formData.prop = item.value;
  getList();
};

// 表单搜索
const onSubmit = (type = false) => {
  paginations.pageNum = 1
  paginations.pageSize = 50
  getList(type);
  setUncheck();
};

// 标签页切换
const handleClick = (activeKey) => {
  formData.state = activeKey;
  getList();
};
// 提取去重逻辑
const uniqueArray = (arr1, arr2) => [...new Set([...arr1, ...arr2])];
// 公共处理批量所需的数据格式
const commFn = (tableItem, type = "single", record = {}) => {
  const existingItem = syncOneList.value.find(
    (e) => e.account === tableItem.account
  );
  if (existingItem) {
    const offerIdsToAdd =
      type === "single"
        ? [record.offerId]
        : tableItem.children.map((el) => el.offerId);
    const productIdsToAdd =
      type === "single" ? [record.id] : tableItem.children.map((el) => el.id);

    existingItem.offerIds = uniqueArray(existingItem.offerIds, offerIdsToAdd);
    existingItem.productIds = uniqueArray(
      existingItem.productIds,
      productIdsToAdd
    );
  } else {
    const newOfferIds =
      type === "single"
        ? [record.offerId]
        : [...new Set(tableItem.children.map((e) => e.offerId))];
    const newProductIds =
      type === "single"
        ? [record.id]
        : [...new Set(tableItem.children.map((e) => e.id))];

    const newObj = {
      account: tableItem.account,
      offerIds: newOfferIds,
      productIds: newProductIds,
    };
    syncOneList.value.push(newObj);
  }
};

//单个选择
const handelChecked = (e, tbItem, record) => {
  if (e.target.checked) {
    selectedRows.value.push(record);
    commFn(tbItem, "single", record);
  } else {
    selectedRows.value = selectedRows.value.filter(
      (item) => item.id !== record.id
    );
    syncOneList.value = syncOneList.value.map((item) => {
      if (item.account === record.account) {
        item.offerIds = item.offerIds.filter((id) => !(id == record.offerId));
        item.productIds = item.productIds.filter((id) => !(id == record.id));
      }
      return item;
    });
  }
  const checkItem = tbItem.children.every((child) => child.checked);
  tbItem.tabAllChecked = checkItem;
};

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
      commFn(item, "multiple");
    });
  } else {
    // 取消选中时，移除所有相关子元素
    tableData.value.forEach((item) => {
      item.tabAllChecked = false;
      item.children.forEach((child) => {
        child.checked = false;
        selectedRows.value = selectedRows.value.filter(
          (row) => row.id !== child.id
        );
      });
    });
  }
};

// 总产品全选
const changeBox = (e, tbItem, index) => {
  tbItem.children.forEach((child) => (child.checked = tbItem.tabAllChecked));
  allChecked.value = tableData.value.every((item) => item.tabAllChecked);
  if (tbItem.tabAllChecked) {
    tbItem.children.forEach((child) => selectedRows.value.push(child));
    commFn(tbItem, "multiple");
  } else {
    tbItem.children.forEach(
      (child) =>
      (selectedRows.value = selectedRows.value.filter(
        (item) => item.id !== child.id
      ))
    );
    syncOneList.value = syncOneList.value.map((item) => {
      if (item.account === tbItem.account) {
        const childrenOfferIds = tbItem.children.map((child) => child.offerId);
        const childrenProductIds = tbItem.children.map((child) => child.id);
        item.offerIds = item.offerIds.filter(
          (id) => !childrenOfferIds.includes(id)
        );
        item.productIds = item.productIds.filter(
          (id) => !childrenProductIds.includes(id)
        );
      }
      return item;
    });
  }
};

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
};
// 控制错误信息
const displayedStatus = (row) => {
  return row.show ? row.status.itemErrors : row.status.itemErrors.slice(0, 3);
};
// 商品ID跳转
const jumpTo = (sku) => {
  if (sku == "sku未创建") return;
  const url = `https://ozon.ru/context/detail/id/${sku}`;
  window.open(url, "_blank");
};

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
};
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
};

// 单个批量同步
const handleAsyncClick = (e) => {
  if (e.key === "All") {
    sync();
  } else if (e.key === "single") {
    syncOne();
  }
};

// 批量修改库存、重量、尺寸等
const handleMenuClick = (e) => {
  if (e.key === "remark") {
    addRemark();
  } else if (e.key === "delete") {
    Modal.confirm({
      title: "删除",
      content: "请确认是否删除(此删除仅代表在erp上删除)？",
      onOk: () => {
        deleteItem();
        setUncheck();
      },
      onCancel: () => {
        setUncheck();
      },
    });
  } else if (e.key === "deactivate") {
    Modal.confirm({
      title: "移入归档",
      content: "请确认是否将产品移入已归档？",
      onOk: () => {
        deactivate();
        setUncheck();
      },
      onCancel: () => {
        setUncheck();
      },
    });
  } else {
    for (let i = 0; i < selectedRows.value.length; i++) {
      if (selectedRows.value[i].state == "已归档") {
        message.error("归档商品不可修改库存，请取消！");
        return;
      }
    }
    defType.value = e.keyPath;
    editPriceVisible.value = true;
    stockShops.value = syncOneList.value.map((e) => e.account);
    getStore();
    getBrandList();
  }
};

// 获取品牌相关数据
const getBrandList = () => {
  let list = selectedRows.value.map((e) => {
    return {
      account: e.account,
      typeId: e.typeId,
      descriptionCategoryId: e.descriptionCategoryId
    }
  })
  brandCategory(list).then((res) => {
    brandList.value = res?.data ?? [];
  })
};

// 导出
const handleExport = (e) => {
  let seqIds = [];
  if (e.key == "page") {
    seqIds = extractSeqIds(tableData.value);
  } else {
    seqIds = selectedRows.value.map((item) => item.seqId);
  }
  exportProduct({ seqIds }).then((res) => {
    download.name(res.msg);
    message.success("下载任务已开始！请耐心等待完成");
    setUncheck();
  });
};
// 递归提取children里面的seqId 用于导出
const extractSeqIds = (data) => {
  let seqIds = [];
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item.children) {
        seqIds = seqIds.concat(extractSeqIds(item.children));
      } else if (item.seqId) {
        seqIds.push(item.seqId);
      }
    });
  }
  return seqIds;
};

// 批量修改库存
const editStock = (row = {}) => {
  let stockObj = {
    account: row.account,
    offerIds: [row.offerId],
  };
  stockShops.value.push(row.account);
  selectOzonId.value.push(stockObj);
  getStore();
  editQuantityVis.value = true;
};

const backCloseQuantity = () => {
  getList();
  stockShops.value = [];
  selectOzonId.value = [];
  syncOneList.value = [];
  selectOzonId.value = [];
  editQuantityVis.value = false;
};

// 修改单个价格
const checkOldPrice = (row) => {
  // 使用解构赋值提取所需属性
  const { price, oldPrice } = row;

  // 将价格转换为数值类型以避免字符串比较问题
  const numericPrice = Number(price);
  const numericOldPrice = Number(oldPrice);

  // 验证数值有效性
  if ([numericPrice, numericOldPrice].some(isNaN)) {
    message.error("请输入有效的价格数值");
    return;
  }

  // 核心业务逻辑判断
  if (numericPrice > numericOldPrice) {
    message.error("售价不可高于原价");
    return;
  }
  let params = {
    offerIds: row.offerId,
    oldPrice: Math.round(row.oldPrice * 100) / 100,
    price: Math.round(row.price * 100) / 100,
    productIds: row.productIds,
    minPrice: Math.round(row.minPrice * 100) / 100,
    account: row.account,
  };
  updatePrices([params])
    .then((res) => {
      message.success(res.msg);
    })
    .finally(() => {
      getList();
      singleVisible.value = false;
      priceVisible.value = false;
      minPriceVisible.value = false;
      itemId.value = "";
    });
};

const editSinglePrice = (item) => {
  priceVisible.value = true;
  itemId.value = item.id;
};

const handelEditPrice = (item) => {
  singleVisible.value = true;
  itemId.value = item.id;
};
const handelEditminPrice = (item) => {
  minPriceVisible.value = true;
  itemId.value = item.id;
};

// 关闭已合并弹窗
const handleProductListClose = () => {
  prodListVisible.value = false;
  childList.value = [];
};
// 关闭价格
const handleEditPriceClose = () => {
  selectOzonId.value = [];
  selectedRows.value = [];
  syncOneList.value = [];
  defType.value = [];
  editPriceVisible.value = false;
  getList();
  setUncheck();
  editStockList.value = clearStock(editStockList.value);
};

function clearStock(data) {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item.children) {
        clearStock(item.children);
      }
      if (item.hasOwnProperty("stock")) {
        item.stock = null;
      }
    });
  }
  return data;
}

const setUncheck = () => {
  allChecked.value = false;
  selectedRows.value = [];
  tableData.value.forEach((item) => {
    item.tabAllChecked = false;
    item.children.forEach((child) => {
      child.checked = false;
    });
  });
};
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
};
// 备注弹窗关闭
const backCloseRemark = () => {
  remarkVisible.value = false;
  selectedRows.value = [];
  remarkId.value = [];
  syncOneList.value = [];
  allChecked.value = false;
  getList();
  setUncheck();
};

const handleCopyProductClose = () => {
  copyList.value = [];
  copyProductVis.value = false;
  getList();
  setUncheck();
};

// 复制
const copyItems = (row = {}) => {
  if (syncOneList.value.length == 0) {
    copyList.value.push({
      account: row.account,
      offerIds: [row.offerId],
    });
  } else {
    copyList.value = syncOneList.value;
  }
  copyProductVis.value = true;
};
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
  deactivateLoading.value = true;
  batchArchive(id)
    .then((res) => {
      message.success(res.msg);
    })
    .finally(() => {
      getList();
      deactivateLoading.value = false;
      syncOneList.value = [];
      selectedRows.value = [];
    });
};
// 单个和批量删除
const deleteItem = (row = {}) => {
  let products = [];
  if (Object.keys(row).length == 0) {
    products = syncOneList.value;
  } else {
    products.push({
      account: row.account,
      offerIds: [row.offerId],
    });
  }

  delLoading.value = true;
  del(products)
    .then((res) => {
      message.success(res.msg);
    })
    .finally(() => {
      getList();
      delLoading.value = false;
      syncOneList.value = [];
      selectedRows.value = [];
    });
};

const add = () => {
  window.open("productPublish", "_blank");
};
const edit = (row = {}) => {
  let newRow = Object.keys(row).length != 0 ? row : selectedRows.value[0];
  let newRowId = encodeURIComponent(newRow.offerId); //转译
  window.open(
    "editProductPublish" + `?id=${newRowId}&account=${newRow.account}`,
    "_blank"
  );
};
const sync = () => {
  syncLoading.value = true;
  if (formData.account == null || formData.account == "") {
    // showOpen.value = true;
    syncShopProductAll()
      .then((res) => {
        message.success("正在同步店铺所有商品，请稍后！");
        // interval.value = setInterval(() => {
        //     shopAsyncProgress(res.msg).then(res => {
        //         asyncErrData.value = res.data
        //         // percentage.value = parseInt(res.data);
        //         // if (res.data >= 100) {
        //         //     clearInterval(interval.value)
        //         //     message.success("同步成功！");
        //         //     syncLo// ... existing code ...
        // let params = {
        //   ...formData,
        //   ...Object.entries(advancedForm).reduce((acc, [key, value]) => {
        //     // 过滤掉 timeSearch 和 time 字段
        //     if (["time"].includes(key)) return acc;

        //     // 保留原有转换逻辑并添加字符串转换
        //     if (value !== null && value !== undefined && value !== "") {
        //       acc[key] = typeof value === "number" ? String(value) : value;
        //     }
        //     return acc;
        //   }, {}),
        //   startDateTime: advancedForm.time.length
        //     ? dayjs(advancedForm.time[0])
        //       .startOf("day")
        //       .format("YYYY-MM-DD HH:mm:ss")
        //     : undefined,
        //   // ... existing code ...
        // };
        // syncLoading.value = false;
        //         //     showOpen.value = false;
        //         //     getList();
        //         //     setTimeout(() => {
        //         //         percentage.value = 0;
        //         //     }, 300);
        //         // }
        //     })
        // }, 5000);
      })
      .finally(() => {
        syncLoading.value = false;
        // showOpen.value = false;
        getList();
        // setTimeout(() => {
        //     percentage.value = 0;
        // }, 300);
        selectedRows.value = [];
      });
  } else {
    syncShopProduct({ account: formData.account })
      .then((res) => {
        message.success("同步成功！");
        getList();
      })
      .finally(() => {
        syncLoading.value = false;
        // getList();
        selectedRows.value = [];
      });
  }
};

const handleProgressBarClose = () => {
  showOpen.value = false;
  getList();
};

const syncOne = (record = {}) => {
  let syncList = [];
  let obj = {};
  if (syncOneList.value.length == 0) {
    obj = {
      account: record.account,
      offerIds: [record.offerId],
      // productIds: [record.id]
    };
    syncList.push(obj);
  } else {
    syncList = syncOneList.value;
  }
  syncLoading.value = true;
  syncOneProduct(syncList)
    .then((res) => {
      message.success(res.msg);
    })
    .finally(() => {
      syncLoading.value = false;
      syncOneList.value = [];
      selectedRows.value = [];
      getList();
    });
};

// 同步历史分类
const syncHisAttr = () => {
  // if (!formData.account) {
  //     message.error("请先选择店铺后同步历史分类！");
  //     return;
  // }
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
      selectedRows.value = [];
    });
};

const timestampToDateTime = (timestamp) => {
  if (timestamp == null || timestamp == "") {
    return "无";
  }
  return timestamp;
};

// 获取店铺数据
const getList = () => {
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
  loading.value = true;
  let params = {
    ...formData,
    // ...advancedForm,
    ...Object.entries(advancedForm).reduce((acc, [key, value]) => {
      // 过滤掉 timeSearch 和 time 字段
      if (["time"].includes(key)) return acc;

      // 保留原有转换逻辑并添加字符串转换
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = typeof value === 'number' ? String(value) : value;
      }
      return acc;
    }, {}),
    startDateTime: advancedForm.time.length
      ? dayjs(advancedForm.time[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss")
      : undefined,
    endDateTime: advancedForm.time.length
      ? dayjs(advancedForm.time[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss")
      : undefined,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
  };
  list(params)
    .then((res) => {
      tableData.value =
        res.data.map((item) => {
          item.show = false;
          item.children.forEach((e) => {
            e.errors = e?.errors?.map((el) => {
              return {
                attributeName: el?.texts?.attributeName,
                description: el?.texts?.description,
                message: el?.texts?.message,
              };
            });
          });
          return item;
        }) ?? [];
    })
    .finally(() => {
      loading.value = false;
    });
  byState(params).then((res) => {
    tabQuantity.value = res?.data?.rows ?? [];
    paginations.total = res?.data?.total ?? 0;
  });
};

const shopSet = () => {
  shopSetVisible.value = true;
  getShopSet();
};

const getShopSet = () => {
  shopCurrency().then((res) => {
    shopCurryList.value = res?.data ?? [];
  });
};
// tabs的商品统计条数赋值
watch(tabQuantity, (newValue, oldValue) => {
  if (newValue.length === 0) {
    tabList = [...tabDicList];
  } else {
    tabList = tabDicList.map((item) => {
      const match = newValue.find((q) => q.state === item.label);
      return {
        ...item,
        value: match ? match.count.toString() : "0",
      };
    });
  }
});
onMounted(() => {
  getAccount();
});
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

  .ant-table {
    border-bottom: none;

    @media (min-width: 1920px) {
      .prodTitle {
        width: 220px !important;
      }
    }

    @media (min-width: 2560px) {
      .prodTitle {
        width: 440px !important;
      }
    }
  }
}

:deep(.fixedTable) {
  height: 38px;

  table {
    height: 38px;
  }
}
</style>
