<template>
    <a-modal v-model:open="visible" title="图片翻译" width="1250px">
        <a-checkbox v-model:checked="checkedAll" @change="handleCheckAllChange"> 选择全部</a-checkbox>

        <div flex text-left pt-15px>
            <div> <a-tag color="#108ee9"> 说明! </a-tag> </div>
            <div>
                <span class="text-#999"> 1、只能是选择网络图片 </span><br />
                <span class="text-#999"> 2、每次不能超过20张 </span>
            </div>
        </div>

        <div class="flex flex-wrap  mt-10px h-900px overflow-y-auto">
            <div v-for="(item, index) in tableData" :key="index" flex gap-15px h-150px>
                <a-card v-for="(element, i) in item.imageUrl" :key="element.url" mb-10px ml-10px p-0px rounded-none
                    class="file-card flex" hoverable style="width: 125px;">
                    <div :key="element.uid" @click="tabCheck(element)">
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
                    <div w-full>
                        <div flex justify-between w-full>
                            <a-checkbox v-if="element.url.includes('http')" v-model:checked="element.checked"
                                @change="check"></a-checkbox>
                        </div>
                    </div>
                    <template #extra></template>
                </a-card>
            </div>
        </div>

        <div></div>
        <template #footer>
            <a-button type="primary" @click="submit" :loading="loading">确定</a-button>
            <a-button @click="close">取消</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { CheckOutlined } from '@ant-design/icons-vue';
import { imageRecognitionApi, imageRecognitionQueryApi, imageTranslationApi } from '~@/api/common/translation';

const checkedAll = ref(false);
const visible = ref(false);
const loading = ref(false);
const tableData = ref([]); // 图片列表
const timer = ref(null);

const showModal = (list = []) => {
    tableData.value = list || [];
    tableData.value.forEach((item) => {
        item.imageUrl.forEach((v) => {
            v.checked = false
        })
    });
    visible.value = true;
};

const close = () => {
    tableData.value = [];
    visible.value = false;
};

const handleCheckAllChange = () => {
    tableData.value.forEach(item => {
        item.imageUrl.forEach(v => {
            v.checked = checkedAll.value
        })
    })
};

// 点击选中
const tabCheck = (element) => {
    if (element.url.includes('http')) {
        element.checked = !element.checked;
    } else {
        message.error('只能选择网络图片');
    }
    const isAllChecked = tableData.value.every(item => item.imageUrl.every(v => v.checked));
    checkedAll.value = isAllChecked;
};

const check = () => {
    const isAllChecked = tableData.value.every(item => item.imageUrl.every(v => v.checked));
    checkedAll.value = isAllChecked;
};


const submit = async () => {
    const checkedList = tableData.value.flatMap((item, index) => item.imageUrl.filter(v => v.checked).map((img) => {
        return {
            ...img,
            index: index
        }
    }));

    if (checkedList.length === 0) {
        message.error('请选择图片');
        return;
    };
    loading.value = true;
    //  单张图片翻译
    if (checkedList.length === 1) {
        imageTranslationApi({
            imageUrl: checkedList[0].url,
            sourceLanguage: 'zh', // 源语言
            targetLanguage: 'en' // 目标语言
        }).then(res => {
            if (res.code === 200) {
                message.success('翻译成功');
                const finalImageUrl = res.data.finalImageUrl;
                // emits('singleSubmit', {
                //     newUrl: finalImageUrl,
                //     oldUrl: checkedList[0].url,
                // });
                tableData.value[checkedList[0].index].imageUrl.forEach((v) => {
                    if (checkedList[0].url === v.url) {
                        v.url = finalImageUrl
                    }
                })
                close();
            }
        }).finally(() => {
            loading.value = false;
        })
        return;
    };
    if (checkedList.length > 20) {
        message.error('最多选择20张图片');
        return;
    }
    //  多张图片翻译
    if (checkedList.length > 1 && checkedList.length <= 20) {

        const res = await imageRecognitionApi({
            imageUrls: checkedList.map(item => item.url),
            sourceLanguage: 'zh',
            targetLanguage: 'en',
            customTaskId: new Date().getTime().toString(),
        });
        if (res.code === 200) {
            const taskId = res.data.taskId;
            timer.value = setInterval(() => {
                imageRecognitionQueryApi(taskId)
                    .then(res => {
                        if (res.code === 200) {
                            const data = res.data || [];
                            if (data.length > 0) {
                                const list = checkedList.map((checkItem, index) => {
                                    return {
                                        ...checkItem,
                                        newUrl: data[index].finalImageUrl ? data[index].finalImageUrl : checkItem.url,
                                        success: data[index].success,
                                        oldUrl: checkItem.url,
                                    }
                                });
                                loading.value = false;
                                message.success('翻译成功');
                                // emits('multiSubmit', list);

                                console.log('urls', list);
                                tableData.value.forEach((item) => {
                                    item.imageUrl.forEach((v) => {
                                        list.forEach(item => {
                                            if (v.url === item.oldUrl) {
                                                v.url = item.newUrl
                                            }
                                        })
                                    })
                                })

                                clearInterval(timer.value);
                                timer.value = null;
                                close();
                            }
                        }
                    })
            }, 3500);
        };
    };
};

const emits = defineEmits(['singleSubmit', 'multiSubmit'])

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