<template>
    <div class="mt-10px">
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 变种参数 </div>
            </template>
            <a-form>
                <a-form-item label="变种主题:">
                    <div>
                        <div class="flex items-center gap-12px">
                            <a-button type="link" v-for="item in lazadaAttrsState.skuAttrs" :key="item.name"
                                :disabled="disabledTheme(item)" @click="handleSelectTheme(item)">
                                <PlusCircleOutlined style="font-size: 14px" />
                                <span> {{ item.label }} </span>
                            </a-button>
                        </div>
                        <div class="flex">
                            <a-tag color="#108ee9"> 说明 </a-tag>
                            <span style="color: #737679"> Lazada接口限制，选择了两个变种主题时，Size不能作为第一个变种主题使用！ </span>
                        </div>
                    </div>
                </a-form-item>
            </a-form>
            <a-card v-for="(item, index) in selectThemeList" :key="item.name" class="mt-10px">
                <template #title>
                    <div flex items-center>
                        <div> 变种主题 {{ index + 1 }} ：<span v-if="item.is_mandatory === 1" class="required"> * </span>
                        </div>
                    </div>
                </template>
                <a-checkbox-group v-model:value="item.checkedList" @change="changeCheckedList(item)"
                    :style="item.options.length > 15 ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gridGap: '10px' } : { display: 'flex', flexWrap: 'wrap', gap: '10px' }">
                    <a-checkbox v-for="option in item.options" :key="option.en_name" :value="option.en_name">
                        <div class="flex">
                            <span v-if="!option.isEdit"> {{ option.en_name }} </span>

                        </div>
                    </a-checkbox>
                </a-checkbox-group>
            </a-card>
        </a-card>
    </div>
</template>

<script setup>
import { PlusCircleOutlined, EditOutlined, SaveOutlined, CloseOutlined, HomeOutlined, SwapOutlined } from '@ant-design/icons-vue';
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message, Modal } from 'ant-design-vue';
import EventBus from "~/utils/event-bus";
import { skuList } from '@/pages/lazada/product/api';
import { unique } from '@/pages/lazada/product/common';

const { detailData } = defineProps({
    detailData: {
        type: Object,
        default: () => ({})
    }
});
const { state: lazadaAttrsState, setSelectTheme, setSkuTable, setProductSkus, setSkuAttrs } = useLadazaAttrs();
const baseModalEl = useTemplateRef('baseModalRef');
const modalMethods = ref({});
const selectThemeList = ref([]); // 选择的变种主题列表
const themeLabel = ref(''); // 变种主题名称
const optionName = ref(''); // options label 名称
const themeLabelEl = useTemplateRef('themeLabelRef');
const { state, reset } = useResetReactive({
    oneCheckedList: undefined,
    twoCheckedList: undefined,
});
const register = (methods) => {
    modalMethods.value = methods;
};
const customTheme = ref('');
const themeList = ref([]);// 主题列表theme
const disabledTheme = (item) => {
    if (selectThemeList.value.length >= 2) {
        return true
    };

    const findItem = selectThemeList.value.find((themeItem) => {
        return item.label === themeItem.label
    });
    if (findItem) {
        return true
    }
    return false
}

const handleSelectTheme = (item) => {
    console.log('item', item);

    selectThemeList.value.push({
        ...item,
        options: item.options ? item.options : [],
        checkedList: [],
        isEdit: false,
        searchValue: ''
    });
    setSelectTheme(selectThemeList.value);
};

// 添加自定义属性
const addVariant = () => {
    modalMethods.value.openModal();
};
// 移除选中的变种主题
const handleRemove = (item, index) => {
    selectThemeList.value.splice(index, 1);
    if (!item.id) {
        lazadaAttrsState.skuAttrs.splice(index, 1);
    }
    setSelectTheme(selectThemeList.value);
};

