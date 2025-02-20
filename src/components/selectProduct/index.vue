<template>
    <a-modal v-model:open="visible" title="选择资料库产品" :footer="null" :width="'95vw'" :zIndex="1000"
        :style="{ top: '10px', padding: 0, height: '100vh' }"
        :bodyStyle="{ height: 'calc(100vh - 100px)', overflow: 'auto' }" :maskClosable="false" :destroyOnClose="true">
        <div class="modal-content">
            <Search @search="handleSearch"></Search>
            <BaseTable ref="baseTableRef" :columns="columns" :api="storeList" :init-search-param="initSearchParam"
                :scroll="{ y: 'calc(100vh - 390px)', x: '3200px' }">
                <template #action="{ record }">
                    <a-button @click="handleDetail(record)" type="link">详情</a-button>
                    <a-button @click="handleSelect(record)" type="link">选中</a-button>
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
                    <div v-if="record.meansRelated && JSON.parse(record.meansRelated).length > 0">
                        <div v-for="(item, index) in meansRelated(record.meansRelated)" :key="index">
                            <span>
                                {{ item.sku }}
                            </span>
                        </div>
                    </div>
                    <div v-else> </div>
                </template>

                <template #status="{ record }">
                    <span v-if="record.status == 0">-</span>
                    <a-tag v-if="record.status == 1" color="success">已完成</a-tag>
                    <a-tag v-if="record.status == 2" color="warning">已下架</a-tag>
                    <a-tag v-if="record.status == 3" color="error">重拍中</a-tag>
                    <a-tag v-if="record.status == 4" color="default">待拍照</a-tag>
                </template>

                <template #classify="{ record }">
                    <a-tag color="success">{{ classify(record.classify) }}</a-tag>
                </template>

                <template #meansKeepGrain="{ record }">
                    <a-tag v-for="tag in meansKeepGrainMap(record.meansKeepGrain)" :key="tag.key" color="processing">{{
                        tag.label
                    }}</a-tag>
                </template>

                <template #completeTime="{ record }">
                    {{ record.completeTime }}
                </template>


                <template #phSelectionTime="{ record }">
                    {{ record.selectionTime ? record.selectionTime : record.completeTime }}
                </template>


                <template #devProhibitPlatform="{ record }">
                    <div v-html="devProhibitPlatform(record.devProhibitPlatform)"></div>
                </template>
                <template #tortType="{ record }">
                    <div>
                        <a-tag type="primary" danger v-if="record.tortType ? record.tortType.includes('1') : false"
                            effect="dark" style="margin-right: 5px">速卖通微侵权
                        </a-tag>
                        <a-tag type="primary" danger v-if="record.tortType ? record.tortType.includes('2') : false"
                            effect="dark">Shopee微侵权
                        </a-tag>
                    </div>
                </template>
                <template #meansForbidAttribute="{ record }">
                    <a-tag type="success" v-for="(item, index) in meansForbidAttribute(record.meansForbidAttribute)"
                        :key="index" style="margin-right: 5px;">{{
                            getAttrName(item) }}</a-tag>
                </template>

                <template #meansForbidSite="{ record }">
                    <a-tag v-for="tag in meansForbidSiteSplit(record.meansForbidSite)" :key="tag" color="red">{{
                        tagMap(tag)
                    }}</a-tag>
                </template>

                <template #meansRemark="{ record }">
                    <div style="width: 100%;text-overflow: ellipsis; overflow: hidden;white-space: nowrap;text-align: center;padding: 0 8px;"
                        v-if="record.meansRemark">
                        <span v-html="record.meansRemark.replace(/<[^>]+>/g, '')"></span>
                    </div>
                </template>
            </BaseTable>
        </div>

        <DetailModal ref="detailModalRef"></DetailModal>
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
import DetailModal from './detail/detailModal.vue';

const { userInfo, forbidSaleList } = useSelectProduct();
const initSearchParam = { order: "", prop: "" };
const baseTablEl = useTemplateRef('baseTableRef');
const detailModalEl = useTemplateRef('detailModalRef');
const emits = defineEmits(['select']);

const visible = ref(false);
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

function admin() {
    // return this.$auth.hasRole("admin");
    const super_admin = "admin";
    const userStore = useUserStore()
    const roles = userStore.roles
    if (roles && Array.isArray(roles) && roles.length > 0) {
        const roleFlag = 'admin'

        const hasRole = roles.some(role => {
            return super_admin === role || roleFlag.includes(role)
        })

        return hasRole
    }
    return false
};

const handleDetail = (record) => {
    detailModalEl.value.open(record);
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
    let oldSku = e.split(',');
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
// 侵权类型
const tortTypePer = () => {
    return userInfo.value.aliexpressTort == 1 || userInfo.value.shopeeTort == 1;
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
    return meansRelated ? JSON.parse(meansRelated) : []
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
        return ''
    }
    return meansKeepGrainTag(row)
};
const meansForbidAttribute = (str) => {
    return str ? str.split(',') : []
};

const getAttrName = (key) => {
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
    };
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
const meansForbidSiteSplit = (list) => {
    if (list) {
        return list.split(',');
    }
    return [];
};
const tagMap = (code) => {
    const tasStatus = {
        "01": "印尼",
        "02": "菲律宾",
        "03": "新加坡",
        "04": "泰国",
        "05": "马来西亚",
        "06": "越南",
        "07": "台湾",
        "08": "巴西",
        "09": "墨西哥",
        "10": "智利",
        "11": "哥伦比亚",
        "12": "波兰",
        "13": "法国",
        "14": "西班牙",
        "99": "全站点",
        "00": "无",
    };
    return tasStatus[code] || '';
};

const meansKeepGrainMap = (list) => {
    const tagList = [];
    const listSplit = list ? list.split(',') : [];
    listSplit.forEach((v) => {
        switch (v) {
            case '0':
            case '总仓':
                tagList.push({ key: v, label: '总仓' });
                break;
            case '1':
            case '馨拓靓仓':
                tagList.push({ key: v, label: '馨拓靓仓' });
                break;
            case '2':
            case 'PH海外仓':
                tagList.push({ key: v, label: 'PH海外仓' });
                break;
            case '3':
            case '馨拓美仓':
                tagList.push({ key: v, label: '馨拓美仓' });
                break;
            case '4':
            case 'TH海外仓':
                tagList.push({ key: v, label: 'TH海外仓' });
                break;
            case '5':
            case '亚马逊仓':
                tagList.push({ key: v, label: '亚马逊仓' });
                break;
            default:
                break;
        }
    });
    return tagList;
};



defineExpose({ openModal });

</script>

<style scoped>
.modal-content {
    padding: 24px;
}
</style>