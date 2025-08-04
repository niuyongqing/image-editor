<template>
    <a-modal v-model:open="visible" title="图片翻译" width="1000px">
        <a-checkbox v-model:checked="checkedAll" @change="handleCheckAllChange"> 选择全部</a-checkbox>

        <div flex text-left pt-15px>
            <div> <a-tag color="#108ee9"> 说明! </a-tag> </div>
            <div>
                <!-- <span class="text-#999"> 1、只能是选择网络图片 </span><br /> -->
                <span class="text-#999"> 每次不能超过10张 </span>
            </div>
        </div>
        <div class="flex flex-wrap  mt-10px">
            <a-card v-for="element in fileList" :key="element.url" mb-10px ml-10px p-0px rounded-none class="file-card"
                hoverable style="width: 125px;">
                <div :key="element.uid" @click="check(element)">
                    <div class="file-item">
                        <div class="file-img">
                            <img :src="element.url" alt="" class="file-img" />
                            <div class="image-mask"> {{ element.height }} X {{ element.width }} </div>

                            <div class="image-check" v-if="element.checked">
                                <CheckOutlined style="color: #00B903;font-size: 20px; font-weight: bold;" />
                            </div>
                            <div class="image-tooltip" v-if="element.url.includes('http')">
                                点击{{ element.checked ? '取消' : '选中' }}
                            </div>
                        </div>
                    </div>
                </div>
            </a-card>
        </div>
        <div></div>
        <template #footer>
            <a-button type="primary" @click="submit" :loading="loading">添加</a-button>
            <a-button @click="close">关闭</a-button>
        </template>
    </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { CheckOutlined } from '@ant-design/icons-vue';
import { imageTranslationApi } from '~@/api/common/translation';

const checkedAll = ref(false);
const visible = ref(false);
const loading = ref(false);
const fileList = ref([]); // 图片列表
const timer = ref(null);

const showModal = (list = []) => {
    fileList.value = list.map((item) => {
        return {
            ...item,
            checked: false,
        }
    });
    visible.value = true;
};

const close = () => {
    fileList.value = [];
    visible.value = false;
};

const handleCheckAllChange = () => {
    fileList.value.forEach(item => {
        item.checked = checkedAll.value
    })
};

// 点击选中
const check = (element) => {
    element.checked = !element.checked;
    const isAllChecked = fileList.value.every(item => item.checked);
    checkedAll.value = isAllChecked;
};

const submit = async () => {
    const checkedList = fileList.value.filter(item => item.checked);
    if (checkedList.length === 0) {
        message.error('请选择图片');
        return;
    };
    if (checkedList.length > 10) {
        message.error('最多选择10张图片');
        return;
    }

    if (checkedList.length <= 10) {
        loading.value = true;
        const res = await imageTranslationApi({
            imageUrl: checkedList.map(e => e.url.replace('/prod-api', '')),
            sourceLanguage: 'zh',
            targetLanguage: 'en',
        });
        if (res.code === 200) {
            if (res.code === 200) {
                message.success('翻译成功');
                const data = res.data;
                const list = checkedList.map((checkItem, index) => {
                    return {
                        ...checkItem,
                        newUrl: data[index].newImage ? data[index].newImage : data[index].oldImage,
                        success: data[index].success,
                        oldUrl: checkItem.url,
                    }
                });
                emits('emitImages', list);
                loading.value = false;
                close();
            }
        };
    };
};

const emits = defineEmits(['emitImages'])

defineExpose({
    showModal,
});

</script>

<style lang="less" scoped>
:deep(.ant-card-body) {
    padding: 1px;
}

.file-item {
    margin-right: 8px;
    position: relative;
}

.file-img {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    object-fit: cover;
}

:deep(.ant-card-body) {
    width: 120px;
}

.image-mask {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 120px;
    height: 20px;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;
    padding: 5px;
}

.image-check {
    position: absolute;
    top: 0;
    right: 0px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
}

.image-tooltip {
    position: absolute;
    top: 0;
    right: 0px;
    left: 0px;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    color: #fff;
    font-size: 14px;
    background-color: rgba(0, 0, 0, .5);
    display: none;
}

.file-img:hover .image-tooltip {
    display: block;
}
</style>