<template>
    <div>
        <a-modal title="选择类目" v-model:open="visible" :maskClosable="false" @cancel="handleClose" :width="1100">
            <div :style="{ height: openSelect ? '420px' : 'auto' }">
                <div flex gap-10px>
                    <a-dropdown v-model:open="openSelect" trigger="">
                        <div flex gap-10px>
                            <a-input v-model:value="searchValue" style="width: 1000px;margin-bottom: 8px"
                                placeholder="搜索分类名称" />
                        </div>
                        <template #overlay>
                            <a-menu v-if="historyCategoryList.length > 0"
                                style="height: 400px; overflow-y: auto; text-align: left;">
                                <a-menu-item v-for="item in historyCategoryList" :key="item.value"
                                    @click="selectMenu(item)">{{ item.label }}</a-menu-item>
                            </a-menu>
                            <a-empty v-else />
                        </template>
                    </a-dropdown>
                    <a-button type="primary" @click="searchHistory">搜索</a-button>
                </div>
                <p> {{ selectItem.label }} </p>
            </div>
            <div flex gap-10px v-if="!openSelect">
                <a-card>
                    <div w-320px h-300px>
                        <a-dropdown v-model:open="firstState.open" trigger="">
                            <a-input-search v-model:value="firstState.value" placeholder="搜索" style="width: 320px"
                                @search="onSearchFirst" />
                            <template #overlay>
                                <a-menu style="height: 280px; overflow-y: auto; text-align: left;"
                                    v-model:selected-keys="firstState.selectKeys">
                                    <a-menu-item v-for="item in firstState.options" :key="item.value"
                                        @click="selectFirstItem(item)">
                                        <div flex>
                                            <div w-250px overflow-hidden text-ellipsis whitespace-nowrap> {{ item.label
                                            }}
                                            </div>
                                            <div>
                                                <RightOutlined />
                                            </div>
                                        </div>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                </a-card>

                <a-card>
                    <div w-320px h-300px>
                        <a-dropdown v-model:open="secondState.open" trigger="">
                            <a-input-search v-model:value="secondState.value" placeholder="搜索" style="width: 320px"
                                @search="onSearchSecond" />
                            <template #overlay>
                                <a-menu style="height: 280px; overflow-y: auto; text-align: left;"
                                    v-model:selected-keys="secondState.selectKeys">
                                    <a-menu-item v-for="item in secondState.options" :key="item.value"
                                        @click="selectSecondItem(item)">
                                        <div flex>
                                            <div w-250px overflow-hidden text-ellipsis whitespace-nowrap> {{ item.label
                                            }}
                                            </div>
                                            <div>
                                                <RightOutlined />
                                            </div>
                                        </div>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                </a-card>

                <a-card v-if="thirdState.options.length">
                    <div w-320px h-300px>
                        <a-dropdown v-model:open="thirdState.open" trigger="">
                            <a-input-search v-model:value="thirdState.value" placeholder="搜索" style="width: 320px"
                                @search="onSearchThird" />
                            <template #overlay>
                                <a-menu style="height: 280px; overflow-y: auto; text-align: left;"
                                    v-model:selected-keys="thirdState.selectKeys">
                                    <a-menu-item v-for="item in thirdState.options" :key="item.value"
                                        @click="selectThirdItem(item)">
                                        <div w-250px overflow-hidden text-ellipsis whitespace-nowrap> {{ item.label
                                        }}
                                        </div>
                                    </a-menu-item>
                                </a-menu>

                            </template>
                        </a-dropdown>
                    </div>
                </a-card>
            </div>
            <template #footer>
                <a-button type="primary" @click="handleSave">选择</a-button>
                <a-button @click="handleClose">关闭</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import { categoryTree } from '@/pages/ozon/config/api/product.js';
