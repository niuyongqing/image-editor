<template>
    <div>
        <a-modal v-model:open="visible" title="开发商品详情" :footer="null" :width="'95vw'" :zIndex="1000"
            :style="{ top: '10px', padding: 0, height: '100vh' }"
            :bodyStyle="{ height: 'calc(100vh - 100px)', overflow: 'auto' }" :maskClosable="false"
            :destroyOnClose="true">
            <div style="margin: 0 50px 100px 50px">
                <a-descriptions title="基本信息">
                    <a-descriptions-item label="产品名称">
                        <div v-html="tableData.tradeName"></div>
                    </a-descriptions-item>
                    <a-descriptions-item label="产品类型">
                        <a-tag color="success">{{ classify() }}</a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="市场方向">
                        <div v-html="devAttributableMarket()"></div>
                    </a-descriptions-item>
                    <a-descriptions-item label="产品库区" v-if="tableData.devAttributableMarket == 3">
                        <div v-html="stockAreaTag()"></div>
                    </a-descriptions-item>
                    <a-descriptions-item label="禁止刊登平台">
                        <div style="margin-top: -8px" v-html="devProhibitPlatform()"></div>
                    </a-descriptions-item>
                </a-descriptions>
                <a-divider></a-divider>

                <a-descriptions title="价格信息" v-if="price == '1' || roleName == 'admin'">
                    <a-descriptions-item label="售价($)">{{ tableData.devPrice }}</a-descriptions-item>
                    <a-descriptions-item label="预估重量(g)">{{ tableData.devWeight }}</a-descriptions-item>
                    <a-descriptions-item label="采购成本(￥)">{{ tableData.devPrimeCost }}</a-descriptions-item>
                    <a-descriptions-item label="预估利润(￥)">{{ tableData.devProfit }}</a-descriptions-item>
                    <a-descriptions-item label="预估利润率(%)">{{ tableData.devProfitMargin }}</a-descriptions-item>
                </a-descriptions>
                <a-divider></a-divider>

                <a-descriptions title="参考链接">
                    <a-descriptions-item label="开发参考链接">
                        <a v-for="(item, index) in tableData.devConsultLink" :key="index" target="_blank" :href="item"
                            style="width:100%">{{ item }}</a>
                    </a-descriptions-item>
                    <a-descriptions-item label="供应商链接" v-if="vdata == '1' || roleName == 'admin'">
                        <a v-for="(item, index) in tableData.devSupplierUrl" :key="index" target="_blank" :href="item"
                            style="width:100%;">
                            {{ item }}
                        </a>
                    </a-descriptions-item>
                </a-descriptions>
                <a-divider></a-divider>

                <a-descriptions title="文案信息">
                    <a-descriptions-item label="供应商" v-if="vdata == '1' || roleName == 'admin'">
                        {{ tableData.meansSupplier }}
                    </a-descriptions-item>
                    <a-descriptions-item label="shopee禁售属性">
                        <div v-for="(item, index) in tableData.meansForbidAttribute" :key="index">
                            <a-tag style="margin-right: 3px;">{{ getAttrName3(item) }}</a-tag>
                        </div>
                    </a-descriptions-item>
                    <a-descriptions-item label="产品SKU">{{ skuList(tableData.skuList) }}</a-descriptions-item>
                    <a-descriptions-item label="商品属性">
                        <div v-for="(item, index) in tableData.meansProductProperties" :key="index">
                            <a-tag style="margin-right: 3px;">{{ getAttrName1(item) }}</a-tag>
                        </div>
                    </a-descriptions-item>
                    <a-descriptions-item label="产品编号"> {{ tableData.number }} </a-descriptions-item>
                    <a-descriptions-item label="品牌">{{ tableData.meansBrand }} </a-descriptions-item>
                    <a-descriptions-item label="授权截止日期"> {{ tableData.meansEmpowerStop }} </a-descriptions-item>
                    <a-descriptions-item label="包装材料">{{ tableData.meansPackaging }}</a-descriptions-item>
                    <a-descriptions-item label="包装重量"> {{ tableData.meansPackagingWeight }} </a-descriptions-item>
                    <a-descriptions-item label="shopee禁售站点">
                        <div v-for="(item, index) in tableData.meansForbidSite" :key="index">
                            <a-tag>{{ getAttrName4(item) }}</a-tag>
                        </div>
                    </a-descriptions-item>
                    <a-descriptions-item label="仓储类别">
                        <div v-for="(item, index) in tableData.meansKeepGrain" :key="index">
                            <a-tag style="margin-right: 3px;">{{ getAttrName2(item) }}</a-tag>
                        </div>
                    </a-descriptions-item>
                </a-descriptions>
                <a-divider></a-divider>

                <a-descriptions title="产品描述">
                    <a-descriptions-item label="中文产品描述">
                        {{ tableData.meansChineseDescription }}
                    </a-descriptions-item>
                    <a-descriptions-item>
                        <template #label>
                            <div>英文产品描述</div>
                            <div><a-button type="link" @click="copyMeansEnglishDescription">复制</a-button></div>
                        </template>
                        <pre v-html="tableData.meansEnglishDescription" style="font-family: none; color: #606266"></pre>
                    </a-descriptions-item>
                </a-descriptions>
                <a-divider></a-divider>

                <a-descriptions title="备注" :colon="false" v-if="price == '1' || roleName == 'admin'">
                    <a-descriptions-item>
                        <div v-html="tableData.meansRemark"></div>
                    </a-descriptions-item>
                </a-descriptions>
                <a-divider></a-divider>
                <a-descriptions title="SKU列表" :colon="false">
                    <a-descriptions-item>
                        <a-table :columns="columns" :dataSource="tableData.sku" :bordered="true"
                            :rowKey="record => record.skuNumber" :pagination="false">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'attr'">
                                    {{ record.detail.attr }}
                                </template>
                                <template v-if="column.dataIndex === 'productNo'">
                                    {{ record.detail.productNo }}
                                </template>
                                <template v-if="column.dataIndex === 'describe'">
                                    {{ record.detail.describe }}
                                </template>
                                <template v-if="column.dataIndex === 'cost'">
                                    {{ record.detail.cost }}
                                </template>
                                <template v-if="column.dataIndex === 'weight'">
                                    {{ record.detail.weight }}
                                </template>
                                <template v-if="column.dataIndex === 'sellCount'">
                                    {{ record.detail.sellCount }}
                                </template>

                                <template v-if="column.dataIndex === 'remarks'">
                                    <a-select v-model:value="record.detail.remarks" placeholder="" mode="multiple"
                                        disabled style="width: 200px;" :options="remarksList"></a-select>
                                </template>
                            </template>
                        </a-table>
                    </a-descriptions-item>
                </a-descriptions>
                <a-divider></a-divider>

                <div style="position: absolute; right: 70px;"
                    v-if="tableData.devDrawing != null && tableData.devDrawing != '' && tableData.devDrawing != '[]'">
                    <a-button style="margin-left: 10px">开发</a-button>
                    <a-button>美工</a-button>
                    <a-button>全部</a-button>
                </div>
                <a-descriptions title="开发图片/视频" :colon="false"
                    v-if="tableData.devDrawing != null && tableData.devDrawing != '' && tableData.devDrawing != '[]'">
                    <a-descriptions-item>
                        <a-card shadow="never" style="width: 100%; min-height: 200px">
                            <a-empty description="没有开发图片/视频"
                                v-if="tableData.devDrawing == null || tableData.devDrawing === '' || tableData.devDrawing.length == 0"></a-empty>
                            <a-row v-else>
                                <a-col :span="24"
                                    style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                                    <div v-for="(item, index) in images(tableData.devDrawing)" :key="index"
                                        style="margin-right: 6px;">
                                        <a-card :bodyStyle="{ padding: '0px' }"
                                            style="width: 200px; margin-bottom: 10px">
                                            <a-image :src="item.url" :preview="true" />
                                            <div class="bottom clearfix"
                                                style="font-size: 13px; text-align: center; padding: 7px 0;">
                                                {{ item.name.length > 15 ? item.name.substring(0, 15) + "..." :
                                                    item.name }}
                                            </div>
                                        </a-card>
                                    </div>
                                </a-col>
                            </a-row>
                        </a-card>
                    </a-descriptions-item>
                </a-descriptions>

                <a-card class="box-card">
                    <template #title>
                        <span>主图</span>
                        <div style="float: right">
                            <a-button style="margin-left: 10px" @click="sortKaifaArtMainImage()">开发</a-button>
                            <a-button @click="sortMeigongArtMainImage()">美工</a-button>
                            <a-button @click="sortQuanbuArtMainImage()">全部</a-button>
                        </div>
                    </template>
                    <a-empty description="没有主图"
                        v-if="tableData.artMainImage == null || tableData.artMainImage === '' || tableData.artMainImage.length == 0"></a-empty>
                    <a-row v-else>
                        <a-col :span="24"
                            style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                            <div v-for="(item, index) in images(tableData.artMainImage)" :key="index"
                                style="margin-right: 6px;">
                                <a-card :bodyStyle="{ padding: '0px' }" style="width: 200px; margin-bottom: 10px">
                                    <a-image :src="item.url" :preview="true" />
                                    <div class="bottom clearfix"
                                        :style="item.name.includes('美工处理') ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;' : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'">
                                        {{ item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name }}
                                    </div>
                                </a-card>
                            </div>
                        </a-col>
                    </a-row>
                </a-card>
                <br />


                <a-card class="box-card">
                    <template #title>
                        <span>副图</span>
                        <div style="float: right">
                            <a-button style="margin-left: 10px" @click="sortKaifaArtAssistantImage()">开发</a-button>
                            <a-button @click="sortMeigongArtAssistantImage()">美工</a-button>
                            <a-button @click="sortQuanbuArtAssistantImage()">全部</a-button>
                        </div>
                    </template>
                    <a-empty description="没有副图"
                        v-if="tableData.artAssistantImage == null || tableData.artAssistantImage === '' || tableData.artAssistantImage.length == 0"></a-empty>
                    <a-row v-else
                        style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                        <div v-for="(item, index) in images(tableData.artAssistantImage)" :key="index"
                            style="margin-right: 6px;">
                            <a-col :span="3">
                                <a-card :bodyStyle="{ padding: '0px' }" style="width: 200px; margin-bottom: 10px">
                                    <a-image :src="item.url" :preview="true" />
                                    <div class="bottom clearfix"
                                        :style="item.name.includes('美工处理') ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;' : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'">
                                        {{ item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name }}
                                    </div>
                                </a-card>
                            </a-col>
                        </div>
                    </a-row>
                </a-card>

                <br />

                <a-card class="box-card">
                    <template #title>
                        <span>SKU图</span>
                        <div style="float: right">
                            <a-button style="margin-left: 10px" @click="sortKaifaArtSkuImage()">开发</a-button>
                            <a-button @click="sortMeigongArtSkuImage()">美工</a-button>
                            <a-button @click="sortQuanbuArtSkuImage()">全部</a-button>
                        </div>
                    </template>
                    <a-empty description="没有SKU图"
                        v-if="(tableData.artSkuImage == null || tableData.artSkuImage === '' || tableData.artSkuImage.length == 0)"></a-empty>
                    <a-row v-else
                        style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                        <div v-for="(item, index) in images(tableData.artSkuImage)" :key="index"
                            style="margin-right: 6px;">
                            <a-col :span="3">
                                <a-card :bodyStyle="{ padding: '0px' }" style="width: 200px; margin-bottom: 10px">
                                    <a-image :src="item.url" :preview="true" />
                                    <div class="bottom clearfix"
                                        :style="item.name.includes('美工处理') ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;' : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'">
                                        {{ item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name }}
                                    </div>
                                </a-card>
                            </a-col>
                        </div>
                    </a-row>
                </a-card>

                <br />

                <a-card class="box-card">
                    <template #title>
                        <span>Amazon图</span>
                    </template>
                    <a-empty description="没有Amazon图"
                        v-if="(tableData.artAmazonImage == null || tableData.artAmazonImage === '' || tableData.artAmazonImage.length == 0 || tableData.artAmazonImage === '[]')"></a-empty>
                    <a-row v-else
                        style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                        <div v-for="(item, index) in images(tableData.artAmazonImage)" :key="index"
                            style="margin-right: 6px;">
                            <a-col :span="3">
                                <a-card :bodyStyle="{ padding: '0px' }" style="width: 200px; margin-bottom: 10px">
                                    <a-image :src="item.url" :preview="true" />
                                    <div class="bottom clearfix"
                                        :style="item.name.includes('美工处理') ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;' : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'">
                                        {{ item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name }}
                                    </div>
                                </a-card>
                            </a-col>
                        </div>
                    </a-row>
                </a-card>

                <br />

                <a-card class="box-card">
                    <template #title>
                        <span>Shein图</span>
                        <div style="float: right">
                            <a-button style="margin-left: 10px" @click="sortKaifaArtNewImage()">开发</a-button>
                            <a-button @click="sortMeigongArtNewImage()">美工</a-button>
                            <a-button @click="sortQuanbuArtNewImage()">全部</a-button>
                        </div>
                    </template>
                    <a-empty description="没有Shein图"
                        v-if="(tableData.artNewImage == null || tableData.artNewImage === '' || tableData.artNewImage.length == 0 || tableData.artVideo === '[]')"></a-empty>
                    <a-row v-else
                        style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                        <div v-for="(item, index) in images(tableData.artNewImage)" :key="index"
                            style="margin-right: 6px;">
                            <a-col :span="3">
                                <a-card :bodyStyle="{ padding: '0px' }" style="width: 200px; margin-bottom: 10px">
                                    <a-image :src="item.url" :preview="true" />
                                    <div class="bottom clearfix"
                                        :style="item.name.includes('美工处理') ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;' : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'">
                                        {{ item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name }}
                                    </div>
                                </a-card>
                            </a-col>
                        </div>
                    </a-row>
                </a-card>

                <br />


                <a-card class="box-card">
                    <template #title>
                        <span>资质文件</span>
                    </template>
                    <a-empty description="没有资质文件"
                        v-if="(tableData.devQualificationFiles == null || tableData.devQualificationFiles === '' || tableData.devQualificationFiles.length == 0 || tableData.devQualificationFiles == '[]')"></a-empty>
                    <a-row v-else
                        style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                        <div v-for="(item, index) in images(tableData.devQualificationFiles)" :key="index"
                            style="margin-right: 6px;">
                            <a-col :span="3">
                                <a-card :bodyStyle="{ padding: '0px' }" style="width: 200px; margin-bottom: 10px">
                                    <div
                                        v-if="item.url.includes('.gif') || item.url.includes('.xls') || item.url.includes('.xlsx') || item.url.includes('.docx') || item.url.includes('.doc') || item.url.includes('.pdf')">
                                        <svg t="1722496954430" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" p-id="4286" width="200" height="200">
                                            <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01" p-id="4287">
                                            </path>
                                            <path
                                                d="M102.4 68.266667a34.133333 34.133333 0 0 1 34.133333-34.133334h750.933334a34.133333 34.133333 0 0 1 34.133333 34.133334v634.402133a34.133333 34.133333 0 0 1-10.001067 24.132267l-253.064533 253.064533a34.133333 34.133333 0 0 1-24.132267 10.001067H136.533333a34.133333 34.133333 0 0 1-34.133333-34.133334V68.266667z"
                                                fill="#11AA66" p-id="4288"></path>
                                            <path
                                                d="M238.933333 238.933333a34.133333 34.133333 0 0 1 34.133334-34.133333h477.866666a34.133333 34.133333 0 1 1 0 68.266667H273.066667a34.133333 34.133333 0 0 1-34.133334-34.133334z m0 204.8a34.133333 34.133333 0 0 1 34.133334-34.133333h477.866666a34.133333 34.133333 0 1 1 0 68.266667H273.066667a34.133333 34.133333 0 0 1-34.133334-34.133334z m34.133334 170.666667a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H273.066667z"
                                                fill="#FFFFFF" p-id="4289"></path>
                                            <path
                                                d="M648.533333 750.933333a34.133333 34.133333 0 0 1 34.133334-34.133333h230.7072a3.413333 3.413333 0 0 1 2.389333 5.802667l-261.393067 261.461333a3.413333 3.413333 0 0 1-5.8368-2.423467V750.933333z"
                                                fill="#FFAA44" p-id="4290"></path>
                                        </svg>
                                    </div>
                                    <a-image v-else :src="item.url" :preview="true" />
                                    <div class="bottom clearfix"
                                        :style="item.name.includes('美工处理') ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;' : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'">
                                        {{ item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name }}
                                        <i class="el-icon-download" style="font-size: 20px"
                                            @click="devQualificationFilesDown(item)"></i>
                                    </div>
                                </a-card>
                            </a-col>
                        </div>
                    </a-row>
                </a-card>

                <br />


                <a-card class="box-card">
                    <template #title>
                        <span>视频</span>
                    </template>
                    <a-empty description="没有视频"
                        v-if="tableData.artVideo == null || tableData.artVideo === '' || tableData.artVideo === '[]' || tableData.artVideo.length == 0"></a-empty>
                    <a-row v-else
                        style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                        <div v-for="(item, index) in tableData.artVideo" :key="index" style="margin-right: 6px;">
                            <a-col :span="3">
                                <a-card :bodyStyle="{ padding: '0px' }" style="width: 200px; margin-bottom: 10px">
                                    <video :src="tableData.artVideo[0].url" style="width: 200px; height: 200px"
                                        controls></video>
                                    <div class="bottom clearfix"
                                        style="font-size: 13px; text-align: center; padding: 7px 0;">
                                        {{ item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name }}
                                    </div>
                                </a-card>
                            </a-col>
                        </div>
                    </a-row>
                </a-card>
                <div flex justify-end mt-15px>
                    <a-button type="primary" @click="visible = false">关闭</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import classifyRevert from '@/utils/classifyRevert'
