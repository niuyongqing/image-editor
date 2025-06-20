<template>
    <div id="editRemarkCont">
        <a-modal :open="remarkVisible" @cancel="handleCancel" :maskClosable="false" :width="'40%'" :keyboard="false" title="修改备注"
            >

            <a-form :model="editForm" ref="ruleForm" laba-width="120px" class="demo-ruleForm">
                <a-form-item label="备注信息:" name="remark">
                    <a-textarea style="width:90%" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容"
                        v-model:value="editForm.remark">
                    </a-textarea>
                </a-form-item>
                <a-form-item label="备注颜色:" name="remarkColor">
                    <!-- <a-radio-group v-model:value="editForm.remarkColor">
                        <a-radio-button :value="false">红</a-radio-button>
                        <a-radio-button :value="true">绿</a-radio-button>
                    </a-radio-group> -->
                    <div>
                        <!-- 颜色列表 -->
                        <div class="color-list">
                            <div class="color-item" v-for="(item, index) in colorList" :key="index"
                                :class="item.id === seletColorId ? 'color-active' : ''"
                                :style="{ background: item.color }" @click="remarkColorSelect(item)"></div>
                        </div>
                    </div>
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
import { remark } from "../../config/api/product";
import { message } from "ant-design-vue";
import { colors } from "../../config/commDic/defDic"

const colorList = colors;
const seletColorId = ref(0);
const props = defineProps({
    remarkVisible: Boolean,
    remarkId: Array,
});
const emit = defineEmits(["backCloseRemark"]);
const loading = ref(false)
const ruleForm = ref()
const editForm = reactive({
    remark: "",
    remarkColor: "",
})

const remarkColorSelect = (item) => {
    editForm.remarkColor = item.id;
    seletColorId.value = item.id;
}

const handleCancel = () => {
    emit("backCloseRemark")
    editForm.remark = ""
    editForm.remarkColor = ""
    seletColorId.value = 0
}

const onSubmit = () => {
    if (!editForm.remark) {
        message.error("请填写备注信息！");
        return
    }
    if (!editForm.remarkColor) {
        message.error("请选择备注颜色！");
        return
    }
    loading.value = true
    let remarks = props.remarkId.map(e => {
        return {
            account: e.account,
            offerIds: e.offerIds,
            remark: editForm.remark,
            remarkColor: editForm.remarkColor,
        }
    })

    remark({ remarks }).then((res) => {
        message.success(res.msg);
    }).finally(() => {
        loading.value = false
        emit("backCloseRemark")
        editForm.remark = ""
        editForm.remarkColor = ""
        seletColorId.value = 0
    });
}
</script>
<style lang="less" scoped>
.color-item {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    margin-right: 10px;
    cursor: pointer;
    border: 3px solid #ccc;
}

.color-list {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.color-active {
    border: 2px solid #000;
}
</style>