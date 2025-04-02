<template>
    <div class="my-12px">
        <div class="w-full flex justify-between items-center">
            <div class="pl-2">
                <a-dropdown>
                    <a-button type="primary" style="height: 32px;  margin-left: 10px;">
                        批量操作
                        <DownOutlined />
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="handleDeactivated()">
                                批量下架
                            </a-menu-item>
                            <a-menu-item @click="handleRemark()">
                                批量备注
                            </a-menu-item>

                            <a-menu-item @click="handleBatchPrice()">
                                批量修改价格
                            </a-menu-item>
                            <a-menu-item @click="handleBatchStock()">
                                批量修改库存
                            </a-menu-item>
                            <a-menu-item @click="handleBatchSpecialPrice()">
                                批量修改促销价格
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>

            <div>
                <!-- <a-button @click="warehouseSetting" type="link" style="height: 32px; margin-left: 10px; ">
                    <SettingOutlined />
                    仓库管理
                </a-button> -->
                <a-button @click="addHalfway" type="primary" style="height: 32px; margin-left: 10px; ">
                    <PlusOutlined />
                    新增半托管商品
                </a-button>
                <a-dropdown>

                    <a-button type="primary" style="height: 32px ; margin-left: 10px;">
                        创建产品
                        <DownOutlined />
                    </a-button>

                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="cretateGlobalProduct">
                                创建“六合一产品”
                            </a-menu-item>
                            <a-menu-item @click="createSiteProduct">
                                创建站点产品
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>

                <!--
                 <a-dropdown>
                    <a-button type="primary" style="height: 32px;  margin-left: 10px;">
                        导入/导出
                        <DownOutlined />
                    </a-button>

                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="exportProduct">
                                导入产品
                            </a-menu-item>
                            <a-menu-item @click="exportPrice">
                                导入更新价格库存
                            </a-menu-item>

                        </a-menu>
                    </template>
                </a-dropdown>
                 -->


                <a-dropdown>
                    <a-button type="primary" style="height: 32px;  margin-left: 10px;">
                        同步产品
                        <DownOutlined />
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="syncProduct">
                                同步全部产品
                            </a-menu-item>
                            <a-menu-item @click="syncSelectProduct">
                                同步选中产品
                            </a-menu-item>
                            <a-menu-item @click="syncShortCodeProduct">
                                同步店铺产品
                            </a-menu-item>
                            <a-menu-item @click="syncUpProduct">
                                同步可升级产品
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
    <WarehouseSetting ref="warehouseSettingRef" />
    <PriceModal ref="priceModalRef" @success="priceSuccess"></PriceModal>
    <RemarkModal ref="remarkModalRef" @success="remarkSuccess"></RemarkModal>
    <StockModal ref="stockModalRef" @success="stockSuccess"></StockModal>
    <SpecialPriceModal ref="specialPriceModalRef" @success="specialPriceSuccess"></SpecialPriceModal>
    <BaseProgess ref="baseProgessRef" v-model:percent="percent" v-model:open="progessOpen" :showSaveBtn="false"
        :showCancelBtn="false"></BaseProgess>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { DownOutlined, SettingOutlined, PlusOutlined } from "@ant-design/icons-vue";
import WarehouseSetting from './warehouseSetting.vue';
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import { syncAll, sync, deactivate } from '@/pages/lazada/product/api';
import { message, Modal } from 'ant-design-vue';
import PriceModal from './priceModal.vue';
import RemarkModal from './remarkModal.vue';
import StockModal from './stockModal.vue';
import SpecialPriceModal from './specialPriceModal.vue';

const { selectedRows, shortCode } = defineProps({
    //  表格选中的数据
    selectedRows: {
        type: Array,
        default: () => []
    },
    shortCode: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['success']);
const router = useRouter();
const percent = ref(0);
const timer = ref(null);
const progessOpen = ref(false);
const warehouseSettingEl = useTemplateRef('warehouseSettingRef');
const priceModalEl = useTemplateRef('priceModalRef');
const remarkModalEl = useTemplateRef('remarkModalRef');
const stockModalEl = useTemplateRef('stockModalRef');
const specialPriceModalEl = useTemplateRef('specialPriceModalRef');
const { state: lazadaAttrsState, setShortCode, setLazadaAttrs, setLoading, reset } = useLadazaAttrs();

const handleDeactivated = () => {
    if (!selectedRows.length) {
        message.error('请选择需要下架的产品');
        return
    }
    Modal.confirm({
        title: '下架',
        content: '是否确认下架？',
        onOk: async () => {
            const res = await deactivate({ itemId: record.itemId });
            if (res.code === 200) {
                message.success('下架成功');
                emits('success');
            } else {
                message.error(res.msg);
            }
        },
    })
};

watch(() => shortCode, (newVal) => {
    clearInterval(timer.value);
    percent.value = 0;
})

const syncShortCodeProduct = () => {
    if (!shortCode) {
        message.error('请选择店铺');
        return
    }
    progessOpen.value = true;
    timer.value = setInterval(() => {
        if (percent.value < 80) {
            percent.value++;
        }
    }, 800);
    sync({
        "shortCode": shortCode
    }).then((res) => {
        percent.value = 100;
        progessOpen.value = false;
        message.success('同步成功');
        clearInterval(timer.value);
        percent.value = 0;
        emits('success');
    }).catch((err) => {
        percent.value = 0;
        progessOpen.value = false;
    })
};


const handleRemark = () => {
    if (!selectedRows.length) {
        message.error('请选择需要备注的产品');
        return
    }
    remarkModalEl.value.open(selectedRows, true);
};

const handleBatchPrice = () => {
    if (!selectedRows.length) {
        message.error('请选择产品');
        return
    }
    priceModalEl.value.open(selectedRows, true);
};

const handleBatchStock = () => {
    if (!selectedRows.length) {
        message.error('请选择产品');
        return
    }
    stockModalEl.value.open(selectedRows, true);
};
const handleBatchSpecialPrice = () => {
    if (!selectedRows.length) {
        message.error('请选择产品');
        return
    }
    specialPriceModalEl.value.open(selectedRows, true);
}

// 仓库管理
const warehouseSetting = () => {
    warehouseSettingEl.value.open();
};
// 创建半托管产品
const addHalfway = () => {
    window.open('/platform/lazada/siteProduct/add?type=halfway', '_blank');
};
// 创建“六合一产品”
const cretateGlobalProduct = () => {
    reset();
    window.open('/platform/lazada/gobalProduct/add', '_blank');
};

// 创建站点产品
const createSiteProduct = () => {
    reset();
    window.open('/platform/lazada/siteProduct/add', '_blank');
};
//  同步所有产品
const syncProduct = () => {
    syncAll().then(res => {
        console.log(res);
        message.success('同步成功');
        emits('success');
    });
}

//  同步选中产品
const syncSelectProduct = () => {

};
// 同步可升级产品
const syncUpProduct = () => {

};

const priceSuccess = () => {
    emits('success');
};
const remarkSuccess = () => {
    emits('success');
};
const stockSuccess = () => {
    emits('success');
};
const specialPriceSuccess = () => {
    emits('success');
};
onBeforeUnmount(() => {
    clearInterval(timer.value);
})
</script>