import { storeDetail, cacheGet, forbidSaleApi } from '@/api/common/selectProduct';
import devAttributableMarketRevert from '@/utils/devAttributableMarketRevert';
import { devStockAreaTag, storeStatusTag } from '@/utils/devStatusTag'
import devProhibitPlatformRevert from '@/utils/devProhibitPlatformRevert';
import { productAttr, meansKeepGrains } from '@/utils/devStatusSelect'
import sheepProhibitionSelect from "@/utils/sheepProhibitionSelect";
import { message } from 'ant-design-vue';

const id = ref('');
const visible = ref(false);
const cacheGetArr = ref([]);
const attriData = ref([]);
const attriDataOptions = ref([]);
const tableData = ref({});
const oldMeansEnglishDescription = ref('');
const userStore = useUserStore();
const productAttrOptions = ref(productAttr);
const forbidSiteOptions = ref(sheepProhibitionSelect);
const meansKeepGrainOptions = ref(meansKeepGrains);

const columns = [
    {
        title: 'SKU编码',
        dataIndex: 'skuNumber',
        key: 'skuNumber',
        width: 200,
    },
    {
        title: '型号',
        dataIndex: 'attr',
        key: 'attr',
        width: 200,
    },
    {
        title: '产品编号',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 200,
    },
    {
        title: 'SKU描述',
        dataIndex: 'describe',
        key: 'describe',
        width: 250,
    },
    {
        title: '成本价格',
        dataIndex: 'cost',
        key: 'cost',
        width: 200,
        // customRender: (text, record) => (this.price == '1' || this.roleName == 'admin') ? text : '',
    },
    {
        title: '重量',
        dataIndex: 'weight',
        key: 'weight',
        width: 200,
    },
    {
        title: '30天销量',
        dataIndex: 'sellCount',
        key: 'sellCount',
        width: 200,
        // customRender: (text, record) => (this.sale == '1' || this.roleName == 'admin') ? text : '',
    },
    {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        scopedSlots: { customRender: 'remarks' },
        width: 200,
    },
];
const remarksList = [
    {
        label: '国内仓',
        value: '1'
    },
    {
        label: '菲律宾仓',
        value: '2'
    },
    {
        label: '泰国仓',
        value: '3'
    }
];

