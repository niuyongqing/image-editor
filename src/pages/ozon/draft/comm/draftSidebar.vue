<template>
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
            <typeTree v-model:current-class="currentClass" v-model:node-path="nodePath" platform="ozon"
                @update:currentClass="updateCurrentClass" ref="typeTreeRef">
            </typeTree>

            <div :class="active === 'wait' ? 'ozon-active' : 'default'">
                <div text-left pl-10px cursor-pointer @click="selectActive('wait')">
                    定时发布(<span>112</span>)</div>
            </div>

            <div :class="active === 'timing' ? 'ozon-active' : 'default'">
                <div text-left pl-10px cursor-pointer @click="selectActive('timing')">
                    定时中(<span>112</span>)</div>
            </div>

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
            <typeTree v-model:current-class="currentClass" v-model:node-path="nodePath" platform="ozon"
                @update:currentClass="updateCurrentClass" ref="typeTreeRef">
            </typeTree>
        </div>
    </a-card>

    <!--  待发布产品分类管理 -->
    <ManageCategories ref="waitPublishManageRef" v-model:modal-open="waitPublishManageOpen" platform="ozon"
        @updateTree="waitPublishUpdateTree" />
    <!-- 在线产品分类管理 -->
    <typeManage v-model:modal-open="typeManageOpen" platform="ozon" @updateTree="updateTree">
    </typeManage>
</template>

<script setup>
import { SettingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import ManageCategories from './manageCategories.vue';
import typeTree from '@/components/classificationTree/typeTree.vue';
import typeManage from '@/components/classificationTree/typeManage.vue';


const { count } = defineProps({
    count: {
        type: Number,
        default: 0
    }
})
const typeTreeEl = useTemplateRef('typeTreeRef');
const currentClass = ref('0');
const nodePath = ref('');
const typeManageOpen = ref(false);

const waitPublishManageOpen = ref(false);

const active = ref('all');
const selectedKeys = ref([]);

const waitPublishTreeValue = ref(''); // 待发布产品搜索
const waitPublishTreeData = ref([]);
const copyTreeData = ref([]);

const waitPublishManageEl = useTemplateRef('waitPublishManageRef');

function filterTreeWithParents(nodes, predicate) {
    return nodes
        .map(node => ({ ...node }))
        .filter(node => {
            if (node.children) {
                node.children = filterTreeWithParents(node.children, predicate);
            }
            return predicate(node) || (node.children && node.children.length > 0);
        });
};

//  更新在线产品信息
const updateTree = () => {
    typeTreeEl.value.updateTree();
};

const waitPublishUpdateTree = () => {
    waitPublishManageEl.value.updateTree();
};

const selectActive = (e) => {
    active.value = e;
    currentClass.value = '0';
    emits('updateClass', true);
}

const selectNode = (keys, info) => {
    selectedKeys.value = [info.node.key];
    active.value = '';
    emits('search', { deptId: info.node.key });
};
// 管理分类设置
const setting = () => {
    waitPublishManageOpen.value = true;
};

watch(waitPublishTreeValue, () => {
    onSearch();
});

// 更新当前选中节点
const updateCurrentClass = (value) => {
    if (!value) return;
    active.value = '';
    emits('updateClass', false);
};

// 待发布产品搜索
const onSearch = () => {
    if (waitPublishTreeValue.value) {
        const result = filterTreeWithParents(waitPublishTreeData.value, node =>
            node.title && node.title.includes(waitPublishTreeValue.value)
        );
        waitPublishTreeData.value = result;
    } else {
        waitPublishTreeData.value = copyTreeData.value;
    }
};

const emits = defineEmits(['updateClass']);
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