const editSkuLabel = (item) => {
    item.isEdit = true;
    themeLabel.value = item.label;
};
//  保存sku-label
const saveSkuLabel = (item) => {
    item.isEdit = false;
    item.label = themeLabel.value;
};

//  关闭 sku-label
const closeSkuLabel = (item) => {
    item.isEdit = false;
};

const changeSearch = (item, evtValue) => {
    if (!evtValue) {
        item.options = item.skuOptions;
    };
    item.options = item.options.filter((option) => {
        //  不计较大小写
        return option.en_name.toLowerCase().includes(evtValue.toLowerCase())
    })
};

const checkOptions = (options) => {
    return options.map((item) => {
        return item.en_name
    });
};
const editOptionName = (option) => {
    optionName.value = option.en_name;
    option.isEdit = true;
};
const saveOptionName = (option, item) => {
    option.isEdit = false;
    if (optionName.value != option.en_name) {
        option.name = optionName.value;
        option.en_name = optionName.value;
        item.checkedList.push(optionName.value);
        changeCheckedList(item);
    };
    setSelectTheme(selectThemeList.value);
};

const closeOptionName = (option) => {
    option.isEdit = false;
};

const handleAddOther = (item) => {
    if (!item.otherValue) return;
    if (item.checkedList.includes(item.otherValue)) {
        message.warning('该属性已存在');
    } else {
        item.options.push({
            en_name: item.otherValue,
            name: item.otherValue
        });
        // item.skuOptions.push({
        //     en_name: item.otherValue,
        //     name: item.otherValue
        // });
        item.checkedList.push(item.otherValue);
        setSelectTheme(selectThemeList.value);
    };
    item.otherValue = '';
    changeCheckedList(item);
};

