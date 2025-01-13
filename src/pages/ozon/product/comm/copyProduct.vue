<template>
    <div id="copyProductCont">
        <a-modal :open="copyProductVis" :maskClosable="false" @cancel="handleCancel" :width="'40%'" :keyboard="false"
            title="修改价格">
            <a-form ref="formRef" :model="form" class="form-padding" :rules="rule" laba-width="120px">
                <a-form-item name="shortCodes" label="店铺：" style="margin-top: 20px;">
                    <a-select v-model:value="form.shortCodes" optionFilterProp="label" :options="accountList" placeholder="店铺"
                        mode="multiple" style="width: 280px">
                    </a-select>
                </a-form-item>
            </a-form>
            <template #footer>
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup name='copyProduct'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { accountCache, copyList } from "../../config/api/product";
import { message } from "ant-design-vue";

const props = defineProps({
    copyProductVis: Boolean,
    copyList: Array,
});
const emit = defineEmits(["handleCopyProductClose"]);
const formRef = ref(null)
const form = reactive({
    shortCodes: undefined
})
const loading = ref(false)
const accountList = ref([])
const rule = {
    shortCodes: {
        required: true,
        message: "必填项，请选择",
        trigger: 'change',
    },
}
// 获取店铺列表
const getAccount = () => {
    accountCache().then((res) => {
        if (res.data) {
            accountList.value = res?.data?.map(item => {
                return {
                    label: item.simpleName ? item.simpleName : item.alias,
                    value: item.account
                }
            }) ?? [];
        }
    });
}

const handleCancel = () => {
    formRef.value.resetFields();
    emit("handleCopyProductClose")
}
const onSubmit = () => {
    formRef.value
        .validate()
        .then(() => {
            loading.value = true;
            let hasEmptyData = false;
            props.copyList.forEach((item) => {
                hasEmptyData = item.offerIds.some((id) => id === "");
            });
            if (hasEmptyData) {
                message.error("产品ID为空,请同步后复制！");
                return;
            }
            copyList({
                copyProduct: props.copyList,
                targetAccount: form.shortCodes,
            })
                .then((res) => {
                    message.success(res.msg);
                })
                .finally(() => {
                    handleCancel()
                    loading.value = false;
                });
        })
        .catch(error => {
            console.log('error', error);
        });
}

onMounted(() => {
    getAccount()
})
</script>
<style lang="less" scoped></style>