<template>
    <div mb-15px>
        <a-card style="text-align: left;">
            <template #title>
                ERP信息 <span style="color: #9fa0a2">（注：下列信息，仅在店小秘系统生效）</span>
            </template>
            <a-form :model="formData" ref="formRef" :label-col="{ span: 3 }">
                <a-form-item label="ERP分类" name="erpProductId">
                    <a-dropdown trigger="click" v-model:open="openDropdown">
                        <a-button style="width: 300px; height: 32px;">
                            <div flex>
                                <div w-280px text-left> 分类管理 </div>
                                <DownOutlined />
                            </div>
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-input-search v-model:value="treeValue" style="margin-bottom: 8px"
                                    placeholder="搜索分类名称" @search="onSearch" />
                                <a-tree show-line :tree-data="treeData" defaultExpandAll v-if="treeData.length"
                                    v-model:selected-keys="selectedKeys" @select="selectNode">
                                    <template #title="{ title }">
                                        <span>{{ title }}</span>
                                    </template>
                                </a-tree>
                            </a-menu>
                        </template>
                    </a-dropdown>
                    <a-button type="link" @click="showCategoryModal"> + 管理分类 </a-button>
                </a-form-item>

                <a-form-item label="来源URL" name="sourceUrl">
                    <div v-for="(item, index) in sourceUrlList" mb-12px>
                        <a-input v-model:value="item.sourceUrl" placeholder="请输入ERP产品名称" style="width: 90%;">
                            <template #addonBefore>
                                {{ index + 1 }}
                            </template>
                            <template #addonAfter>
                                <a-button type="link" @click="visitUrl" style="height: 20px; line-height: 20px;">
                                    访问
                                </a-button>
                            </template>
                        </a-input>
                        <a-button type="link" @click="handlePlus">
                            <PlusOutlined></PlusOutlined>
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>

        <ManageCategories ref="manageCategoriesRef" />
    </div>
</template>

<script setup>
import { DownOutlined, PlusOutlined } from '@ant-design/icons-vue';
import ManageCategories from '@/pages/ozon/draft/comm/manageCategories.vue';

const manageCategoriesEl = useTemplateRef('manageCategoriesRef');
const formRef = ref(null)
const formData = reactive({
    erpProductId: '',
    sourceUrl: '',
});
const sourceUrlList = ref([{}]); // 来源URL列表
const openDropdown = ref(false); // 下拉框是否打开

const selectedKeys = ref([]);
const treeValue = ref(''); // 待发布产品搜索
const treeData = ref([
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
]);
const copyTreeData = ref([{
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
}]);

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
// 待发布产品搜索
const onSearch = () => {
    if (treeValue.value) {
        const result = filterTreeWithParents(treeData.value, node =>
            node.title && node.title.includes(treeValue.value)
        );
        treeData.value = result;
    } else {
        treeData.value = copyTreeData.value;
    }
};
watch(treeValue, () => {
    onSearch();
});

const selectNode = (keys, info) => {
    selectedKeys.value = [info.node.key];

    openDropdown.value = false;
};

const visitUrl = () => {
    console.log('访问');
};

//  新增
const handlePlus = () => {
    console.log('点击了');
    sourceUrlList.value.push({});
};


//  管理分类-弹窗
const showCategoryModal = () => {
    manageCategoriesEl.value.openModal();
};
</script>