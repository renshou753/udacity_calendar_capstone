import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueTextareaAutosize from 'vue-textarea-autosize'
import router from "./router";
import { Auth0Plugin } from "./auth";
import HighlightJs from "./directives/highlight";

Vue.use(VueTextareaAutosize)

Vue.config.productionTip = false



Vue.directive("highlightjs", HighlightJs);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