const open = (record,) => {
    const { commodityId } = record;
    id.value = commodityId;
    storeDetail({ id: commodityId }).then(res => {
        console.log(res);
        tableData.value = res.data || {};
        //赋值最开始的英文描述
        oldMeansEnglishDescription.value = tableData.value.meansEnglishDescription;
        let sku = [];
        res.data.sku.forEach(v => {
            v.detail = JSON.parse(v.detail.replaceAll("'", '"'));
            sku.push(v)
        });
        sku.forEach(v => {
            if (v.detail.remarks == null || v.detail.remarks == undefined || v.detail.remarks == '') {
                v.remarks = []
            }
            else {
                v.detail.remarks = v.detail.remarks.toString().split(',')
            }
        });
        tableData.value.sku = sku;

        if (tableData.value.devDrawing != '' && tableData.value.devDrawing != null) {
            tableData.value.devDrawing = JSON.parse(tableData.value.devDrawing)
        }
        if (tableData.value.artMainImage != '' && tableData.value.artMainImage != null) {
            tableData.value.artMainImage = JSON.parse(tableData.value.artMainImage)
        }
        if (tableData.value.artAssistantImage != '' && tableData.value.artAssistantImage != null) {
            tableData.value.artAssistantImage = JSON.parse(tableData.value.artAssistantImage)
        }

        if (tableData.value.artSkuImage != '' && tableData.value.artSkuImage != null) {
            tableData.value.artSkuImage = JSON.parse(tableData.value.artSkuImage)
        };
        if (tableData.artNewImage != '' && tableData.value.artNewImage != null) {
            tableData.value.artNewImage = JSON.parse(tableData.value.artNewImage)
        }

        if (tableData.value.artVideo != '' && tableData.value.artVideo != null) {
            tableData.value.artVideo = JSON.parse(tableData.value.artVideo)
        };

        if (tableData.value.meansForbidAttribute !== null) {
            tableData.value.meansForbidAttribute = tableData.value.meansForbidAttribute.split(",")
        } else {
            tableData.value.meansForbidAttribute = []
        }
        if (tableData.value.meansProductProperties !== null) {
            tableData.value.meansProductProperties = tableData.value.meansProductProperties.split(",")
        } else {
            tableData.value.meansProductProperties = []
        }
        if (tableData.value.meansKeepGrain !== null) {
            tableData.value.meansKeepGrain = tableData.value.meansKeepGrain.split(",")
        } else {
            tableData.value.meansKeepGrain = []
        };


        if (tableData.value.meansForbidSite !== null) {
            tableData.value.meansForbidSite = tableData.value.meansForbidSite.split(",")
        } else {
            tableData.value.meansForbidSite = []
        }
        if (tableData.value.devConsultLink) {
            tableData.value.devConsultLink = JSON.parse(tableData.value.devConsultLink)
        } else {
            tableData.value.devConsultLink = []
        }

        if (tableData.value.devSupplierUrl) {
            tableData.value.devSupplierUrl = JSON.parse(tableData.value.devSupplierUrl)
        } else {
            tableData.value.devSupplierUrl = []
        };
        if (cacheGetArr.value && cacheGetArr.value.length > 0) {
            // cacheGetArr.value = this.cacheGetArr.filter(value => value.length > 1)
            // 修改匹配逻辑
            for (let i = 0; i < cacheGetArr.value.length; i++) {
                // 直接使用字符串，不再二次调用 escapeRegExp
                const searchString = cacheGetArr.value[i];
                // 为包含空格的字符串构建正则表达式时不添加单词边界
                let regexPattern = "";
                if (searchString === "s") {
                    regexPattern = `(?<!\\w)(?<!\\w')(s)(?!\\w)`;
                } else {
                    regexPattern = `(?<!\\w)${escapeRegExp(searchString)}(?!\\w)`;
                }

                const regex = new RegExp(regexPattern, 'gi'); // 'g'表示全局匹配，'i'表示不区分大小写
                // 进行文本替换
                tableData.value.meansEnglishDescription = tableData.value.meansEnglishDescription.replace(regex, (matched) => {
                    return `<span style="color: red;font-size: 18px;font-weight: bolder">${matched}</span>`; // 使用匹配到的原始文本（保留大小写）
                });
            }
            tableData.value.meansEnglishDescription = tableData.value.meansEnglishDescription.replaceAll("<span <span style=\"color: red;font-size: 18px;font-weight: bolder\">style</span>=\"color: red;font-size: 18px;font-weight: bolder\">", "<span style=\"color: red;font-size: 18px;font-weight: bolder\">")
        }
    });
    visible.value = true;
};
const vdata = computed(() => {
    return userStore.userInfo.sysUser.roles[0].vdata
});
const price = computed(() => {
    return userStore.userInfo.sysUser.roles[0].price
});
const roleName = computed(() => {
    return userStore.userInfo.roles[0]
});
const sale = computed(() => {
    return userStore.userInfo.sysUser.roles[0].sale;
});
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
};


