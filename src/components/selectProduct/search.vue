<template>
    <div>
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }" layout="inline" :model="formData"
                labelAlign="left">
                <a-form-item label="产品分类：">
                    <a-cascader placeholder="产品分类" allowClear v-model:value="formData.classify"
                        :options="commodityTypeList" style="width: 220px;" :allow-clear="true"
                        :field-names="{ label: 'label', value: 'value', children: 'children' }" />
                </a-form-item>
                <a-form-item label="完成状态：">
                    <a-select v-model:value="formData.status" :options="storeStatus" style="width: 220px;"
                        placeholder="完成状态" allowClear></a-select>
                </a-form-item>
                <a-form-item label="禁售站点：">
                    <a-select v-model:value="formData.meansForbidSite" :options="sheepProhibitionSelect"
                        style="width: 220px;" placeholder="禁售站点" allowClear></a-select>
                </a-form-item>
                <a-form-item label="禁售属性：">
                    <a-select :options="forbidSaleList" style="width: 220px;" placeholder="禁售属性"
                        v-model:value="formData.meansForbidAttribute"
                        :field-names="{ label: 'attributes', value: 'key' }" allowClear>
                    </a-select>
                </a-form-item>
                <a-form-item label="仓储类别：">
                    <a-select v-model:value="formData.preciseMeansKeepGrain" :options="meansKeepGrains"
                        style="width: 220px;" placeholder="禁售站点" allowClear></a-select>
                </a-form-item>
                <a-form-item label="市场方向：">
                    <a-select v-model:value="formData.devAttributableMarket"
                        :options="devAttributableMarketRevertSelect" style="width: 220px;" placeholder="市场方向"
                        allowClear></a-select>
                </a-form-item>
            </a-form>

            <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }" style="margin-top: 10px;" layout="inline"
                labelAlign="left">
                <a-form-item label=" 成本筛选：">
                    <div
                        style="display: flex;justify-content: center;align-items: center;font-size: 14px; width: 220px;">
                        <a-input-number placeholder="最小值" v-model:value="formData.skuCostsMin" style="width: 105px;"
                            :controls="false"></a-input-number>
                        <div style="margin: 0 5px">-</div>
                        <a-input-number placeholder="最大值" v-model:value="formData.skuCostsMax" style="width: 105px;"
                            :controls="false"></a-input-number>
                    </div>
                </a-form-item>
                <a-form-item label="审核时间：">
                    <a-range-picker style="width: 220px" v-model:value="formData.meansAuditTime" allowClear />
                </a-form-item>

                <a-form-item label="重量筛选：">
                    <div
                        style="display: flex;justify-content: center;align-items: center;font-size: 14px; width: 220px;">
                        <a-input-number placeholder="最小值" v-model:value="formData.skuWeightMin" style="width: 105px;"
                            :controls="false"></a-input-number>
                        <div style="margin: 0 5px">-</div>
                        <a-input-number placeholder="最大值" v-model:value="formData.skuWeightMax" style="width: 105px;"
                            :controls="false"></a-input-number>
                    </div>
                </a-form-item>
            </a-form>

            <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }" style="margin-top: 10px;" layout="inline"
                labelAlign="left">
                <a-form-item label="模糊查找：">
                    <div flex gap-10px>
                        <a-input v-model:value="formData.tradeName" style="width: 200px"
                            placeholder="分词查找产品名称"></a-input>
                    </div>
                </a-form-item>
                <a-form-item label="">
                    <div flex gap-10px>
                        <a-input v-model:value="formData.developPerson" placeholder="开发人员"></a-input>
                        <a-input v-model:value="formData.accurateTradeName" placeholder="商品名"></a-input>
                        <a-input v-model:value="formData.sku" placeholder="SKU"></a-input>
                        <a-input v-model:value="formData.description" placeholder="描述"> </a-input>

                        <a-button type="primary" @click="searchForm"> 查询 </a-button>
                        <a-button type="default" @click="handleReset"> 重置 </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { useSelectProduct } from './useSelectProduct';
import _ from "lodash";
const { commodityTypeList, storeStatus, sheepProhibitionSelect, forbidSaleList, meansKeepGrains, devAttributableMarketRevertSelect
} = useSelectProduct();

const { state: formData, reset } = useResetReactive({
    classify: [],
    meansForbidSite: undefined,
    meansForbidAttribute: undefined,
    preciseMeansKeepGrain: undefined,
    devAttributableMarket: undefined,
    skuCostsMin: "",
    description: "",
    skuWeightMin: "",
    skuWeightMax: "",
    meansAuditTime: [],    //审核时间
    tradeName: "",    //产品名称

    developPerson: '',
    accurateTradeName: '',
    sku: '',
    description: ''
})

const searchForm = () => {
    const meansAuditTimeStart = formData.meansAuditTime[0] ?? ''; // 开始时间
    const meansAuditTimeEnd = formData.meansAuditTime[1] ?? ''; // 结束时间
    const copyFormData = _.cloneDeep(formData);
    delete copyFormData.meansAuditTime
    emits('search', {
        ...copyFormData,
        preciseMeansKeepGrain: false,
        classify: formData.classify.join(","),
        meansAuditTimeStart: meansAuditTimeStart,
        meansAuditTimeEnd: meansAuditTimeEnd,
    })
};

const handleReset = () => {
    reset();
    emits('search', {
        ...formData,
        classify: formData.classify.join(","),
        // meansAuditTime
        meansAuditTimeStart: formData.meansAuditTime[0] ?? '', // 开始时间
        meansAuditTimeEnd: formData.meansAuditTime[1] ?? '', // 结束时间
    });
}

const emits = defineEmits(['search'])

</script>

<style lang="less" scoped></style>