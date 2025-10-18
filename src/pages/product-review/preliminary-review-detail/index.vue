<template>
  <div class="text-left p-6 pb-2 bg-#fff">
    <a-spin
      :spinning="loading"
      class="dialog-box"
    >
      <a-descriptions title="基本信息">
        <a-descriptions-item label="产品名称">
          <div v-html="detailData.data.tradeName"></div>
        </a-descriptions-item>
        <a-descriptions-item label="产品类型">
          <a-tag color="success">{{ classify() }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="市场方向">
          <div v-html="devAttributableMarket()"></div>
        </a-descriptions-item>
        <a-descriptions-item
          label="产品库区"
          v-if="detailData.data.devAttributableMarket == 3"
        >
          <div v-html="stockAreaTag()"></div>
        </a-descriptions-item>
        <a-descriptions-item label="禁止刊登平台">
          <div
            style="margin-top: -8px"
            v-html="devProhibitPlatform()"
          ></div>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>

      <a-descriptions
        title="价格信息"
        v-if="price == '1' || roleName == 'admin'"
      >
        <a-descriptions-item label="售价($)">{{ detailData.data.devPrice }}</a-descriptions-item>
        <a-descriptions-item label="预估重量(g)">{{ detailData.data.devWeight }}</a-descriptions-item>
        <a-descriptions-item label="采购成本(￥)">{{ detailData.data.devPrimeCost }}</a-descriptions-item>
        <a-descriptions-item label="预估利润(￥)">{{ detailData.data.devProfit }}</a-descriptions-item>
        <a-descriptions-item label="预估利润率(%)">{{ detailData.data.devProfitMargin }}</a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>

      <a-descriptions
        title="参考链接"
        class="devConsultLink"
      >
        <a-descriptions-item label="开发参考链接">
          <div
            v-for="(item, index) in detailData.data.devConsultLink"
            :key="index"
          >
            <span style="font-weight: 700; margin-right: 8px">{{ index + 1 }}.</span>
            <a
              target="_blank"
              :href="item"
              >{{ item }}</a
            >
          </div>
        </a-descriptions-item>
        <a-descriptions-item
          label="供应商链接"
          v-if="vdata == '1' || roleName == 'admin'"
        >
          <div
            v-for="(item, index) in detailData.data.devSupplierUrl"
            :key="index"
          >
            <span style="font-weight: 700; margin-right: 8px">{{ index + 1 }}.</span>
            <a
              target="_blank"
              :href="item"
              >{{ item }}</a
            >
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>

      <a-descriptions title="文案信息">
        <a-descriptions-item
          label="供应商"
          v-if="vdata == '1' || roleName == 'admin'"
        >
          {{ detailData.data.meansSupplier }}
        </a-descriptions-item>
        <a-descriptions-item label="shopee禁售属性">
          <div
            v-for="(item, index) in detailData.data.meansForbidAttribute"
            :key="index"
          >
            <a-tag style="margin-right: 3px">{{ getAttrName3(item) }}</a-tag>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="产品SKU">{{ skuList(detailData.data.skuList) }}</a-descriptions-item>
        <a-descriptions-item label="商品属性">
          <div
            v-for="(item, index) in detailData.data.meansProductProperties"
            :key="index"
          >
            <a-tag style="margin-right: 3px">{{ getAttrName1(item) }}</a-tag>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="产品编号"> {{ detailData.data.number }} </a-descriptions-item>
        <a-descriptions-item label="品牌">{{ detailData.data.meansBrand }} </a-descriptions-item>
        <a-descriptions-item label="授权截止日期"> {{ detailData.data.meansEmpowerStop }} </a-descriptions-item>
        <a-descriptions-item label="包装材料">{{ detailData.data.meansPackaging }}</a-descriptions-item>
        <a-descriptions-item label="包装重量"> {{ detailData.data.meansPackagingWeight }} </a-descriptions-item>
        <a-descriptions-item label="shopee禁售站点">
          <div
            v-for="(item, index) in detailData.data.meansForbidSite"
            :key="index"
          >
            <a-tag>{{ getAttrName4(item) }}</a-tag>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="仓储类别">
          <div
            v-for="(item, index) in detailData.data.meansKeepGrain"
            :key="index"
          >
            <a-tag style="margin-right: 3px">{{ getAttrName2(item) }}</a-tag>
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>

      <a-descriptions
        title="产品描述"
        class="meansChineseDescription"
      >
        <a-descriptions-item label="中文产品描述">
          {{ detailData.data.meansChineseDescription }}
        </a-descriptions-item>
        <a-descriptions-item label="英文产品描述">
          <pre
            v-html="detailData.data.meansEnglishDescription"
            style="font-family: none; color: #606266"
          ></pre>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>

      <a-descriptions
        title="备注"
        :colon="false"
        v-if="price == '1' || roleName == 'admin'"
      >
        <a-descriptions-item>
          <div v-html="detailData.data.meansRemark"></div>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>

      <a-descriptions
        title="SKU列表"
        :colon="false"
      >
        <a-descriptions-item>
          <a-table
            :columns="columns"
            :dataSource="detailData.data.sku"
            :bordered="true"
            :rowKey="record => record.skuNumber"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'remarks'">
                <a-select
                  v-model:value="record.remarks"
                  placeholder=""
                  mode="multiple"
                  disabled
                  style="width: 200px"
                  :options="remarksList"
                ></a-select>
              </template>
            </template>
          </a-table>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>

      <!-- 主图 -->
      <a-card title="主图">
        <a-space class="mb-3">
          <a-button @click="artMainImageBtn = 'all'">全部</a-button>
          <a-button @click="artMainImageBtn = 'dev'">开发</a-button>
          <a-button @click="artMainImageBtn = 'art'">美工</a-button>
        </a-space>
        <a-empty
          v-if="artMainImageShowList.length === 0"
          description="没有主图"
        />
        <a-row v-else>
          <a-col
            :span="24"
            style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
          >
            <div
              v-for="(item, index) in images(artMainImageShowList)"
              :key="index"
              style="margin-right: 6px"
            >
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <a-image :src="item.url" />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <br />
      <!-- 副图 -->
      <a-card title="副图">
        <a-space class="mb-3">
          <a-button @click="artAssistantImageBtn = 'all'">全部</a-button>
          <a-button @click="artAssistantImageBtn = 'dev'">开发</a-button>
          <a-button @click="artAssistantImageBtn = 'art'">美工</a-button>
        </a-space>
        <a-empty
          v-if="artAssistantImageShowList.length === 0"
          description="没有副图"
        />
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in images(artAssistantImageShowList)"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <a-image :src="item.url" />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <!-- SKU图 -->
      <a-card title="SKU图">
        <a-space class="mb-3">
          <a-button @click="artSkuImageBtn = 'all'">全部</a-button>
          <a-button @click="artSkuImageBtn = 'dev'">开发</a-button>
          <a-button @click="artSkuImageBtn = 'art'">美工</a-button>
        </a-space>
        <a-empty
          description="没有SKU图"
          v-if="artSkuImageShowList.length === 0"
        />
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in images(artSkuImageShowList)"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <a-image :src="item.url" />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <!-- Amazon场景主图 -->
      <a-card title="Amazon场景主图">
        <a-empty
          description="没有Amazon场景主图"
          v-if="!(Array.isArray(detailData.data.artSkuSceneImage) && detailData.data.artSkuSceneImage.length > 0)"
        />
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in images(detailData.data.artSkuSceneImage)"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <a-image :src="item.url" />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <!-- Amazon详情图 -->
      <a-card title="Amazon详情图">
        <a-empty
          description="没有Amazon详情图"
          v-if="!(Array.isArray(detailData.data.artAmazonDetailImage) && detailData.data.artAmazonDetailImage.length > 0)"
        />
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in images(detailData.data.artAmazonDetailImage)"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <a-image :src="item.url" />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <!-- Amazon白底图 -->
      <a-card title="Amazon白底图">
        <a-empty
          description="没有Amazon白底图"
          v-if="!(Array.isArray(detailData.data.artSkuWhiteImage) && detailData.data.artSkuWhiteImage.length > 0)"
        />
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in images(detailData.data.artSkuWhiteImage)"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <a-image :src="item.url" />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <!-- AmazonSKU图 -->
      <a-card title="AmazonSKU图">
        <a-empty
          description="没有AmazonSKU图"
          v-if="!(Array.isArray(detailData.data.artAmazonSkuImage) && detailData.data.artAmazonSkuImage.length > 0)"
        />
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in images(detailData.data.artAmazonSkuImage)"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <a-image :src="item.url" />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <!-- Shein图 -->
      <a-card title="Shein图">
        <a-empty
          description="没有Shein图"
          v-if="!(Array.isArray(detailData.data.artNewImage) && detailData.data.artNewImage.length > 0)"
        />
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in images(detailData.data.artNewImage)"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <a-image :src="item.url" />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <a-card title="资质文件">
        <a-empty
          description="没有资质文件"
          v-if="
            detailData.data.devQualificationFiles == null ||
            detailData.data.devQualificationFiles === '' ||
            detailData.data.devQualificationFiles.length == 0 ||
            detailData.data.devQualificationFiles == '[]'
          "
        ></a-empty>
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in images(detailData.data.devQualificationFiles)"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <div v-if="['.gif', '.xls', '.xlsx', '.docx', '.doc', '.pdf'].some(item => item.url.includes(item))">
                  <svg
                    t="1722496954430"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="4286"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M0 0h1024v1024H0V0z"
                      fill="#202425"
                      opacity=".01"
                      p-id="4287"
                    ></path>
                    <path
                      d="M102.4 68.266667a34.133333 34.133333 0 0 1 34.133333-34.133334h750.933334a34.133333 34.133333 0 0 1 34.133333 34.133334v634.402133a34.133333 34.133333 0 0 1-10.001067 24.132267l-253.064533 253.064533a34.133333 34.133333 0 0 1-24.132267 10.001067H136.533333a34.133333 34.133333 0 0 1-34.133333-34.133334V68.266667z"
                      fill="#11AA66"
                      p-id="4288"
                    ></path>
                    <path
                      d="M238.933333 238.933333a34.133333 34.133333 0 0 1 34.133334-34.133333h477.866666a34.133333 34.133333 0 1 1 0 68.266667H273.066667a34.133333 34.133333 0 0 1-34.133334-34.133334z m0 204.8a34.133333 34.133333 0 0 1 34.133334-34.133333h477.866666a34.133333 34.133333 0 1 1 0 68.266667H273.066667a34.133333 34.133333 0 0 1-34.133334-34.133334z m34.133334 170.666667a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H273.066667z"
                      fill="#FFFFFF"
                      p-id="4289"
                    ></path>
                    <path
                      d="M648.533333 750.933333a34.133333 34.133333 0 0 1 34.133334-34.133333h230.7072a3.413333 3.413333 0 0 1 2.389333 5.802667l-261.393067 261.461333a3.413333 3.413333 0 0 1-5.8368-2.423467V750.933333z"
                      fill="#FFAA44"
                      p-id="4290"
                    ></path>
                  </svg>
                </div>
                <a-image
                  v-else
                  :src="item.url"
                />
                <div
                  class="bottom clearfix"
                  :style="
                    item.name.includes('美工处理')
                      ? 'background-image: linear-gradient(267deg, #ffffff, #3ad6ff80); font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; width: 100%;'
                      : 'font-size: 13px; color: #5a5e66; text-align: center; display: flex; justify-content: center; align-items: center; height: 25px; background-image: linear-gradient(60deg, #ffffff, #FFB03A); width: 100%'
                  "
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                  <i
                    class="el-icon-download"
                    style="font-size: 20px"
                    @click="devQualificationFilesDown(item)"
                  ></i>
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <!-- 视频 -->
      <a-card title="视频">
        <a-empty
          description="没有视频"
          v-if="!(Array.isArray(detailData.data.artVideo) && detailData.data.artVideo.length > 0)"
        />
        <a-row
          v-else
          style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap"
        >
          <div
            v-for="(item, index) in detailData.data.artVideo"
            :key="index"
            style="margin-right: 6px"
          >
            <a-col :span="3">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 200px; margin-bottom: 10px"
              >
                <video
                  :src="detailData.data.artVideo[0].url"
                  style="width: 200px; height: 200px"
                  controls
                ></video>
                <div
                  class="bottom clearfix"
                  style="font-size: 13px; text-align: center; padding: 7px 0"
                >
                  {{ item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name }}
                </div>
              </a-card>
            </a-col>
          </div>
        </a-row>
      </a-card>
      <br />
      <!-- 底部按钮 -->
      <a-space class="float-right">
        <a-button
          v-if="!isEditDetail"
          @click="close"
          >关闭</a-button
        >
        <a-button
          v-if="isPreliminary"
          type="primary"
          @click="reviewOpen = true"
          >审核</a-button
        >
      </a-space>
    </a-spin>

    <!-- 回到顶部(待编辑详情在左半部分) -->
    <a-back-top
      :target="targetFn"
      :class="isEditDetail && 'left-[calc(50vw-30px)]'"
    />

    <!-- 审核弹窗 -->
    <a-modal
      v-model:open="reviewOpen"
      title="审核"
      centered
      :confirm-loading="reviewLoading"
      @cancel="reviewModalCancel"
      @ok="reviewModalOk"
    >
      <a-form
        :model="reviewForm"
        ref="reviewFormRef"
        layout="vertical"
      >
        <a-form-item name="auditStatus">
          <div class="text-center">
            <a-radio-group v-model:value="reviewForm.auditStatus">
              <a-radio
                :value="1"
                class="mr-4"
                >审核通过</a-radio
              >
              <a-radio :value="0">审核驳回</a-radio>
            </a-radio-group>
          </div>
        </a-form-item>

        <a-form-item
          name="remark"
          label="备注"
          :rules="[
            {
              required: reviewForm.auditStatus === 0,
              message: '请输入审核备注',
              trigger: 'blur'
            }
          ]"
        >
          <a-textarea
            v-model:value="reviewForm.remark"
            :rows="4"
            :maxlength="255"
            show-count
            allowClear
            placeholder="请输入审核备注（驳回时必填）"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { forbidSaleApi, cacheGet, storeDetail } from '~@/api/common/selectProduct'
  import classifyRevert from '~@/utils/classifyRevert'
  import devAttributableMarketRevert from '~@/utils/devAttributableMarketRevert'
  import devProhibitPlatformRevert from '~@/utils/devProhibitPlatformRevert'
  import { devStockAreaTag } from '~@/utils/devStatusTag'
  import { productAttr, meansKeepGrains } from '@/utils/devStatusSelect'
  import sheepProhibitionSelect from '@/utils/sheepProhibitionSelect'
  import { message } from 'ant-design-vue'
  import download from '@/api/common/download'
  import { lastAudit } from '~@/pages/product-review/config/api/product-review.js'

  defineOptions({ name: 'PreliminaryReviewDetail' })

  const loading = ref(false)
  const detailData = reactive({
    data: {},
    productAttrOptions: productAttr,
    forbidSiteOptions: sheepProhibitionSelect,
    meansKeepGrainOptions: meansKeepGrains
  })

  const columns = [
    {
      title: 'SKU编码',
      dataIndex: 'skuNumber',
      key: 'skuNumber',
      width: 200
    },
    {
      title: '型号',
      dataIndex: 'attr',
      key: 'attr',
      width: 200
    },
    {
      title: '产品编号',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 200
    },
    {
      title: 'SKU描述',
      dataIndex: 'describe',
      key: 'describe',
      width: 250
    },
    {
      title: '长（CM）',
      dataIndex: 'inLongCm',
      key: 'inLongCm',
      width: 200
    },
    {
      title: '宽（CM）',
      dataIndex: 'inWidthCm',
      key: 'inWidthCm',
      width: 200
    },
    {
      title: '高（CM）',
      dataIndex: 'inHeightCm',
      key: 'inHeightCm',
      width: 200
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 200
    },
    {
      title: '尺寸',
      dataIndex: 'size',
      key: 'size',
      width: 200
    },
    {
      title: '尺寸单位英文',
      dataIndex: 'sizeUnit',
      key: 'sizeUnit',
      width: 200
    },
    {
      title: '成本价格',
      dataIndex: 'cost',
      key: 'cost',
      width: 200
    },
    {
      title: '重量',
      dataIndex: 'weight',
      key: 'weight',
      width: 200
    },
    {
      title: '30天销量',
      dataIndex: 'sellCount',
      key: 'sellCount',
      width: 200
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200
    }
  ]
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
    },
    {
      label: '南宁仓',
      value: '7'
    },
    {
      label: '菲律宾一仓',
      value: '8'
    },
    {
      label: '菲律宾二仓',
      value: '9'
    }
  ]

  const userStore = useUserStore()
  const vdata = computed(() => {
    return userStore.userInfo.sysUser.roles[0].vdata
  })
  const price = computed(() => {
    return userStore.userInfo.sysUser.roles[0].price
  })
  const roleName = computed(() => {
    return userStore.userInfo.roles[0]
  })
  const sale = computed(() => {
    return userStore.userInfo.sysUser.roles[0].sale
  })

  /** 图片切换按钮 */
  // 主图
  const artMainImageBtn = ref('all') // all-全部; dev-开发; art-美工;
  const artMainImageShowList = computed(() => {
    if (!detailData.data.artMainImage) return []

    switch (artMainImageBtn.value) {
      case 'all':
        return detailData.data.artMainImage
      case 'dev':
        return detailData.data.artMainImage.filter(item => !item.name.includes('美工图片'))
      case 'art':
        return detailData.data.artMainImage.filter(item => item.name.includes('美工图片'))
      default:
        return []
    }
  })

  // 副图
  const artAssistantImageBtn = ref('all')
  const artAssistantImageShowList = computed(() => {
    if (!detailData.data.artAssistantImage) return []

    switch (artAssistantImageBtn.value) {
      case 'all':
        return detailData.data.artAssistantImage
      case 'dev':
        return detailData.data.artAssistantImage.filter(item => !item.name.includes('美工图片'))
      case 'art':
        return detailData.data.artAssistantImage.filter(item => item.name.includes('美工图片'))
      default:
        return []
    }
  })

  // SKU 图
  const artSkuImageBtn = ref('all')
  const artSkuImageShowList = computed(() => {
    if (!detailData.data.artSkuImage) return []

    switch (artSkuImageBtn.value) {
      case 'all':
        return detailData.data.artSkuImage
      case 'dev':
        return detailData.data.artSkuImage.filter(item => !item.name.includes('美工图片'))
      case 'art':
        return detailData.data.artSkuImage.filter(item => item.name.includes('美工图片'))
      default:
        return []
    }
  })

  let forbidSaleList = []
  // 获取禁售属性
  const getForbidSale = new Promise((resolve, reject) => {
    loading.value = true
    forbidSaleApi()
      .then(res => {
        forbidSaleList = res.data || []
        resolve()
      })
      .catch(() => {
        reject()
      })
  })
  let cacheGetArr = []
  // 获取关键词所有的数据
  /* const getCacheGet = new Promise((resolve, reject) => {
    cacheGet()
      .then(res => {
        cacheGetArr = res.data || []
        resolve()
      })
      .catch(() => {
        reject()
      })
  }) */
  // 注释掉侵权关键词
  // const pList = [getForbidSale, getCacheGet]
  const pList = [getForbidSale]
  Promise.all(pList).then(_ => {
    loading.value = false
    getDetail()
  })

  const route = useRoute()
  // 是否为资料待编辑详情
  const isEditDetail = computed(() => route.path === '/platform/product-review/data-for-editing-detail')
  // 初审详情
  const isPreliminary = computed(() => route.path === '/platform/product-review/preliminary-review-detail')
  // 驳回详情
  const isReject = computed(() => route.path === '/platform/product-review/preliminary-review-detail')

  // 获取详情数据
  async function getDetail() {
    const id = route.query.commodityId
    if (!id) {
      message.error('缺少详情commodityId')

      return
    }

    loading.value = true
    try {
      let res = await storeDetail({ id })
      const data = res.data
      if (!data) throw new Error('无详情数据')

      data.sku.forEach(v => {
        v.detail = v.detail || '{}'
        v.detail = JSON.parse(v.detail.replaceAll("'", '"'))
        v.remarks = v.remarks ? v.remarks : '[]'
        v.remarks = JSON.parse(v.remarks)
      })

      data.artSkuSceneImage = [
        ...JSON.parse(data.artSkuSceneImage || '[]'),
        ...JSON.parse(data.artAmazonDetailImage || '[]'),
        ...JSON.parse(data.artSkuWhiteImage || '[]'),
        ...JSON.parse(data.artAmazonSkuImage || '[]')
      ]
      if (data.artMainImage !== '' && data.artMainImage !== null) {
        data.artMainImage = JSON.parse(data.artMainImage)
      }
      if (data.artAssistantImage !== '' && data.artAssistantImage !== null) {
        data.artAssistantImage = JSON.parse(data.artAssistantImage)
      }

      if (data.artSkuImage !== '' && data.artSkuImage !== null) {
        data.artSkuImage = JSON.parse(data.artSkuImage)
      }
      if (detailData.data.artNewImage !== '' && data.artNewImage !== null) {
        data.artNewImage = JSON.parse(data.artNewImage)
      }

      if (data.artVideo !== '' && data.artVideo !== null) {
        data.artVideo = JSON.parse(data.artVideo)
      }

      if (data.meansForbidAttribute !== null) {
        data.meansForbidAttribute = data.meansForbidAttribute.split(',')
      } else {
        data.meansForbidAttribute = []
      }
      if (data.meansProductProperties !== null) {
        data.meansProductProperties = data.meansProductProperties.split(',')
      } else {
        data.meansProductProperties = []
      }
      if (data.meansKeepGrain !== null) {
        data.meansKeepGrain = data.meansKeepGrain.split(',')
      } else {
        data.meansKeepGrain = []
      }

      if (data.meansForbidSite !== null) {
        data.meansForbidSite = data.meansForbidSite.split(',')
      } else {
        data.meansForbidSite = []
      }
      if (data.devConsultLink) {
        data.devConsultLink = JSON.parse(data.devConsultLink)
      } else {
        data.devConsultLink = []
      }

      if (data.devSupplierUrl) {
        data.devSupplierUrl = JSON.parse(data.devSupplierUrl)
      } else {
        data.devSupplierUrl = []
      }
      if (cacheGetArr.length > 0) {
        // 修改匹配逻辑
        for (let i = 0; i < cacheGetArr.length; i++) {
          // 直接使用字符串，不再二次调用 escapeRegExp
          const searchString = cacheGetArr[i]
          // 为包含空格的字符串构建正则表达式时不添加单词边界
          let regexPattern = ''
          if (searchString === 's') {
            regexPattern = `(?<!\\w)(?<!\\w')(s)(?!\\w)`
          } else {
            regexPattern = `(?<!\\w)${escapeRegExp(searchString)}(?!\\w)`
          }

          const regex = new RegExp(regexPattern, 'gi') // 'g'表示全局匹配，'i'表示不区分大小写
          // 进行文本替换
          data.meansEnglishDescription = data.meansEnglishDescription.replace(regex, matched => {
            return `<span style="color: red;font-size: 18px;font-weight: bolder">${matched}</span>` // 使用匹配到的原始文本（保留大小写）
          })
        }
        data.meansEnglishDescription = data.meansEnglishDescription.replaceAll(
          '<span <span style="color: red;font-size: 18px;font-weight: bolder">style</span>="color: red;font-size: 18px;font-weight: bolder">',
          '<span style="color: red;font-size: 18px;font-weight: bolder">'
        )
      }
      detailData.data = data
    } catch (error) {
      console.error(error)
    }
    loading.value = false
  }
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
  }

  function classify() {
    if (detailData.data.classify != null && detailData.data.classify !== '' && detailData.data.classify !== undefined) {
      return classifyRevert(detailData.data.classify.split(','))
    }
  }
  function devAttributableMarket() {
    if (detailData.data.devAttributableMarket != null && detailData.data.devAttributableMarket !== '' && detailData.data.devAttributableMarket !== undefined) {
      return devAttributableMarketRevert(detailData.data.devAttributableMarket.split(','))
    }
  }
  function stockAreaTag() {
    return devStockAreaTag(detailData.data.devStockArea)
  }
  function devProhibitPlatform() {
    if (detailData.data.devProhibitPlatform != null && detailData.data.devProhibitPlatform !== '' && detailData.data.devProhibitPlatform !== undefined) {
      return devProhibitPlatformRevert(detailData.data.devProhibitPlatform.split(','))
    }
  }
  function getAttrName1(val) {
    let Aname1
    if (detailData.productAttrOptions.length > 0) {
      detailData.productAttrOptions.forEach(item => {
        if (item.value == val) {
          Aname1 = item.label
        }
      })
    }
    return Aname1
  }

  function getAttrName2(val) {
    let Aname1
    if (detailData.meansKeepGrainOptions.length > 0) {
      detailData.meansKeepGrainOptions.forEach(item => {
        if (item.value == val) {
          Aname1 = item.label
        }
      })
    }
    return Aname1
  }
  function getAttrName3(key) {
    let Aname1
    let Aname2
    if (forbidSaleList.length > 0) {
      Aname1 = forbidSaleList.find(item => {
        return item.key == key
      })
      if (Aname1) {
        Aname2 = Aname1.attributes
      } else {
        Aname2 = ''
      }
    }
    return Aname2
  }
  function getAttrName4(val) {
    let Aname1
    if (detailData.forbidSiteOptions.length > 0) {
      detailData.forbidSiteOptions.forEach(item => {
        if (item.value == val) {
          Aname1 = item.label
        }
      })
    }
    return Aname1
  }
  function skuList(e) {
    let str = ''
    if (e == '' || e == null) {
      e = ''
    }
    let spanD = e.split(',')
    let oldSku = e.split(',') //原始错乱sku
    let b = [] //去除所有带标签的
    oldSku.map(item => {
      b.push(item.replace(/<[^>]+>/g, ''))
    })
    let newSku = b.sort() //排序 正确的sku
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
  }
  function images(images, images2) {
    const urls = []
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
    return urls
  }

  //资质文件下载
  function devQualificationFilesDown(item) {
    message.success('执行下载成功，请等待文件下载完成！勿重复操作')
    download.name(item.url, item.name)
  }

  /** 返回需要监听其滚动事件的元素 */
  function targetFn() {
    // 编辑 ? 外层父元素 : 页面顶层元素
    return isEditDetail.value ? document.getElementById('preliminary-review-detail') : document.querySelector('.ant-layout-content')
  }

  function close() {
    window.close()
  }

  /** 审核弹窗 */
  const reviewOpen = ref(false)
  const reviewLoading = ref(false)
  const reviewFormRef = ref()
  const reviewForm = reactive({
    auditStatus: 1,
    remark: ''
  })

  function reviewModalCancel() {
    reviewOpen.value = false
    reviewForm.auditStatus = 1
    reviewForm.remark = ''
  }

  function reviewModalOk() {
    reviewFormRef.value.validate().then(_ => {
      const params = [
        {
          auditStatus: reviewForm.auditStatus === 1 ? 20 : 70, // 10 待编辑; 70 运营驳回
          id: route.query.id,
          commodityId: route.query.commodityId,
          remark: reviewForm.remark
        }
      ]

      reviewLoading.value = true
      lastAudit(params)
        .then(res => {
          message.success('审核成功')
          reviewModalCancel()

          // 窗口通信, 刷新列表页
          const targetWindow = window.opener
          if (targetWindow) {
            targetWindow.postMessage('refresh', targetWindow.location.origin)
          }

          setTimeout(() => {
            window.close()
          }, 1000)
        })
        .finally(() => {
          reviewLoading.value = false
        })
    })
  }
</script>

<style lang="less" scoped>
  :deep(.ant-image-img) {
    width: 198px;
    height: 198px;
  }
  :deep(.ant-tag) {
    margin-bottom: 6px;
  }
  :deep(.ant-spin-nested-loading) {
    width: 100%;
  }
  :deep(.ant-descriptions) {
    width: 100%;
    &.devConsultLink {
      .ant-descriptions-item-content {
        flex-direction: column;
        a {
          width: 100%;
        }
      }
    }
    &.meansChineseDescription {
      .ant-descriptions-item-label {
        white-space: nowrap;
      }
      .ant-descriptions-item-content {
        max-width: calc(100% - 100px);
        .pre {
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
  }
</style>