function classify() {
    if (tableData.value.classify != null && tableData.value.classify !== '' && tableData.value.classify !== undefined) {
        return classifyRevert(tableData.value.classify.split(","))
    }
};

function devAttributableMarket() {
    if (tableData.value.devAttributableMarket != null && tableData.value.devAttributableMarket !== '' && tableData.value.devAttributableMarket !== undefined) {
        return devAttributableMarketRevert(tableData.value.devAttributableMarket.split(","))
    }
};

function stockAreaTag() {
    return devStockAreaTag(tableData.value.devStockArea)
};

function devProhibitPlatform() {
    if (tableData.value.devProhibitPlatform != null && tableData.value.devProhibitPlatform !== '' && tableData.value.devProhibitPlatform !== undefined) {
        return devProhibitPlatformRevert(tableData.value.devProhibitPlatform.split(','))
    }
};
function getAttrName1(val) {
    let Aname1
    if (productAttrOptions.value.length > 0) {
        productAttrOptions.value.forEach(item => {
            if (item.value == val) {
                Aname1 = item.label
            }
        });
    };
    return Aname1
};

function getAttrName2(val) {
    let Aname1
    if (meansKeepGrainOptions.value.length > 0) {
        meansKeepGrainOptions.value.forEach(item => {
            if (item.value == val) {
                Aname1 = item.label
            }
        })
    };
    return Aname1
};
function getAttrName3(key) {
    let Aname1
    let Aname2
    if (attriDataOptions.value.length > 0) {
        Aname1 = attriDataOptions.value.find(item => {
            return item.key == key
        })
        if (Aname1) {
            Aname2 = Aname1.attributes

        } else {
            Aname2 = ''
        }

    };
    return Aname2
};
function getAttrName4(val) {
    let Aname1;
    if (forbidSiteOptions.value.length > 0) {
        forbidSiteOptions.value.forEach(item => {
            if (item.value == val) {
                Aname1 = item.label
            }
        })
    }
    return Aname1
};

