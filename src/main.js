import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./icons";
// 引入插件
import payLayer from "./lib/vue-pay-layer/lib";
// 使用插件
Vue.use(payLayer);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
