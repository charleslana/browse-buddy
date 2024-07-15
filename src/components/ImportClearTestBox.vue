<script setup lang="ts">
import { ref } from 'vue';
import ModalConfirm from './ModalConfirm.vue';
import translate from '@/translate';
import { runTestStore } from '@/store/run-test-store';

defineProps<{
  isSkeleton: boolean;
}>();

const isConfirmModalActive = ref(false);
const t = translate.global.t;
const store = runTestStore();

function openFile(): void {
  window.ipcRenderer.send('open-file');
}

function confirmAction(): void {
  isConfirmModalActive.value = false;
  store.saveRunTest({
    name: t('inputTestName'),
    url: '',
    isSaveLastScreenshot: true,
    isSaveEveryScreenshot: true,
    isHeadless: true,
    defaultTimeout: 15000,
    actions: [],
    log: true,
  });
  window.ipcRenderer.send('delete-session');
}

function closeConfirmModal(): void {
  isConfirmModalActive.value = false;
}
</script>

<template>
  <div class="box">
    <div class="level">
      <div class="level-left">
        <button class="button is-responsive" @click="openFile" :disabled="isSkeleton">
          {{ $t('importTest') }}
        </button>
      </div>
      <div class="level-right">
        <button class="button is-ghost" @click="isConfirmModalActive = true" :disabled="isSkeleton">
          {{ $t('clearTests') }}
        </button>
      </div>
    </div>
  </div>
  <ModalConfirm
    v-if="isConfirmModalActive"
    @confirm-modal="confirmAction"
    @close-modal="closeConfirmModal"
  />
</template>

<style scoped></style>
