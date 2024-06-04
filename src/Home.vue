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
        <Notification
          :type="isNotificationType"
          :message="isNotificationMessage"
          @close="handleNotification"
          v-if="isNotification"
        />
        <input
          class="input is-large mb-5"
          type="text"
          :class="{ 'is-skeleton': isSkeleton }"
          :placeholder="$t('testName')"
          v-model.trim="name"
        />
        <BoxNavigate :is-skeleton="isSkeleton" @input-filled="handleInputFilled" />
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
import Notification from './components/Notification.vue';
import translate from './translate';
import BoxNavigate from './components/BoxNavigate.vue';

const t = translate.global.t;
const isConfirmModalActive = ref(false);
const isNotification = ref(false);
const isNotificationType = ref<'is-danger' | 'is-success'>('is-success');
const isNotificationMessage = ref(t('testSuccessNotification'));
const isSkeleton = ref(false);
const isInputFilled = ref(false);
const name = ref(t('inputTestName'));

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

function handleNotification(): void {
  isNotification.value = false;
}

function handleInputFilled(value: boolean): void {
  isInputFilled.value = value;
}
</script>

<style scoped></style>
