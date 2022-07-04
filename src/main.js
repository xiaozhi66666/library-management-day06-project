import Vue from 'vue'
import App from './App.vue'
// 全局引入element-ui
import ElementUI from 'element-ui';
// 引入element.css
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
// 设置根路径
axios.defaults.baseURL = "http://www.liulongbin.top:3006"
Vue.prototype.$axios = axios;
// 注册组件
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')