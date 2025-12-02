import { createPinia } from 'pinia'
import { createApp } from 'vue'
import hasPermi from "~/utils/permission/component/hasPermi.js";
import hasRole from "~/utils/permission/component/hasRole.js";
import {checkPermi, checkRole} from "~/utils/permission/component/permission.js";
import Root from './App.vue'
import { setupI18n } from './locales/index.js'
import {
  setupAccessDirective,
  setupLoadingDirective,
} from './directive/index.js'
import router from '~/router'
import '~/router/router-guard'
import 'ant-design-vue/dist/reset.css'
import '~/assets/styles/reset.css'
import '~/assets/styles/antDesignVueCustomize.less'
// import
import 'uno.css'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import STable from '@surely-vue/table';


import VxeUIAll from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'

import VxeUITable from 'vxe-table'
import 'vxe-table/es/style.css'

import Vue3JsonViewer from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/vue3-json-viewer.css';

const pinia = createPinia()
async function start() {
  const app = createApp(Root)
  app.use(Vue3JsonViewer)
  app.use(pinia)
  await setupI18n(app)
  setupDirective(app)
  app.use(router)
  app.directive('has-permi', hasPermi)
  app.directive('has-role', hasRole)
  app.directive('checkPermi', checkPermi)
  app.directive('checkRole', checkRole)
  app.use(STable);
  app.use(Antd)
  app.use(VxeUIAll)
  app.use(VxeUITable)
  app.mount('#app')
  app.config.performance = true
  app.config.errorHandler = (err, vm, info) => {
    console.error('Error:', err);
    console.log('Component:', vm);
    console.log('Info:', info);
  };
}
function setupDirective(app) {
  setupLoadingDirective(app)
  setupAccessDirective(app)
}


start()
