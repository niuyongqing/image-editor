<template>
  <div>
    <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 24 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
    >

      <div v-for="(item,index) in json.properties" :key="index">
        <div v-if="base.includes(item.title)">
          <a-form-item :label="item.items.properties.value.title" :name="item.title" :rules="[{ required: item.items.properties.value.editable, message: item.title }]">
            <a-input :placeholder="item.description" v-if="item.items.properties.value.type === 'string'" :maxlength="item.items.properties.value.maxLength" :minLength="item.items.properties.value.minLength" :showCount="true"></a-input>

          </a-form-item>
        </div>
      </div>
    </a-form>
  </div>
</template>
<script setup lang="js">
const props = defineProps({
  json:{required:true,type:JSON}
})
const base = [
  'Title',
  'Product Type',
  'Item Type Keyword',
  'Brand Name',
  'External Product ID',
  'Variation Theme'
]
const formState = reactive({})

function onFinish(json) {

}

function onFinishFailed(error){

}
</script>
<style scoped lang="less">

</style>