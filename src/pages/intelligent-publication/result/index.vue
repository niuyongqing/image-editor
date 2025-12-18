<!-- 刊登结果 列表页 -->
<template>
  <div>
    <div>
      <!-- 搜索区 -->
      <AppTableForm
        v-model:formData="formData"
        reset-set-menu="result"
        @on-submit="search"
      >
        <template #formItemRow>
          <a-form-item
            label="店铺账号"
            name="account"
          >
            <AppCardSelect
              v-model:account="formData.account"
              :options="shopAccount"
              :field-obj="{ label: 'simpleName', value: 'account' }"
              @selectItem="search"
            />
          </a-form-item>
          <a-form-item
            label="模糊查询"
            name="mult"
          >
            <a-form-item-rest>
              <a-space>
                <a-input
                  v-model:value="formData.name"
                  placeholder="标题"
                  allow-clear
                />
                <a-input
                  v-model:value="formData.sku"
                  placeholder="SKU, 多个SKU间用逗号隔开，最多支持200个"
                  allow-clear
                />
                <a-input
                  v-model:value="formData.id"
                  placeholder="产品ID,多个ID间用逗号隔开，最多支持200个"
                  allow-clear
                />
              </a-space>
            </a-form-item-rest>
          </a-form-item>
        </template>
      </AppTableForm>

      <a-card class="mt-2">
        <div
          style="width: 100%; height: 38px"
          class="flex justify-between"
        >
          <a-space>
            <a-button
              type="primary"
              :disabled="selectedRows.length === 0"
              @click="addRemark()"
              >批量备注</a-button
            >
            <a-popconfirm
              title="确认删除(此删除仅代表在erp上删除)？"
              :disabled="selectedRows.length === 0"
              @confirm="deleteItem()"
              @cancel="setUncheck"
            >
              <a-button
                danger
                :disabled="selectedRows.length === 0"
                >批量删除</a-button
              >
            </a-popconfirm>
          </a-space>

          <a-space>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleAsyncClick">
                  <a-menu-item
                    key="All"
                    >同步全部产品</a-menu-item
                  >
                  <a-menu-item
                    key="single"
                    :disabled="selectedRows.length === 0"
                    >同步选中产品</a-menu-item
                  >
                </a-menu>
              </template>
              <a-button type="primary">
                同步产品
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </a-space>
        </div>
        <div class="flex items-baseline justify-between">
          <a-tabs
            v-model:activeKey="activeName"
            type="card"
            style="width: 800px"
            @tab-click="handleClick"
          >
            <a-tab-pane
              v-for="item in TABS"
              :key="item.value"
              :tab="item.label + `(${item.count})`"
            >
            </a-tab-pane>
          </a-tabs>
          <a-pagination
            :show-total="total => `共 ${total} 条`"
            v-model:current="paginations.pageNum"
            v-model:pageSize="paginations.pageSize"
            :total="paginations.total"
            class="mt-5 mb-2.5 text-right"
            :show-quick-jumper="true"
            @change="getList"
            :showSizeChanger="true"
          />
        </div>
        <a-spin :spinning="loading">
          <div class="outContent">
            <div class="topHeader relative">
              <a-checkbox
                v-model:checked="allChecked"
                class="absolute top-2.5 left-5 z-1"
                @change="allChangeBox"
              ></a-checkbox>

              <a-table
                style="height: 39px"
                :columns="DEFAULT_COLUMNS"
              >
              </a-table>
            </div>
            <div
              v-if="selectedRows.length != 0"
              class="h-7.5 pl-5 lh-7.5 text-left"
              style="background-color: #ffffcd"
            >
              已选中{{ selectedRows.length }}条数据
            </div>
            <div v-if="tableData.length == 0">
              <a-empty
                class="flex flex-col justify-center"
                :image-size="200"
                style="height: 100vh"
              ></a-empty>
            </div>

            <template v-else>
              <div
                v-for="(tbItem, index) in tableData"
                :key="tbItem.id"
                class="loopTable"
              >
                <div
                  class="loopTable-head flex justify-between bg-[#fafafa]"
                  :key="tbItem.id"
                >
                  <div>
                    <a-checkbox
                      v-model:checked="tbItem.tabAllChecked"
                      @change="changeBox($event, tbItem, index)"
                      class="mr-2.5"
                    ></a-checkbox
                    ><span>总产品({{ tbItem.count }})</span>
                  </div>
                  <div class="mr-15px">
                    <a-button
                      v-if="tbItem.count > 1"
                      type="link"
                      @click="edit(tbItem, 'all')"
                      >编辑总产品</a-button
                    >
                  </div>
                </div>
                <a-table
                  :data-source="tbItem.children"
                  row-key="id"
                  :showHeader="false"
                  :columns="DEFAULT_COLUMNS"
                  :pagination="false"
                  :data-index="index"
                >
                  <template #bodyCell="{ column, record }">
                    <div
                      v-if="column.dataIndex === 'name'"
                      class="flex"
                    >
                      <a-checkbox
                        class="mx-2.5"
                        @change="handelChecked($event, tbItem, record)"
                        v-model:checked="record.checked"
                      ></a-checkbox>
                      <div class="flex text-left items-center">
                        <a-image
                          style="width: 100px; height: 100px"
                          :src="processImageSource((record.primaryImage?.length > 0 && record.primaryImage[0]) || (record.images?.length > 0 && record.images[0]) || '')"
                        />
                        <div class="block ml-2.5">
                          <div class="break-all">{{ record.name }}</div>
                          <div class="float-left text-[#999]">
                            产品ID：
                            <a-tooltip placement="top">
                              <template #title>
                                <span
                                  class="cursor-pointer"
                                  @click="copyText(record.sku)"
                                  >复制</span
                                >
                              </template>
                              <a
                                class="text-[#1677ff]"
                                href="#"
                                @click="jumpTo(record.sku)"
                                >{{ record.sku }}</a
                              >
                            </a-tooltip>
                          </div>
                          <br />
                          <div class="text-[#999] float-left">店铺: {{ record.simpleName }}</div>
                          <br />
                          <div
                            :style="{
                              color: remarkColor(record.remarkColor),
                              float: 'left'
                            }"
                          >
                            备注:{{ record.remark }}
                          </div>
                          <br />
                          <div
                            class="text-red"
                            v-if="record.bathErrorInfo"
                          >
                            失败原因: {{ record.bathErrorInfo }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="column.dataIndex === 'state'">
                      <a-tag
                        :bordered="false"
                        :color="getStateColor(record.state)"
                      >
                        {{ getStateLabel(record.state) }}
                      </a-tag>
                    </div>
                    <div v-else-if="column.dataIndex === 'sku'">
                      <div>
                        <div class="text-[#1677ff] cursor-pointer">
                          <a-tooltip placement="topLeft">
                            <template #title>
                              <span
                                class="cursor-pointer"
                                @click="copyText(record.offerId)"
                                >复制</span
                              >
                            </template>
                            <div class="w-100px">{{ record.offerId }}</div>
                          </a-tooltip>
                        </div>
                        <div
                          class="text-[#428bca] cursor-pointer"
                          v-if="tbItem.count > 1 && record.state === '在售'"
                          @click="showChildren(record.account, tbItem.attributeId, record.typeId)"
                        >
                          已合并:{{ tbItem.count }}
                        </div>
                        <div>
                          促销活动价：<span class="text-[#1677ff]">{{ record.marketingPrice || '暂未参加活动' }}</span>
                        </div>
                        <div v-if="record.state === '已归档' || record.state === '在售'">
                          <div class="flex">
                            <span>内容质量分:</span>
                            <div v-if="record.productsScore">
                              <a-popover
                                placement="right"
                                :overlayInnerStyle="{ width: '400px' }"
                                trigger="click"
                              >
                                <template #content>
                                  <div class="scoreItem">
                                    <div class="flex justify-between">
                                      <div>
                                        <span class="font-bold"> 搜索属性</span>
                                        <a-popover
                                          placement="right"
                                          :overlayInnerStyle="{ width: '300px' }"
                                          :title="discLists[0].title"
                                        >
                                          <template #content>
                                            <div
                                              v-for="(e, ind) in discLists[0].list"
                                              :key="ind"
                                              class="m-2.5 flex justify-between"
                                            >
                                              <span>{{ e.sock }}</span
                                              ><span>{{ e.disc }}</span>
                                            </div>
                                          </template>
                                          <AsyncIcon
                                            icon="QuestionCircleOutlined"
                                            class="ml-2.5"
                                          />
                                        </a-popover>
                                      </div>
                                      <div>
                                        <span>分数:</span><span>{{ record.productsScore[0].groups[0].score }}分</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span class="text-[#999]">至少填写{{ record.productsScore[0].groups[0].improveAtLeast }}个属性可得最大分数</span>
                                      <ul>
                                        <li
                                          v-for="(item, index) in record.productsScore[0].groups[0].improveAttributes"
                                          :key="index"
                                        >
                                          {{ item.name }}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="scoreItem">
                                    <div class="flex justify-between">
                                      <div>
                                        <span class="font-bold">其他属性</span>
                                        <a-popover
                                          placement="right"
                                          :overlayInnerStyle="{ width: '300px' }"
                                          :title="discLists[1].title"
                                        >
                                          <template #content>
                                            <div
                                              v-for="(e, ind) in discLists[1].list"
                                              :key="ind"
                                              class="m-2.5 flex justify-between"
                                            >
                                              <span>{{ e.sock }}</span
                                              ><span>{{ e.disc }}</span>
                                            </div>
                                          </template>
                                          <AsyncIcon
                                            icon="QuestionCircleOutlined"
                                            class="ml-2.5"
                                          />
                                        </a-popover>
                                      </div>
                                      <div>
                                        <span>分数:</span><span>{{ record.productsScore[0].groups[1].score }}分</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span class="text-[#999]">至少填写{{ record.productsScore[0].groups[1].improveAtLeast }}个属性可得最大分数</span>
                                      <ul>
                                        <li
                                          v-for="(item, index) in record.productsScore[0].groups[1].improveAttributes"
                                          :key="index"
                                        >
                                          {{ item.name }}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="scoreItem">
                                    <div class="flex justify-between">
                                      <div>
                                        <span class="font-bold">描述和丰富内容</span>
                                        <a-popover
                                          placement="right"
                                          :overlayInnerStyle="{ width: '300px' }"
                                          :title="discLists[2].title"
                                        >
                                          <template #content>
                                            <div
                                              v-for="(e, ind) in discLists[2].list"
                                              :key="ind"
                                              class="m-2.5 flex justify-between"
                                            >
                                              <span>{{ e.sock }}</span
                                              ><span>{{ e.disc }}</span>
                                            </div>
                                          </template>
                                          <AsyncIcon
                                            icon="QuestionCircleOutlined"
                                            class="ml-2.5"
                                          />
                                        </a-popover>
                                      </div>
                                      <div>
                                        <span>分数:</span><span>{{ record.productsScore[0].groups[2].score }}分</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span class="text-[#999]">至少填写{{ record.productsScore[0].groups[2].improveAtLeast }}个属性可得最大分数</span>
                                      <ul>
                                        <li
                                          v-for="(item, index) in record.productsScore[0].groups[2].improveAttributes"
                                          :key="index"
                                        >
                                          {{ item.name }}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="scoreItem">
                                    <div class="flex justify-between">
                                      <div>
                                        <span class="font-bold">图片和视频</span>
                                        <a-popover
                                          placement="right"
                                          :overlayInnerStyle="{ width: '300px' }"
                                          :title="discLists[3].title"
                                        >
                                          <template #content>
                                            <div
                                              v-for="(e, ind) in discLists[3].list"
                                              :key="ind"
                                              class="m-2.5 flex justify-between"
                                            >
                                              <span>{{ e.sock }}</span
                                              ><span>{{ e.disc }}</span>
                                            </div>
                                          </template>
                                          <AsyncIcon
                                            icon="QuestionCircleOutlined"
                                            class="ml-2.5"
                                          />
                                        </a-popover>
                                      </div>
                                      <div>
                                        <span>分数:</span><span>{{ record.productsScore[0].groups[3].score }}分</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span class="text-[#999]">至少填写{{ record.productsScore[0].groups[3].improveAtLeast }}个属性可得最大分数</span>
                                      <ul>
                                        <li>Ozon视频： 链接</li>
                                        <li>Ozon.视频封面：链接</li>
                                      </ul>
                                    </div>
                                  </div>
                                </template>
                                <span class="text-[#1677ff] cursor-pointer ml-2.5">{{ record.productsScore[0].rating }}分</span>
                              </a-popover>
                            </div>
                            <span
                              v-else
                              class="ml-2"
                              >{{ 0.0 }}分</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="column.dataIndex === 'price'">
                      <span
                        class="text-[#1677ff]"
                        v-if="!(priceVisible && itemId == record.id)"
                        >{{ record.currencyCode }} {{ record.price }}</span
                      >
                      <div
                        v-else
                        class="inline-block"
                      >
                        <a-input-number
                          class="mr-2.5 w-30"
                          v-model:value="record.price"
                          placeholder="请输原价格"
                          :min="0"
                          :precision="2"
                        ></a-input-number>
                        <a-button
                          class="mr-2.5"
                          @click="priceVisible = false"
                          >取消</a-button
                        >
                        <a-button
                          type="primary"
                          @click="checkOldPrice(record)"
                          >确定</a-button
                        >
                      </div>
                      <AsyncIcon
                        v-if="!(priceVisible && itemId == record.id)"
                        icon="EditOutlined"
                        class="cursor-pointer text-[#1677ff]"
                        @click="editSinglePrice(record)"
                      >
                      </AsyncIcon>
                    </div>
                    <div v-else-if="column.dataIndex === 'oldPrice'">
                      <span
                        class="text-[#1677ff]"
                        v-if="!(singleVisible && itemId == record.id)"
                        >{{ record.currencyCode }} {{ record.oldPrice }}</span
                      >
                      <div
                        v-else
                        class="inline-block"
                      >
                        <a-input-number
                          class="mr-2.5 w-30"
                          v-model:value="record.oldPrice"
                          placeholder="请输原价格"
                          :min="0"
                          :precision="2"
                        ></a-input-number>
                        <a-button
                          class="mr-2.5"
                          @click="singleVisible = false"
                          >取消</a-button
                        >
                        <a-button
                          type="primary"
                          @click="checkOldPrice(record)"
                          >确定</a-button
                        >
                      </div>
                      <AsyncIcon
                        v-if="!(singleVisible && itemId == record.id)"
                        class="cursor-pointer text-[#1677ff]"
                        icon="EditOutlined"
                        @click="handelEditPrice(record)"
                      >
                      </AsyncIcon>
                    </div>
                    <div v-else-if="column.dataIndex === 'minPrice'">
                      <span
                        class="text-[#1677ff]"
                        v-if="record.minPrice && !(minPriceVisible && itemId == record.id)"
                        >{{ record.currencyCode }} {{ record.minPrice }}</span
                      ><span v-if="!record.minPrice">0</span>
                      <div
                        v-if="minPriceVisible && itemId == record.id"
                        class="inline-block"
                      >
                        <a-input-number
                          class="mr-2.5 w-30"
                          v-model:value="record.minPrice"
                          placeholder="请输原价格"
                          :min="0"
                          :precision="2"
                        ></a-input-number>
                        <a-button
                          class="mr-2.5"
                          @click="minPriceVisible = false"
                          >取消</a-button
                        >
                        <a-button
                          type="primary"
                          @click="checkOldPrice(record)"
                          >确定</a-button
                        >
                      </div>
                      <AsyncIcon
                        v-if="!(minPriceVisible && itemId == record.id) && record.state === '在售'"
                        class="cursor-pointer text-[#1677ff] ml-2.5"
                        icon="EditOutlined"
                        @click="handelEditminPrice(record)"
                      >
                      </AsyncIcon>
                    </div>
                    <div v-else-if="column.dataIndex === 'stock'">
                      <a-tooltip
                        class="mr-2.5"
                        effect="dark"
                        placement="top"
                        v-if="record.warehouseList"
                      >
                        <template #title>
                          <div
                            v-for="(item, index) in record.warehouseList"
                            :key="index"
                          >
                            <span>{{ item.warehouseName }}</span
                            >:
                            <span>{{ item.present || 0 }}</span>
                          </div>
                        </template>
                        <span class="text-[#1677ff]">{{ record.stock }}</span>
                      </a-tooltip>
                      <span
                        v-else
                        class="text-[#1677ff]"
                        >{{ record.stock }}</span
                      >
                      <AsyncIcon
                        class="cursor-pointer text-[#1677ff]"
                        icon="EditOutlined"
                        v-if="record.state != '审核不通过' && record.state != '已归档'"
                        @click="editStock(record)"
                      ></AsyncIcon>
                    </div>
                    <div v-else-if="column.dataIndex === 'errorInfo'">
                      <div v-if="record.errors != null">
                        <div class="flex">
                          <div>
                            详细描述:
                            <a-popover
                              :overlayInnerStyle="{ width: '1000px' }"
                              trigger="click"
                            >
                              <template #content>
                                <a-table
                                  :pagination="false"
                                  :data-source="record.errors"
                                  bordered
                                  :scroll="{ x: 200, y: 300 }"
                                  :columns="errorColumns"
                                >
                                </a-table>
                              </template>
                              <a-button
                                type="primary"
                                :disabled="record.errors && record.errors.length == 0"
                                class="ml-2"
                                >更多信息</a-button
                              >
                            </a-popover>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <span>--</span>
                      </div>
                    </div>
                    <div v-else-if="column.dataIndex === 'publishType'">
                      <div>{{ PUBLISH_TYPE_OPTIONS.find(opt => opt.value === record.publishType)?.label || '--' }}</div>
                    </div>
                    <div v-else-if="column.dataIndex === 'operatorName'">
                      <span>{{ record.operatorName || '--' }}</span>
                    </div>
                    <div v-else-if="column.dataIndex === 'createdAt'">
                      <div>
                        创建时间：<span class="text-[#9e9f9e]">{{ timestampToDateTime(record.createTime) }}</span>
                      </div>
                      <div>
                        更新时间：<span class="text-[#9e9f9e]">{{ timestampToDateTime(record.updateTime) }}</span>
                      </div>
                    </div>
                    <div v-else-if="column.dataIndex === 'option'">
                      <a-space>
                        <a-button
                          v-if="record.state !== '已归档'"
                          type="link"
                          @click="edit(record, 'single')"
                          >编辑</a-button
                        >
                        <a-button
                          type="link"
                          @click="syncOne(record)"
                          >同步</a-button
                        >
                        <a-button
                          type="link"
                          @click="addRemark(record)"
                          >备注</a-button
                        >
                        <a-popconfirm
                          title="确认删除(此删除仅代表在erp上删除)？"
                          @confirm="deleteItem(record)"
                          @cancel="setUncheck"
                        >
                          <a-button
                            type="link"
                            danger
                            >删除</a-button
                          >
                        </a-popconfirm>
                      </a-space>
                    </div>
                  </template>
                </a-table>
              </div>
            </template>
          </div>
        </a-spin>
        <a-pagination
          :show-total="total => `共 ${total} 条`"
          v-model:current="paginations.pageNum"
          v-model:pageSize="paginations.pageSize"
          :total="paginations.total"
          class="mt-5 mb-2.5 text-right"
          :show-quick-jumper="true"
          @change="getList"
          :showSizeChanger="true"
        />
      </a-card>
    </div>

    <a-back-top
      :visibility-height="0"
      style="margin-right: 10px"
      @click="backToTop"
    />
    <!-- 备注 -->
    <editRemark
      :remarkVisible="remarkVisible"
      :remarkId="remarkId"
      @backCloseRemark="backCloseRemark"
    ></editRemark>
    <!-- 统一修改价格库存等 -->
    <editPriceModal
      :selectedRows="selectedRows"
      :editPriceVisible="editPriceVisible"
      :brandList="brandList"
      @handleEditPriceClose="handleEditPriceClose"
      :editStockList="editStockList"
      :defType="defType"
    >
    </editPriceModal>
    <!-- 库存 -->
    <editQuantity
      :editQuantityVis="editQuantityVis"
      :editStockList="editStockList"
      :selectOzonId="selectOzonId"
      @backCloseQuantity="backCloseQuantity"
    ></editQuantity>
    <!-- 进度条 -->
    <progressBar
      :showOpen="showOpen"
      :asyncErrData="asyncErrData"
      @handleProgressBarClose="handleProgressBarClose"
      :percentage="percentage"
    >
    </progressBar>
    <!-- 复制 -->
    <copyProduct
      :copyProductVis="copyProductVis"
      :copyList="copyList"
      @handleCopyProductClose="handleCopyProductClose"
    >
    </copyProduct>
    <!-- 已合并 -->
    <productList
      @handleProductListClose="handleProductListClose"
      :childList="childList"
      :prodListVisible="prodListVisible"
    >
    </productList>
    <!-- 店铺设置 -->
    <shopSetModal
      :shopSetVisible="shopSetVisible"
      :shopCurryList="shopCurryList"
      @handleShopSetClose="shopSetVisible = false"
      @refreshShopSet="getShopSet"
    ></shopSetModal>
  </div>
</template>

<script setup>
  import AsyncIcon from '@/layouts/components/menu/async-icon.vue'
  import {
    accountCache,
    list,
    batchArchive,
    syncOneProduct,
    syncHistoryCategory,
    mergeList,
    updatePrices,
    productWarehouse,
    del,
    syncShopProductAll,
    syncShopProduct,
    byState,
    exportProduct,
    shopCurrency,
    brandCategory
  } from '@/pages/ozon/config/api/product'
  import { warehouseList } from '@/pages/ozon/config/api/storeManagement'
  import { attrList, colors } from '@/pages/ozon/config/commDic/defDic'
  import { DEFAULT_COLUMNS, TABS } from '../js/result-config'
  import { message, Modal } from 'ant-design-vue'
  import editRemark from '@/pages/ozon/product/comm/editRemark.vue'
  import editPriceModal from '@/pages/ozon/product/comm/editPriceModal.vue'
  import editQuantity from '@/pages/ozon/product/comm/editQuantity.vue'
  import progressBar from '@/pages/ozon/config/component/progressBar/index.vue'
  import productList from '@/pages/ozon/product/comm/productList.vue'
  import copyProduct from '@/pages/ozon/product/comm/copyProduct.vue'
  import shopSetModal from '@/pages/ozon/product/comm/shopSetModal.vue'
  import { processImageSource } from '@/pages/ozon/config/commJs/index'
  import dayjs from 'dayjs'
  import { useClipboard } from '@v-c/utils'
  import { SettingOutlined, EditOutlined, ReloadOutlined, CloudUploadOutlined, DownloadOutlined, DownOutlined } from '@ant-design/icons-vue'
  import download from '@/api/common/download'

  const { copy } = useClipboard()
  const formRef = ref(null)
  const formData = reactive({
    id: '',
    account: '',
    sku: '',
    name: '',
    publishType: 1,
    prop: 'create_time',
    order: 'desc',
    state: ''
  })
  const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
  })
  const advancedForm = reactive({
    minPrice: null,
    maxPrice: null,
    minOldPrice: null,
    maxOldPrice: null,
    minStock: null,
    maxStock: null,
    timeSearch: 'update_time',
    time: []
  })
  // 刊登模式选项
  const PUBLISH_TYPE_OPTIONS = [
    { label: '智能化刊登', value: 1 },
    { label: '运营刊登', value: 0 }
  ]
  let discLists = attrList
  const advancedType = ref(false)
  const loading = ref(false)
  const allChecked = ref(false)
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
  const percentage = ref(0)
  const defType = ref([])
  const itemId = ref()
  const remarkId = ref([])
  const shopAccount = ref([])
  const tableData = ref([])
  const activeName = ref('')
  const stockShops = ref([])
  const selectedRows = ref([])
  const syncOneList = ref([])
  const selectOzonId = ref([])
  const editStockList = ref([])
  const childList = ref([])
  const copyList = ref([])
  const shopCurryList = ref([])
  const asyncErrData = ref([])
  const brandList = ref([])
  const errorColumns = [
    {
      title: '错误字段',
      dataIndex: 'attributeName',
      width: 200
    },
    {
      title: '错误描述1',
      dataIndex: 'description',
      width: 200
    },
    {
      title: '错误描述2',
      dataIndex: 'message',
      width: 200
    }
  ]
  const actives = ref(1)
  const sortObj = reactive({
    sortField: 'create_time',
    sortType: 'desc'
  })
  const searchType = [
    {
      label: '标题',
      prop: 1
    },
    {
      label: 'SKU',
      prop: 2
    },
    {
      label: '产品ID',
      prop: 3
    }
  ]
  const shopObj = {
    fieldKey: 'account',
    fieldLabel: 'simpleName'
  }
  const active = ref({
    label: '按创建时间',
    value: 'create_time',
    type: 'top',
    prop: 1,
    isDefault: true
  }) // 默认按下单时间查询
  const strList = ref([
    {
      label: '按创建时间',
      value: 'create_time',
      type: 'top',
      prop: 1,
      isDefault: true
    },
    {
      label: '按更新时间',
      type: 'bottom',
      value: 'update_time',
      prop: 2,
      isDefault: false
    },
    {
      label: '按售价',
      value: 'price',
      type: 'top',
      prop: 3,
      isDefault: false
    },
    {
      label: '按总库存量',
      value: 'stock',
      type: 'top',
      prop: 4,
      isDefault: false
    }
  ])

  const getStateLabel = state => {
    const ENUM = {
      平台审核: '审核中',
      准备出售: '审核中',
      在售: '刊登成功',
      审核不通过: '刊登失败'
    }
    return ENUM[state] || '--'
  }
  const getStateColor = state => {
    const colorMap = {
      平台审核: 'processing',
      准备出售: 'processing',
      在售: 'success',
      审核不通过: 'error'
    }
    return colorMap[state] || 'default'
  }

  // 复制
  const copyText = text => {
    copy(text)
    message.success(`复制成功：${text}`)
  }

  // 店铺数据
  const getAccount = () => {
    accountCache().then(res => {
      if (res.data) {
        shopAccount.value = res?.data ?? []
        getList()
      }
    })
  }
  const backToTop = () => {
    let elements = document.getElementsByClassName('ant-layout-content')
    if (elements) {
      elements[0].scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const remarkColor = param => {
    const findItem = colors.find(item => {
      return item.id === param
    })
    return findItem ? findItem.color : '#000000'
  }

  // 搜索内容
  const selectTypes = index => {
    actives.value = index
    switch (index) {
      case 1:
        formData.sku = ''
        formData.id = ''
        break
      case 2:
        formData.name = ''
        formData.id = ''
        break
      case 3:
        formData.sku = ''
        formData.name = ''
        break
      default:
        break
    }
  }

  // 高级搜索重置
  const resetForm = (type = 0) => {
    formData.sku = ''
    formData.id = ''
    formData.name = ''
    advancedForm.minPrice = null
    advancedForm.maxPrice = null
    advancedForm.minOldPrice = null
    advancedForm.maxOldPrice = null
    advancedForm.minStock = null
    advancedForm.maxStock = null
    // advancedForm.isRemark = ""
    advancedForm.timeSearch = 'update_time'
    advancedForm.time = []
    advancedType.value = type == 1 ? false : true
    paginations.pageNum = 1
    paginations.pageSize = 50
    getList()
  }

  // 排序方式
  const storChange = item => {
    item.type = item.type === 'top' ? 'bottom' : 'top'
    active.value = item
    sortObj.sortField = item.value
    sortObj.sortType = item.type === 'top' ? 'desc' : 'asc'
    formData.order = item.type === 'top' ? 'desc' : 'asc'
    formData.prop = item.value
    getList()
  }

  // 表单搜索
  const onSubmit = (type = false) => {
    paginations.pageNum = 1
    paginations.pageSize = 50
    getList(type)
  }

  // 标签页切换
  const handleClick = activeKey => {
    formData.state = activeKey
    getList()
  }
  // 提取去重逻辑
  const uniqueArray = (arr1, arr2) => [...new Set([...arr1, ...arr2])]
  // 公共处理批量所需的数据格式
  const commFn = (tableItem, type = 'single', record = {}) => {
    const existingItem = syncOneList.value.find(e => e.account === tableItem.account)
    if (existingItem) {
      const offerIdsToAdd = type === 'single' ? [record.offerId] : tableItem.children.map(el => el.offerId)
      const productIdsToAdd = type === 'single' ? [record.id] : tableItem.children.map(el => el.id)

      existingItem.offerIds = uniqueArray(existingItem.offerIds, offerIdsToAdd)
      existingItem.productIds = uniqueArray(existingItem.productIds, productIdsToAdd)
    } else {
      const newOfferIds = type === 'single' ? [record.offerId] : [...new Set(tableItem.children.map(e => e.offerId))]
      const newProductIds = type === 'single' ? [record.id] : [...new Set(tableItem.children.map(e => e.id))]

      const newObj = {
        account: tableItem.account,
        offerIds: newOfferIds,
        productIds: newProductIds
      }
      syncOneList.value.push(newObj)
    }
  }

  //单个选择
  const handelChecked = (e, tbItem, record) => {
    if (e.target.checked) {
      selectedRows.value.push(record)
      commFn(tbItem, 'single', record)
    } else {
      selectedRows.value = selectedRows.value.filter(item => item.id !== record.id)
      syncOneList.value = syncOneList.value.map(item => {
        if (item.account === record.account) {
          item.offerIds = item.offerIds.filter(id => !(id == record.offerId))
          item.productIds = item.productIds.filter(id => !(id == record.id))
        }
        return item
      })
    }
    const checkItem = tbItem.children.every(child => child.checked)
    tbItem.tabAllChecked = checkItem
  }

  // 数据全选
  const allChangeBox = e => {
    const isChecked = e.target.checked
    if (isChecked) {
      // 清空 selectedRows
      if (selectedRows.value.length > 0) {
        selectedRows.value = []
      }
      // 遍历 tableData 并添加符合条件的子元素
      tableData.value.forEach(item => {
        item.tabAllChecked = true
        item.children.forEach(child => {
          child.checked = true
          selectedRows.value.push(child)
        })
        commFn(item, 'multiple')
      })
    } else {
      // 取消选中时，移除所有相关子元素
      tableData.value.forEach(item => {
        item.tabAllChecked = false
        item.children.forEach(child => {
          child.checked = false
          selectedRows.value = selectedRows.value.filter(row => row.id !== child.id)
        })
      })
    }
  }

  // 总产品全选
  const changeBox = (e, tbItem, index) => {
    tbItem.children.forEach(child => (child.checked = tbItem.tabAllChecked))
    allChecked.value = tableData.value.every(item => item.tabAllChecked)
    if (tbItem.tabAllChecked) {
      tbItem.children.forEach(child => selectedRows.value.push(child))
      commFn(tbItem, 'multiple')
    } else {
      tbItem.children.forEach(child => (selectedRows.value = selectedRows.value.filter(item => item.id !== child.id)))
      syncOneList.value = syncOneList.value.map(item => {
        if (item.account === tbItem.account) {
          const childrenOfferIds = tbItem.children.map(child => child.offerId)
          const childrenProductIds = tbItem.children.map(child => child.id)
          item.offerIds = item.offerIds.filter(id => !childrenOfferIds.includes(id))
          item.productIds = item.productIds.filter(id => !childrenProductIds.includes(id))
        }
        return item
      })
    }
  }

  const showChildren = (account, id, typeId) => {
    if (!id) return
    let params = {
      account,
      attributeId: id,
      categoryId: typeId
    }
    mergeList(params).then(res => {
      prodListVisible.value = true
      childList.value = res?.data || []
    })
  }
  // 控制错误信息
  const displayedStatus = row => {
    return row.show ? row.status.itemErrors : row.status.itemErrors.slice(0, 3)
  }
  // 商品ID跳转
  const jumpTo = sku => {
    if (sku == 'sku未创建') return
    const url = `https://ozon.ru/context/detail/id/${sku}`
    window.open(url, '_blank')
  }

  const getStore = () => {
    let params = {
      account: stockShops.value
    }
    productWarehouse(params).then(res => {
      editStockList.value =
        res?.data?.map(item => {
          return {
            account: item.account,
            simpleName: item.simpleName,
            children: item.children,
            allStock: ''
          }
        }) ?? []
    })
  }

  // 单个批量同步
  const handleAsyncClick = e => {
    if (e.key === 'All') {
      sync()
    } else if (e.key === 'single') {
      syncOne()
    }
  }

  // 批量修改库存、重量、尺寸等
  const handleMenuClick = e => {
    if (e.key === 'remark') {
      addRemark()
    } else if (e.key === 'delete') {
      Modal.confirm({
        title: '删除',
        content: '请确认是否删除(此删除仅代表在erp上删除)？',
        onOk: () => {
          deleteItem()
          setUncheck()
        },
        onCancel: () => {
          setUncheck()
        }
      })
    } else if (e.key === 'deactivate') {
      Modal.confirm({
        title: '移入归档',
        content: '请确认是否将产品移入已归档？',
        onOk: () => {
          deactivate()
          setUncheck()
        },
        onCancel: () => {
          setUncheck()
        }
      })
    } else {
      for (let i = 0; i < selectedRows.value.length; i++) {
        if (selectedRows.value[i].state == '已归档') {
          message.error('归档商品不可修改库存，请取消！')
          return
        }
      }
      defType.value = e.keyPath
      editPriceVisible.value = true
      stockShops.value = syncOneList.value.map(e => e.account)
      getStore()
      getBrandList()
    }
  }

  // 获取品牌相关数据
  const getBrandList = () => {
    let list = selectedRows.value.map(e => {
      return {
        account: e.account,
        typeId: e.typeId,
        descriptionCategoryId: e.descriptionCategoryId
      }
    })
    brandCategory(list).then(res => {
      brandList.value = res?.data ?? []
    })
  }

  // 导出
  const handleExport = e => {
    let seqIds = []
    if (e.key == 'page') {
      seqIds = extractSeqIds(tableData.value)
    } else {
      seqIds = selectedRows.value.map(item => item.seqId)
    }
    exportProduct({ seqIds }).then(res => {
      download.name(res.msg)
      message.success('下载任务已开始！请耐心等待完成')
      setUncheck()
    })
  }
  // 递归提取children里面的seqId 用于导出
  const extractSeqIds = data => {
    let seqIds = []
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.children) {
          seqIds = seqIds.concat(extractSeqIds(item.children))
        } else if (item.seqId) {
          seqIds.push(item.seqId)
        }
      })
    }
    return seqIds
  }

  // 批量修改库存
  const editStock = (row = {}) => {
    let stockObj = {
      account: row.account,
      offerIds: [row.offerId]
    }
    stockShops.value.push(row.account)
    selectOzonId.value.push(stockObj)
    getStore()
    editQuantityVis.value = true
  }

  const backCloseQuantity = () => {
    getList()
    stockShops.value = []
    selectOzonId.value = []
    syncOneList.value = []
    selectOzonId.value = []
    editQuantityVis.value = false
  }

  // 修改单个价格
  const checkOldPrice = row => {
    // 使用解构赋值提取所需属性
    const { price, oldPrice } = row

    // 将价格转换为数值类型以避免字符串比较问题
    const numericPrice = Number(price)
    const numericOldPrice = Number(oldPrice)

    // 验证数值有效性
    if ([numericPrice, numericOldPrice].some(isNaN)) {
      message.error('请输入有效的价格数值')
      return
    }

    // 核心业务逻辑判断
    if (numericPrice > numericOldPrice) {
      message.error('售价不可高于原价')
      return
    }
    let params = {
      offerIds: row.offerId,
      oldPrice: Math.round(row.oldPrice * 100) / 100,
      price: Math.round(row.price * 100) / 100,
      productIds: row.productIds,
      minPrice: Math.round(row.minPrice * 100) / 100,
      account: row.account
    }
    updatePrices([params])
      .then(res => {
        message.success(res.msg)
      })
      .finally(() => {
        getList()
        singleVisible.value = false
        priceVisible.value = false
        minPriceVisible.value = false
        itemId.value = ''
      })
  }

  const editSinglePrice = item => {
    priceVisible.value = true
    itemId.value = item.id
  }

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
    prodListVisible.value = false
    childList.value = []
  }
  // 关闭价格
  const handleEditPriceClose = () => {
    selectOzonId.value = []
    syncOneList.value = []
    defType.value = []
    editPriceVisible.value = false
    getList()
    editStockList.value = clearStock(editStockList.value)
  }

  function clearStock(data) {
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.children) {
          clearStock(item.children)
        }
        if (item.hasOwnProperty('stock')) {
          item.stock = null
        }
      })
    }
    return data
  }

  const setUncheck = () => {
    allChecked.value = false
    selectedRows.value = []
    tableData.value.forEach(item => {
      item.tabAllChecked = false
      item.children.forEach(child => {
        child.checked = false
      })
    })
  }
  // 修改备注
  const addRemark = (row = {}) => {
    remarkVisible.value = true
    if (Object.keys(row).length == 0) {
      remarkId.value = syncOneList.value
    } else {
      let remarkObj = {
        account: row.account,
        offerIds: [row.offerId]
      }
      remarkId.value.push(remarkObj)
    }
  }
  // 备注弹窗关闭
  const backCloseRemark = () => {
    remarkVisible.value = false
    remarkId.value = []
    syncOneList.value = []
    getList()
  }

  const handleCopyProductClose = () => {
    copyList.value = []
    copyProductVis.value = false
    getList()
  }

  // 复制
  const copyItems = (row = {}, type) => {
    if (type == 'all') {
      copyList.value.push({
        account: row.account,
        offerIds: row.children.map(item => item.offerId)
      })
    } else {
      copyList.value.push({
        account: row.account,
        offerIds: [row.offerId]
      })
    }
    copyProductVis.value = true
  }
  // 下架商品
  const deactivate = (row = {}) => {
    let id = []
    if (Object.keys(row).length == 0) {
      for (let i = 0; i < selectedRows.value.length; i++) {
        if (selectedRows.value[i].state == '已归档') {
          message.error('已归档商品不可重复归档，请取消！')
          return
        }
      }
      id = syncOneList.value
    } else {
      id.push({
        account: row.account,
        productIds: [row.id]
      })
    }
    let hasEmptyData = false
    id.forEach(item => {
      hasEmptyData = item.productIds.some(id => id === '')
    })
    if (hasEmptyData) {
      message.error('产品ID为空,请同步后归档！')
      return
    }
    deactivateLoading.value = true
    batchArchive(id)
      .then(res => {
        message.success(res.msg)
      })
      .finally(() => {
        getList()
        deactivateLoading.value = false
        syncOneList.value = []
        selectedRows.value = []
      })
  }
  // 单个和批量删除
  const deleteItem = (row = {}) => {
    let products = []
    if (Object.keys(row).length == 0) {
      products = syncOneList.value
    } else {
      products.push({
        account: row.account,
        offerIds: [row.offerId]
      })
    }

    delLoading.value = true
    del(products)
      .then(res => {
        message.success(res.msg)
      })
      .finally(() => {
        getList()
        delLoading.value = false
        syncOneList.value = []
        selectedRows.value = []
      })
  }

  const add = () => {
    window.open('/platform/ozon/productPublish', '_blank')
  }
  const edit = (row = {}, type) => {
    let offerIds = ''
    if (type == 'single') {
      offerIds = row.offerId
    } else if (type == 'all') {
      offerIds = row.children.map(item => item.offerId).join(',')
    }

    const query = `?id=${offerIds.replaceAll('+', '_')}&account=${row.account}`

    window.open(`/platform/ozon/editProductPublish?${query}`)
  }
  const sync = () => {
    loading.value = true
    if (formData.account == null || formData.account == '') {
      syncShopProductAll()
        .then(res => {
          message.success('正在同步店铺所有商品，请稍后！')
        })
        .finally(() => {
          loading.value = false
          getList()
          selectedRows.value = []
        })
    } else {
      syncShopProduct({ account: formData.account })
        .then(res => {
          message.success('同步成功！')
          getList()
        })
        .finally(() => {
          loading.value = false
          selectedRows.value = []
        })
    }
  }

  const handleProgressBarClose = () => {
    showOpen.value = false
    getList()
  }

  const syncOne = (record = {}) => {
    let syncList = []
    let obj = {}
    if (syncOneList.value.length == 0) {
      obj = {
        account: record.account,
        offerIds: [record.offerId]
      }
      syncList.push(obj)
    } else {
      syncList = syncOneList.value
    }
    loading.value = true
    syncOneProduct(syncList)
      .then(res => {
        message.success(res.msg)
      })
      .finally(() => {
        loading.value = false
        syncOneList.value = []
        selectedRows.value = []
        getList()
      })
  }

  const timestampToDateTime = timestamp => {
    if (timestamp == null || timestamp == '') {
      return '无'
    }
    return timestamp
  }

  // 获取店铺数据
  const getList = () => {
    if (advancedForm.minPrice > advancedForm.maxPrice) {
      message.error('最大售价必须大于最小售价！')
      return
    }
    if (advancedForm.minOldPrice > advancedForm.maxOldPrice) {
      message.error('最大原价必须大于最小原价！')
      return
    }
    if (advancedForm.minStock > advancedForm.maxStock) {
      message.error('最大库存必须大于最小库存！')
      return
    }
    loading.value = true
    let params = {
      ...formData,
      customCategoryId: '0',
      ...Object.entries(advancedForm).reduce((acc, [key, value]) => {
        // 过滤掉 timeSearch 和 time 字段
        if (['time'].includes(key)) return acc

        // 保留原有转换逻辑并添加字符串转换
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = typeof value === 'number' ? String(value) : value
        }
        return acc
      }, {}),
      startDateTime: advancedForm.time.length ? dayjs(advancedForm.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      endDateTime: advancedForm.time.length ? dayjs(advancedForm.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      pageNum: paginations.pageNum,
      pageSize: paginations.pageSize
    }
    list(params)
      .then(res => {
        tableData.value =
          res.data.map(item => {
            item.show = false
            item.children.forEach(e => {
              e.errors = e?.errors?.map(el => {
                return {
                  attributeName: el?.texts?.attributeName,
                  description: el?.texts?.description,
                  message: el?.texts?.message
                }
              })
            })
            return item
          }) ?? []
      })
      .finally(() => {
        loading.value = false
        setUncheck()
      })
    byState(params).then(res => {
      const rows = res?.data?.rows || []
      if (rows.length) {
        TABS.forEach(tab => {
          let count = 0
          if (tab.label === '全部') {
            const target1 = rows.find(item => item.state === '全部') || { count: 0 }
            const target2 = rows.find(item => item.state === '已归档') || { count: 0 }
            count = target1.count - target2.count
          } else if (tab.label === '审核中') {
            const target1 = rows.find(item => item.state === '平台审核') || { count: 0 }
            const target2 = rows.find(item => item.state === '准备出售') || { count: 0 }
            count = target1.count + target2.count
          } else {
            const target = rows.find(item => item.state === tab.value) || { count: 0 }
            count = target.count
          }

          tab.count = count
        })

        const label = TABS.find(tab => tab.value === activeName.value)?.label || '全部'
        paginations.total = TABS.find(tab => tab.label === label)?.count || 0
      } else {
        // 没数据则重置
        TABS.forEach(tab => {
          tab.count = 0
          paginations.total = 0
        })
      }
    })
  }

  const search = () => {
    paginations.pageNum = 1
    getList()
  }

  const shopSet = () => {
    shopSetVisible.value = true
    getShopSet()
  }

  const getShopSet = () => {
    shopCurrency().then(res => {
      shopCurryList.value = res?.data ?? []
    })
  }
  onMounted(() => {
    getAccount()
  })
</script>

<style lang="less" scoped>
  .outContent {
    border: 1px solid #ccc;
    width: 100%;
  }

  :deep(.topHeader) {
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
    }
  }
</style>
