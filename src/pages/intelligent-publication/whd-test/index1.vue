<template>
  <div id="publication_sequence" class="publication_sequence">
    <appTableBox :reset-set-menu="'segsdfsd'" :data-source="originalData" :table-header="goalCompletion_header">
      <template #bodyCell="{ column: { key, dataIndex }, record: row }">
        <!-- <template v-if="dataIndex === 'reportDate'">{{ row.reportDate }}{{ '5555' }}</template>
        <template v-if="key === 'otherBusinessIncome'">
          <a-tag v-if="(row[key] / 1000) % 6 === 1" color="success">
            success
          </a-tag>
          <a-tag v-if="(row[key] / 1000) % 6 === 2" color="processing">
            processing
          </a-tag>
          <a-tag v-if="(row[key] / 1000) % 6 === 3" color="error">
            error
          </a-tag>
          <a-tag v-if="(row[key] / 1000) % 6 === 4" color="warning">
            warning
          </a-tag>
          <a-tag v-if="(row[key] / 1000) % 6 === 0" color="default">
            default
          </a-tag>
        </template> -->
        <!-- <template v-if="dataIndex === 'deptName'">{{ row }}</template> -->
      </template>
    </appTableBox>
  </div>
</template>

<script setup>
import test from './test.vue';
// const appModal = () => import('~/components/common/appModal.vue');
// const appTableBox = () => import('~/components/common/appTableBox.vue');
// const appTablePagination = () => import('~/components/common/appTablePagination.vue');
// const appTableForm = () => import('~/components/common/appTableForm.vue');
import appModal from '~/components/common/appModal.vue';
import appTableBox from '~/components/common/appTableBox.vue';
import appTablePagination from '~@/components/common/appTablePagination.vue';
import appTableForm from '~@/components/common/appTableForm.vue';
import { v4 as uuidv4 } from 'uuid';
import header from '~@/pages/ozon/common/existingProducts/js/header';
defineOptions({ name: 'publication_sequence' });
const { proxy: _this } = getCurrentInstance();

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
];
const originalData = [
  {
    "id": "692565aae466b57498dcb924",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通一部",
    "groupName": "速卖通一部（一组）",
    "category": null,
    "dataType": "dict_operator",
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
    "semiAvgOrderValue": 0,
    "semiOrderCount": 0,
    "semiGmvForecastEffect": 0,
    "theoryAchieve": 1639394.07,
    "popProfitRateTarget": 0.1,
    "semiProfitRateTarget": 0,
    "profitRateTarget": 0.03333332,
    "realNetProfitRate": 0.12600146,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 1639394.07,
    "popNetProfitRate": 0.12600112,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0.12600112,
    "semiNetProfitRate": 0,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0
  },
  {
    "id": "692565aae466b57498dcb911",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通一部",
    "groupName": "速卖通一部（一组）",
    "category": null,
    "dataType": "dict_operator",
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
    "semiAvgOrderValue": 98.16139572,
    "semiOrderCount": 5567,
    "semiGmvForecastEffect": -43.84646899,
    "theoryAchieve": 1639350.25353101,
    "popProfitRateTarget": 0,
    "semiProfitRateTarget": 0.13,
    "profitRateTarget": 0.04333331,
    "realNetProfitRate": 0.12600147,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 1639394.1,
    "popNetProfitRate": 0,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0,
    "semiNetProfitRate": 0.12600114,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0.12600114
  },
  {
    "id": "692565aae466b57498dcb926",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通一部",
    "groupName": "速卖通一部（一组）",
    "category": null,
    "dataType": "dict_group",
    "shopUserName": "华艳琴,傅雪静,杨贞,杨媛媛",
    "gmvBaseTarget": 54,
    "gmvIncreaseTarget": 58,
    "gmvRealAchieve": 6557576.46,
    "gmvRealAchieveRate": 113061.66310344,
    "isAchieve": true,
    "gmvChallengeTarget": 74,
    "gmvChallengeExceed": -6557502.46,
    "gmvChallengeAchieveRate": 88615.8981081,
    "isChallengeAchieve": true,
    "semiAvgOrderValue": 98.15258105,
    "semiOrderCount": 11135,
    "semiGmvForecastEffect": -87.69099899,
    "theoryAchieve": 6557488.76900101,
    "popProfitRateTarget": 0.1,
    "semiProfitRateTarget": 0.145,
    "profitRateTarget": 0.04333331,
    "realNetProfitRate": 0.12600148,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 6557576.46,
    "popNetProfitRate": 0.12600112,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0.12600112,
    "semiNetProfitRate": 0.12600115,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0.12600115
  },
  {
    "id": "692565aae466b57498dcb912",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通一部",
    "groupName": "速卖通一部（三组）",
    "category": null,
    "dataType": "dict_operator",
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
    "semiAvgOrderValue": 0,
    "semiOrderCount": 0,
    "semiGmvForecastEffect": 0,
    "theoryAchieve": 1639394.28,
    "popProfitRateTarget": 0,
    "semiProfitRateTarget": 0,
    "profitRateTarget": 0,
    "realNetProfitRate": 0.12600157,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 1639394.28,
    "popNetProfitRate": 0,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0,
    "semiNetProfitRate": 0,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0
  },
  {
    "id": "692565aae466b57498dcb91c",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通一部",
    "groupName": "速卖通一部（三组）",
    "category": null,
    "dataType": "dict_operator",
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
    "semiAvgOrderValue": 0,
    "semiOrderCount": 0,
    "semiGmvForecastEffect": 0,
    "theoryAchieve": 1639393.491,
    "popProfitRateTarget": 0,
    "semiProfitRateTarget": 0,
    "profitRateTarget": 0,
    "realNetProfitRate": 0.1260017,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 1639393.491,
    "popNetProfitRate": 0,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0,
    "semiNetProfitRate": 0,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0
  },
  {
    "id": "692565aae466b57498dcb927",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通一部",
    "groupName": "速卖通一部（三组）",
    "category": null,
    "dataType": "dict_group",
    "shopUserName": "张杨,赵妍,王泽佳,闵红艳,刘梦丽",
    "gmvBaseTarget": 70.5,
    "gmvIncreaseTarget": 75.5,
    "gmvRealAchieve": 8196969.891,
    "gmvRealAchieveRate": 108569.13762913,
    "isAchieve": true,
    "gmvChallengeTarget": 95.5,
    "gmvChallengeExceed": -8196874.391,
    "gmvChallengeAchieveRate": 85832.14545549,
    "isChallengeAchieve": true,
    "semiAvgOrderValue": 0,
    "semiOrderCount": 0,
    "semiGmvForecastEffect": 0,
    "theoryAchieve": 8196969.891,
    "popProfitRateTarget": 0,
    "semiProfitRateTarget": 0,
    "profitRateTarget": 0,
    "realNetProfitRate": 0.12600163,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 8196969.891,
    "popNetProfitRate": 0,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0,
    "semiNetProfitRate": 0,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0
  },
  {
    "id": "692565aae466b57498dcb92c",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通一部",
    "groupName": "速卖通一部（一组）,速卖通一部（三组）,速卖通一部（二组）,速卖通一部（三组）,速卖通一部（二组）,速卖通一部（一组）,速卖通一部（三组）,速卖通一部（一组）,速卖通一部（三组）,速卖通一部（三组）,速卖通一部（一组）,速卖通一部（二组）",
    "category": null,
    "dataType": "dict_department",
    "shopUserName": "华艳琴,张杨,余安微,赵妍,李核函,傅雪静,王泽佳,杨贞,闵红艳,刘梦丽,杨媛媛,杨媛媛(代)",
    "gmvBaseTarget": 164.5,
    "gmvIncreaseTarget": 176.5,
    "gmvRealAchieve": 19672729.011,
    "gmvRealAchieveRate": 111460.22102549,
    "isAchieve": true,
    "gmvChallengeTarget": 224.5,
    "gmvChallengeExceed": -19672504.511,
    "gmvChallengeAchieveRate": 87629.08245434,
    "isChallengeAchieve": true,
    "semiAvgOrderValue": 98.15258105,
    "semiOrderCount": 11135,
    "semiGmvForecastEffect": -87.69099899,
    "theoryAchieve": 19672641.32000101,
    "popProfitRateTarget": 0.1,
    "semiProfitRateTarget": 0.145,
    "profitRateTarget": 0.02055554,
    "realNetProfitRate": 0.12600156,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 19672729.011,
    "popNetProfitRate": 0.12600112,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0.12600112,
    "semiNetProfitRate": 0.12600115,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0.12600115
  },
  {
    "id": "692565aae466b57498dcb915",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通二部",
    "groupName": "速卖通二部（一组）",
    "category": null,
    "dataType": "dict_operator",
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
    "profitRateTarget": 0,
    "realNetProfitRate": 0.12600221,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 1639392.309,
    "popNetProfitRate": 0,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0,
    "semiNetProfitRate": 0,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0
  },
  {
    "id": "692565aae466b57498dcb91a",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通二部",
    "groupName": "速卖通二部（一组）",
    "category": null,
    "dataType": "dict_operator",
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
    "semiAvgOrderValue": 0,
    "semiOrderCount": 0,
    "semiGmvForecastEffect": 0,
    "theoryAchieve": 1639393.83,
    "popProfitRateTarget": 0,
    "semiProfitRateTarget": 0,
    "profitRateTarget": 0,
    "realNetProfitRate": 0.12600133,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 1639393.83,
    "popNetProfitRate": 0,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0,
    "semiNetProfitRate": 0,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0
  },
  {
    "id": "692565aae466b57498dcb92a",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通二部",
    "groupName": "速卖通二部（一组）",
    "category": null,
    "dataType": "dict_group",
    "shopUserName": "袁梦,刘欣欣,沈梦雨",
    "gmvBaseTarget": 48,
    "gmvIncreaseTarget": 51,
    "gmvRealAchieve": 4918180.599,
    "gmvRealAchieveRate": 96434.91370588,
    "isAchieve": true,
    "gmvChallengeTarget": 63,
    "gmvChallengeExceed": -4918117.599,
    "gmvChallengeAchieveRate": 78066.35871428,
    "isChallengeAchieve": true,
    "semiAvgOrderValue": 0,
    "semiOrderCount": 0,
    "semiGmvForecastEffect": 0,
    "theoryAchieve": 4918180.599,
    "popProfitRateTarget": 0,
    "semiProfitRateTarget": 0,
    "profitRateTarget": 0,
    "realNetProfitRate": 0.12600174,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 4918180.599,
    "popNetProfitRate": 0,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0,
    "semiNetProfitRate": 0,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0
  },
  {
    "id": "692565aae466b57498dcb92d",
    "dataYear": "2025",
    "dataMonth": "10",
    "serialNumber": "202510-04",
    "deptName": "速卖通二部",
    "groupName": "速卖通二部（三组）,速卖通二部（一组）,速卖通二部（二组）,速卖通二部（二组）,速卖通二部（一组）,速卖通二部（三组）,速卖通二部（三组）,速卖通二部（二组）,速卖通二部（一组）",
    "category": null,
    "dataType": "dict_department",
    "shopUserName": "胡妹,袁梦,彭珍琪,罗晓搁,刘欣欣,吕杏花,雷金萍,黄慧珍,沈梦雨",
    "gmvBaseTarget": 157.5,
    "gmvIncreaseTarget": 166.5,
    "gmvRealAchieve": 13115150.037,
    "gmvRealAchieveRate": 78769.66989189,
    "isAchieve": true,
    "gmvChallengeTarget": 202.5,
    "gmvChallengeExceed": -13114947.537,
    "gmvChallengeAchieveRate": 64766.17302222,
    "isChallengeAchieve": true,
    "semiAvgOrderValue": 0,
    "semiOrderCount": 0,
    "semiGmvForecastEffect": 0,
    "theoryAchieve": 13115150.037,
    "popProfitRateTarget": 0,
    "semiProfitRateTarget": 0,
    "profitRateTarget": 0,
    "realNetProfitRate": 0.12600172,
    "isProfitRateAchieve": true,
    "lastMonthGmv": 0,
    "currentMonthGmvIncr": 13115150.037,
    "popNetProfitRate": 0,
    "lastMonthPopNetProfitRate": 0,
    "popNetProfitRateIncr": 0,
    "semiNetProfitRate": 0,
    "lastMonthSemiNetProfitRate": 0,
    "semiNetProfitRateIncr": 0
  }
];

</script>

<style lang="less" scoped>
.publication_sequence {
  text-align: left;
}
</style>
