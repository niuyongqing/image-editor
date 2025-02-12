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
                            <a-menu-item @click="handleEdit()">
                                批量编辑
                            </a-menu-item>
                            <a-menu-item @click="handlePublish()">
                                立即发布
                            </a-menu-item>
                            <a-menu-item @click="handleRemark()">
                                批量备注
                            </a-menu-item>
                            <a-menu-item @click="handleBatchPrice()">
                                批量修改价格
                            </a-menu-item>
                            <a-menu-item @click="handleStock()">
                                批量修改库存
                            </a-menu-item>
                            <a-menu-item @click="handleSpecialPrice()">
                                批量修改促销价
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            <div>
                <a-button @click="warehouseSetting" type="link" style="height: 32px; margin-left: 10px; ">
                    <SettingOutlined /> 仓库管理
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
            </div>
        </div>
    </div>
    <WarehouseSetting ref="warehouseSettingRef" />
    <RemarkModal ref="remarkModalRef"></RemarkModal>
    <PriceModal ref="priceModalRef" @success="priceSuccess"></PriceModal>
    <StockModal ref="stockModalRef" @success="stockSuccess"></StockModal>
    <SpecialPriceModal ref="specialPriceModalRef" @success="specialPriceSuccess"></SpecialPriceModal>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { DownOutlined, SettingOutlined } from "@ant-design/icons-vue";
import WarehouseSetting from './warehouseSetting.vue'; // 仓库管理
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import RemarkModal from './batchModal/remarkModal.vue';
import PriceModal from './batchModal/priceModal.vue';
import SpecialPriceModal from './batchModal/specialPriceModal.vue';
import StockModal from './batchModal/stockModal.vue';

const { selectedRows } = defineProps({
    //  表格选中的数据
    selectedRows: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['success']);

const router = useRouter();
const remarkModalEl = useTemplateRef('remarkModalRef');
const warehouseSettingEl = useTemplateRef('warehouseSettingRef');
const priceModalEl = useTemplateRef('priceModalRef');
const stockModalEl = useTemplateRef('stockModalRef');
const specialPriceModalEl = useTemplateRef('specialPriceModalRef');
const { state: lazadaAttrsState, setShortCode, setLazadaAttrs, setLoading, reset } = useLadazaAttrs();

// 仓库管理
const warehouseSetting = () => {
    warehouseSettingEl.value.open();
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

const handleEdit = () => { };
const handleGobalPlus = () => { };

const handleRemark = () => {
    remarkModalEl.value.open();
};

const handleBatchPrice = () => {
    priceModalEl.value.open();
};
const handleStock = () => {
    stockModalEl.value.open();
};
const handleSpecialPrice = () => {
    specialPriceModalEl.value.open();
};

// 批量发布
const handlePublish = () => { };
const priceSuccess = () => {
    emits('success');
};
const stockSuccess = () => {
    emits('success');
};
const specialPriceSuccess = () => {
    emits('success');
};
</script>