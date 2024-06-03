import App from './App.vue';
import translate from '@/translate';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Tooltip, vTooltip } from 'floating-vue';
import './style.css';
import 'bulma/css/bulma.css';
import 'floating-vue/dist/style.css';
import 'vue-loading-overlay/dist/css/index.css';

const app = createApp(App);

app.use(createPinia());
app.directive('tooltip', vTooltip);
app.component('VTooltip', Tooltip);
app.use(translate);

app.mount('#app').$nextTick(() => {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  });
});
