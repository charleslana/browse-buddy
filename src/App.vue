<template>
  <Home />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import translate from './translate';
import Home from './Home.vue';
import { SupportedLanguages } from '@electron/types/supported-languages';

onMounted(() => {
  window.ipcRenderer.on('set-language', (_, response) => handleLanguage(response));
});

onBeforeUnmount(() => {
  window.ipcRenderer.removeListener('set-language', (_, response) => handleLanguage(response));
});

function handleLanguage(lang: SupportedLanguages | undefined) {
  if (lang) {
    translate.global.locale = lang;
  }
}
</script>

<style scoped></style>
