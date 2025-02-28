<template>
    <div class="my-12px">
        <div class="w-full flex justify-between items-center">
            <div class="pl-2">
                <a-dropdown>
                    <a-button type="primary" style="height: 32px;  margin-left: 10px;">
                        批量操作
                        <DownOutlined />
                    </a-button>

                </a-dropdown>
            </div>
        </div>
    </div>
    <WarehouseSetting ref="warehouseSettingRef" />
    <PriceModal ref="priceModalRef" @success="priceSuccess"></PriceModal>
    <RemarkModal ref="remarkModalRef" @search="remarkSuccess"></RemarkModal>
    <StockModal ref="stockModalRef" @success="stockSuccess"></StockModal>
    <SpecialPriceModal ref="specialPriceModalRef" @success="specialPriceSuccess"></SpecialPriceModal>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { DownOutlined, SettingOutlined, PlusOutlined } from "@ant-design/icons-vue";
import WarehouseSetting from './warehouseSetting.vue';
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import { syncAll } from '@/pages/lazada/product/api';
import { message, Modal } from 'ant-design-vue';
import PriceModal from '@/pages/lazada/product/siteProduct//batchModal/priceModal.vue';
import RemarkModal from './remarkModal.vue';
import StockModal from '@/pages/lazada/product/siteProduct/batchModal/stockModal.vue';
import SpecialPriceModal from '@/pages/lazada/product/siteProduct/batchModal/specialPriceModal.vue';

const { selectedRows } = defineProps({
    //  表格选中的数据
    selectedRows: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['success']);
const router = useRouter();
const warehouseSettingEl = useTemplateRef('warehouseSettingRef');
const priceModalEl = useTemplateRef('priceModalRef');
const remarkModalEl = useTemplateRef('remarkModalRef');
const stockModalEl = useTemplateRef('stockModalRef');
const specialPriceModalEl = useTemplateRef('specialPriceModalRef');
const { state: lazadaAttrsState, setShortCode, setLazadaAttrs, setLoading, reset } = useLadazaAttrs();

const handleDeactivated = () => {
    Modal.confirm({
        title: '下架',
        content: '是否确认下架？',
        onOk: async () => {
            // const res = await deactivated({ itemId: record.itemId });
            // if (res.code === 200) {
            //     message.success('下架成功');
            //     emits('success');
            // } else {
            //     message.error(res.msg);
            // }
        },
    })
};

const handleRemark = () => {
    remarkModalEl.value.open();
};

const handleBatchPrice = () => {
    priceModalEl.value.open();
};

const handleBatchStock = () => {
    stockModalEl.value.open();
};
const handleBatchSpecialPrice = () => {
    specialPriceModalEl.value.open();
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
</script>