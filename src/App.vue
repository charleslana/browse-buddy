<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import translate from './translate';
import { SupportedLanguages } from '@electron/types/supported-languages';
import { RouterView } from 'vue-router';
import { saveLanguage } from './utils/local-storage-utils';

onMounted(() => {
  window.ipcRenderer.on('set-language', (_, response) => handleLanguage(response));
});

onBeforeUnmount(() => {
  window.ipcRenderer.removeAllListeners('set-language');
});

function handleLanguage(lang: SupportedLanguages | undefined) {
  if (lang) {
    saveLanguage(lang);
    translate.global.locale = lang;
  }
}
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
