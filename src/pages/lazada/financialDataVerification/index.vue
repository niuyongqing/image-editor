<template>
    <div>
        <Search @search="handleSearch" @send="handleSend" ref="searchRef"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="financeCheckList" :init-search-param="initSearchParam"
            :immediate="false">
            <template #leftBar>
                <a-space>
                    <a-button type="primary" @click="importData" v-has-permi="['platform:lazada:finance:check:import']">
                        <DownloadOutlined /> 导入普元数据
                    </a-button>
                    <a-button type="primary" @click="importDataFeeName"
                        v-has-permi="['platform:lazada:finance:check:import']">
                        <DownloadOutlined /> 导入费用名称维度表
                    </a-button>
                    <a-button type="primary" @click="exportData" :loading="exportLoading"
                        v-has-permi="['platform:lazada:finance:check:export']">
                        <DownloadOutlined /> 导 出
                    </a-button>
                    <a-button type="primary" @click="syncData" v-has-permi="['platform:lazada:finance:check:list']">
                        <ReloadOutlined />同步状态
                    </a-button>
                    <a-button type="primary" @click="computeData"
                        v-has-permi="['platform:lazada:finance:check:compute']">
                        <ReloadOutlined /> 汇总计算
                    </a-button>
                    <a-button type="primary" @click="logData" v-has-permi="['platform:lazada:finance:check:log:list']">
                        <OrderedListOutlined />日 志
                    </a-button>
                </a-space>
            </template>
        </BaseTable>
        <ImportTable ref="importTableRef"></ImportTable>
        <ImportDataFeeName ref="importDataFeeNameRef"></ImportDataFeeName>
        <Sync ref="syncRef"></Sync>
        <ComputeData ref="computeDataRef"></ComputeData>
        <Log ref="logRef"></Log>
    </div>
</template>

<script setup>
import { DownloadOutlined, ReloadOutlined, OrderedListOutlined } from '@ant-design/icons-vue';
import { columns } from './columns';
import { financeCheckList, exportFinanceCheckList } from './api';
import { syncFinanceCheckList } from '@/pages/lazada/financialDataVerification/api';
import { message, Modal } from "ant-design-vue";
import dayjs from 'dayjs';
import download from '@/api/common/download'
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import ImportTable from './components/importTable.vue';
import ImportDataFeeName from './components/importDataFeeName.vue';
import Sync from './components/sync.vue';
import ComputeData from './components/computeData.vue';
import Log from './components/log.vue';

const myIncomeDownloadLoading = ref(false);
const initSearchParam = {
    order: "desc",
    prop: "create_time",
    month: dayjs().format('YYYYMM'),
};
const baseTableEl = useTemplateRef('baseTableRef');
const searchEl = useTemplateRef('searchRef');
const importTableEl = useTemplateRef('importTableRef');
const importDataFeeNameEl = useTemplateRef('importDataFeeNameRef');
const syncEl = useTemplateRef('syncRef');
const computeDataEl = useTemplateRef('computeDataRef');
const logEl = useTemplateRef('logRef');

const exportLoading = ref(false);
const searchData = ref({});
// 导入普元数据
const importData = () => {
    importTableEl.value.open();
};
// 导入费用名称维度表
const importDataFeeName = () => {
    importDataFeeNameEl.value.open();
};
// 导出
const exportData = () => {
    exportLoading.value = true;
    exportFinanceCheckList(searchData.value).then(res => {
        if (res.code === 200) {
            message.success("已执行下载")
            download.name(res.msg, true)
        };
    }).finally(() => {
        exportLoading.value = false
    })
};
// 同步状态
const syncData = () => {
    syncEl.value.open();
};
// 汇总计算
const computeData = () => {
    computeDataEl.value.open();
};
// 日志的
const logData = () => {
    logEl.value.open();
};
const syncDataMount = (month) => {
    syncFinanceCheckList({ month })
        .then((res) => {
            if (res.code === 200) {
                const status = res.data.status;
                if (status == "0") {
                    Modal.confirm({
                        title: '同步',
                        content: '当前查询月份未同步',
                        okText: '确定',
                        cancelButtonProps: { style: { display: 'none' } },
                    })
                } else if (status == "5") {
                    Modal.confirm({
                        title: '同步',
                        content: '当前查询月份同步中',
                        okText: '确定',
                        cancelButtonProps: { style: { display: 'none' } },
                    })
                } else {
                    Modal.confirm({
                        title: '同步',
                        content: '当前查询月份同步完成',
                        okText: '确定',
                        cancelButtonProps: { style: { display: 'none' } },
                    })
                }
            }
        }).finally(() => {
            baseTableEl.value.setLoading(false)
        })
};
const handleSearch = async (param) => {
    searchData.value = param;
    baseTableEl.value.search(param);
    syncDataMount(param.month);
};
const handleSend = (param) => {
    searchData.value = param;
    baseTableEl.value.search(param);
}

</script>