function images(images, images2) {
    const urls = [];
    if (images != null && images != '') {
        let a = Array.isArray(images) ? images : JSON.parse(images)
        a.forEach(v => {
            urls.push(v)
        })
    }
    if (images2 != null && images2 != '') {
        let a = Array.isArray(images) ? images : JSON.parse(images2)
        a.forEach(v => {
            urls.push(v)
        })
    }
    return urls;
};

function skuList(e) {
    let str = ''
    if (e == '' || e == null) {
        e = ''
    }
    let spanD = e.split(',');
    let oldSku = e.split(','); //原始错乱sku
    let b = [] //去除所有带标签的
    oldSku.map(item => {
        b.push(item.replace(/<[^>]+>/g, ''))
    })
    let newSku = b.sort(); //排序 正确的sku
    if (newSku.length == 0) {
        str = ''
    } else if (newSku.length == 1) {
        str = spanD[0]
    } else if (newSku.length > 1) {
        spanD.forEach(v => {
            if (v.includes(newSku[0])) {
                newSku[0] = v
            }
            if (v.includes(newSku[newSku.length - 1])) {
                newSku[newSku.length - 1] = v
            }
        })
        str = `${newSku[0]} - ${newSku[newSku.length - 1]}`
    }
    return str
};

const close = () => {
    visible.value = false;
};


