<template>
    <a-modal title="管理分类" v-model:open="visible" @cancel="handleCancel" :maskClosable="false" width="600px">
        <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="搜索分类名称"
            @search="onSearch" />
        <a-tree show-line :tree-data="treeData" defaultExpandAll v-if="treeData.length"
            v-model:selected-keys="selectedKeys" @select="selectNode" style="width: 480px;">
            <template #title="node">
                <div style="display: flex; align-items: center;">
                    <div :style="{
                        width: 200 - node.level * 25 + 'px',
                        overflow: 'hidden',
                        'text-overflow': 'ellipsis',
                        'white-space': 'nowrap',
                    }">
                        <a-input v-if="node.edit" v-model:value="node.title" @blur="blurNode(node)" ref="inputRef" />
                        <span v-else> {{ node.title }} </span>
                    </div>

                    <div style="width:150px; overflow: hidden">
                        <a-button type="link" @click="addNode(node)">
                            <PlusCircleOutlined />
                        </a-button>
                        <a-button type="link" v-if="node.level !== 1" @click="editNode(node)">
                            <EditOutlined />
                        </a-button>
                        <a-button type="link" danger v-if="node.level !== 1" @click="deleteNode(node)">
                            <DeleteOutlined />
                        </a-button>
                    </div>
                </div>
            </template>
        </a-tree>

        <template #footer>
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
        </template>
    </a-modal>
</template>

<script setup>
import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
const visible = ref(false);
const loading = ref(false);
const searchValue = ref(''); // 待发布产品搜索
const width = ref(100);
const inputEl = useTemplateRef('inputRef');
const copyTreeData = ref([
    {
        title: '所有分类',
        key: '0-0',
        level: 1, // 层级
        children: [
            {
                title: 'parent 1-0',
                key: '0-0-0',
                level: 2, // 层级
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-0-0',
                        level: 3, // 层级
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-1',
                        level: 3, // 层级
                    },
                ],
            },
            {
                title: 'parent 1-1',
                key: '0-0-1',
                level: 2, // 层级
                children: [
                    {
                        key: '0-0-1-0',
                        title: 'sss',
                        level: 3, // 层级
                    },
                ],
            },
        ],
    },
]);
const treeData = ref([
    {
        title: '所有分类',
        key: '0-0',
        level: 1, // 层级
        edit: false,
        children: [
            {
                title: 'parent 1-0',
                key: '0-0-0',
                level: 2, // 层级
                edit: false,
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-0-0',
                        level: 3, // 层级
                        edit: false,
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-1',
                        level: 3, // 层级
                        edit: false,
                    },
                ],
            },
            {
                title: 'parent 1-1',
                key: '0-0-1',
                level: 2, // 层级
                edit: false,
                children: [
                    {
                        key: '0-0-1-0',
                        title: 'sss',
                        level: 3, // 层级
                        edit: false,
                    },
                ],
            },
        ],
    },
]);
const selectedKeys = ref([]);
const selectNode = (keys, info) => {
    selectedKeys.value = [info.node.key];
};

const addNode = (node) => {
    console.log('node', node);
    const { data } = node;
    const children = data.children || [];
    children.push({
        title: 'new node',
        key: node.key + '-' + children.length,
        level: node.level + 1,
    })
    data.children = children;
    data.edit = true;
};

const editNode = (node) => {
    console.log('node', node);
    const { data } = node;
    data.edit = true;
    nextTick(() => {
        inputEl.value.focus();
    })
};

const deleteNode = (node) => {
    Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk: () => {
            const { data } = node;
            console.log('node', node);
            message.success('删除成功');
        }
    })
};

//  失去焦点
const blurNode = (node) => {
    const { data } = node;
    data.edit = false;
};
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

const onSearch = () => {
    if (searchValue.value) {
        const result = filterTreeWithParents(treeData.value, node =>
            node.title && node.title.includes(searchValue.value)
        );
        treeData.value = result;
    } else {
        treeData.value = copyTreeData.value;
    }
};
watch(searchValue, () => {
    onSearch();
});

const handleCancel = () => {
    visible.value = false;
};

const onSubmit = () => {
    visible.value = false;
};

const openModal = () => {
    visible.value = true;
    selectedKeys.value = [];
};

const closeModal = () => {
    visible.value = false;
};

const emits = defineEmits('success');

defineExpose({
    openModal,
})

</script>
