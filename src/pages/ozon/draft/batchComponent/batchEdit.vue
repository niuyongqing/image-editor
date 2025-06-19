<template>
    <div>
        <!--  批量编辑 弹窗-->
        <a-modal v-model:open="visible" title="批量编辑" width="1400px" @cancel="cancel" :footer="null" style="top: 20px">
            <div my-15px>
                <a-breadcrumb separator=">">
                    <a-breadcrumb-item>Ozon产品</a-breadcrumb-item>
                    <a-breadcrumb-item>采集箱</a-breadcrumb-item>
                    <a-breadcrumb-item>批量编辑</a-breadcrumb-item>
                </a-breadcrumb>
            </div>

            <a-card title="选择批量编辑的信息" :bordered="true" :style="{ margin: '0 auto', borderRadius: '0px' }">
                <div flex>
                    <div>
                        <a-checkbox v-model:checked="state.checkAll" @change="onCheckAllChange">
                            <span font-bold> 全部 </span>
                        </a-checkbox>
                    </div>
                    <div ml-80px>
                        <a-checkbox-group w-150px v-model:value="state.checkedList" class="checkGroup">
                            <a-row>
                                <a-col :span="24">
                                    <a-checkbox value="A"><span font-bold>变种信息</span></a-checkbox>
                                </a-col>
                                <a-col :span="24">
                                    <a-checkbox value="B">SKU标题</a-checkbox>
                                </a-col>
                                <a-col :span="24">
                                    <a-checkbox value="E">条形码</a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </div>
                    <div w-300px ml-80px>
                        <a-checkbox-group v-model:value="state.checkedList">
                            <a-row>
                                <a-col :span="24">
                                    <a-checkbox value="A"><span font-bold>变种信息</span></a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="B">SKU标题</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="E">条形码</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="C">变种图片</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="E">尺寸</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="D">售价</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="E">重量</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="E">原价</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="E">库存</a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </div>
                </div>
            </a-card>


            <div w-full flex justify-between>
                <div flex text-left pt-15px>
                    <div> <a-tag color="#108ee9"> 说明! </a-tag> </div>
                    <div>
                        <span class="text-#999"> 1、点击表格中的内容，可进行编辑操作！ </span><br />
                        <span class="text-#999"> 2、若设置了SKU标题，则以SKU标题为准！ </span>
                    </div>
                </div>
                <div style="align-content: end">
                    <a-dropdown>
                        <a-button style="height: 32px;">
                            一键翻译
                            <DownOutlined />
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item key="1">
                                    中文—>俄语
                                </a-menu-item>
                                <a-menu-item key="2">
                                    英文—>俄语
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>

                    <a-button type="primary"
                        style="height: 32px; background-color: #FF8345; color: #fff; margin-left: 10px;">保存</a-button>
                </div>
            </div>

            <!-- 表格 -->
            <div mt-15px>
                <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ y: 500 }">
                    <template #headerCell="{ column, title }">
                        <template v-if="column.key === 'product'">
                            <div bg-green-4>{{ title }} </div>
                        </template>
                        <template v-if="column.key === 'image'">
                            <div bg-green-4>{{ title }} </div>
                        </template>
                        <template v-if="column.key === 'title'">
                            <div bg-green-4>{{ title }} </div>
                        </template>
                        <template v-if="column.key === 'variantInfo'">
                            <div bg-red-4>{{ title }} </div>
                        </template>
                        <template v-if="column.key === 'variantName'">
                            <div bg-red-4>{{ title }} </div>
                        </template>
                        <template v-if="column.key === 'variantSku'">
                            <div bg-red-4>{{ title }} </div>
                        </template>
                    </template>

                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'image'">
                            <div bg-green-4> {{ record.image }} </div>
                        </template>

                        <template v-if="column.key === 'title'">
                            <div bg-green-4> {{ record.title }} </div>
                        </template>

                        <template v-if="column.key === 'variantName'">
                            <div bg-red-4> {{ record.variantName }} </div>
                        </template>

                        <template v-if="column.key === 'variantSku'">
                            <div bg-red-4> {{ record.variantSku }} </div>
                        </template>

                        <template v-if="column.key === 'action'">
                            <a-button type="link" @click="edit(record)">编辑</a-button>
                        </template>
                    </template>
                </a-table>
            </div>

        </a-modal>
    </div>
</template>

<script setup>
import { DownOutlined } from '@ant-design/icons-vue';

const tableData = ref([
    {
        image: 'https://via.placeholder.com/150',
        title: '产品标题',
        variantName: '变种名称',
        variantSku: '变种SKU',
    },

    {
        image: 'https://via.placeholder.com/150',
        title: '产品标题',
        variantName: '变种名称',
        variantSku: '变种SKU',
    },
]);
const visible = ref(false);
const acceptParams = ref([]);
const state = reactive({
    checkAll: false,
    checkedList: [],
});
const columns = [
    {
        title: '产品信息',
        dataIndex: 'product',
        key: 'product',
        children: [
            {
                title: '图片',
                dataIndex: 'image',
                key: 'image',
                align: 'center',
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                align: 'center',
            },
        ]
    },
    {
        title: '变种信息',
        dataIndex: 'variantInfo',
        key: 'variantInfo',
        align: 'center',
        children: [
            {
                title: '变种名称',
                dataIndex: 'variantName',
                key: 'variantName',
                align: 'center',
            },
            {
                title: '变种SKU',
                dataIndex: 'variantSku',
                key: 'variantSku',
                align: 'center',
            },
        ]
    },

    {
        title: '',
        dataIndex: 'option',
        key: 'option',
        children: [
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
            },

        ]
    },
];


const cancel = () => {
    visible.value = false;
};

const onCheckAllChange = (e) => {
    console.log(e);
};


const open = (data) => {
    visible.value = true;
    acceptParams.value = data;
};

const emits = defineEmits(['success']);
defineExpose({
    open,
});

</script>
<style scoped>
.checkGroup {
    margin-left: 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}

:deep(.ant-table-wrapper .ant-table-thead>tr>th) {
    padding: 1px !important;
}

:deep(.ant-table-wrapper .ant-table-tbody>tr>td) {
    padding: 0px !important;
}
</style>