import { message } from 'ant-design-vue';
import { RightOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash'
const { account } = defineProps({
    account: {
        type: String,
        default: ''
    }
});
const searchValue = ref('');
const openSelect = ref(false); // 是否展开下拉菜单
const selectItem = ref({}); // 选中的历史分类
const visible = ref(false);
const treeData = ref([]);
const historyCategoryList = ref([]);
const copyFirstOpts = ref([]);
const copySecondOpts = ref([]);
const copyThirdOpts = ref([]);
const { state: firstState, reset: firstReset } = useResetReactive({
    options: [],
    open: true,
    value: '',
    selectKeys: [],
    selectValue: {},
});
const { state: secondState, reset: secondReset } = useResetReactive({
    options: [],
    open: true,
    value: '',
    selectKeys: [],
    selectValue: {},
});
const { state: thirdState, reset: thirdReset } = useResetReactive({
    options: [],
    open: true,
    value: '',
    selectKeys: [],
    selectValue: {},
});

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
const searchHistory = () => {
    if (searchValue.value) {
        openSelect.value = true;
        const filterData = filterTreeWithParents(treeData.value, node =>
            node.categoryName && node.categoryName.includes(searchValue.value)
        );
        function treeToList(tree, path = [], result = [], ids = []) {
            tree.forEach(node => {
                const newPath = [...path, node.categoryName];
                const newIds = [...ids, node.descriptionCategoryId];
                if (node.children && node.children.length > 0) {
                    treeToList(node.children, newPath, result, newIds);
                } else {
                    result.push({
                        label: newPath.join(' / '),
                        value: node.typeId,
                        ids: newIds,
                    });
                }
            });
            return result;
        };
        const list = treeToList(filterData) || [];
        historyCategoryList.value = list.filter((item) => {
            return item.label.split(' / ').length === 3
        })
    } else {
        message.info('请输入搜索条件');
    }
};


const onSearchFirst = (value) => {
    if (value) {
        const data = copyFirstOpts.value.filter((item) => {
            return item.label.includes(value)
        })
        firstState.options = data;
    } else {
        firstState.options = copyFirstOpts.value;
    }
};
const onSearchSecond = (value) => {
    if (value) {
        const data = copySecondOpts.value.filter((item) => {
            return item.label.includes(value)
        })
        secondState.options = data;
    } else {
        secondState.options = copySecondOpts.value;
    }
};
const onSearchThird = (value) => {
    if (value) {
        const data = copyThirdOpts.value.filter((item) => {
            return item.label.includes(value)
        })
        thirdState.options = data;
    } else {
        thirdState.options = copyThirdOpts.value;
    }
};

function getCategoryTree() {
    categoryTree({
        "account": account
    }).then(res => {
        treeData.value = res.data || [];
        firstState.options = treeData.value.map((item) => {
            return {
                ...item,
                label: item.categoryName,
                value: item.descriptionCategoryId,
            }
        });
        secondState.options = treeData.value[0].children.map((item) => {
            return {
                ...item,
                label: item.categoryName,
                value: item.descriptionCategoryId,
            }
        });
        thirdState.options = treeData.value[0].children[0].children.map((item) => {
            return {
                ...item,
                label: item.categoryName,
                value: item.descriptionCategoryId,
            }
        });
        firstState.open = true;
        secondState.open = true;
        thirdState.open = true;
        copyFirstOpts.value = cloneDeep(firstState.options);
        copySecondOpts.value = cloneDeep(secondState.options);
        copyThirdOpts.value = cloneDeep(thirdState.options);
    })
};
const handleSave = () => {
    if (!thirdState.selectValue.typeId) {
        message.info('请选择最后一级类目');
        return
    }
    openSelect.value = false;
    const findPathById = (id, tree) => {
        for (let item of tree) {
            if (item.descriptionCategoryId === id) {
                return {
                    ids: [item.descriptionCategoryId],
                    labels: [item.categoryName],
                };
            }
            if (item.children) {
                const path = findPathById(id, item.children);
                if (path) {
                    return {
                        ids: [item.descriptionCategoryId, ...path.ids],
                        labels: [item.categoryName, ...path.labels],
                    };
                }
            }
        }
        return null;
    };
    const path = findPathById(thirdState.selectValue.typeId, treeData.value);
    emits('select', {
        "label": path.labels,
        "value": thirdState.selectValue.typeId,
        "ids": path.ids
    });
    handleClose();
};
const selectMenu = (item) => {
    selectItem.value = item;
    emits('select', item)
    openSelect.value = false;
    searchValue.value = '';
    firstReset();
    secondReset();
    thirdReset();
    firstState.open = false;
    secondState.open = false;
    thirdState.open = false;
    historyCategoryList.value = [];
    visible.value = false;
};
const selectFirstItem = (item) => {
    firstState.selectKeys = [item.value];
    secondState.options = item.children.map((item) => {
        return {
            ...item,
            label: item.categoryName,
            value: item.descriptionCategoryId,
        }
    });
    secondState.open = true;
    firstState.selectValue = item;
    secondState.selectKeys = [];
    thirdReset();
};
const selectSecondItem = (item) => {
    secondState.selectKeys = [item.value];
    thirdState.options = item.children.map((item) => {
        return {
            ...item,
            label: item.categoryName,
            value: item.descriptionCategoryId,
        }
    });
    thirdState.open = true;
    secondState.selectValue = item;
    thirdState.selectKeys = [];
};


const selectThirdItem = (item) => {
    thirdState.selectKeys = [item.value];
    thirdState.selectValue = item;
}

const open = () => {
    visible.value = true;
    getCategoryTree();
};

const handleClose = () => {
    if (openSelect.value === true) {
        openSelect.value = false;
        return
    };
    openSelect.value = false;
    searchValue.value = '';
    firstReset();
    secondReset();
    thirdReset();
    firstState.open = false;
    secondState.open = false;
    thirdState.open = false;
    historyCategoryList.value = [];
    visible.value = false;
};

const emits = defineEmits(['select']);
defineExpose({
    open,
})
</script>
