<template>
  <div class="tree-table-container">
    <!-- @onSubmit="onSubmit" @formHeightChange="formHeightChange" -->
    <appTableForm 
      v-model:formData="formData" 
      resetSetMenu="serialNumberManagement" 
      label-width="100"
      :hide-name-list="['sdgdfg']"
    >
      <template #formItemBox>
        <a-form-item label="年份" name="dataYear">
          <a-date-picker v-model:value="formData.dataYear" picker="year" value-format="YYYY" :allowClear="false" />
        </a-form-item>
        <a-form-item label="月份" name="dataMonth">
          <a-select v-model:value="formData.dataMonth" :options="options.monthList" placeholder="请选择月份"></a-select>
        </a-form-item>
        <a-form-item label="月份" name="sadgsd">
          <a-select v-model:value="formData.dataMonth" :options="options.monthList" placeholder="请选择月份"></a-select>
        </a-form-item>
        <a-form-item label="月份" name="sdgdfg">
          <a-select v-model:value="formData.dataMonth" :options="options.monthList" placeholder="请选择月份"></a-select>
        </a-form-item>
        <!-- <a-form-item label="月份" name="dfhdsfh">
          <a-select v-model:value="formData.dataMonth" :options="options.monthList" placeholder="请选择月份"></a-select>
        </a-form-item> -->
        <a-form-item label="月份" name="dfhdfhgdsf">
          <a-select allowClear v-model:value="formData.dataMonth" :options="options.monthList" placeholder="请选择月份"></a-select>
        </a-form-item>
        <a-form-item label="店铺" name="sdgdfg">
          <appShopSelect :multiple="true" :options="shopData" :fieldObj="shopObj" v-model:account="formData.account"></appShopSelect>
        </a-form-item>
      </template>
    </appTableForm>
    <!-- <a-table :columns="goalCompletion_header" :data-source="processedDataWithSummary" :pagination="false" bordered
      :scroll="{ x: 'max-content', y: '70vh' }" :rowKey="record => record.key || record.id">

      <template #bodyCell="{ column, record, text }">

        <template v-if="isSummaryRow(record)">
          <template v-if="column.dataIndex === 'deptName'">
            <div class="summary-content font-700 bg-orange-500">
              {{ getSummaryLabel(record) }}
            </div>
          </template>
          <template v-else-if="isNumericColumn(column.dataIndex) && record[column.dataIndex] !== undefined">
            <div class="summary-content numeric font-700 text-right">
              {{ formatSummaryValue(column.dataIndex, record[column.dataIndex]) }}
            </div>
          </template>
          <template v-else-if="column.dataIndex.includes('Achieve')">
            <a-tag :color="getAchieveColor(text)">
              {{ formatAchieveText(text) }}
            </a-tag>
          </template>
          <template v-else-if="['groupName', 'category', 'shopUserName'].includes(column.dataIndex)">
            <span></span>
          </template>
          <template v-else>
            <span class="text-right font-700">{{ text !== undefined && text !== null ? text : '' }}</span>
          </template>
        </template>
        <template v-else>
          <template v-if="column.dataIndex === 'category'">
            <span>{{ catrgoryEnum[record.groupName] || '' }}</span>
          </template>
          <template v-else-if="isNumericColumn(column.dataIndex)">
            <span class="numeric-value text-right! block">
              {{ formatCellValue(column.dataIndex, text) }}
            </span>
          </template>
          <template v-else-if="column.dataIndex.includes('Rate') || column.dataIndex.includes('Target')">
            <a-tag :color="getRateColor(text)">
              {{ formatRate(text) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex.includes('Achieve')">
            <a-tag :color="getAchieveColor(text)">
              {{ formatAchieveText(text) }}
            </a-tag>
          </template>
          <template v-else>
            <span class="text-right">{{ text !== undefined && text !== null ? text : '' }}</span>
          </template>
        </template>
      </template>
    </a-table> -->
     <appTableBox :table-header="goalCompletion_header" :data-source="processedDataWithSummary"
      reset-set-menu="serialNumberManagement">
      <template #bodyCell="{ column, record, text }">
        <template v-if="isSummaryRow(record)">
          <template v-if="column.dataIndex === 'deptName'">
            <div class="summary-content font-700 bg-orange-500">
              {{ getSummaryLabel(record) }}
            </div>
          </template>
          <template v-else-if="isNumericColumn(column.dataIndex) && record[column.dataIndex] !== undefined">
            <div class="summary-content numeric font-700 text-right">
              {{ formatSummaryValue(column.dataIndex, record[column.dataIndex]) }}
            </div>
          </template>
          
          <template v-else-if="column.dataIndex?.includes('Achieve')">
            <a-tag :color="getAchieveColor(text)">
              {{ formatAchieveText(text) }}
            </a-tag>
          </template>
          <template v-else-if="['groupName', 'category', 'shopUserName'].includes(column.dataIndex)">
            <span></span>
          </template>
          <template v-else>
            <span class="text-right font-700">{{ text !== undefined && text !== null ? text : '' }}</span>
          </template>
        </template>

        <template v-else>
          <template v-if="column.dataIndex === 'category'">
            <span>{{ catrgoryEnum[record.groupName] }}</span>
          </template>
          <template v-else-if="isNumericColumn(column.dataIndex)">
            <span class="numeric-value text-right! block">
              {{ formatCellValue(column.dataIndex, text) }}
            </span>
          </template>
          <template v-else-if="column.dataIndex?.includes('Rate') || column.dataIndex?.includes('Target')">
            <a-tag :color="getRateColor(text)">
              {{ formatRate(text) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex?.includes('Achieve')">
            <a-tag :color="getAchieveColor(text)">
              {{ formatAchieveText(text) }}
            </a-tag>
          </template>
          <template v-else>
            <span class="text-right">{{ text !== undefined && text !== null ? text : '' }}</span>
          </template>
          <!-- <template v-if="column.dataIndex === 'deptName'">
            <div class="summary-content font-700 bg-orange-500">
              {{ getSummaryLabel(record) }}
            </div>
          </template>
          <template v-else-if="isNumericColumn(column.dataIndex) && record[column.dataIndex] !== undefined">
            <div class="summary-content numeric font-700 text-right">
              {{ formatSummaryValue(column.dataIndex, record[column.dataIndex]) }}
            </div>
          </template>
          
          <template v-else-if="column.dataIndex?.includes('Achieve')">
            <a-tag :color="getAchieveColor(text)">
              {{ formatAchieveText(text) }}
            </a-tag>
          </template>
          <template v-else-if="['groupName', 'category', 'shopUserName'].includes(column.dataIndex)">
            <span></span>
          </template>
          <template v-else>
            <span class="text-right font-700">{{ text !== undefined && text !== null ? text : '' }}</span>
          </template>
        </template>

        <template v-else>
          <template v-if="column.dataIndex === 'category'">
            <span>{{ catrgoryEnum[record.groupName] || '' }}</span>
          </template>
          <template v-else-if="isNumericColumn(column.dataIndex)">
            <span class="numeric-value text-right! block">
              {{ formatCellValue(column.dataIndex, text) }}
            </span>
          </template>
          <template v-else-if="column.dataIndex?.includes('Rate') || column.dataIndex?.includes('Target')">
            <a-tag :color="getRateColor(text)">
              {{ formatRate(text) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex?.includes('Achieve')">
            <a-tag :color="getAchieveColor(text)">
              {{ formatAchieveText(text) }}
            </a-tag>
          </template>
          <template v-else>
            <span class="text-right">{{ text !== undefined && text !== null ? text : '' }}</span>
          </template> -->
        </template>
      </template>
      <template #leftTool>
        <a-button type="primary" :loading="exportLoading" @click="exportReport">下载</a-button>
      </template>
    </appTableBox>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { monthList } from '~@/pages/financialStatements/common/data';
import appTableForm from '~@/components/common/appTableForm.vue';
import appTableBox from '~@/components/common/appTableBox.vue';
import appShopSelect from '~@/components/common/appShopSelect.vue';
import download from "~/api/common/download.js";
import { message } from "ant-design-vue";

defineOptions({ name: "goalCompletion" })

const exportLoading = ref(false);
const formData = reactive({
  dataYear: dayjs(),
  dataMonth: dayjs().format('MM'),
  account: ''
});
const options = reactive({
  monthList,  // 月
})
const formHeight = ref(0);
// 原始数据
const originalData = ref([]);
const goalCompletion_header = [
  {
    title: '部门',
    key: 'deptName',
    dataIndex: 'deptName',
    width: 240,
    align:'center',
    fixed: 'left'
  },
  {
    title: '组别',
    dataIndex: 'groupName',
    key: 'groupName',
    width: 240,
    align:'center',
    fixed: 'left'
  },
  {
    title: '类别',
    dataIndex: 'category',
    key: 'category',
    width: 100,
    align:'center',
    fixed: 'left'
  },
  {
    title: '人员',
    dataIndex: 'shopUserName',
    key: 'shopUserName',
    width: 100,
    align:'center',
    fixed: 'left'
  },
  {
    title: '目标完成情况',
    align:'center',
    dataIndex:'goalCompletion',
    key: 'goalCompletion',
    children: [
      {
        title: '基础目标',
        dataIndex: 'gmvBaseTarget',
        key: 'gmvBaseTarget',
        width: 200,
        align:'center'
      },
      {
        title: '上浮后基础目标',
        dataIndex: 'gmvIncreaseTarget',
        key: 'gmvIncreaseTarget',
        width: 200,
        align:'center'
      },
      {
        title: '实际完成',
        dataIndex: 'gmvRealAchieve',
        key: 'gmvRealAchieve',
        width: 200,
        align:'center'
      },
      {
        title: '实际完成率',
        dataIndex: 'gmvRealAchieveRate',
        key: 'gmvRealAchieveRate',
        width: 200,
        align:'center'
      },
      {
        title: '是否达成',
        dataIndex: 'isAchieve',
        key: 'isAchieve',
        width: 100,
        align:'center'
      }
    ]
  },
  {
    title: 'GMV挑战目标完成情况',
    align:'center',
    dataIndex:'goalCompletion1',
    key: 'goalCompletion1',
    children: [
      {
        title: '挑战目标',
        dataIndex: 'gmvChallengeTarget',
        key: 'gmvChallengeTarget',
        width: 200,
        align:'center'
      },
      {
        title: '超额',
        dataIndex: 'gmvChallengeExceed',
        key: 'gmvChallengeExceed',
        width: 200,
        align:'center'
      },
      {
        title: '实际完成率',
        dataIndex: 'gmvChallengeAchieveRate',
        key: 'gmvChallengeAchieveRate',
        width: 200,
        align:'center'
      },
      {
        title: '是否达成',
        dataIndex: 'isChallengeAchieve',
        key: 'isChallengeAchieve',
        width: 100,
        align:'center'
      }
    ]
  },
  {
    title: '理论完成情况（实际完成+半托管预估影响的GMV）',
    align:'center',
    dataIndex:'goalCompletion2',
    key: 'goalCompletion2',
    children: [
      {
        title: '半托管客单价',
        dataIndex: 'semiAvgOrderValue',
        key: 'semiAvgOrderValue',
        width: 200,
        align:'center'
      },
      {
        title: '订单数量',
        dataIndex: 'semiOrderCount',
        key: 'semiOrderCount',
        width: 200,
        align:'center'
      },
      {
        title: '预估影响的GMV',
        dataIndex: 'semiGmvForecastEffect',
        key: 'semiGmvForecastEffect',
        width: 200,
        align:'center'
      },
      {
        title: '理论完成',
        dataIndex: 'theoryAchieve',
        key: 'theoryAchieve',
        width: 200,
        align:'center'
      }
    ]
  },
  {
    title: '本月净毛利率达成情况',
    align:'center',
    dataIndex:'goalCompletion3',
    key: 'goalCompletion3',
    children: [
      {
        title: 'pop利润率目标',
        dataIndex: 'popProfitRateTarget',
        key: 'popProfitRateTarget',
        width: 200,
        align:'center'
      },
      {
        title: '半托管利润率目标',
        dataIndex: 'semiProfitRateTarget',
        key: 'semiProfitRateTarget',
        width: 200,
        align:'center'
      },
      {
        title: '综合利润率目标',
        dataIndex: 'profitRateTarget',
        key: 'profitRateTarget',
        width: 200,
        align:'center'
      },
      {
        title: '实际毛利率',
        dataIndex: 'realNetProfitRate',
        key: 'realNetProfitRate',
        width: 200,
        align:'center'
      },
      {
        title: '是否达成',
        dataIndex: 'isProfitRateAchieve',
        key: 'isProfitRateAchieve',
        width: 100,
        align:'center'
      }
    ]
  },
  {
    title: 'GMV对比情况',
    align:'center',
    dataIndex:'goalCompletion4',
    key: 'goalCompletion4',
    children: [
      {
        title: '上月GMV',
        dataIndex: 'lastMonthGmv',
        key: 'lastMonthGmv',
        width: 200,
        align:'center'
      },
      {
        title: '对比上月增长情况',
        dataIndex: 'currentMonthGmvIncr',
        key: 'currentMonthGmvIncr',
        width: 200,
        align:'center'
      }
    ]
  },
  {
    title: '净毛利率对比情况',
    align:'center',
    dataIndex:'goalCompletion5',
    key: 'goalCompletion5',
    children: [
      {
        title: '跨境净毛利率',
        align:'center',
        children: [
        {
            title: '本月净毛利率',
            dataIndex: 'popNetProfitRate',
            key: 'popNetProfitRate',
            width: 200,
            align:'center'
          },
          {
            title: '上月净毛利率',
            dataIndex: 'lastMonthPopNetProfitRate',
            key: 'lastMonthPopNetProfitRate',
            width: 200,
            align:'center'
          },
          {
            title: '对比上月增长情况',
            dataIndex: 'popNetProfitRateIncr',
            key: 'popNetProfitRateIncr',
            width: 200,
            align:'center'
          }
        ]
      },
      {
        title: '半托管净毛利率',
        align:'center',
        children: [
          {
            title: '本月净毛利率',
            dataIndex: 'semiNetProfitRate',
            key: 'semiNetProfitRate',
            width: 200,
            align:'center'
          },
          {
            title: '上月净毛利率',
            dataIndex: 'lastMonthSemiNetProfitRate',
            key: 'lastMonthSemiNetProfitRate',
            width: 200,
            align:'center'
          },
          {
            title: '对比上月增长情况',
            dataIndex: 'semiNetProfitRateIncr',
            key: 'semiNetProfitRateIncr',
            width: 200,
            align:'center'
          }
        ]
      }
    ]
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
    align:'center'
  }
]
const shopData = [
    {
        "account": "15382473660",
        "clientId": "1732283",
        "apiKey": "ea560b1c-b9df-41c3-8f1c-43017eae1721",
        "simpleName": "Ozon01--Warmstation Store",
        "accessToken": null
    },
    {
        "account": "13325791654",
        "clientId": "1732337",
        "apiKey": "39b671c9-ef28-4528-9118-c0c7db7bc802",
        "simpleName": "Ozon02--CC Clothing",
        "accessToken": null
    },
    {
        "account": "15355383720",
        "clientId": "1732354",
        "apiKey": "41d9e1ed-1fd6-4065-9403-dd2e8d5169dd",
        "simpleName": "Ozon03--Auto Boutique Store",
        "accessToken": null
    },
    {
        "account": "15345899074",
        "clientId": "1732374",
        "apiKey": "8a0d58f9-a14a-4039-a4d1-0562ddadf96f",
        "simpleName": "Ozon04--Life-Designer Store",
        "accessToken": null
    },
    {
        "account": "15381779160",
        "clientId": "1734214",
        "apiKey": "7c2c53c0-65b2-472d-b622-c83d13702651",
        "simpleName": "Ozon05--ILOVEDIY Fashion Store",
        "accessToken": null
    },
    {
        "account": "15356991761",
        "clientId": "1734222",
        "apiKey": "a0e6386b-4b82-44a7-a758-1fad954ae2dc",
        "simpleName": "Ozon06--Beauty-Girl Store",
        "accessToken": null
    },
    {
        "account": "15382463697",
        "clientId": "1841669",
        "apiKey": "c6943a03-20a2-4e4e-b196-fbe148a35fec",
        "simpleName": "Ozon08-- CC Grocery Shop",
        "accessToken": null
    },
    {
        "account": "15372945586",
        "clientId": "1843244",
        "apiKey": "edb498bb-3efd-46af-96e4-8b96d8caefea",
        "simpleName": "Ozon11--YY Grocerys",
        "accessToken": null
    },
    {
        "account": "15356907957",
        "clientId": "1843279",
        "apiKey": "4bdea11b-23c7-4eee-a7b7-7414e5eebd28",
        "simpleName": "Ozon14--Home-living Designer Store",
        "accessToken": null
    },
    {
        "account": "15356991751",
        "clientId": "1843320",
        "apiKey": "04609a4f-ffa2-4302-af3a-da11e2ca1576",
        "simpleName": "Ozon15--Global Online Store",
        "accessToken": null
    },
    {
        "account": "13276794490",
        "clientId": "1893277",
        "apiKey": "f7505419-79a0-4630-9e21-d6b22a0b04ec",
        "simpleName": "Ozon16--le serein",
        "accessToken": null
    },
    {
        "account": "13276794670",
        "clientId": "1893319",
        "apiKey": "0d526ee1-cb97-422b-a983-60e47d540742",
        "simpleName": "Ozon17--Home Sweet Home",
        "accessToken": null
    },
    {
        "account": "13276895470",
        "clientId": "1893216",
        "apiKey": "f8859c3c-1c3a-4bd0-b169-7a98c5df0f1c",
        "simpleName": "Ozon18--Home life SHOP",
        "accessToken": null
    },
    {
        "account": "17394622214",
        "clientId": "1893140",
        "apiKey": "cd3d72c4-3183-4faf-ba0b-438f9f1f3fd7",
        "simpleName": "Ozon19--Trendy Beauty Store",
        "accessToken": null
    },
    {
        "account": "19025752896",
        "clientId": "2322006",
        "apiKey": "d62808fa-5905-4dea-a7c1-42e414a6f6bc",
        "simpleName": "Ozon20--Happy Life Everyday Store",
        "accessToken": null
    },
    {
        "account": "19025752723",
        "clientId": "2322033",
        "apiKey": "fb539c6f-4d5b-4567-82b0-134fb98bc58d",
        "simpleName": "Ozon21--Fashion World Store",
        "accessToken": null
    },
    {
        "account": "19025753657",
        "clientId": "2322060",
        "apiKey": "e7af3810-4a42-4bc1-9ec4-b752a05c0509",
        "simpleName": "Ozon22--SevenSerenity Haven Store",
        "accessToken": null
    },
    {
        "account": "19025753307",
        "clientId": "2322081",
        "apiKey": "568ee5e1-0fa5-4c56-b421-b78a1c7fc51d",
        "simpleName": "Ozon23--XZ Home Fashion Store",
        "accessToken": null
    },
    {
        "account": "19025751586",
        "clientId": "2322095",
        "apiKey": "b84d44da-7e66-4564-a5a5-051cef8b0d5d",
        "simpleName": "Ozon24--Happyyoyo",
        "accessToken": null
    },
    {
        "account": "19025752192",
        "clientId": "2457353",
        "apiKey": "adae4f55-9104-4025-8d1a-82d31c40266a",
        "simpleName": "Ozon25--Beauty Store",
        "accessToken": null
    },
    {
        "account": "19025752396",
        "clientId": "2457461",
        "apiKey": "86a047fd-6a7b-47a4-b690-e6251065d9c8",
        "simpleName": "Ozon26--Beauty Legend Store",
        "accessToken": null
    },
    {
        "account": "19025753370",
        "clientId": "2457477",
        "apiKey": "53efea75-8381-4ca2-bcd9-caed4a6d4f1a",
        "simpleName": "Ozon27--Umi Stylish Store",
        "accessToken": null
    },
    {
        "account": "19025752290",
        "clientId": "2457490",
        "apiKey": "7715a80f-d6cf-4a02-9809-c2f5d6ebbc66",
        "simpleName": "Ozon28--Lucky 7",
        "accessToken": null
    },
    {
        "account": "13017949327",
        "clientId": "2649641",
        "apiKey": "2c337fc1-23f2-4415-a1da-6fff04ee9ae2",
        "simpleName": "Ozon29--Warm Home",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZHZlcnRpc2luZy5wZXJmb3JtYW5jZS5vem9uLnJ1IiwiZXhwIjoxNzYwMTY4ODM1LCJpYXQiOjE3NjAxNjcwMzUsImlzcyI6InBlcmZvcm1hbmNlLWF1dGgub3pvbi5ydSIsInN1YiI6IjgwMjQzNTUxLTE3NTUwNTQ3NjYxODBAYWR2ZXJ0aXNpbmcucGVyZm9ybWFuY2Uub3pvbi5ydSJ9.ltfWMDHfYPEXlHPYyeOo7ql8KnrIpcPgpBFmSq1yhNY"
    },
    {
        "account": "18057985154",
        "clientId": "2649681",
        "apiKey": "09604982-8677-46ef-ae12-32c723f01abd",
        "simpleName": "Ozon30--Warm Life",
        "accessToken": null
    },
    {
        "account": "13106204023",
        "clientId": "2665905",
        "apiKey": "a4a582a8-979c-418b-baea-441e1583c141",
        "simpleName": "Ozon31--Lovely Home Store",
        "accessToken": null
    },
    {
        "account": "13276791469",
        "clientId": "2665927",
        "apiKey": "34ccee13-412c-4ee6-980f-74edc0d3800c",
        "simpleName": "Ozon32--Everything Home Store",
        "accessToken": null
    },
    {
        "account": "15669606377",
        "clientId": "2665959",
        "apiKey": "161c40a3-6fd2-46b1-895b-d855d3e6b38e",
        "simpleName": "Ozon33--Sapphire Sky Home Store",
        "accessToken": null
    },
    {
        "account": "13282954516",
        "clientId": "2665974",
        "apiKey": "a03f6901-6693-4683-bd99-bde486ce597b",
        "simpleName": "Ozon34--Sunduk Chudes",
        "accessToken": null
    },
    {
        "account": "13282934028",
        "clientId": "2669006",
        "apiKey": "b406fab6-530e-4b17-a04d-bc214e4bab09",
        "simpleName": "Ozon35--Luck Day",
        "accessToken": null
    },
    {
        "account": "13106264447",
        "clientId": "2669018",
        "apiKey": "922afea9-0487-4965-bfa1-d3a4a55b8274",
        "simpleName": "Ozon36--Luck Home",
        "accessToken": null
    },
    {
        "account": "19025753823",
        "clientId": "2779650",
        "apiKey": "063291b8-d2bf-45ff-a0cb-ce724a1f252e",
        "simpleName": "Ozon37-Jealous Girl",
        "accessToken": null
    },
    {
        "account": "19025753720",
        "clientId": "2779683",
        "apiKey": "2c687596-e8e3-419b-9003-ea9ce6766105",
        "simpleName": "Ozon38-ILOVEDIY",
        "accessToken": null
    },
    {
        "account": "19025753612",
        "clientId": "2779953",
        "apiKey": "701c33b9-335a-4183-951e-4919b3deaf14",
        "simpleName": "Ozon39-OPPZAN",
        "accessToken": null
    },
    {
        "account": "19025752757",
        "clientId": "2779996",
        "apiKey": "909891e9-35df-4cba-b796-3360aeee2e3f",
        "simpleName": "Ozon40-rainbow love",
        "accessToken": null
    },
    {
        "account": "19025753157",
        "clientId": "2780022",
        "apiKey": "5e8b6414-7b79-44ef-a66a-360e68398507",
        "simpleName": "Ozon41-Warm Station",
        "accessToken": null
    },
    {
        "account": "19025752395",
        "clientId": "2780036",
        "apiKey": "9602b09c-0329-49b8-bd97-019c82017342",
        "simpleName": "Ozon42-AlwaysU",
        "accessToken": null
    },
    {
        "account": "19025753163",
        "clientId": "2780145",
        "apiKey": "727de455-6abe-4b7d-936e-360531e7a763",
        "simpleName": "Ozon43-ILOVEDIY Finding Store",
        "accessToken": null
    },
    {
        "account": "19025753670",
        "clientId": "2780170",
        "apiKey": "917e8c57-7647-4b54-9191-128ddce95503",
        "simpleName": "Ozon44-SunnyNook",
        "accessToken": null
    },
    {
        "account": "19025752512",
        "clientId": "2780186",
        "apiKey": "3f2bb73a-5a45-4485-be05-34d7368af452",
        "simpleName": "Ozon45-HomeHug",
        "accessToken": null
    },
    {
        "account": "19025752673",
        "clientId": "2780204",
        "apiKey": "86836d89-661a-466a-8f93-1386e01a9e0d",
        "simpleName": "Ozon46-VeloZen",
        "accessToken": null
    },
    {
        "account": "15858983729",
        "clientId": "3031773",
        "apiKey": "740f2463-0dcc-4b41-9f5b-195c02f5ce7e",
        "simpleName": "Ozon47-department store",
        "accessToken": null
    },
    {
        "account": "15858983076",
        "clientId": "3031863",
        "apiKey": "963b4710-6004-47a7-bbc8-419548a34552",
        "simpleName": "Ozon48-Fun Box",
        "accessToken": null
    },
    {
        "account": "15858983156",
        "clientId": "3031888",
        "apiKey": "608f4d8c-d6ab-40e6-9896-01ffb6328661",
        "simpleName": "Ozon49-Lucky Cat",
        "accessToken": null
    },
    {
        "account": "19025752683",
        "clientId": "3175479",
        "apiKey": "a1c7a1c6-7c5b-4542-b7d5-a4224b6c9661",
        "simpleName": "Ozon50-Candy Bean",
        "accessToken": null
    },
    {
        "account": "19025752872",
        "clientId": "3175498",
        "apiKey": "11355e0c-318e-41ae-82e3-7a9b133c35ad",
        "simpleName": "Ozon51-Cat Planet",
        "accessToken": null
    },
    {
        "account": "18606540143",
        "clientId": "3354206",
        "apiKey": "db8bb291-ecdb-4e1d-8ef9-0b3d1fb1ee35",
        "simpleName": "Ozon52-Love store",
        "accessToken": null
    },
    {
        "account": "13184494380",
        "clientId": "3354307",
        "apiKey": "19a67d54-1809-4b41-b445-dc63b56d4e84",
        "simpleName": "Ozon53-Fashion DIY",
        "accessToken": null
    },
    {
        "account": "15858983720",
        "clientId": "3367948",
        "apiKey": "3adb3d22-de05-402f-9243-0d7f2d493a57",
        "simpleName": "Ozon54-CozyHaven",
        "accessToken": null
    },
    {
        "account": "15858983726",
        "clientId": "3368117",
        "apiKey": "b520553a-696b-4fb5-b75d-fc4cc61eedce",
        "simpleName": "Ozon55-ClearLove7",
        "accessToken": null
    },
    {
        "account": "15858983731",
        "clientId": "3368222",
        "apiKey": "c467dd93-bda0-48e9-b633-bf1419ae4c76",
        "simpleName": "Ozon56-Bubble Star",
        "accessToken": null
    }
]
const shopObj = {
  value: "account",
  label: "simpleName",
};
// // 数值型列定义
const numericColumns = computed(() => {
  return [
    'gmvBaseTarget', 'gmvIncreaseTarget', 'gmvRealAchieve', 'gmvRealAchieveRate',
    'gmvChallengeTarget', 'gmvChallengeExceed', 'gmvChallengeAchieveRate',
    'semiAvgOrderValue', 'semiOrderCount', 'semiGmvForecastEffect', 'theoryAchieve',
    'lastMonthGmv', 'currentMonthGmvIncr', 'popNetProfitRate', 'lastMonthPopNetProfitRate',
    'popNetProfitRateIncr', 'semiNetProfitRate', 'lastMonthSemiNetProfitRate', 'semiNetProfitRateIncr'
  ];
});

// 品类枚举映射
const catrgoryEnum = {
  '速卖通一部（一组）': '综合',
  '速卖通一部（二组）': '家居',
  '速卖通一部（三组）': '3C',
  '速卖通一部（四组）': '汽摩配',
  '速卖通一部（五组）': '家居',
  '速卖通二部（一组）': '综合',
  '速卖通二部（二组）': '家居',
  '速卖通二部（三组）': '3C',
  '速卖通二部（四组）': '汽摩配',
  '速卖通二部（五组）': '家居',
  '速卖通二部（六组）': '家居',
}

// 部门排序顺序
const deptOrder = ['速卖通一部', '速卖通二部'];

/**
 * 判断是否为合计行
 */
const isSummaryRow = (record) => {
  return record.dataType && (record.dataType === 'group' || record.dataType === 'dept' || record.dataType === 'all');
};

/**
 * 处理数据排序（不添加合计行，直接使用后端返回的合计数据）
 */
const processDataWithSummary = (data) => {
  if (!data || !data.length) return [];

  // 1. 深度拷贝数据
  const dataCopy = JSON.parse(JSON.stringify(data));

  // 2. 对数据进行排序
  return sortData(dataCopy);
};

/**
 * 数据排序 - 按照部门顺序排序
 */
const sortData = (data) => {
  return data.sort((a, b) => {
    // 按照预设的部门顺序排序
    const aIndex = deptOrder.indexOf(a.deptName);
    const bIndex = deptOrder.indexOf(b.deptName);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // 如果不在预设顺序中，按字母顺序排序
    return a.deptName.localeCompare(b.deptName);
  });
};

/**
 * 处理后的数据（直接使用后端返回的合计数据）
 */
const processedDataWithSummary = computed(() => {
  return processDataWithSummary(originalData.value);
});

// 工具函数
const isNumericColumn = (dataIndex) => {
  return numericColumns.value.includes(dataIndex);
};

const getSummaryColSpan = (record) => {
  if (record.dataType === 'group') return 4;
  if (record.dataType === 'dept') return 4;
  if (record.dataType === 'all') return 4;
  return 4;
};

const getSummaryLabel = (record) => {
  // console.log(record,11);
  if (record.dataType === 'group') return `${record.groupName}合计`;
  if (record.dataType === 'dept') return `${record.deptName}合计`;
  if (record.dataType === 'all') return '总合计';
  return '合计';
};

const formatSummaryValue = (field, value) => {
  if (value === undefined || value === null) return '';
  if (field.includes('Rate')) {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
  }
  return formatNumber(value);
};

const formatCellValue = (field, value) => {
  // console.log({field, value});
  
  if (value === undefined || value === null) return '';
  if (field.includes('Rate')) {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
  }
  if (isNumericColumn(field)) {
    return formatNumber(value);
  }
  return value;
};

const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '';
  const number = parseFloat(num);
  if (number === 0) return '0';
  return number.toLocaleString();
};

const formatRate = (rate) => {
  if (rate === undefined || rate === null) return '';
  return `${(parseFloat(rate) * 100).toFixed(2)}%`;
};

// 达成状态颜色判断
const getAchieveColor = (value) => {
  if (value === true || value === '是') return 'green';
  if (value === false || value === '否') return 'red';
  return 'default';
};

// 布尔值转中文显示
const formatAchieveText = (value) => {
  if (value === true) return '是';
  if (value === false) return '否';
  return value; // 如果已经是中文或其他值，直接返回
};

const getRateColor = (rate) => {
  if (rate === undefined || rate === null) return 'default';
  const numRate = parseFloat(rate) || 0;
  if (numRate >= 1) return 'green';
  if (numRate >= 0.9) return 'blue';
  if (numRate >= 0.8) return 'orange';
  return 'red';
};

// 查询
const onSubmit = () => {
  formData.pageNum = 1;
  formData.pageSize = 50;
}

const formHeightChange = (height) => {
  formHeight.value = height;
}

const getgoalCompletionReport = async () => {
  let params = {
    "dataYear": "2025",
    "dataMonth": "10",
  }
  // const res = await goalCompletionReport(params);
  // if (res.code === 200) {
  //   originalData.value = res.data || [];
  // }
  setTimeout(() => {
    originalData.value = [
      {
        "id": "6927ea3877c3a079d3c80e6c",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（一组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "杨贞",
        "gmvBaseTarget": 15,
        "gmvIncreaseTarget": 16,
        "gmvRealAchieve": 1639394.13,
        "gmvRealAchieveRate": 102462.133125,
        "isAchieve": true,
        "gmvChallengeTarget": 20,
        "gmvChallengeExceed": -1639374.13,
        "gmvChallengeAchieveRate": 81969.7065,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.95905799,
        "semiOrderCount": 11157,
        "semiGmvForecastEffect": -87.64834099,
        "theoryAchieve": 1639306.48165901,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.14499999,
        "profitRateTarget": 0.16333333,
        "realNetProfitRate": 0.12600149,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.13,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0.12600132,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600132,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e6e",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（三组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "张杨",
        "gmvBaseTarget": 14,
        "gmvIncreaseTarget": 15,
        "gmvRealAchieve": 1639394.28,
        "gmvRealAchieveRate": 109292.952,
        "isAchieve": true,
        "gmvChallengeTarget": 19,
        "gmvChallengeExceed": -1639375.28,
        "gmvChallengeAchieveRate": 86283.90947368,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.6876582,
        "semiOrderCount": 5594,
        "semiGmvForecastEffect": -43.79411599,
        "theoryAchieve": 1639350.48588401,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.17,
        "profitRateTarget": 0.21333335,
        "realNetProfitRate": 0.12600157,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.28,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0.12600157,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600157,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e70",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（二组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "李核函",
        "gmvBaseTarget": 12,
        "gmvIncreaseTarget": 13,
        "gmvRealAchieve": 1639394.25,
        "gmvRealAchieveRate": 126107.25,
        "isAchieve": true,
        "gmvChallengeTarget": 17,
        "gmvChallengeExceed": -1639377.25,
        "gmvChallengeAchieveRate": 96434.95588235,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 0,
        "semiOrderCount": 0,
        "semiGmvForecastEffect": 0,
        "theoryAchieve": 1639394.25,
        "popProfitRateTarget": 0.12,
        "semiProfitRateTarget": 0,
        "profitRateTarget": 0.18000001,
        "realNetProfitRate": 0.12600155,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.25,
        "popNetProfitRate": 0.12600155,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600155,
        "semiNetProfitRate": 0,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e76",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（三组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "雷金萍",
        "gmvBaseTarget": 18.5,
        "gmvIncreaseTarget": 19.5,
        "gmvRealAchieve": 1092929.53,
        "gmvRealAchieveRate": 56047.66820512,
        "isAchieve": true,
        "gmvChallengeTarget": 23.5,
        "gmvChallengeExceed": -1092906.03,
        "gmvChallengeAchieveRate": 46507.63957446,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.49596253,
        "semiOrderCount": 5605,
        "semiGmvForecastEffect": -43.77278699,
        "theoryAchieve": 1092885.75721301,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.13,
        "profitRateTarget": 0.22999998,
        "realNetProfitRate": 0.12600158,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1092929.53,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0.12600175,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600175,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e6b",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（一组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "刘欣欣",
        "gmvBaseTarget": 15.5,
        "gmvIncreaseTarget": 16.5,
        "gmvRealAchieve": 1639393.83,
        "gmvRealAchieveRate": 99357.20181818,
        "isAchieve": true,
        "gmvChallengeTarget": 20.5,
        "gmvChallengeExceed": -1639373.33,
        "gmvChallengeAchieveRate": 79970.4307317,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.96783793,
        "semiOrderCount": 5578,
        "semiGmvForecastEffect": -43.82513999,
        "theoryAchieve": 1639350.00486001,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.18,
        "profitRateTarget": 0.18,
        "realNetProfitRate": 0.12600133,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639393.83,
        "popNetProfitRate": 0.12600133,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600133,
        "semiNetProfitRate": 0.12600131,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600131,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e78",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（三组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "胡妹",
        "gmvBaseTarget": 19,
        "gmvIncreaseTarget": 20,
        "gmvRealAchieve": 1092929.55,
        "gmvRealAchieveRate": 54646.4775,
        "isAchieve": true,
        "gmvChallengeTarget": 24,
        "gmvChallengeExceed": -1092905.55,
        "gmvChallengeAchieveRate": 45538.73125,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 0,
        "semiOrderCount": 0,
        "semiGmvForecastEffect": 0,
        "theoryAchieve": 1092929.55,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0,
        "profitRateTarget": 0.155,
        "realNetProfitRate": 0.12600159,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1092929.55,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e6d",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（二组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "彭珍琪",
        "gmvBaseTarget": 17.5,
        "gmvIncreaseTarget": 18.5,
        "gmvRealAchieve": 1639393.596,
        "gmvRealAchieveRate": 88615.87005405,
        "isAchieve": true,
        "gmvChallengeTarget": 22.5,
        "gmvChallengeExceed": -1639371.096,
        "gmvChallengeAchieveRate": 72861.9376,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.71385695,
        "semiOrderCount": 11185,
        "semiGmvForecastEffect": -87.59404899,
        "theoryAchieve": 1639306.00195101,
        "popProfitRateTarget": 0.1,
        "semiProfitRateTarget": 0.20999999,
        "profitRateTarget": 0.17333335,
        "realNetProfitRate": 0.12600179,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639393.596,
        "popNetProfitRate": 0.12600227,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600227,
        "semiNetProfitRate": 0.12600155,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600155,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e77",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（二组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "罗晓搁",
        "gmvBaseTarget": 17,
        "gmvIncreaseTarget": 18,
        "gmvRealAchieve": 1639393.575,
        "gmvRealAchieveRate": 91077.42083333,
        "isAchieve": true,
        "gmvChallengeTarget": 22,
        "gmvChallengeExceed": -1639371.575,
        "gmvChallengeAchieveRate": 74517.88977272,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.18372843,
        "semiOrderCount": 5623,
        "semiGmvForecastEffect": -43.73779049,
        "theoryAchieve": 1639349.83720951,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.19,
        "profitRateTarget": 0.19666666,
        "realNetProfitRate": 0.12600177,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639393.575,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0.12600225,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600225,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e7d",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（三组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "吕杏花",
        "gmvBaseTarget": 19.5,
        "gmvIncreaseTarget": 20.5,
        "gmvRealAchieve": 1092929.57,
        "gmvRealAchieveRate": 53313.63756097,
        "isAchieve": true,
        "gmvChallengeTarget": 24.5,
        "gmvChallengeExceed": -1092905.07,
        "gmvChallengeAchieveRate": 44609.37020408,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.82754744,
        "semiOrderCount": 5586,
        "semiGmvForecastEffect": -43.80962799,
        "theoryAchieve": 1092885.76037201,
        "popProfitRateTarget": 0.1,
        "semiProfitRateTarget": 0.14,
        "profitRateTarget": 0.11999999,
        "realNetProfitRate": 0.12600161,
        "isProfitRateAchieve": true,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1092929.57,
        "popNetProfitRate": 0.12600178,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600178,
        "semiNetProfitRate": 0.12600144,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600144,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e75",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（三组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "赵妍",
        "gmvBaseTarget": 14,
        "gmvIncreaseTarget": 15,
        "gmvRealAchieve": 1639394.34,
        "gmvRealAchieveRate": 109292.956,
        "isAchieve": true,
        "gmvChallengeTarget": 19,
        "gmvChallengeExceed": -1639375.34,
        "gmvChallengeAchieveRate": 86283.91263157,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.83630382,
        "semiOrderCount": 11171,
        "semiGmvForecastEffect": -87.62119499,
        "theoryAchieve": 1639306.71880501,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.155,
        "profitRateTarget": 0.14666666,
        "realNetProfitRate": 0.1260016,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.34,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0.12600143,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600143,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e6f",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（一组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "袁梦",
        "gmvBaseTarget": 16.5,
        "gmvIncreaseTarget": 17.5,
        "gmvRealAchieve": 1639392.309,
        "gmvRealAchieveRate": 93679.56051428,
        "isAchieve": true,
        "gmvChallengeTarget": 21.5,
        "gmvChallengeExceed": -1639370.809,
        "gmvChallengeAchieveRate": 76250.80506976,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 0,
        "semiOrderCount": 0,
        "semiGmvForecastEffect": 0,
        "theoryAchieve": 1639392.309,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0,
        "profitRateTarget": 0.18,
        "realNetProfitRate": 0.12600221,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639392.309,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e7f",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（一组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "杨媛媛",
        "gmvBaseTarget": 16,
        "gmvIncreaseTarget": 17,
        "gmvRealAchieve": 1639394.07,
        "gmvRealAchieveRate": 96434.94529411,
        "isAchieve": true,
        "gmvChallengeTarget": 21,
        "gmvChallengeExceed": -1639373.07,
        "gmvChallengeAchieveRate": 78066.38428571,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.44381241,
        "semiOrderCount": 5608,
        "semiGmvForecastEffect": -43.76696999,
        "theoryAchieve": 1639350.30303001,
        "popProfitRateTarget": 0.12,
        "semiProfitRateTarget": 0.13,
        "profitRateTarget": 0.12333333,
        "realNetProfitRate": 0.12600146,
        "isProfitRateAchieve": true,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.07,
        "popNetProfitRate": 0.12600129,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600129,
        "semiNetProfitRate": 0.12600179,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600179,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e71",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（二组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "余安微",
        "gmvBaseTarget": 15,
        "gmvIncreaseTarget": 16,
        "gmvRealAchieve": 1639394.19,
        "gmvRealAchieveRate": 102462.136875,
        "isAchieve": true,
        "gmvChallengeTarget": 20,
        "gmvChallengeExceed": -1639374.19,
        "gmvChallengeAchieveRate": 81969.7095,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.74006975,
        "semiOrderCount": 11182,
        "semiGmvForecastEffect": -87.59986599,
        "theoryAchieve": 1639306.59013401,
        "popProfitRateTarget": 0.17,
        "semiProfitRateTarget": 0.205,
        "profitRateTarget": 0.19333333,
        "realNetProfitRate": 0.12600152,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.19,
        "popNetProfitRate": 0.12600152,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600152,
        "semiNetProfitRate": 0.12600152,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600152,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e73",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（一组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "华艳琴",
        "gmvBaseTarget": 10,
        "gmvIncreaseTarget": 11,
        "gmvRealAchieve": 1639394.1,
        "gmvRealAchieveRate": 149035.82727272,
        "isAchieve": true,
        "gmvChallengeTarget": 15,
        "gmvChallengeExceed": -1639379.1,
        "gmvChallengeAchieveRate": 109292.94,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 0,
        "semiOrderCount": 0,
        "semiGmvForecastEffect": 0,
        "theoryAchieve": 1639394.1,
        "popProfitRateTarget": 0.12,
        "semiProfitRateTarget": 0,
        "profitRateTarget": 0.14666667,
        "realNetProfitRate": 0.12600147,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.1,
        "popNetProfitRate": 0.12600114,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600114,
        "semiNetProfitRate": 0,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e7b",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（三组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "闵红艳",
        "gmvBaseTarget": 14.5,
        "gmvIncreaseTarget": 15.5,
        "gmvRealAchieve": 1639393.47,
        "gmvRealAchieveRate": 105767.32064516,
        "isAchieve": true,
        "gmvChallengeTarget": 19.5,
        "gmvChallengeExceed": -1639373.97,
        "gmvChallengeAchieveRate": 84071.46,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.27022071,
        "semiOrderCount": 5618,
        "semiGmvForecastEffect": -43.74748999,
        "theoryAchieve": 1639349.72251001,
        "popProfitRateTarget": 0.21,
        "semiProfitRateTarget": 0.14,
        "profitRateTarget": 0.16666668,
        "realNetProfitRate": 0.12600169,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639393.47,
        "popNetProfitRate": 0.12600162,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600162,
        "semiNetProfitRate": 0.12600216,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600216,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e7a",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（一组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "傅雪静",
        "gmvBaseTarget": 13,
        "gmvIncreaseTarget": 14,
        "gmvRealAchieve": 1639394.16,
        "gmvRealAchieveRate": 117099.58285714,
        "isAchieve": true,
        "gmvChallengeTarget": 18,
        "gmvChallengeExceed": -1639376.16,
        "gmvChallengeAchieveRate": 91077.45333333,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.39171805,
        "semiOrderCount": 5611,
        "semiGmvForecastEffect": -43.76115299,
        "theoryAchieve": 1639350.39884701,
        "popProfitRateTarget": 0.15,
        "semiProfitRateTarget": 0.21,
        "profitRateTarget": 0.16666667,
        "realNetProfitRate": 0.12600151,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.16,
        "popNetProfitRate": 0.12600151,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600151,
        "semiNetProfitRate": 0.12600184,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600184,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e7e",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（二组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "黄慧珍",
        "gmvBaseTarget": 18,
        "gmvIncreaseTarget": 19,
        "gmvRealAchieve": 1639393.617,
        "gmvRealAchieveRate": 86283.87457894,
        "isAchieve": true,
        "gmvChallengeTarget": 23,
        "gmvChallengeExceed": -1639370.617,
        "gmvChallengeAchieveRate": 71277.98334782,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.88010926,
        "semiOrderCount": 5583,
        "semiGmvForecastEffect": -43.81544499,
        "theoryAchieve": 1639349.80155501,
        "popProfitRateTarget": 0.1,
        "semiProfitRateTarget": 0.28,
        "profitRateTarget": 0.17999999,
        "realNetProfitRate": 0.1260018,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639393.617,
        "popNetProfitRate": 0.12600173,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600173,
        "semiNetProfitRate": 0.12600139,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600139,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e74",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（一组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "沈梦雨",
        "gmvBaseTarget": 16,
        "gmvIncreaseTarget": 17,
        "gmvRealAchieve": 1639394.46,
        "gmvRealAchieveRate": 96434.96823529,
        "isAchieve": true,
        "gmvChallengeTarget": 21,
        "gmvChallengeExceed": -1639373.46,
        "gmvChallengeAchieveRate": 78066.40285714,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.59171622,
        "semiOrderCount": 11199,
        "semiGmvForecastEffect": -87.56690299,
        "theoryAchieve": 1639306.89309701,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.29,
        "profitRateTarget": 0.29,
        "realNetProfitRate": 0.12600167,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.46,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0.12600166,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600166,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e72",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（三组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "刘梦丽",
        "gmvBaseTarget": 13,
        "gmvIncreaseTarget": 14,
        "gmvRealAchieve": 1639394.31,
        "gmvRealAchieveRate": 117099.59357142,
        "isAchieve": true,
        "gmvChallengeTarget": 18,
        "gmvChallengeExceed": -1639376.31,
        "gmvChallengeAchieveRate": 91077.46166666,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.3050178,
        "semiOrderCount": 5616,
        "semiGmvForecastEffect": -43.75145799,
        "theoryAchieve": 1639350.55854201,
        "popProfitRateTarget": 0.17,
        "semiProfitRateTarget": 0.31,
        "profitRateTarget": 0.22000001,
        "realNetProfitRate": 0.12600159,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.31,
        "popNetProfitRate": 0.12600159,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600159,
        "semiNetProfitRate": 0.12600192,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600192,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e79",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（二组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "杨媛媛(代)",
        "gmvBaseTarget": 13,
        "gmvIncreaseTarget": 14,
        "gmvRealAchieve": 1639394.22,
        "gmvRealAchieveRate": 117099.58714285,
        "isAchieve": true,
        "gmvChallengeTarget": 18,
        "gmvChallengeExceed": -1639376.22,
        "gmvChallengeAchieveRate": 91077.45666666,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.53946363,
        "semiOrderCount": 11205,
        "semiGmvForecastEffect": -87.55526899,
        "theoryAchieve": 1639306.66473101,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.18000001,
        "profitRateTarget": 0.17666667,
        "realNetProfitRate": 0.12600154,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639394.22,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0.12600171,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600171,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e7c",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（三组）",
        "category": null,
        "dataType": "operator",
        "shopUserName": "王泽佳",
        "gmvBaseTarget": 15,
        "gmvIncreaseTarget": 16,
        "gmvRealAchieve": 1639393.491,
        "gmvRealAchieveRate": 102462.0931875,
        "isAchieve": true,
        "gmvChallengeTarget": 20,
        "gmvChallengeExceed": -1639373.491,
        "gmvChallengeAchieveRate": 81969.67455,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.43504511,
        "semiOrderCount": 11217,
        "semiGmvForecastEffect": -87.53191009,
        "theoryAchieve": 1639305.95908991,
        "popProfitRateTarget": 0,
        "semiProfitRateTarget": 0.20000002,
        "profitRateTarget": 0.19333334,
        "realNetProfitRate": 0.1260017,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 1639393.491,
        "popNetProfitRate": 0,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0,
        "semiNetProfitRate": 0.12600191,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600191,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e83",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（三组）",
        "category": null,
        "dataType": "group",
        "shopUserName": "张杨,刘梦丽,赵妍,闵红艳,王泽佳",
        "gmvBaseTarget": 70.5,
        "gmvIncreaseTarget": 75.5,
        "gmvRealAchieve": 8196969.891,
        "gmvRealAchieveRate": 108569.13762913,
        "isAchieve": true,
        "gmvChallengeTarget": 95.5,
        "gmvChallengeExceed": -8196874.391,
        "gmvChallengeAchieveRate": 85832.14545549,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.54314797,
        "semiOrderCount": 39216,
        "semiGmvForecastEffect": -306.44616907,
        "theoryAchieve": 8196663.44483093,
        "popProfitRateTarget": 0.19,
        "semiProfitRateTarget": 0.19000002,
        "profitRateTarget": 0.18800001,
        "realNetProfitRate": 0.12600163,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 8196969.891,
        "popNetProfitRate": 0.1260016,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.1260016,
        "semiNetProfitRate": 0.12600176,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600176,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e80",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（一组）",
        "category": null,
        "dataType": "group",
        "shopUserName": "刘欣欣,袁梦,沈梦雨",
        "gmvBaseTarget": 48,
        "gmvIncreaseTarget": 51,
        "gmvRealAchieve": 4918180.599,
        "gmvRealAchieveRate": 96434.91370588,
        "isAchieve": true,
        "gmvChallengeTarget": 63,
        "gmvChallengeExceed": -4918117.599,
        "gmvChallengeAchieveRate": 78066.35871428,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.71676879,
        "semiOrderCount": 16777,
        "semiGmvForecastEffect": -131.39204299,
        "theoryAchieve": 4918049.20695701,
        "popProfitRateTarget": 0.19,
        "semiProfitRateTarget": 0.24666667,
        "profitRateTarget": 0.21888891,
        "realNetProfitRate": 0.12600174,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 4918180.599,
        "popNetProfitRate": 0.12600133,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600133,
        "semiNetProfitRate": 0.12600154,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600154,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e84",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（二组）",
        "category": null,
        "dataType": "group",
        "shopUserName": "李核函,余安微,杨媛媛(代)",
        "gmvBaseTarget": 40,
        "gmvIncreaseTarget": 43,
        "gmvRealAchieve": 4918182.66,
        "gmvRealAchieveRate": 114376.34093023,
        "isAchieve": true,
        "gmvChallengeTarget": 55,
        "gmvChallengeExceed": -4918127.66,
        "gmvChallengeAchieveRate": 89421.50290909,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.63966364,
        "semiOrderCount": 22387,
        "semiGmvForecastEffect": -175.15513499,
        "theoryAchieve": 4918007.50486501,
        "popProfitRateTarget": 0.14499999,
        "semiProfitRateTarget": 0.1925,
        "profitRateTarget": 0.18333334,
        "realNetProfitRate": 0.12600154,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 4918182.66,
        "popNetProfitRate": 0.12600154,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600154,
        "semiNetProfitRate": 0.12600161,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600161,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e85",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（三组）",
        "category": null,
        "dataType": "group",
        "shopUserName": "雷金萍,胡妹,吕杏花",
        "gmvBaseTarget": 57,
        "gmvIncreaseTarget": 60,
        "gmvRealAchieve": 3278788.65,
        "gmvRealAchieveRate": 54646.4775,
        "isAchieve": true,
        "gmvChallengeTarget": 72,
        "gmvChallengeExceed": -3278716.65,
        "gmvChallengeAchieveRate": 45538.73125,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.6614735,
        "semiOrderCount": 11191,
        "semiGmvForecastEffect": -87.58241499,
        "theoryAchieve": 3278701.06758501,
        "popProfitRateTarget": 0.1,
        "semiProfitRateTarget": 0.13499999,
        "profitRateTarget": 0.16833332,
        "realNetProfitRate": 0.12600159,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 3278788.65,
        "popNetProfitRate": 0.12600178,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600178,
        "semiNetProfitRate": 0.12600159,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600159,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e82",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（二组）",
        "category": null,
        "dataType": "group",
        "shopUserName": "彭珍琪,罗晓搁,黄慧珍",
        "gmvBaseTarget": 52.5,
        "gmvIncreaseTarget": 55.5,
        "gmvRealAchieve": 4918180.788,
        "gmvRealAchieveRate": 88615.87005405,
        "isAchieve": true,
        "gmvChallengeTarget": 67.5,
        "gmvChallengeExceed": -4918113.288,
        "gmvChallengeAchieveRate": 72861.9376,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.62218056,
        "semiOrderCount": 22391,
        "semiGmvForecastEffect": -175.14728449,
        "theoryAchieve": 4918005.64071551,
        "popProfitRateTarget": 0.1,
        "semiProfitRateTarget": 0.2225,
        "profitRateTarget": 0.18333333,
        "realNetProfitRate": 0.12600179,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 4918180.788,
        "popNetProfitRate": 0.126002,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.126002,
        "semiNetProfitRate": 0.12600168,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600168,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e81",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（一组）",
        "category": null,
        "dataType": "group",
        "shopUserName": "杨贞,华艳琴,傅雪静,杨媛媛",
        "gmvBaseTarget": 54,
        "gmvIncreaseTarget": 58,
        "gmvRealAchieve": 6557576.46,
        "gmvRealAchieveRate": 113061.66310344,
        "isAchieve": true,
        "gmvChallengeTarget": 74,
        "gmvChallengeExceed": -6557502.46,
        "gmvChallengeAchieveRate": 88615.8981081,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.6876582,
        "semiOrderCount": 22376,
        "semiGmvForecastEffect": -175.17646398,
        "theoryAchieve": 6557401.28353602,
        "popProfitRateTarget": 0.1275,
        "semiProfitRateTarget": 0.1575,
        "profitRateTarget": 0.15,
        "realNetProfitRate": 0.12600148,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 6557576.46,
        "popNetProfitRate": 0.12600131,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600131,
        "semiNetProfitRate": 0.12600157,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600157,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e86",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部",
        "groupName": "速卖通二部（一组）,速卖通二部（二组）,速卖通二部（三组）",
        "category": null,
        "dataType": "dept",
        "shopUserName": "刘欣欣,彭珍琪,袁梦,沈梦雨,雷金萍,罗晓搁,胡妹,吕杏花,黄慧珍",
        "gmvBaseTarget": 157.5,
        "gmvIncreaseTarget": 166.5,
        "gmvRealAchieve": 13115150.037,
        "gmvRealAchieveRate": 78769.66989189,
        "isAchieve": true,
        "gmvChallengeTarget": 202.5,
        "gmvChallengeExceed": -13114947.537,
        "gmvChallengeAchieveRate": 64766.17302222,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.66242429,
        "semiOrderCount": 50359,
        "semiGmvForecastEffect": -394.12174248,
        "theoryAchieve": 13114755.91525752,
        "popProfitRateTarget": 0.12249999,
        "semiProfitRateTarget": 0.21111111,
        "profitRateTarget": 0.19291667,
        "realNetProfitRate": 0.12600172,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 13115150.037,
        "popNetProfitRate": 0.12600178,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600178,
        "semiNetProfitRate": 0.12600162,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600162,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e87",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通一部",
        "groupName": "速卖通一部（一组）,速卖通一部（三组）,速卖通一部（二组）",
        "category": null,
        "dataType": "dept",
        "shopUserName": "杨贞,张杨,李核函,余安微,刘梦丽,华艳琴,赵妍,杨媛媛(代),傅雪静,闵红艳,王泽佳,杨媛媛",
        "gmvBaseTarget": 164.5,
        "gmvIncreaseTarget": 176.5,
        "gmvRealAchieve": 19672729.011,
        "gmvRealAchieveRate": 111460.22102549,
        "isAchieve": true,
        "gmvChallengeTarget": 224.5,
        "gmvChallengeExceed": -19672504.511,
        "gmvChallengeAchieveRate": 87629.08245434,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.60738138,
        "semiOrderCount": 83979,
        "semiGmvForecastEffect": -656.77776809,
        "theoryAchieve": 19672072.23323191,
        "popProfitRateTarget": 0.1475,
        "semiProfitRateTarget": 0.18200001,
        "profitRateTarget": 0.17416667,
        "realNetProfitRate": 0.12600156,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 19672729.011,
        "popNetProfitRate": 0.12600144,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600144,
        "semiNetProfitRate": 0.12600167,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600167,
        "remark": null
      },
      {
        "id": "6927ea3877c3a079d3c80e88",
        "dataYear": "2025",
        "dataMonth": "10",
        "serialNumber": "202510-16",
        "deptName": "速卖通二部,速卖通一部",
        "groupName": "速卖通二部（一组）,速卖通一部（一组）,速卖通二部（二组）,速卖通一部（三组）,速卖通一部（二组）,速卖通二部（三组）",
        "category": null,
        "dataType": "all",
        "shopUserName": "刘欣欣,杨贞,彭珍琪,张杨,袁梦,李核函,余安微,刘梦丽,华艳琴,沈梦雨,赵妍,雷金萍,罗晓搁,胡妹,杨媛媛(代),傅雪静,闵红艳,王泽佳,吕杏花,黄慧珍,杨媛媛",
        "gmvBaseTarget": 322,
        "gmvIncreaseTarget": 343,
        "gmvRealAchieve": 32787879.048,
        "gmvRealAchieveRate": 95591.48410495,
        "isAchieve": true,
        "gmvChallengeTarget": 427,
        "gmvChallengeExceed": -32787452.048,
        "gmvChallengeAchieveRate": 76786.60198594,
        "isChallengeAchieve": true,
        "semiAvgOrderValue": 97.6280152,
        "semiOrderCount": 134338,
        "semiGmvForecastEffect": -1050.89951059,
        "theoryAchieve": 32786828.14848941,
        "popProfitRateTarget": 0.13916667,
        "semiProfitRateTarget": 0.19291667,
        "profitRateTarget": 0.18166667,
        "realNetProfitRate": 0.12600162,
        "isProfitRateAchieve": false,
        "lastMonthGmv": 0,
        "currentMonthGmvIncr": 32787879.048,
        "popNetProfitRate": 0.12600155,
        "lastMonthPopNetProfitRate": 0,
        "popNetProfitRateIncr": 0.12600155,
        "semiNetProfitRate": 0.12600165,
        "lastMonthSemiNetProfitRate": 0,
        "semiNetProfitRateIncr": 0.12600165,
        "remark": null
      }
    ];
  }, 300);
}

// 导出
const exportReport = async () => {
  let params = {
    "dataYear": "2025",
    "dataMonth": "10",
  }
  exportLoading.value = true;
  // goalCompletionReportExport(params).then((res) => {
  //   if (res.code === 200) {
  //     download.name(res.data);
  //     message.success(res.msg)
  //   }
  // }).finally(() => {
  // });
  exportLoading.value = false;

}

// 加载数据
onMounted(() => { getgoalCompletionReport(); });
</script>

<style scoped></style>