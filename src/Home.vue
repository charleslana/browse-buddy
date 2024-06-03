<template>
  <NavBar />
  <div class="container">
    <div class="columns">
      <div class="column is-two-thirds mx-5">
        <div class="box">
          <div class="level">
            <div class="level-left">
              <button class="button is-responsive" @click="openFile">
                {{ $t('importTest') }}
              </button>
            </div>
            <div class="level-right">
              <button class="button is-ghost" @click="isConfirmModalActive = true">
                {{ $t('clearTests') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalConfirm
    v-if="isConfirmModalActive"
    @confirm-modal="confirmAction"
    @close-modal="closeConfirmModal"
  />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import NavBar from './components/NavBar.vue';
import ModalConfirm from './components/ModalConfirm.vue';

const isConfirmModalActive = ref(false);

onMounted(() => {
  window.ipcRenderer.on('set-session', (_, response) => handleSession(response));
});

onBeforeUnmount(() => {
  window.ipcRenderer.removeListener('set-session', (_, response) => handleSession(response));
});

function handleSession(response: string) {
  console.log(response);
}

function openFile(): void {
  window.ipcRenderer.send('open-file');
}

function confirmAction(): void {
  isConfirmModalActive.value = false;
}

function closeConfirmModal(): void {
  isConfirmModalActive.value = false;
}
</script>

<style scoped></style>
