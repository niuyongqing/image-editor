<script setup lang="ts">
import {ref} from "vue";
import * as Icons from '@ant-design/icons-vue';
import {addMenuApi, updateMenuApi, selectById, selectMenuClassify,addMenuClassify} from '~/api/common/menu.js'
import { message } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
const emit = defineEmits(['close']);
const loading = ref(false);
const formData = ref({})
const inputClassify = ref('')

// 获取所有图标名称和组件
const columns = ['setTwoToneColor','setTwoToneColor','default','getTwoToneColor','createFromIconfontCN']
const iconNames = Object.keys(Icons).filter(name => !!Icons[name]).filter(v=> !columns.includes(v));
const classify = ref([])
const openAddClassify = ref(false)
// 计算出当前要显示的图标组件
const displayedIcon = computed(() => Icons[selectedIcon.value]);
// 更新选择的图标
const selectIcon = (icon) => {
  selectedIcon.value = icon;
  formData.value.icon = icon
};


// 当前选择的图标名称
const selectedIcon = ref('');
const props = defineProps({
  open:{ type: Boolean, required: true, default:false },
  title:{type:String, required: true, default:''},
  data:{type:Object,required: false, default:{}},
  menus:{type:Array, required: true, default:[]},
})
watchEffect(()=>{
  if(props.data.id){
    selectById({id:props.data.id}).then(res=>{
      if(props.title === '编辑'){
        formData.value = res.data
        formData.value.parentId = res.data.parentId
        selectedIcon.value = formData.value.icon
      }else {
        formData.value.parentId = res.data.id
      }
    })

  }else {
    formData.value = {hideInMenu:false,target:'_blank',keepAlive:false}
    selectedIcon.value = ''
  }
  getMenuClassify()
})

function getMenuClassify(){
  selectMenuClassify().then(res=>{
    classify.value = res.data
  })
}

function handleOk() {
  loading.value = true;
  if(props.title === '新增' || props.title === '添加一级菜单' ){
    addMenuApi(formData.value).then((res)=>{
      if(res.code == 200){
        formData.value = {};
        message.success(res.msg);
        close()
      }else {
        message.error(res.msg);
      }
    }).finally(()=>{
      loading.value = false;
    })
    return
  }
  if(props.title === '编辑'){
    updateMenuApi(formData.value).then((res)=>{
      if(res.code == 200){
        formData.value = {};
        message.success(res.msg);
        close()
      }else {
        message.error(res.msg);
      }
    }).finally(()=>{
      loading.value = false;
    })
  }
}
function close() {
  emit('close', false);
}

function addClassifyOk() {
  addMenuClassify({name:inputClassify.value}).then(res=>{
    if(res.code == 200){
      getMenuClassify()
      message.success(res.msg);
      openAddClassify.value = false
      inputClassify.value = ''
    }else {
      message.error(res.msg);
    }

  })
}


</script>

<template>
  <a-modal :open="props.open" :title="title"  :confirm-loading="loading" html-type="submit" :footer="null" :closable="false" :destroyOnClose="true">
    <a-card>
      <a-form :model="formData"  label-align="right" @finish="handleOk" >
        <a-form-item label="上一级菜单" name="parentId" v-if="title === '新增' || title === '编辑'" :rules="[{ required: false, message: '上一级' }]" >
          <a-tree-select v-model:value="formData.parentId" :tree-data="menus" :fieldNames="{children:'children',label:'name',value:'id'}" ></a-tree-select>
        </a-form-item>
        <a-form-item label="类型" name="type" :rules="[{ required: true }]">
          <a-select v-model:value="formData.type" >
            <a-select-option :key="1">文件夹</a-select-option>
            <a-select-option :key="2" >页面</a-select-option>
            <a-select-option :key="3" >按钮</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="图 标" name="icon" :rules="[{ required: false}]" v-if="formData.type != 3">
          <div style="display: flex; align-items: center;">
            <a-dropdown>
              <a-button >{{formData.icon}} <down-outlined /></a-button>
              <template #overlay>
                <div class="icon-dropdown">
                  <div v-for="icon in iconNames" :key="icon" class="icon-item" @click="selectIcon(icon)">
                    <component v-if="Icons[icon]" :is="Icons[icon]" style="font-size: 24px;"/>
                    <span style="width: 30px">{{ icon }}</span>
                  </div>
                </div>
              </template>
            </a-dropdown>
            <div v-if="displayedIcon" style="font-size: 24px;margin-left: 10px">
              <!-- 动态渲染所选图标 -->
              <component :is="displayedIcon" />
            </div>
          </div>
        </a-form-item>
        <a-form-item label="名 称" name="title" :rules="[{ required: true, message: '请输入菜单名称' }]">
          <a-input v-model:value="formData.title" />
        </a-form-item>
        <a-form-item label="路由名称" name="name" :rules="[{ required: true}]">
          <a-input v-model:value="formData.name" placeholder="不允许与其他所有路由名称相同，否则无法访问"/>
        </a-form-item>
        <a-form-item label="分 类" name="classify" v-if="formData.classify != 3 && title != '添加一级菜单' &&  formData.parentId" :rules="[{ required: formData.type != 3, message: '请选择分类' }]">
          <div style="display: flex">
            <a-select v-model:value="formData.classify" filterable>
              <a-select-option v-for="t in classify" :key="t.id">{{t.name}}</a-select-option>
            </a-select>
            <a-button type="link" @click="openAddClassify = true">添加分类</a-button>
          </div>
        </a-form-item>
        <a-form-item label="权限字符" name="permission" :rules="[{ required: false }]">
          <a-input v-model:value="formData.permission" />
        </a-form-item>
        <a-form-item label="组件路径" name="component" v-if="formData.type != 3" :rules="[{ required: false }]">
          <a-input v-model:value='formData.component' />
        </a-form-item>
        <a-form-item label="路由" name="path" v-if="formData.type != 3" :rules="[{ required: true, message: '请输入路由地址'}]">
          <a-input v-model:value="formData.path" />
        </a-form-item>
        <a-form-item label="重定向" name="redirect" v-if="formData.type != 3" :rules="[{ required: false }]">
          <a-input v-model:value="formData.redirect" />
        </a-form-item>
        <a-form-item label="排序" name="sort" :rules="[{ required: true }]">
          <a-input-number v-model:value="formData.sort" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="是否隐藏" name="hideInMenu" :rules="[{ required: true,message: '请选择是否隐藏' }]">
          <a-radio-group v-model:value="formData.hideInMenu" name="radioGroup">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否保活" name="keepAlive" v-if="formData.type == 2" :rules="[{ required: false,message: '请选择是否隐藏' }]">
          <a-radio-group v-model:value="formData.keepAlive" name="radioGroup">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="打开方式" name="target" v-if="formData.type == 1" :rules="[{ required: false }]">
          <a-select v-model:value="formData.target" >
            <a-select-option key="_blank">_blank</a-select-option>
            <a-select-option key="_self" >_self</a-select-option>
            <a-select-option key="_parent" >_parent</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item style="display: flex; text-align: right">
          <a-button @click="close" style="margin-right: 10px">取消</a-button>
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
  <a-modal v-model:open="openAddClassify" title="添加菜单分类" @ok="addClassifyOk">
    <a-input v-model:value="inputClassify"></a-input>
  </a-modal>
</template>

<style scoped lang="less">
.icon-dropdown {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  width: 500px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #f0f0f0;
  padding: 10px;
  z-index: 1000;
}

.icon-item {
  text-align: center;
  cursor: pointer;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.icon-item:hover {
  border-color: #1890ff;
}
</style>