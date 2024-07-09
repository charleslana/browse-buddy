import App from './App.vue';
import router from './router';
import translate from '@/translate';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Tooltip, vTooltip } from 'floating-vue';
import './style.css';
import './assets/lib/bulma-timeline.min.css';
import './assets/lib/modal-fx.min.css';
import 'bulma/css/bulma.css';
import 'floating-vue/dist/style.css';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.directive('tooltip', vTooltip);
app.component('VTooltip', Tooltip);
app.use(translate);

app.mount('#app').$nextTick(() => {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  });
});