// 主图搜索全部
function sortQuanbuArtMainImage() {
    oldStore({ id: id.value }).then(res => {
        let paramsVal = res.data
        if (paramsVal.devDrawing != '' && paramsVal.devDrawing != null) {
            tableData.value.devDrawing = JSON.parse(paramsVal.devDrawing)
        }
        if (paramsVal.artMainImage != '' && paramsVal.artMainImage != null) {
            tableData.value.artMainImage = JSON.parse(paramsVal.artMainImage)
        }

        if (paramsVal.artAssistantImage != '' && paramsVal.artAssistantImage != null) {
            tableData.value.artAssistantImage = JSON.parse(paramsVal.artAssistantImage)
        }

        if (paramsVal.artSkuImage != '' && paramsVal.artSkuImage != null) {
            tableData.value.artSkuImage = JSON.parse(paramsVal.artSkuImage)
        }

        if (paramsVal.artNewImage != '' && paramsVal.artNewImage != null) {
            tableData.value.artNewImage = JSON.parse(paramsVal.artNewImage)
        }

        if (paramsVal.artVideo != '' && paramsVal.artVideo != null) {
            tableData.value.artVideo = JSON.parse(paramsVal.artVideo)
        }
    })
};

const sortKaifaArtMainImage = () => {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data;
        if (paramsVal.artMainImage != '' && paramsVal.artMainImage != null) {
            tableData.value.artMainImage = JSON.parse(paramsVal.artMainImage)
            tableData.value.artMainImage = tableData.value.artMainImage.filter((item) => {
                return !item.name.includes('美工处理')
            })
        }
    })
};
// 副图搜索 开发图片
function sortKaifaArtAssistantImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data;
        if (paramsVal.artAssistantImage != '' && paramsVal.artAssistantImage != null) {
            tableData.value.artAssistantImage = JSON.parse(paramsVal.artAssistantImage)
            tableData.value.artAssistantImage = tableData.value.artAssistantImage.filter((item) => {
                return !item.name.includes('美工处理')
            })
        }
    })
};
// sku图搜索开发图片
function sortKaifaArtSkuImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data;
        if (paramsVal.artSkuImage != '' && paramsVal.artSkuImage != null) {
            tableData.value.artSkuImage = JSON.parse(paramsVal.artSkuImage)
            tableData.value.artSkuImage = tableData.value.artSkuImage.filter((item) => {
                return !item.name.includes('美工处理')
            })
        }
    })
};

