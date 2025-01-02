<template>
    <a-modal v-model:open="visible" title="选择资料库产品" :footer="null" :width="'95vw'" :zIndex="1000"
        :style="{ top: 0, padding: 0, height: '100vh' }" :bodyStyle="{ height: 'calc(100vh - 55px)', overflow: 'auto' }"
        :maskClosable="false" :destroyOnClose="true">
        <div class="modal-content">
            <Search @search="handleSearch"></Search>
            <BaseTable ref="baseTableRef" :columns="columns" :api="storeList" :init-search-param="initSearchParam"
                :tableHeightOffset="150">
                <template #action="{ record }">
                    <a-button @click="handleSelect(record)" type="link">选择</a-button>
                </template>

                <template #artMainImage="{ record }">
                    <a-image-preview-group>
                        <a-image :width="50" v-for="(item, index) in artMainImageSrc(record)" :src="item"
                            :key="index" />
                    </a-image-preview-group>
                </template>
                <template #devAccount="{ record }">
                    <span v-if="record.devAccount == 0">暂无</span>
                    <span v-if="record.devAccount == 1">平台热销品</span>
                    <span v-if="record.devAccount == 2">平台趋势产品</span>
                    <span v-if="record.devAccount == 3">公司热销品周边产品</span>
                    <span v-if="record.devAccount == 4">季节、节日、重要事件相关产品</span>
                    <span v-if="record.devAccount == 5">市场热销品</span>
                    <span v-if="record.devAccount == 6">前瞻性产品</span>
                    <span v-if="record.devAccount == 7">其他</span>
                    <span v-if="record.devAccount == 8">菲律宾本土仓开发</span>
                </template>

                <template #devAttributableMarket="{ record }">
                    <div v-html="devAttributableMarket(record.devAttributableMarket)"></div>
                </template>
                <template #skuList="{ record }">
                    <div v-html="sortArrey(record.skuList)"></div>
                </template>
                <template #meansRelated="{ record }">
                    <div v-for="(item, index) in meansRelated(record.meansRelated)" :key="index">
                        {{ item.sku }}
                    </div>
                </template>

                <template #status="{ record }">
                    <span v-html="meansStatusTag1(record.status)"></span>
                </template>

                <template #classify="{ record }">
                    <div v-html="classify(record.classify)"></div>
                </template>

                <template #meansKeepGrain="{ record }">
                    <span v-html="meansKeepGrainTag1(record.meansKeepGrain)"></span>
                </template>

                <template #completeTime="{ record }">
                    {{ record.completeTime }}
                </template>

                <template #devProhibitPlatform="{ record }">
                    <div v-html="devProhibitPlatform(record.devProhibitPlatform)"></div>
                </template>

                <template #meansForbidAttribute="{ record }">
                    {{ record.meansForbidAttribute }}
                    <!-- <div v-for="(item, index) in record.meansForbidAttribute" :key="index" style="margin-right: 5px;">{{
                        getAttrName(item) }}</div> -->
                </template>

                <template #meansForbidSite="{ record }">
                    <span v-html="sheepProhibition1(record.meansForbidSite)"></span>
                </template>

                <template #meansRemark="{ record }">
                    <div style="width: 100%;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;text-align: center;padding: 0 8px;"
                        v-if="record.meansRemark"><span v-html="record.meansRemark.replace(/<[^>]+>/g, '')"></span>
                    </div>
                </template>
            </BaseTable>
        </div>
    </a-modal>
</template>

<script setup>
import Search from './search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { storeList } from '@/api/common/selectProduct';
import { columns } from './columns';
import { storeStatusTag, meansKeepGrainTag } from '@/utils/devStatusTag';
import classifyRevert from "@/utils/classifyRevert";
import devProhibitPlatformRevert from "@/utils/devProhibitPlatformRevert";
import sheepProhibitionSelect from "@/utils/sheepProhibitionSelect";
import sheepProhibition from "@/utils/sheepProhibition";
import { useSelectProduct } from './useSelectProduct';
import devAttributableMarketRevert from "@/utils/devAttributableMarketRevert";
const { forbidSaleList } = useSelectProduct();
const initSearchParam = { order: "", prop: "" };
const baseTablEl = useTemplateRef('baseTableRef');
const emits = defineEmits(['select']);

const visible = ref(true);
const openModal = () => {
    visible.value = true;
};

const handleOk = () => {
    visible.value = false;
};

const handleCancel = () => {
    visible.value = false;
};

// 搜索
const handleSearch = (formData) => {
    baseTablEl.value.search(formData);
};


const handleSelect = (record) => {
    emits('select', record);
    visible.value = false;
};

const artMainImageSrc = (record) => {
    if (record.artMainImage) {
        const imgs = JSON.parse(record.artMainImage).map(item => item.url);
        return [imgs[0]];
    }
    return []
};

const sortArrey = (e) => {
    let str = ''
    if (e == '' || e == null) {
        e = ''
    }
    let spanD = e.split(',');
    let oldSku = e.split(','); //原始错乱sku
    let b = [] //去除所有带标签的
    oldSku.map(item => {
        b.push(item.replace(/<[^>]+>/g, ''))
    })
    let newSku = b.sort(); //排序 正确的sku
    if (newSku.length == 0) {
        str = ''
    } else if (newSku.length == 1) {
        str = spanD[0]
    } else if (newSku.length > 1) {
        spanD.forEach(v => {
            if (v.includes(newSku[0])) {
                newSku[0] = v
            }
            if (v.includes(newSku[newSku.length - 1])) {
                newSku[newSku.length - 1] = v
            }
        })
        str = `${newSku[0]} - ${newSku[newSku.length - 1]}`
    }
    return str
};

// 市场方向
const devAttributableMarket = (record) => {
    if (record == '' || record == null) {
        return '-'
    }
    return devAttributableMarketRevert(record.split(","));
};
// 还原关联商品
const meansRelated = (meansRelated) => {
    if (meansRelated) {
        return JSON.parse(meansRelated);
    }
    return '-'
};
const meansStatusTag1 = (record) => {
    if (record == '' || record == null) {
        return '-'
    }
    return storeStatusTag(record)
};
// 分类还原
const classify = (record) => {
    if (record == '' || record == null) {
        return '-'
    }
    return classifyRevert(record.split(","))
};

// 禁止刊登平台
const devProhibitPlatform = (record) => {
    if (record == '' || record == null) {
        return '-'
    }
    return devProhibitPlatformRevert(record.split(","))
};

const meansKeepGrainTag1 = (row) => {
    if (row == '' || row == null) {
        return '-'
    }
    return meansKeepGrainTag(row)
};
const getAttrName = (key) => {
    console.log('forbidSaleList', forbidSaleList.value);
    let Aname1
    let Aname2;
    if (forbidSaleList.value.length > 0) {
        Aname1 = forbidSaleList.value.find(item => {
            return item.key == key
        })
        if (Aname1) {
            Aname2 = Aname1.attributes
        } else {
            Aname2 = ''
        }
    }
    return Aname2
};

const sheepProhibition1 = (row) => {
    if (row == '' || row == null) {
        return '-'
    }
    let tag = "";
    row.split(",").forEach((v) => {
        tag += sheepProhibition(v);
    })

    return tag;
};

defineExpose({ openModal });

</script>

<style scoped>
.modal-content {
    padding: 24px;
}
</style>