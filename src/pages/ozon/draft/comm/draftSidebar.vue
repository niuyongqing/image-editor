<template>
    <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
        <template #title>
            <div flex justify-between class="nav-title">
                <div> 在线产品 </div>
            </div>
        </template>

        <div :class="active === 'all' ? 'ozon-active' : 'default'">
            <div text-left pl-10px cursor-pointer @click="selectActive('all')">
                「ozon」采集箱(<span>112</span>)</div>
        </div>
    </a-card>
    <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
        <template #title>
            <div flex justify-between class="nav-title">
                <div> 待发布产品 </div>
                <div>
                    <a-button type="link" @click="setting">
                        <SettingOutlined />
                    </a-button>
                </div>
            </div>
        </template>
        <div py-10px px-5px>
            <a-input-search v-model:value="waitPublishTreeValue" style="margin-bottom: 8px" placeholder="搜索分类名称"
                @search="onSearch" />
            <a-tree show-line :tree-data="waitPublishTreeData" defaultExpandAll v-if="waitPublishTreeData.length"
                v-model:selected-keys="selectedKeys" @select="selectNode">
                <template #title="{ title }">
                    <span>{{ title }}</span>
                </template>
            </a-tree>

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
                    <a-button type="link" @click="setting">
                        <SettingOutlined />
                    </a-button>
                </div>
            </div>
        </template>
        <div py-10px px-5px>
            <a-input-search v-model:value="onlineTreeValue" style="margin-bottom: 8px" placeholder="搜索分类名称"
                @search="onlineSearch" />
            <a-tree show-line :tree-data="onlineTreeData" defaultExpandAll v-if="onlineTreeData.length"
                v-model:selected-keys="selectedKeys" @select="selectNode">
                <template #title="{ title }">
                    <span>{{ title }}</span>
                </template>
            </a-tree>
        </div>
    </a-card>

    <ManageCategories ref="manageCategoriesRef" />
</template>

<script setup>
import { SettingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import ManageCategories from './manageCategories.vue';
import { cloneDeep } from 'lodash';
const active = ref('all');
const selectedKeys = ref([]);

const waitPublishTreeValue = ref(''); // 待发布产品搜索
const waitPublishTreeData = ref([]);
const copyTreeData = ref([]);

const onlineTreeValue = ref(''); // 在线产品搜索
const onlineTreeData = ref([]);
const copyOnlineTreeData = ref([]);

const manageCategoriesEl = useTemplateRef('manageCategoriesRef');

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


const selectActive = (e) => {
    active.value = e;
}

const selectNode = (keys, info) => {

    selectedKeys.value = [info.node.key];
    active.value = '';
    emits('search', { deptId: info.node.key });
};
// 管理分类设置
const setting = () => {
    manageCategoriesEl.value.openModal();
};

watch(waitPublishTreeValue, () => {
    onSearch();
});

watch(onlineTreeValue, () => {
    onlineSearch();
});


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

// 在线产品搜索
const onlineSearch = () => {
    if (onlineTreeValue.value) {
        const result = filterTreeWithParents(onlineTreeData.value, node =>
            node.title && node.title.includes(onlineTreeValue.value)
        );
        onlineTreeData.value = result;
    } else {
        onlineTreeData.value = copyOnlineTreeData.value;
    }
};

const emits = defineEmits(['search']);

onMounted(() => {
    waitPublishTreeData.value = [
        {
            title: '所有分类',
            key: '0-0',
            children: [
                {
                    title: 'parent 1-0',
                    key: '0-0-0',
                    children: [
                        {
                            title: 'leaf',
                            key: '0-0-0-0',
                        },
                        {
                            title: 'leaf',
                            key: '0-0-0-1',
                        },
                    ],
                },
                {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    children: [
                        {
                            key: '0-0-1-0',
                            title: 'sss',
                        },
                    ],
                },
            ],
        },
    ];

    copyTreeData.value = [
        {
            title: '所有分类',
            key: '0-0',
            children: [
                {
                    title: 'parent 1-0',
                    key: '0-0-0',
                    children: [
                        {
                            title: 'leaf',
                            key: '0-0-0-0',
                        },
                        {
                            title: 'leaf',
                            key: '0-0-0-1',
                        },
                    ],
                },
                {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    children: [
                        {
                            key: '0-0-1-0',
                            title: 'sss',
                        },
                    ],
                },
            ],
        },
    ];

    onlineTreeData.value = [
        {
            title: '所有分类',
            key: '0-0',
            children: [
                {
                    title: 'parent 1-0',
                    key: '0-0-01',
                    children: [
                        {
                            title: 'leaf',
                            key: '0-0-0-01',
                        },
                        {
                            title: 'leaf',
                            key: '0-0-0-111',
                        },
                    ],
                },
                {
                    title: 'parent 1-1',
                    key: '0-0-11',
                    children: [
                        {
                            key: '0-0-1-0',
                            title: 'sss1',
                        },
                    ],
                },
            ],
        },
    ];
    copyOnlineTreeData.value = cloneDeep(onlineTreeData.value);

    selectedKeys.value = [copyTreeData.value[0].key];
});
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
</style>