// 副图搜索美工图片
function sortMeigongArtAssistantImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data

        if (paramsVal.artAssistantImage != '' && paramsVal.artAssistantImage != null) {
            tableData.value.artAssistantImage = JSON.parse(paramsVal.artAssistantImage)
            tableData.value.artAssistantImage = tableData.value.artAssistantImage.filter((item) => {
                return item.name.includes('美工处理')
            })
        }
    })
};
// sku图搜索美工图片
function sortMeigongArtSkuImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data
        if (paramsVal.artSkuImage != '' && paramsVal.artSkuImage != null) {
            tableData.value.artSkuImage = JSON.parse(paramsVal.artSkuImage)
            tableData.value.artSkuImage = tableData.value.artSkuImage.filter((item) => {
                return item.name.includes('美工处理')
            })
        }
    })
};


// 副图搜索全部
function sortQuanbuArtAssistantImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data
        if (paramsVal.devDrawing != '' && paramsVal.devDrawing != null) {
            tableData.value.devDrawing = JSON.parse(paramsVal.devDrawing)
        }
        if (paramsVal.artMainImage != '' && paramsVal.artMainImage != null) {
            tableData.value.artMainImage = JSON.parse(paramsVal.artMainImage)
        }

        if (paramsVal.artAssistantImage != '' && paramsVal.artAssistantImage != null) {
            tableData.value.artAssistantImage = JSON.parse(paramsVal.artAssistantImage)
        }

        if (paramsVal.artSkuImage != '' && paramsVal.artSkuImage != null) {
            tableData.value.artSkuImage = JSON.parse(paramsVal.artSkuImage)
        }

        if (paramsVal.artNewImage != '' && paramsVal.artNewImage != null) {
            tableData.value.artNewImage = JSON.parse(paramsVal.artNewImage)
        }

        if (paramsVal.artVideo != '' && paramsVal.artVideo != null) {
            tableData.value.artVideo = JSON.parse(paramsVal.artVideo)
        }
    })
};

