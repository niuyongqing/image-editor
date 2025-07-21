<template>
    <div w-300px>
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div flex justify-between class="nav-title">
                    <div> 在线产品 </div>
                </div>
            </template>
            <div :class="active === 'all' ? 'ozon-active' : 'default'">
                <div text-left pl-10px cursor-pointer @click="selectActive('all')">
                    「ozon」采集箱(<span>{{ count }}</span>)</div>
            </div>
        </a-card>
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div flex justify-between class="nav-title">
                    <div> 待发布产品 </div>
                    <div>
                        <a-button type="link" @click="typeManageOpen = true">
                            <SettingOutlined />
                        </a-button>
                    </div>
                </div>
            </template>
            <div py-10px px-5px>
                <typeTree v-model:current-class="currentClass" platform="public" @update:currentClass="waitCurrentClass"
                    ref="waitTypeTreeRef">
                </typeTree>
                <!-- <div :class="active === 'wait' ? 'ozon-active' : 'default'">
                <div text-left pl-10px cursor-pointer @click="selectActive('wait')">
                    定时发布(<span>112</span>)</div>
            </div>
            <div :class="active === 'timing' ? 'ozon-active' : 'default'">
                <div text-left pl-10px cursor-pointer @click="selectActive('timing')">
                    定时中(<span>112</span>)</div>
            </div> -->
                <div :class="active === 'fail' ? 'ozon-active' : 'default'">
                    <div text-left pl-10px cursor-pointer @click="selectActive('fail')">
                        发布失败(<span text-red-5 font-bold>112</span>)</div>
                </div>
            </div>
        </a-card>
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div flex justify-between class="nav-title">
                    <div> 在线产品 </div>
                    <div>
                        <a-button type="link" @click="typeManageOpen = true">
                            <SettingOutlined />
                        </a-button>
                    </div>
                </div>
            </template>
            <div py-10px px-5px>
                <typeTree v-model:current-class="currentClass" platform="public"
                    @update:currentClass="onlineCurrentClass" ref="onlineTypeTreeRef">
                </typeTree>
            </div>
        </a-card>
    </div>
    <!-- 在线产品分类管理 -->
    <typeManage v-model:modal-open="typeManageOpen" platform="public" @updateTree="updateTree">
    </typeManage>
</template>

<script setup>
import { SettingOutlined } from '@ant-design/icons-vue';
import typeTree from '@/components/classificationTree/typeTree.vue';
import typeManage from '@/components/classificationTree/typeManage.vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const { count } = defineProps({
    count: {
        type: Number,
        default: 0
    }
})
const waitTypeTreeEl = useTemplateRef('waitTypeTreeRef'); // 待发布产品分类
const onlineTypeTreeEl = useTemplateRef('onlineTypeTreeRef'); // 在线产品分类
const publishManageEl = useTemplateRef('publishManageRef');

const currentClass = ref('0');
const typeManageOpen = ref(false);
const active = ref('all');

//  更新在线产品信息
const updateTree = () => {
    waitTypeTreeEl.value.updateTree();
    onlineTypeTreeEl.value.updateTree();
};

const selectActive = (e) => {
    active.value = e;
    router.push({
        path: '/platform/ozon/draft'
    })
    emits('draftUpdateClass', {
        "productState": e === 'fail' ? 'PUBLISH_FAILED' : ''
    });
};

const waitCurrentClass = (value) => {
    if (!value) return;
    active.value = '';
    currentClass.value = value;
    router.push({
        path: '/platform/ozon/waitPublish'
    })
    emits('waitUpdateClass');
};

const onlineCurrentClass = (value) => {
    if (!value) return;
    active.value = '';
    currentClass.value = value;
    router.push({
        path: '/platform/ozon/product'
    })
    emits('onlineUpdateClass');
};

const emits = defineEmits(['draftUpdateClass', 'waitUpdateClass', 'onlineUpdateClass']);
onMounted(() => {
    if (route.path.includes('draft')) {
        active.value = 'all';
    } else if (route.path.includes('waitPublish')) {
        active.value = 'wait';
    } else if (route.path.includes('product')) {
        active.value = 'online';
    }
})

</script>
<style lang="less" scoped>
:deep(.ant-card-body) {
    padding: 0px
}

:deep(.ant-tree-node-selected) {
    color: #428bca;
    background: #eff2f9 !important;
}

:deep(.ant-card-head) {
    padding: 0px;
}

.nav-title {
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    padding-left: 12px;
    padding-right: 12px;
    height: 40px;
    line-height: 40px;
    color: #434649;
    font-weight: 600;
    background-color: #f2f2f2;
}

.ozon-active {
    border-left: 3px solid #428bca;
    color: #428bca;
    background: #eff2f9;
    padding: 8px;
}

.default {
    padding: 8px;
}

.text-color {
    color: #737679;
}

.node-name {
    font-size: 16px;
    font-weight: 500;
    width: 100%;
}
</style>
