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
                            <a-menu-item @click="handleGobalPlus()">
                                批量升级Gobal Plus
                            </a-menu-item>
                            <a-menu-item @click="handleDeactivated()">
                                批量下架
                            </a-menu-item>
                            <a-menu-item @click="handleWater()">
                                营销水印
                            </a-menu-item>
                            <a-menu-item @click="handleRemark()">
                                批量备注
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>

            <div>
                <a-button @click="warehouseSetting" type="link" style="height: 32px; margin-left: 10px; ">
                    <SettingOutlined />
                    仓库管理
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

                <a-dropdown>

                    <a-button type="primary" style="height: 32px;  margin-left: 10px;">
                        导出
                        <DownOutlined />
                    </a-button>

                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="exportProduct">
                                按页导出
                            </a-menu-item>
                            <a-menu-item @click="exportPrice">
                                按勾选导出
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>


                <a-button type="primary" style="height: 32px;  margin-left: 10px;">
                    同步产品
                </a-button>
            </div>
        </div>
    </div>
    <WarehouseSetting ref="warehouseSettingRef" />
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { DownOutlined, SettingOutlined } from "@ant-design/icons-vue";
import WarehouseSetting from './warehouseSetting.vue'; // 仓库管理
import { useLadazaAttrs } from "@/stores/lazadaAttrs";

const router = useRouter()
const warehouseSettingEl = useTemplateRef('warehouseSettingRef');
const { state: lazadaAttrsState, setShortCode, setLazadaAttrs, setLoading, reset } = useLadazaAttrs();
const handleEdit = () => {

};
const handleGobalPlus = () => {

};
const handleDeactivated = () => {
};
const handleWater = () => {
};
const handleRemark = () => {
};

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
//  同步所有产品
const syncProduct = () => { }

//  同步选中产品
const syncSelectProduct = () => {

};
// 同步可升级产品
const syncUpProduct = () => {

};

</script>

<style lang="less" scoped></style>