// sku图 搜索全部
function sortQuanbuArtSkuImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data
        if (paramsVal.devDrawing != '' && paramsVal.devDrawing != null) {
            tableData.value.devDrawing = JSON.parse(paramsVal.devDrawing)
        }
        if (paramsVal.artMainImage != '' && paramsVal.artMainImage != null) {
            tableData.value.artMainImage = JSON.parse(paramsVal.artMainImage)
        }

        if (paramsVal.artAssistantImage != '' && paramsVal.artAssistantImage != null) {
            tableData.value.artAssistantImage = JSON.parse(paramsVal.artAssistantImage)
        }

        if (paramsVal.artSkuImage != '' && paramsVal.artSkuImage != null) {
            tableData.value.artSkuImage = JSON.parse(paramsVal.artSkuImage)
        }

        if (paramsVal.artNewImage != '' && paramsVal.artNewImage != null) {
            tableData.value.artNewImage = JSON.parse(paramsVal.artNewImage)
        }

        if (paramsVal.artVideo != '' && paramsVal.artVideo != null) {
            tableData.value.artVideo = JSON.parse(paramsVal.artVideo)
        }
    })
};

// shit 图开发图片
function sortKaifaArtNewImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data

        if (paramsVal.artNewImage != '' && paramsVal.artNewImage != null) {
            tableData.value.artNewImage = JSON.parse(paramsVal.artNewImage)
            tableData.value.artNewImage = tableData.value.artNewImage.filter((item) => {
                return !item.name.includes('美工处理')
            })
        }

    })
};
// shirt图搜索美工图片
function sortMeigongArtNewImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data

        if (paramsVal.artNewImage != '' && paramsVal.artNewImage != null) {
            tableData.value.artNewImage = JSON.parse(paramsVal.artNewImage)
            tableData.value.artNewImage = tableData.value.artNewImage.filter((item) => {
                return item.name.includes('美工处理')
            })
        }

    })
};
// shirt t图 搜索全部
function sortQuanbuArtNewImage() {
    storeDetail({ id: id.value }).then(res => {
        let paramsVal = res.data
        if (paramsVal.devDrawing != '' && paramsVal.devDrawing != null) {
            tableData.value.devDrawing = JSON.parse(paramsVal.devDrawing)
        }
        if (paramsVal.artMainImage != '' && paramsVal.artMainImage != null) {
            tableData.value.artMainImage = JSON.parse(paramsVal.artMainImage)
        }

        if (paramsVal.artAssistantImage != '' && paramsVal.artAssistantImage != null) {
            tableData.value.artAssistantImage = JSON.parse(paramsVal.artAssistantImage)
        }

        if (paramsVal.artSkuImage != '' && paramsVal.artSkuImage != null) {
            tableData.value.artSkuImage = JSON.parse(paramsVal.artSkuImage)
        }

        if (paramsVal.artNewImage != '' && paramsVal.artNewImage != null) {
            tableData.value.artNewImage = JSON.parse(paramsVal.artNewImage)
        }

        if (paramsVal.artVideo != '' && paramsVal.artVideo != null) {
            tableData.value.artVideo = JSON.parse(paramsVal.artVideo)
        }
    })
};

//资质文件下载
function devQualificationFilesDown(item) {
    message.success("执行下载成功，请等待文件下载完成！勿重复操作")
    download.name(item.url, item.name);
};
//复制产品英文描述  不带高亮描述的
function copyMeansEnglishDescription() {
    const textarea = document.createElement('textarea');
    textarea.value = this.oldMeansEnglishDescription;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    message.success('英文描述复制完成!')
}

watchEffect(() => {
    cacheGet().then(res => {
        cacheGetArr.value = res.data || [];
    });
    forbidSaleApi().then(res => {
        attriDataOptions.value = res.data || [];
    })
});
defineExpose({
    open,
    close
})
</script>