<template>
    <div>
        <a-card>
            <a-form :layout="'inline'" :label-col="{ style: { width: '80px' } }"
                :wrapper-col="{ style: { width: '200px' } }" labelAlign="left">
                <a-form-item label="用户：">
                    <a-select allowClear show-search @search="search" :filter-option="false"
                        v-model:value="state.userId" :fieldNames="{ label: 'userName', value: 'userId' }"
                        :not-found-content="userIdSelction.searchLoading ? undefined : null"
                        :options="userIdSelction.data" placeholder="请输入用户">
                        <template v-if="userIdSelction.searchLoadingg" #notFoundContent>
                            <a-spin size="small" />
                        </template>
                    </a-select>
                </a-form-item>
                <a-form-item label="部门：">
                    <a-cascader v-model:value="state.depId" :options="depOptions" placeholder="请选择部门" changeOnSelect
                        :fieldNames="{ label: 'deptName', value: 'deptId' }"></a-cascader>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" @click="submit" htmlType="submit" :loading="loading">查询</a-button>
                    <a-button style="margin-left: 10px" @click="handleReset">重置</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { useResetReactive } from '@/composables/reset';
import { getAccountUser, getUserDep } from '../api'
import { debounce } from 'lodash-es';
const { depOptions } = defineProps({
    depOptions: {
        type: Array,
        default: () => []
    }
})

const loading = defineModel()
const userIdSelction = reactive({
    data: [],
    searchLoading: false
});
const { state, reset } = useResetReactive({
    userId: undefined,
    platform: undefined
});

const search = debounce((value) => {
    if (!value) return;
    userIdSelction.data = [];
    userIdSelction.searchLoading = true;
    getAccountUser({
        userName: value
    }).then(res => {
        if (res.code === 200) {
            userIdSelction.data = res.data || [];
        }
    }).finally(() => {
        userIdSelction.searchLoading = false;
    });

}, 200)

const submit = () => {
    loading.value = true;
    emits('search', state);
};
const handleReset = () => {
    reset();
    emits('search', state);
};
const emits = defineEmits(['search'])

</script>

<style lang="less" scoped></style>