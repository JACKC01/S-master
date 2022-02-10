import './assets/css/global.less'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/iconfont.less'
import 'element-tiptap/lib/index.css'
import { ElementTiptapPlugin } from 'element-tiptap'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import VueBus from './eventBus/eventBus'
import Permission from 'utils/permission'
import * as echarts from 'echarts'
// 原型注册echarts,这样在组件中使用this.$echarts就可以
Vue.prototype.$echarts = echarts
Vue.use(Permission)
Vue.use(Viewer)
Vue.use(VueBus)
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: 'data-source'
  }
})
// 安装 element-tiptap 插件
Vue.use(ElementTiptapPlugin, {
  lang: 'zh'
})
// 现在你已经在全局注册了 `el-tiptap` 组件。
Vue.use(ElementUI)
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
