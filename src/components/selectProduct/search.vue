<template>
    <div>
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <a-form :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }" layout="inline" :model="formData"
                labelAlign="left">
                <a-form-item label="产品分类：">
                    <a-cascader placeholder="产品分类" allowClear v-model:value="formData.classify"
                        :options="commodityTypeList" style="width: 150px;" :allow-clear="true"
                        :field-names="{ label: 'label', value: 'value', children: 'children' }" />
                </a-form-item>
                <a-form-item label="完成状态：">
                    <a-select v-model:value="formData.status" :options="storeStatus" style="width: 150px;"
                        placeholder="完成状态" allowClear></a-select>
                </a-form-item>
                <a-form-item label="禁售站点：">
                    <a-select v-model:value="formData.meansForbidSite" :options="sheepProhibitionSelect"
                        style="width: 150px;" placeholder="禁售站点" allowClear></a-select>
                </a-form-item>
                <a-form-item label="禁售属性：">
                    <a-select :options="forbidSaleList" style="width: 150px;" placeholder="禁售属性"
                        v-model:value="formData.meansForbidAttribute"
                        :field-names="{ label: 'attributes', value: 'key' }" allowClear>
                    </a-select>
                </a-form-item>
                <a-form-item label="仓储类别：">
                    <a-input style="width: 150px;"></a-input>
                </a-form-item>
                <a-form-item label="市场方向：">
                    <a-input style="width: 150px;"></a-input>
                </a-form-item>
            </a-form>
            <!-- 
            <a-form :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }" style="margin-top: 10px;" layout="inline"
                labelAlign="left">
                <a-form-item label=" 成本筛选：">
                    <a-input></a-input>
                </a-form-item>
                <a-form-item label="审核时间：">
                    <a-input></a-input>
                </a-form-item>

                <a-form-item label="重量筛选：">
                    <a-input></a-input>
                </a-form-item>
            </a-form>

            <a-form :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" style="margin-top: 10px;" layout="inline"
                labelAlign="left">
                <a-form-item label="模糊查找：">
                    <div flex gap-10px>
                        <a-input></a-input>
                    </div>
                </a-form-item>
                <a-form-item label="">
                    <div flex gap-10px>
                        <a-input></a-input>
                        <a-input></a-input>
                        <a-input></a-input>
                        <a-input></a-input>

                        <a-button type="primary" @click="searchForm"> 查询 </a-button>
                        <a-button type="default" @click="handleReset"> 重置 </a-button>
                    </div>
                </a-form-item>


            </a-form> -->
        </a-card>
    </div>
</template>

<script setup>
import { useSelectProduct } from './useSelectProduct';
const { commodityTypeList, storeStatus, sheepProhibitionSelect, forbidSaleList } = useSelectProduct();
console.log('commodityTypeList', commodityTypeList);

const { state: formData, reset } = useResetReactive({
    classify: [],
    meansForbidSite: undefined,
    meansForbidAttribute: undefined
})

const searchForm = () => {
    console.log('search')
    emits('search')
};

const handleReset = () => {
    reset();
    emits('search', state);
}

const emits = defineEmits(['search'])

</script>

<style lang="less" scoped></style>