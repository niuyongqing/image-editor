<template>
    <div mb-15px>
        <a-card style="text-align: left;">
            <template #title>
                ERP信息 <span style="color: #9fa0a2">（注：下列信息，仅在本系统生效）</span>
            </template>
            <a-form :model="formData" ref="formRef" :label-col="{ span: 3 }">
                <a-form-item label="ERP分类" name="erpProductId">
                    <a-dropdown trigger="click" v-model:open="openDropdown">
                        <a-button style="width: 300px; height: 32px;">
                            <div flex>
                                <div w-280px text-left> {{ nodeName ? nodeName : '请选择分类' }} </div>
                                <DownOutlined />
                            </div>
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <typeTree v-model:current-class="currentClass" v-model:node-path="nodePath"
                                    platform="ozon" ref="typeTreeRef" @update:nodePath="updateNodePath">
                                </typeTree>
                            </a-menu>
                        </template>
                    </a-dropdown>
                    <a-button type="link" @click="showCategoryModal"> + 管理分类 </a-button>
                </a-form-item>

                <a-form-item label="来源URL" name="sourceUrl">
                    <div v-for="(item, index) in sourceUrlList" mb-12px>
                        <a-input v-model:value="item.sourceUrl" placeholder="用于记录供货渠道URL，方便采购。仅在店小秘显示，不会同步到Ozon平台！"
                            style="width: 90%;">
                            <template #addonBefore>
                                {{ index + 1 }}
                            </template>
                            <template #addonAfter>
                                <a-button type="link" @click="visitUrl(item.sourceUrl)"
                                    style="height: 20px; line-height: 20px;">
                                    访问
                                </a-button>
                            </template>
                        </a-input>
                        <a-button type="link" @click="handlePlus" v-if="index === 0">
                            <PlusOutlined></PlusOutlined>
                        </a-button>
                        <a-button type="link" @click="handleMinus(index)" v-else>
                            <CloseOutlined></CloseOutlined>
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>

        <typeManage v-model:modal-open="typeManageOpen" platform="ozon" @updateTree="updateTree">
        </typeManage>
    </div>
</template>

<script setup>
import { DownOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import typeTree from '@/components/classificationTree/typeTree.vue';
import typeManage from '@/components/classificationTree/typeManage.vue';

const updateNodePath = (nodePath) => {
    const nodePaths = nodePath.split(' > ');
    nodeName.value = nodePaths[nodePaths.length - 1];
};

const formRef = ref(null)
const formData = reactive({
    erpProductId: '',
    sourceUrl: '',
});
const sourceUrlList = ref([{}]); // 来源URL列表
const openDropdown = ref(false); // 下拉框是否打开

const typeTreeEl = useTemplateRef('typeTreeRef');
const currentClass = ref(0);
const nodePath = ref('');
const typeManageOpen = ref(false);
const nodeName = ref('');
const selectedKeys = ref([]);

// 更新当前选中节点
const updateTree = () => {
    typeTreeEl.value.updateTree();
    const nodePaths = nodePath.value.split(' > ');
    setTimeout(() => {
        nodeName.value = nodePaths[nodePaths.length - 1]
    }, 100);
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


const selectNode = (keys, info) => {
    selectedKeys.value = [info.node.key];
    openDropdown.value = false;
};

const visitUrl = (sourceUrl) => {
    window.open(sourceUrl);
};

//  新增
const handlePlus = () => {
    sourceUrlList.value.push({});
};
const handleMinus = (index) => {
    sourceUrlList.value.splice(index, 1);
}

//  管理分类-弹窗
const showCategoryModal = () => {
    typeManageOpen.value = true;
};
</script>