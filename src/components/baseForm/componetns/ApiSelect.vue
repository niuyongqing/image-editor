<template>
    <div>
        <a-select ref="select" v-model:value="modelValue" v-bind="getComponentProps" :options="options"></a-select>
    </div>
</template>

<script setup>
import { get } from 'lodash-es';
const { api, immediate, resultField, params } = defineProps({
    value: {
        type: String,
        default: ''
    },
    //  Api接口
    api: {
        type: Function,
        required: true,
    },
    //  Api 请求参数
    params: {
        type: Object,
        default: () => ({}),
    },
    // 从response返回结果结果中获取data，默认是data字段
    resultField: {
        type: String,
        default: 'data',
    },
    // 进入页面是否自动请求，弹窗页为false
    immediate: {
        type: Boolean,
        default: true,
    },
    // 配置组件属性
    componentProps: {
        type: Object,
        default: () => ({}),
    }
})
const options = ref([]);
const modelValue = defineModel();
const getProps = computed(() => {
    return {
        api, immediate, resultField, params
    };
});
const attrs = useAttrs();
const getComponentProps = computed(() => {
    return {
        ...attrs,
        ...unref(getProps)
    };
})

watchEffect(() => {
    fetch();
});

async function fetch() {
    options.value = [];
    try {
        // loading.value = true;
        const res = await api(params);
        if (Array.isArray(res)) {
            options.value = res;
            return;
        }
        if (resultField) {
            options.value = get(res, resultField) || [];
        }
    } catch (error) {
        console.warn(error);
    } finally {
        // loading.value = false;
    }
}
</script>