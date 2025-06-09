<template>
    <div id="editRemarkCont">
        <a-modal :open="remarkVisible" @cancel="handleCancel" :maskClosable="false" :width="'40%'" :keyboard="false"
            title="修改备注">

            <a-form :model="editForm" ref="ruleForm" laba-width="120px" class="demo-ruleForm">
                <a-form-item label="备注信息:" name="remark">
                    <a-textarea style="width:90%" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容"
                        v-model:value="editForm.remark">
                    </a-textarea>
                </a-form-item>
                <a-form-item label="备注颜色:" name="remarkColor">
                    <a-radio-group v-model:value="editForm.remarkColor">
                        <a-radio-button :value="false">红</a-radio-button>
                        <a-radio-button :value="true">绿</a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </a-form>
            <template #footer>
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup name='editRemark'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { ozonProductRemark } from "../../config/api/waitProduct";
import { message } from "ant-design-vue";
const props = defineProps({
    remarkVisible: Boolean,
    remarkId: Array,
});
const emit = defineEmits(["backCloseRemark"]);
const loading = ref(false)
const ruleForm = ref()
const editForm = reactive({
    remark: "",
    remarkColor: false,
})

const handleCancel = () => {
    emit("backCloseRemark")
    ruleForm.value.resetFields();
}

const onSubmit = () => {
    loading.value = true
    let remarks = props.remarkId.map(e => {
        return {
            account: e.account,
            waitIds: e.waitIds,
            remark: editForm.remark,
            remarkColor: editForm.remarkColor,
        }
    })
    console.log('props', props.remarkId);

    ozonProductRemark(remarks).then((res) => {
        message.success(res.msg);
    }).finally(() => {
        loading.value = false
        emit("backCloseRemark")
        ruleForm.value.resetFields();
    });
}
</script>
<style lang="less" scoped></style>