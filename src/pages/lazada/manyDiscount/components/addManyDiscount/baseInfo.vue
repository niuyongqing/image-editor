<template>
    <div>
        <a-card bordered>
            <template #title>
                <div class="clearfix">
                    <span>基本信息</span>
                    <span style="margin-left: 30px; color: #9e9f9e; font-size: 12px">
                        带 <span style="color: red">*</span> 为必填项
                    </span>
                </div>
            </template>
            <a-form :model="formData" :rules="rules" ref="formRef" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
                class="demo-ruleForm" style="height: auto">
                <a-form-item label="活动名称：" name="name">
                    <a-input v-model:value="formData.name" allowClear placeholder="请输入活动名称" style="width: 50%" />
                </a-form-item>
                <a-form-item label="生效时间：" name="time">
                    <a-range-picker style="width: 50%" v-model:value="formData.time" showTime
                        format="YYYY-MM-DD HH:mm:ss" allowClear />
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import EventBus from "~/utils/event-bus";
const formData = ref({
    name: '', // 活动名称
    time: [], // 生效时间
});
const formEl = useTemplateRef('formRef');

const rules = ref({
    name: [{ required: true, message: '请输入活动名称', trigger: ['blur', 'change'] }],
    time: [{ required: true, message: '请选择时间', trigger: ['blur', 'change'] }],
});

const baseValidate = async () => {
    const validatePromise = (formRef) =>
        new Promise(async (resolve) => {
            const res = await formRef.validate();
            resolve(res)
        });
    return await validatePromise(formEl.value);
};

defineExpose({
    formData,
    baseValidate,
});

</script>

<style lang="scss" scoped></style>