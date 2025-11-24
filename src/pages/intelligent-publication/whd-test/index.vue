<template>
  <div id="publication_sequence" class="publication_sequence">
    <!-- <test></test> -->
    <appTableForm 
      v-model:formData="formData" 
      @formHeightChange="formHeightChange"
      reset-set-menu="whdTestHeader" 
      :mini="true"
      :rules="rules"
      @onSubmit="onSubmit"
    >
      <template #formItemBox>
        <a-form-item 
          label="sdgsd" 
          name="categoryId"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input v-model:value="formData.categoryId" placeholder="商品名"></a-input>
        </a-form-item>
        <a-form-item label="半托管JIT利润率目标">
          <a-input v-model:value="formData.tradeName" placeholder="商品名"></a-input>
        </a-form-item>
        <a-form-item label="红烧冬瓜梵蒂冈梵冈" name="asdgasdfasd">
          <a-form-item-rest>
            <div style="display: flex;">
              <a-checkbox v-model:checked="formData.rrrr">Checkbox</a-checkbox>
            </div>
          </a-form-item-rest>
        </a-form-item>
        <a-form-item 
          label="sadggfasd" 
          name="afhgsdgfasd"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input v-model:value="formData.afhgsdgfasd" placeholder="商品名"></a-input>
        </a-form-item>
        <a-form-item label="模糊查找" name="asdfasdfasd">
          <a-input v-model:value="formData.asdfasdfasd" placeholder="商品名"></a-input>
        </a-form-item>
        <a-form-item label="是大法官" name="dfgjfdghsdfg">
          <a-date-picker v-model:value="formData.productName" />
        </a-form-item>
        <a-form-item label="sfdgdfsg" name="asdfasdf">
          <a-radio-group v-model:value="formData.asdfasdf" name="radioGroup">
            <a-radio value="1">A</a-radio>
            <a-radio value="2">B</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="煽风点火对手方" name="sadgasdgsdagf">
          <a-range-picker v-model:value="formData.ccc" />
        </a-form-item>
        <a-form-item label="十色调个手" name="dfgdsfg">
          <a-switch v-model:checked="formData.rrfghjgfhjrr" />
        </a-form-item>
        <a-form-item label="十色调个手" name="asdgasdgasd">
          <a-form-item-rest>
            <div flex gap-10px style="width: 400px">
              <a-input v-model:value="formData.productName" placeholder="商品名"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
            </div>
          </a-form-item-rest>
        </a-form-item>
        <a-form-item label="十多个十多个" name="asdfgasdgfas">
          <!-- <a-select v-model:value="formData.ddd">
            <a-select-option value="demo">ERG</a-select-option>
            <a-select-option value="demo">哈哈aSDFASDGASDGASDGASDGASDFGSDAFGSDFHDSFHFSGFDGJFG</a-select-option>
            <a-select-option value="demo">哈DFHBDF 哈</a-select-option>
            <a-select-option value="demo">DFG哈哈</a-select-option>
            <a-select-option value="demo">哈哈</a-select-option>
          </a-select> -->
          <a-select
            v-model:value="formData.ddd"
            :options="options"
            mode="multiple"
            allowClear
            placeholder="Please select"
            @popupScroll="popupScroll"
          ></a-select>
        </a-form-item>
      </template>
      <template #formItemRow>
        <a-form-item label="豆腐干豆腐" name="asdfasdfaseed">
          <!-- <a-cascader 
            placeholder="产品分类" 
            allowClear 
            style="width: 400px;"
            v-model:value="formData.tradeName" 
            :options="[]"
            :allow-clear="true" 
            :field-names="{ value: 'descriptionCategoryId', label: 'categoryName', children: 'children' }" 
          /> -->
          <a-cascader v-model:value="formData.tradeName" :options="options1" placeholder="Please select" />
        </a-form-item>
        <a-form-item label="半托管JIT东方率目标" name="asdfsadf">
          <a-form-item-rest>
            <div flex gap-10px style="width: 600px">
              <a-input v-model:value="formData.productName" placeholder="商品名"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
            </div>
          </a-form-item-rest>
        </a-form-item>
        <a-form-item label="红烧冬瓜梵蒂冈梵冈" name="asdfgsadf">
          <a-form-item-rest>
            <div style="display: flex;">
              <a-checkbox v-model:checked="formData.rrrr">Checkbox</a-checkbox>
              <a-checkbox v-model:checked="formData.rrrr">Checkbox</a-checkbox>
              <a-checkbox v-model:checked="formData.rrrr">Checkbox</a-checkbox>
              <a-checkbox v-model:checked="formData.rrrr">Checkbox</a-checkbox>
              <a-checkbox v-model:checked="formData.rrrr">Checkbox</a-checkbox>
            </div>
          </a-form-item-rest>
        </a-form-item>
        <a-form-item label="半托管JIT东方率目标" name="sdfhdsfg">
          <a-form-item-rest>
            <div flex gap-10px style="width: 600px">
              <a-input v-model:value="formData.skuCode" placeholder="商品名"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
              <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
            </div>
          </a-form-item-rest>
        </a-form-item>
      </template>
    </appTableForm>
    <app-table-box 
      v-model:filter-columns="columns" 
      :data-source="tableData.data"
      :table-header="tableData.header" 
      reset-set-menu="whdTestHeader" 
      rowKey="rowKey"
      :row-selection="{ selectedRowKeys: tableData.selectedRowKeys, onChange: onSelectChange }" 
      @change="tableChange"
      :customRow="customRow"
      :scroll="{x: 1, y: false}"
    >
      <template #leftTool>
        <a-button type="primary" @click="openModal">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <!-- <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button> -->
      </template>
      <template #rightTool>
        <a-button type="primary">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
        <a-button type="primary">Primary Button</a-button>
      </template>
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>56456464 Name</span>
        </template>
      </template>
      <template #bodyCell="{ column: { key }, record: row }">
        <template v-if="key === 'name'">{{ row.name }}{{ '5555' }}</template>
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
        </template>
      </template>
      <!-- <template #options>
        <a-button type="primary" @click="openModal">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
      </template> -->
      <template #summary>
        <a-table-summary :fixed="'bottom'">
          <a-table-summary-row>
            <a-table-summary-cell>{{ '合计' }}</a-table-summary-cell>
            <!-- <a-table-summary-cell></a-table-summary-cell> -->
            <a-table-summary-cell align="right" v-for="item in tableData.filterColumns.filter(i => i.show)"
              :key="item.key">
              {{ dataTotal && dataTotal[item.key] }}
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
      <!-- <template #expandedRowRender="{ record: row }">
        {{ row.rowKey }}
      </template> -->

      <template #pagination>
        <!-- <a-pagination
          v-model:current="current1"
          show-quick-jumper
          :total="500"
          @change="onChange"
        /> -->
        <appTablePagination 
          @pageNumChange="pageNumChange" 
          @pageSizeChange="pageSizeChange"
          v-model:current="paginations.pageNum" 
          v-model:pageSize="paginations.pageSize" 
          :total="paginations.total" 
        />
      </template>
    </app-table-box>

    <!-- 使用自定义footer -->
    <appModal v-model:openValue="customModalVisible" title="自定义底部弹窗1" @close="closeModal" @open="openModalFn">
      <template #appContent>
        <p>弹窗内容</p>
      </template>

      <template #appFooter>
        <a-button @click="handleCustomCancel">自定义取消</a-button>
        <a-button type="primary" @click="handleCustomOk">自定义确定</a-button>
        <a-button type="dashed">其他操作</a-button>
      </template>
    </appModal>
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
defineOptions({ name: 'publication_sequence' });
const { proxy: _this } = getCurrentInstance();

