<template>
    <div id="addProductCont">
        <div style="margin-bottom: 10px; margin-left: 10px">
            <a-form :inline="true" ref="ruleForm" :model="formData" class="form-padding" laba-width="100px">
                <a-form-item prop="productId" label="产品ID：">
                    <a-input clearable v-model="formData.productId" placeholder="请输入产品ID"></a-input>
                </a-form-item>
                <a-form-item prop="productName" label="产品标题：">
                    <a-input clearable v-model="formData.productName" placeholder="请输入产品标题"></a-input>
                </a-form-item>
                <a-form-item prop="sku" label="SKU：">
                    <a-input clearable v-model="formData.sku" placeholder="请输入产品SKU"></a-input>
                </a-form-item>
                <a-form-item prop="description">
                    <a-button type="primary" @click="onSubmit">查询</a-button>
                    <a-button @click="resetForm">重置</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div style="margin-left: 20px">
            <a-button @click="addProd" v-has-permi="[`platform:ozon:activity:save:product`]"
                type="warning">添加产品</a-button>
            <a-button type="primary" v-has-permi="[`platform:ozon:activity:delete:product`]" @click="del()"
                :disabled="selectList.length == 0">批量移除</a-button>
            <a-button type="primary" v-has-permi="[`platform:ozon:activity:save:product`]" @click="save()"
                :disabled="selectList.length == 0">批量保存</a-button>
            <a-table :data="tableData" border stripe ref="promotionTable" v-loading="addProdLoading"
                @selection-change="checkbox" style="width: 100%; margin-top: 10px">
                <a-table-column type="selection" align="center" width="55">
                </a-table-column>
                <a-table-column align="center" v-for="(item, index) in dropCol" :key="`col_${index}`"
                    :prop="dropCol[index].prop" :label="item.label" :fixed="item.fixed" :width="item.width">
                    <template slot="header" slot-scope="{ column }">
                        <div v-if="item.prop === 'otherPorm'">
                            <span>{{ column.label }}</span>
                            <a-tooltip class="item" effect="dark"
                                content="如果您添加的商品已参与其他类型的促销活动，则两个折扣都将应用于该商品。第二次促销的商品价格将按照第一次促销中销售商品的价格计算。"
                                placement="top">
                                <i class="a-icon-question"></i>
                            </a-tooltip>
                        </div>
                        <span v-else>{{ column.label }}</span>
                    </template>

                    <template slot-scope="{ row }">
                        <div v-if="item.prop === 'imageUrl'">
                            <!-- <div>{{ row.imageUrl }}</div> -->
                            <img style="width: 70px; height: 70px" v-if="row.imageUrl" :src="row.imageUrl.split(',')[0]"
                                alt="" />
                        </div>
                        <div v-if="item.prop === 'productName'">
                            <div>{{ row.productName }}</div>
                            <div style="color: #428bca">{{ row.productId }}</div>
                        </div>
                        <div v-if="item.prop === 'sku'">
                            <div>{{ row.sku }}</div>
                        </div>
                        <div v-if="item.prop === 'salePrice'">
                            <div>
                                <span>{{ row.salePrice }}</span><span style="margin-left: 10px">CNY</span>
                            </div>
                        </div>
                        <div v-if="item.prop === 'discount'">
                            <div v-if="isAliasEdit">
                                <a-input style="width: 80%" @input="editDiscount(row)" v-model="row.discount"></a-input>
                                <span style="margin-left: 10px">%</span>
                            </div>
                            <div v-html="row.discount" v-else></div>
                        </div>
                        <div v-if="item.prop === 'discountPrice'">
                            <div v-if="isAliasEdit">
                                <a-input style="width: 80%" v-model="row.discountPrice"
                                    @input="changeVal(row)"></a-input>
                                <span style="margin-left: 10px">CNY</span>
                            </div>
                            <div v-else>{{ row.discountPrice }}CNY</div>
                        </div>
                        <div v-if="item.prop === 'actionActivityCount'">
                            <div>
                                <span>{{ row.actionActivityCount }}</span><span
                                    v-show="row.actionActivityCount">个</span>
                            </div>
                        </div>
                        <div v-if="item.prop === 'stock'">
                            <a-input v-if="isAliasEdit" v-model="row.stock" @blur.stop="editStock(row)"></a-input>
                            <div v-else>{{ row.stock }}</div>
                        </div>
                        <div v-if="item.prop === 'option'">
                            <a-button type="text" v-has-permi="[`platform:ozon:activity:delete:product`]"
                                @click="del(row)">移除</a-button>
                            <a-button type="text" v-has-permi="[`platform:ozon:activity:save:product`]"
                                @click="save(row)">保存</a-button>
                        </div>
                    </template>
                </a-table-column>
            </a-table>
            <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
                :total="paginations.total" show-quick-jumper v-model:current="paginations.pageNum"
                v-model:pageSize="paginations.pageSize" :defaultPageSize="50" :showSizeChanger="true" @change="getList"
                :pageSizeOptions="[50, 100, 200]"></a-pagination>
        </div>
    </div>
</template>

<script setup name='addProduct'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const ruleForm = ref(null)
const formData = reactive({
    productId: "",
    productName: "",
    sku: "",
})
const addProdLoading = ref(false)
const paginations = reactive({
    total: 0,
    pageNum: 1,
    pageSize: 50,
})

const addProd = () => {}

const del = () => {}

const save = () => {} 

const checkbox = () => {} 


</script>
<style lang="less" scoped></style>