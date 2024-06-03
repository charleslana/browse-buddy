<template>
  <Home />
  <div class="container mt-5">
    <button class="button" @click="run">Click</button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import translate from './translate';
import { SupportedLanguages } from 'electron/types/supported-languages';
import Home from './Home.vue';

// const t = translate.global.t;

onMounted(() => {
  window.ipcRenderer.on('run-success', (_, response) => handleSuccess(response));
  window.ipcRenderer.on('set-language', (_, response) => handleLanguage(response));
});

onBeforeUnmount(() => {
  window.ipcRenderer.removeListener('run-success', (_, response) => handleSuccess(response));
  window.ipcRenderer.removeListener('set-language', (_, response) => handleLanguage(response));
});

function run(): void {
  window.ipcRenderer.send('run', 'hello world');
}

function handleSuccess(response: string) {
  alert(response);
}

function handleLanguage(response: SupportedLanguages) {
  translate.global.locale = response;
}
</script>

<style scoped></style>