const formData = reactive({
  categoryId: '', // 分类
  selectUserIdList: [],
  completeTime: [], // 完成时间
  skuCode: '',
  productName: '', // 商品名称
  tradeName: '',
  aaa: '',
  bbb: '',
  ccc: [],
  vvv: '',
  ddd: [],
  rrrr: '',
  vvvvdfs: '',
  sdfsd: '',
  fgdfg: false,
  rrfghjgfhjrr: false,
  dfhh: '',
  dfhdfh: '',
  sdgdfg: '',
  asdgasdfasd: '',
  afhgsdgfasd: '',
  asdfasdfasd: '',
  asdfasdf: '',
  asdfasdf: '',
  radioGroup: '',
  sadgasdgsdagf: '',
  asdfgasdgfas: '',
  asdfasdfsad: '',
  asdgasdgasd: '',
  asdfasdfaseed: '',
  asdfsadf: '',
  asdfgsadf: '',
  sdfhdsfg: '',
  dfgjfdghsdfg: '',
});
const tableData = reactive({
  header: [
    // 基础信息列（1-5）
    { key: 'reportDate', title: '报表日期', width: 120, align: 'center', sorter: true },
    { key: 'accountPeriod', title: '所属期间', width: 100, align: 'center' },
    { key: 'accountCode', title: '科目代码', width: 100 },
    { key: 'accountName', title: '科目名称', width: 150 },
    { key: 'currency', title: '币种', width: 80 },

    // 收入类列（6-10）
    { key: 'mainBusinessIncome', title: '主营业务收入', width: 140, align: 'right' },
    { key: 'otherBusinessIncome', title: '其他业务收入', width: 140, align: 'center' },
    { key: 'investmentIncome', title: '投资收益', width: 120 },
    { key: 'governmentSubsidy', title: '政府补助收入', width: 140 },
    { key: 'totalIncome', title: '收入合计', width: 120 },

    // 成本类列（11-15）
    { key: 'mainBusinessCost', title: '主营业务成本', width: 140 },
    { key: 'otherBusinessCost', title: '其他业务成本', width: 140 },
    { key: 'taxesAndSurcharges', title: '税金及附加', width: 120 },
    { key: 'inventoryWriteDown', title: '存货跌价损失', width: 140 },
    { key: 'totalCost', title: '成本合计', width: 120 },

    // 费用类列（16-20）
    { key: 'salesExpense', title: '销售费用', width: 120, align: 'right' },
    { key: 'managementExpense', title: '管理费用', width: 120 },
    { key: 'financialExpense', title: '财务费用', width: 120 },
    { key: 'researchExpense', title: '研发费用', width: 120 },
    { key: 'totalExpense', title: '费用合计', width: 120 },

    // 利润类列（21-25）
    { key: 'operatingProfit', title: '营业利润', width: 120 },
    { key: 'totalProfit', title: '利润总额', width: 120 },
    { key: 'incomeTax', title: '所得税费用', width: 120 },
    { key: 'netProfit', title: '净利润', width: 120 },
    { key: 'retainedProfit', title: '留存收益', width: 120 },

    // 资产负债及现金流列（26-30）
    { key: 'totalAssets', title: '资产总计', width: 120 },
    { key: 'totalLiabilities', title: '负债总计', width: 120 },
    { key: 'operatingCashFlow', title: '经营活动现金流', width: 150 },
    { key: 'investmentCashFlow', title: '投资活动现金流', width: 150 },
    { key: 'financingCashFlow', title: '筹资活动现金流', width: 150 },
  ],
  data: [
    {
      reportDate: '2023-01-31',
      accountPeriod: '2023Q1',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 1560000,
      otherBusinessIncome: 85000,
      investmentIncome: 32000,
      governmentSubsidy: 15000,
      totalIncome: 1692000,
      mainBusinessCost: 980000,
      otherBusinessCost: 52000,
      taxesAndSurcharges: 45000,
      inventoryWriteDown: 8000,
      totalCost: 1085000,
      salesExpense: 120000,
      managementExpense: 95000,
      financialExpense: 18000,
      researchExpense: 65000,
      totalExpense: 298000,
      operatingProfit: 309000,
      totalProfit: 312000,
      incomeTax: 78000,
      netProfit: 234000,
      retainedProfit: 187200,
      totalAssets: 8500000,
      totalLiabilities: 3400000,
      operatingCashFlow: 280000,
      investmentCashFlow: -150000,
      financingCashFlow: 50000,
    },
    // 第2条：2023年2月
    {
      reportDate: '2023-02-28',
      accountPeriod: '2023Q1',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 1480000,
      otherBusinessIncome: 78000,
      investmentIncome: 28000,
      governmentSubsidy: 0,
      totalIncome: 1586000,
      mainBusinessCost: 920000,
      otherBusinessCost: 48000,
      taxesAndSurcharges: 42000,
      inventoryWriteDown: 5000,
      totalCost: 1015000,
      salesExpense: 115000,
      managementExpense: 90000,
      financialExpense: 16000,
      researchExpense: 62000,
      totalExpense: 283000,
      operatingProfit: 288000,
      totalProfit: 290000,
      incomeTax: 72500,
      netProfit: 217500,
      retainedProfit: 174000,
      totalAssets: 8620000,
      totalLiabilities: 3350000,
      operatingCashFlow: 260000,
      investmentCashFlow: -120000,
      financingCashFlow: 30000,
    },
    // 第3条：2023年3月
    {
      reportDate: '2023-03-31',
      accountPeriod: '2023Q1',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 1650000,
      otherBusinessIncome: 92000,
      investmentIncome: 35000,
      governmentSubsidy: 20000,
      totalIncome: 1797000,
      mainBusinessCost: 1020000,
      otherBusinessCost: 55000,
      taxesAndSurcharges: 48000,
      inventoryWriteDown: 10000,
      totalCost: 1133000,
      salesExpense: 130000,
      managementExpense: 100000,
      financialExpense: 20000,
      researchExpense: 70000,
      totalExpense: 320000,
      operatingProfit: 344000,
      totalProfit: 347000,
      incomeTax: 86750,
      netProfit: 260250,
      retainedProfit: 208200,
      totalAssets: 8780000,
      totalLiabilities: 3300000,
      operatingCashFlow: 310000,
      investmentCashFlow: -180000,
      financingCashFlow: 80000,
    },
    // 第4条：2023年4月
    {
      reportDate: '2023-04-30',
      accountPeriod: '2023Q2',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 1720000,
      otherBusinessIncome: 95000,
      investmentIncome: 38000,
      governmentSubsidy: 12000,
      totalIncome: 1865000,
      mainBusinessCost: 1050000,
      otherBusinessCost: 58000,
      taxesAndSurcharges: 50000,
      inventoryWriteDown: 6000,
      totalCost: 1164000,
      salesExpense: 135000,
      managementExpense: 105000,
      financialExpense: 22000,
      researchExpense: 75000,
      totalExpense: 337000,
      operatingProfit: 364000,
      totalProfit: 367000,
      incomeTax: 91750,
      netProfit: 275250,
      retainedProfit: 220200,
      totalAssets: 8950000,
      totalLiabilities: 3250000,
      operatingCashFlow: 330000,
      investmentCashFlow: -200000,
      financingCashFlow: 60000,
    },
    // 第5条：2023年5月
    {
      reportDate: '2023-05-31',
      accountPeriod: '2023Q2',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 1680000,
      otherBusinessIncome: 90000,
      investmentIncome: 36000,
      governmentSubsidy: 0,
      totalIncome: 1806000,
      mainBusinessCost: 1030000,
      otherBusinessCost: 56000,
      taxesAndSurcharges: 49000,
      inventoryWriteDown: 7000,
      totalCost: 1142000,
      salesExpense: 132000,
      managementExpense: 102000,
      financialExpense: 21000,
      researchExpense: 72000,
      totalExpense: 327000,
      operatingProfit: 337000,
      totalProfit: 340000,
      incomeTax: 85000,
      netProfit: 255000,
      retainedProfit: 204000,
      totalAssets: 9100000,
      totalLiabilities: 3200000,
      operatingCashFlow: 300000,
      investmentCashFlow: -160000,
      financingCashFlow: 40000,
    },
    // 第6-20条（省略部分字段，保持结构一致）
    {
      reportDate: '2023-06-30',
      accountPeriod: '2023Q2',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 1850000,
      otherBusinessIncome: 105000,
      investmentIncome: 42000,
      governmentSubsidy: 25000,
      totalIncome: 2022000,
      mainBusinessCost: 1120000,
      otherBusinessCost: 62000,
      taxesAndSurcharges: 55000,
      inventoryWriteDown: 12000,
      totalCost: 1249000,
      salesExpense: 145000,
      managementExpense: 110000,
      financialExpense: 24000,
      researchExpense: 80000,
      totalExpense: 359000,
      operatingProfit: 414000,
      totalProfit: 417000,
      incomeTax: 104250,
      netProfit: 312750,
      retainedProfit: 250200,
      totalAssets: 9300000,
      totalLiabilities: 3150000,
      operatingCashFlow: 360000,
      investmentCashFlow: -220000,
      financingCashFlow: 90000,
    },
    {
      reportDate: '2023-07-31',
      accountPeriod: '2023Q3',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 1920000,
      otherBusinessIncome: 110000,
      investmentIncome: 45000,
      governmentSubsidy: 18000,
      totalIncome: 2093000,
      mainBusinessCost: 1160000,
      otherBusinessCost: 65000,
      taxesAndSurcharges: 58000,
      inventoryWriteDown: 9000,
      totalCost: 1292000,
      salesExpense: 150000,
      managementExpense: 115000,
      financialExpense: 25000,
      researchExpense: 85000,
      totalExpense: 375000,
      operatingProfit: 426000,
      totalProfit: 429000,
      incomeTax: 107250,
      netProfit: 321750,
      retainedProfit: 257400,
      totalAssets: 9500000,
      totalLiabilities: 3100000,
      operatingCashFlow: 380000,
      investmentCashFlow: -240000,
      financingCashFlow: 70000,
    },
    {
      reportDate: '2023-08-31',
      accountPeriod: '2023Q3',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 1880000,
      otherBusinessIncome: 108000,
      investmentIncome: 43000,
      governmentSubsidy: 0,
      totalIncome: 2031000,
      mainBusinessCost: 1140000,
      otherBusinessCost: 63000,
      taxesAndSurcharges: 56000,
      inventoryWriteDown: 8000,
      totalCost: 1267000,
      salesExpense: 148000,
      managementExpense: 112000,
      financialExpense: 24000,
      researchExpense: 82000,
      totalExpense: 366000,
      operatingProfit: 400000,
      totalProfit: 403000,
      incomeTax: 100750,
      netProfit: 302250,
      retainedProfit: 241800,
      totalAssets: 9650000,
      totalLiabilities: 3050000,
      operatingCashFlow: 350000,
      investmentCashFlow: -210000,
      financingCashFlow: 50000,
    },
    {
      reportDate: '2023-09-30',
      accountPeriod: '2023Q3',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2050000,
      otherBusinessIncome: 120000,
      investmentIncome: 50000,
      governmentSubsidy: 30000,
      totalIncome: 2250000,
      mainBusinessCost: 1230000,
      otherBusinessCost: 70000,
      taxesAndSurcharges: 62000,
      inventoryWriteDown: 15000,
      totalCost: 1377000,
      salesExpense: 160000,
      managementExpense: 120000,
      financialExpense: 26000,
      researchExpense: 90000,
      totalExpense: 396000,
      operatingProfit: 477000,
      totalProfit: 480000,
      incomeTax: 120000,
      netProfit: 360000,
      retainedProfit: 288000,
      totalAssets: 9850000,
      totalLiabilities: 3000000,
      operatingCashFlow: 420000,
      investmentCashFlow: -260000,
      financingCashFlow: 100000,
    },
    {
      reportDate: '2023-10-31',
      accountPeriod: '2023Q4',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2180000,
      otherBusinessIncome: 130000,
      investmentIncome: 55000,
      governmentSubsidy: 22000,
      totalIncome: 2387000,
      mainBusinessCost: 1300000,
      otherBusinessCost: 75000,
      taxesAndSurcharges: 65000,
      inventoryWriteDown: 10000,
      totalCost: 1450000,
      salesExpense: 170000,
      managementExpense: 125000,
      financialExpense: 28000,
      researchExpense: 95000,
      totalExpense: 418000,
      operatingProfit: 519000,
      totalProfit: 522000,
      incomeTax: 130500,
      netProfit: 391500,
      retainedProfit: 313200,
      totalAssets: 10100000,
      totalLiabilities: 2950000,
      operatingCashFlow: 450000,
      investmentCashFlow: -280000,
      financingCashFlow: 80000,
    },
    {
      reportDate: '2023-11-30',
      accountPeriod: '2023Q4',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2350000,
      otherBusinessIncome: 140000,
      investmentIncome: 60000,
      governmentSubsidy: 0,
      totalIncome: 2550000,
      mainBusinessCost: 1400000,
      otherBusinessCost: 80000,
      taxesAndSurcharges: 70000,
      inventoryWriteDown: 12000,
      totalCost: 1562000,
      salesExpense: 180000,
      managementExpense: 130000,
      financialExpense: 30000,
      researchExpense: 100000,
      totalExpense: 440000,
      operatingProfit: 548000,
      totalProfit: 551000,
      incomeTax: 137750,
      netProfit: 413250,
      retainedProfit: 330600,
      totalAssets: 10350000,
      totalLiabilities: 2900000,
      operatingCashFlow: 480000,
      investmentCashFlow: -300000,
      financingCashFlow: 60000,
    },
    {
      reportDate: '2023-12-31',
      accountPeriod: '2023Q4',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2800000,
      otherBusinessIncome: 180000,
      investmentIncome: 75000,
      governmentSubsidy: 40000,
      totalIncome: 3095000,
      mainBusinessCost: 1680000,
      otherBusinessCost: 100000,
      taxesAndSurcharges: 85000,
      inventoryWriteDown: 20000,
      totalCost: 1885000,
      salesExpense: 220000,
      managementExpense: 150000,
      financialExpense: 35000,
      researchExpense: 120000,
      totalExpense: 525000,
      operatingProfit: 685000,
      totalProfit: 690000,
      incomeTax: 172500,
      netProfit: 517500,
      retainedProfit: 414000,
      totalAssets: 10700000,
      totalLiabilities: 2850000,
      operatingCashFlow: 600000,
      investmentCashFlow: -350000,
      financingCashFlow: 120000,
    },
    {
      reportDate: '2024-01-31',
      accountPeriod: '2024Q1',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2200000,
      otherBusinessIncome: 135000,
      investmentIncome: 58000,
      governmentSubsidy: 25000,
      totalIncome: 2418000,
      mainBusinessCost: 1320000,
      otherBusinessCost: 78000,
      taxesAndSurcharges: 66000,
      inventoryWriteDown: 11000,
      totalCost: 1475000,
      salesExpense: 175000,
      managementExpense: 128000,
      financialExpense: 29000,
      researchExpense: 98000,
      totalExpense: 430000,
      operatingProfit: 513000,
      totalProfit: 516000,
      incomeTax: 129000,
      netProfit: 387000,
      retainedProfit: 309600,
      totalAssets: 10900000,
      totalLiabilities: 2800000,
      operatingCashFlow: 460000,
      investmentCashFlow: -290000,
      financingCashFlow: 90000,
    },
    {
      reportDate: '2024-02-29',
      accountPeriod: '2024Q1',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2050000,
      otherBusinessIncome: 125000,
      investmentIncome: 52000,
      governmentSubsidy: 0,
      totalIncome: 2227000,
      mainBusinessCost: 1230000,
      otherBusinessCost: 73000,
      taxesAndSurcharges: 62000,
      inventoryWriteDown: 9000,
      totalCost: 1374000,
      salesExpense: 165000,
      managementExpense: 122000,
      financialExpense: 27000,
      researchExpense: 92000,
      totalExpense: 406000,
      operatingProfit: 447000,
      totalProfit: 450000,
      incomeTax: 112500,
      netProfit: 337500,
      retainedProfit: 270000,
      totalAssets: 11050000,
      totalLiabilities: 2750000,
      operatingCashFlow: 410000,
      investmentCashFlow: -260000,
      financingCashFlow: 70000,
    },
    {
      reportDate: '2024-03-31',
      accountPeriod: '2024Q1',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2400000,
      otherBusinessIncome: 150000,
      investmentIncome: 65000,
      governmentSubsidy: 30000,
      totalIncome: 2645000,
      mainBusinessCost: 1440000,
      otherBusinessCost: 85000,
      taxesAndSurcharges: 72000,
      inventoryWriteDown: 16000,
      totalCost: 1613000,
      salesExpense: 190000,
      managementExpense: 135000,
      financialExpense: 32000,
      researchExpense: 105000,
      totalExpense: 462000,
      operatingProfit: 570000,
      totalProfit: 573000,
      incomeTax: 143250,
      netProfit: 429750,
      retainedProfit: 343800,
      totalAssets: 11300000,
      totalLiabilities: 2700000,
      operatingCashFlow: 520000,
      investmentCashFlow: -320000,
      financingCashFlow: 110000,
    },
    {
      reportDate: '2024-04-30',
      accountPeriod: '2024Q2',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2550000,
      otherBusinessIncome: 160000,
      investmentIncome: 70000,
      governmentSubsidy: 20000,
      totalIncome: 2790000,
      mainBusinessCost: 1530000,
      otherBusinessCost: 90000,
      taxesAndSurcharges: 76000,
      inventoryWriteDown: 14000,
      totalCost: 1710000,
      salesExpense: 200000,
      managementExpense: 140000,
      financialExpense: 34000,
      researchExpense: 110000,
      totalExpense: 484000,
      operatingProfit: 596000,
      totalProfit: 599000,
      incomeTax: 149750,
      netProfit: 449250,
      retainedProfit: 359400,
      totalAssets: 11550000,
      totalLiabilities: 2650000,
      operatingCashFlow: 550000,
      investmentCashFlow: -340000,
      financingCashFlow: 90000,
    },
    {
      reportDate: '2024-05-31',
      accountPeriod: '2024Q2',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2680000,
      otherBusinessIncome: 170000,
      investmentIncome: 75000,
      governmentSubsidy: 0,
      totalIncome: 2925000,
      mainBusinessCost: 1608000,
      otherBusinessCost: 95000,
      taxesAndSurcharges: 80000,
      inventoryWriteDown: 15000,
      totalCost: 1798000,
      salesExpense: 210000,
      managementExpense: 145000,
      financialExpense: 36000,
      researchExpense: 115000,
      totalExpense: 506000,
      operatingProfit: 621000,
      totalProfit: 624000,
      incomeTax: 156000,
      netProfit: 468000,
      retainedProfit: 374400,
      totalAssets: 11800000,
      totalLiabilities: 2600000,
      operatingCashFlow: 580000,
      investmentCashFlow: -360000,
      financingCashFlow: 70000,
    },
    {
      reportDate: '2024-06-30',
      accountPeriod: '2024Q2',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 2900000,
      otherBusinessIncome: 190000,
      investmentIncome: 85000,
      governmentSubsidy: 35000,
      totalIncome: 3210000,
      mainBusinessCost: 1740000,
      otherBusinessCost: 105000,
      taxesAndSurcharges: 87000,
      inventoryWriteDown: 18000,
      totalCost: 1950000,
      salesExpense: 230000,
      managementExpense: 155000,
      financialExpense: 38000,
      researchExpense: 125000,
      totalExpense: 548000,
      operatingProfit: 712000,
      totalProfit: 715000,
      incomeTax: 178750,
      netProfit: 536250,
      retainedProfit: 429000,
      totalAssets: 12100000,
      totalLiabilities: 2550000,
      operatingCashFlow: 650000,
      investmentCashFlow: -380000,
      financingCashFlow: 130000,
    },
    {
      reportDate: '2024-07-31',
      accountPeriod: '2024Q3',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 3050000,
      otherBusinessIncome: 200000,
      investmentIncome: 90000,
      governmentSubsidy: 25000,
      totalIncome: 3365000,
      mainBusinessCost: 1830000,
      otherBusinessCost: 110000,
      taxesAndSurcharges: 91000,
      inventoryWriteDown: 16000,
      totalCost: 2047000,
      salesExpense: 240000,
      managementExpense: 160000,
      financialExpense: 40000,
      researchExpense: 130000,
      totalExpense: 570000,
      operatingProfit: 748000,
      totalProfit: 751000,
      incomeTax: 187750,
      netProfit: 563250,
      retainedProfit: 450600,
      totalAssets: 12400000,
      totalLiabilities: 2500000,
      operatingCashFlow: 680000,
      investmentCashFlow: -400000,
      financingCashFlow: 100000,
    },
    {
      reportDate: '2024-08-31',
      accountPeriod: '2024Q3',
      accountCode: '6001',
      accountName: '主营业务收入',
      currency: '人民币',
      mainBusinessIncome: 3200000,
      otherBusinessIncome: 210000,
      investmentIncome: 95000,
      governmentSubsidy: 0,
      totalIncome: 3505000,
      mainBusinessCost: 1920000,
      otherBusinessCost: 115000,
      taxesAndSurcharges: 96000,
      inventoryWriteDown: 17000,
      totalCost: 2148000,
      salesExpense: 250000,
      managementExpense: 165000,
      financialExpense: 42000,
      researchExpense: 135000,
      totalExpense: 592000,
      operatingProfit: 765000,
      totalProfit: 768000,
      incomeTax: 192000,
      netProfit: 576000,
      retainedProfit: 460800,
      totalAssets: 12700000,
      totalLiabilities: 2450000,
      operatingCashFlow: 700000,
      investmentCashFlow: -420000,
      financingCashFlow: 80000,
    },
  ],
  total: 0,
  loading: false,
  selectedRowKeys: [],
  selectedRows: [],
  filterColumns: [],
  params: {
    pageNum: 1,
    pageSize: 50,
    // "order": "descending", // 倒正序，必须 descending/ascending
    // "prop": "complete_time" // 排序列，必须
  },
});
const columns = reactive([])
const current1 = ref(1);
const current2 = ref(2);
const customModalVisible = ref(false);
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 2000,
});
const options = [...Array(25)].map((_, i) => ({
  value: (i + 10).toString(36) + (i + 1),
}));
let dataList = [];
const rules = {
  asdfasdfasd: [
    { required: true, message: 'Please input Activity name', trigger: 'blur', }
  ]
}
const options1 = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
watch(() => formData, (val, oldVal) => {
  // console.log({val, oldVal});
}, {
  deep: true,
})
onMounted(() => {
  for (let i = 0; i < 2; i++) {
    tableData.data.forEach((item, index) => {
      item.rowKey = uuidv4();
      let obj = { ...item };
      dataList.push(obj);
    });
  }
  tableData.data = [];
  nextTick(() => {
    tableData.data = dataList;
  });
});
const onChange = pageNumber => {
  console.log('Page: ', pageNumber);
};
const popupScroll = () => {
  console.log('popupScroll');
};
// 分页变化
function pageNumChange(val) {
  paginations.pageNum = val;
  console.log({ val });

};
function pageSizeChange(val) {
  paginations.pageSize = val;
  console.log({ val });

};
const dataTotal = computed(() => {
  let obj = {};
  let item = tableData.data[0] || {};
  tableData.header.forEach(head => {
    let key = head.key;
    obj[key] = '';
    if (typeof item[key] === 'number') {
      let total = 0;
      tableData.data.forEach(i => (total += i[key]));
      obj[key] = total.toLocaleString();
    }
  });
  return obj;
});
function formHeightChange(val) {
  // console.log({val}, 'height');
  
}
function onSubmit(val) {
  console.log(formData, {val});
}
// 复选框
function onSelectChange(keys, rows) {
  tableData.selectedRowKeys = keys;
  tableData.selectedRows = rows;
  console.log(111);
}
// 分页
function tableChange(pagination, filters, sorter) {
  if (!sorter) {
    return;
  }
  console.log({ sorter });
}

let clickTimer = null; // 处理单击和双击冲突的定时器
// 自定义行属性（同时绑定单击和双击）
function customRow(row) {
  return {
    onClick: () => {
      // 清除之前的定时器
      if (clickTimer) clearTimeout(clickTimer);
      // 设置新定时器（250ms内没有双击则视为单击）
      clickTimer = setTimeout(() => {
        // rowClick(row)
        console.log({ row }, 'click');
      }, 250);
    },
    onDblclick: () => {
      // 双击时立即清除单击定时器
      clearTimeout(clickTimer);
      // rowDblclick(row);
      console.log({ row }, 'dblclick');
    },
  };
}

function openModal() {
  customModalVisible.value = !customModalVisible.value;
}

// 自定义底部弹窗事件
function handleCustomCancel() {
  console.log('自定义取消操作');
  customModalVisible.value = false;
}

function handleCustomOk() {
  console.log('自定义确定操作');
  customModalVisible.value = false;
}
function closeModal() {
  console.log('关闭回调');
}
function openModalFn() {
  console.log('打开回调');
}
</script>

<style lang="less" scoped>
.publication_sequence {
  text-align: left;
}
</style>
