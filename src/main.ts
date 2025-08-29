import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import '@/assets/styles/main.css';

import App from './App.vue';
import router from './router';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retryOnMount: false,
        retry: false
      }
    }
  }
};

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'unfonts.css'
import '@mdi/font/css/materialdesignicons.css'
const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(vuetify);
app.use(ElementPlus);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.mount('#app');
