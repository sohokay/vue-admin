import Vue from 'vue' // Vue
import 'normalize.css/normalize.css' // 重置默认样式
import ElementUI from 'element-ui' // 导入 Element UI 组件
import 'element-ui/lib/theme-chalk/index.css' // Element UI 样式文件
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 全局样式

import App from './App' // 绑定到主视图
import store from './store' // Vuex
import router from './router' // 路由文件

import '@/icons' // 字体图标
import '@/permission' // 权限控制

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
// vue-cli-service serve 指定环境模式 (默认值：development)  https://cli.vuejs.org/zh/guide/cli-service.html#vue-cli-service-serve
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