//  设为变种主题1
const move = (item) => {
    console.log('item', item);
    Modal.confirm({
        title: '提示',
        content: `确定将${item.label}设为变种主题1吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
            selectThemeList.value = [item, selectThemeList.value[0]]
            setSelectTheme(selectThemeList.value);
        },
    })
};

//  交换
const swap = () => {
    // closeSkuLabel();
    // selectThemeList.value 第一项的label/name和第二项的label/name交换
    const firstLabel = selectThemeList.value[0].label;
    const secondLabel = selectThemeList.value[1].label;
    const firstName = selectThemeList.value[0].name;
    const secondName = selectThemeList.value[1].name;

    selectThemeList.value[0].label = secondLabel;
    selectThemeList.value[1].label = firstLabel;
    selectThemeList.value[0].name = secondName;
    selectThemeList.value[1].name = firstName;

    setSelectTheme(selectThemeList.value);
};
// 选中的变种主题
const changeCheckedList = (item) => {
    EventBus.emit('changeCheckedList')
};

watch(() => lazadaAttrsState.primaryCategory, (newVal) => {
    selectThemeList.value = []
}, {
    deep: true,
    immediate: true
});
const submit = () => {

    if (!customTheme.value) return;
    const findItem = lazadaAttrsState.skuAttrs.find((item) => {
        return item.label === customTheme.value
    });
    if (findItem) {
        message.warning('该属性已存在');
        return;
    }
    // lazadaAttrsState.skuAttrs.push({
    //     label: customTheme.value,
    //     name: customTheme.value,
    //     is_mandatory: 0,
    //     input_type: 'multiEnumInput',
    //     options: []
    // });
    selectThemeList.value.push({
        label: customTheme.value,
        name: customTheme.value,
        is_mandatory: 0,
        options: [],
        checkedList: [],
        otherValue: '',
        searchValue: ''
    });

    customTheme.value = '';
    modalMethods.value.closeModal();
};

onMounted(() => {
    EventBus.on('delRow', (tableData) => {
        if (selectThemeList.value.length === 0) return;
        //  1种主题
        if (selectThemeList.value.length === 1) {
            let checkedList = selectThemeList.value[0].checkedList;
            const name = selectThemeList.value[0].name;
            const oneThemeList = tableData.map((item) => {
                return item[name]
            });
            if (JSON.stringify(selectThemeList.value[0].checkedList) !== JSON.stringify(oneThemeList)) {
                selectThemeList.value[0].checkedList = oneThemeList;
            };
        };
        //  2种主题
        if (selectThemeList.value.length === 2) {
            let checkedList = selectThemeList.value[0].checkedList;
            const name = selectThemeList.value[0].name;
            const oneThemeList = tableData.map((item) => {
                return item[name]
            });
            selectThemeList.value[0].checkedList = oneThemeList;
            let checkedList2 = selectThemeList.value[1].checkedList;
            const name2 = selectThemeList.value[1].name;
            const oneThemeList2 = tableData.map((item) => {
                return item[name2]
            });
            selectThemeList.value[1].checkedList = oneThemeList2;
        };
    });
    EventBus.on('siteEditSelectThemeEmit', (list) => {
        selectThemeList.value = list;
        // if (!lazadaAttrsState.skuAttrs.length) {
        //     console.log('lazadaAttrsState.skuAttrs.length', lazadaAttrsState.skuAttrs.length);
        //     // lazadaAttrsState.skuAttrs = selectThemeList.value;
        //     setSkuAttrs(selectThemeList.value); // 设置skuAttrs
        //     console.log('lazadaAttrsState.skuAttrs', lazadaAttrsState.skuAttrs);

        // }

    })
});

//  产品资料库回显
watch(() => lazadaAttrsState.product, (newValue) => {
    if (newValue && JSON.stringify(newValue) !== '{}') {
        skuList({ id: newValue.commodityId }).then((res) => {
            const data = res.data || [];
            const skus = data.map((item) => {
                const detail = JSON.parse(item.detail);
                return {
                    ...item,
                    detail: detail,
                };
            });
            console.log('skus', skus);
            setProductSkus(skus); // 设置产品sku
            let detailAttrs = skus.map((item) => {
                return {
                    en_name: item.detail.attr,
                    name: item.detail.attr
                }
            });
            const colorFamilyItem = lazadaAttrsState.skuAttrs.find((item) => item.name === "color_family");
            if (colorFamilyItem) {
                const list = [...colorFamilyItem.options, ...detailAttrs];
                const uni3 = unique('en_name', list); // 去重
                colorFamilyItem.options = uni3;
                colorFamilyItem.skuOptions = uni3;
                colorFamilyItem.checkedList = detailAttrs.map((item) => item.en_name);
                selectThemeList.value = [colorFamilyItem]; // 更新selectThemeList

            } else {
                if (lazadaAttrsState.skuAttrs.length) {
                    const list = [...colorFamilyItem.options, ...detailAttrs];
                    const uni3 = unique('en_name', list); // 去重
                    lazadaAttrsState.skuAttrs[0].options = uni3;
                    lazadaAttrsState.skuAttrs[0].skuOptions = uni3;
                    lazadaAttrsState.skuAttrs[0].checkedList = detailAttrs.map((item) => item.en_name);

                    selectThemeList.value = [lazadaAttrsState.skuAttrs[0]]; // 更新selectThemeList
                } else {
                    lazadaAttrsState.skuAttrs = [{
                        label: 'color_family',
                        name: 'color_family',
                        is_mandatory: 0,
                        input_type: 'multiEnumInput',
                        options: [...detailAttrs],
                        skuOptions: [...detailAttrs],
                        checkedList: detailAttrs.map((item) => item.en_name),
                        isEdit: false,
                        searchValue: ''
                    }];
                    selectThemeList.value = lazadaAttrsState.skuAttrs; // 更新selectThemeList
                }
            }

            setSelectTheme(selectThemeList.value); // 设置选择主题
        });
    }
});

onUnmounted(() => {
    EventBus.off('delRow');
});
</script>

<style lang="less" scoped>
.required {
    color: #ff4d4f;
    padding-right: 4px;
}
</style>