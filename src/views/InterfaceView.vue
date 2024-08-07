<template>
  <NavBar />
  <div class="container">
    <div class="columns">
      <div class="column is-two-thirds mx-5">
        <ImportClearTestBox :is-skeleton="isSkeleton" />
        <NotificationComponent
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
        <BoxActions :disabled="!isInputFilled" :is-skeleton="isSkeleton" />
        <nav class="level mb-5">
          <div class="level-left">
            <p class="level-item">
              <button
                class="button is-link"
                :disabled="!isInputFilled || name === ''"
                @click="executeRunTest"
              >
                {{ $t('executeButton') }}
              </button>
            </p>
          </div>
          <div class="level-right">
            <p class="level-item">
              <button
                class="button is-success"
                :disabled="!isInputFilled || name === ''"
                @click="saveFile"
              >
                {{ $t('saveTestButton') }}
              </button>
            </p>
          </div>
        </nav>
      </div>
      <SettingsComponent :is-skeleton="isSkeleton" />
    </div>
  </div>
  <div class="floating-buttons buttons">
    <button @click="goToTop" class="button is-medium">
      <FontAwesomeIcon :icon="faHandPointUp" />
    </button>
    <button @click="goToBottom" class="button is-medium">
      <FontAwesomeIcon :icon="faHandPointDown" />
    </button>
  </div>
  <LoadingOverlay :active="isLoading" :message="$t('loadingText')" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import NavBar from '@/components/NavBar.vue';
import NotificationComponent from '@/components/NotificationComponent.vue';
import translate from '@/translate';
import BoxNavigate from '@/components/BoxNavigate.vue';
import BoxActions from '@/components/BoxActions.vue';
import { runTestStore } from '@/store/run-test-store';
import { navigationResultStore } from '@/store/navigation-result-store';
import { NavigationResult } from '@electron/interfaces/navigation-result';
import SettingsComponent from '@/components/SettingsComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHandPointUp, faHandPointDown } from '@fortawesome/free-solid-svg-icons';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { RunTest } from '@electron/interfaces/run-test';
import ImportClearTestBox from '@/components/ImportClearTestBox.vue';

const store = runTestStore();
const storeResult = navigationResultStore();
const t = translate.global.t;
const isNotification = ref(false);
const isNotificationType = ref<'is-danger' | 'is-success'>('is-success');
const isNotificationMessage = ref(t('testSuccessNotification'));
const isSkeleton = ref(true);
const isInputFilled = ref(false);
const name = ref(store.runTest.name);
const isLoading = ref(false);
const defaultNameValues = [
  translate.global.messages.en.inputTestName,
  translate.global.messages.es.inputTestName,
  translate.global.messages.pt.inputTestName,
];

onMounted(() => {
  window.ipcRenderer.on('run-complete', (_, response) => handleRunResult(response));
  window.ipcRenderer.on('set-session', (_, response) => handleSession(response));
  window.ipcRenderer.send('get-session');
});

onBeforeUnmount(() => {
  window.ipcRenderer.removeAllListeners('set-session');
  window.ipcRenderer.removeAllListeners('run-complete');
});

watch(
  () => translate.global.t('inputTestName'),
  () => {
    if (defaultNameValues.includes(name.value)) {
      name.value = t('inputTestName');
    }
  }
);

watch(
  () => store.runTest,
  newValue => {
    window.ipcRenderer.send('save-session', JSON.stringify(newValue));
  },
  { deep: true }
);

watch(
  () => name.value,
  newValue => {
    if (newValue && newValue !== '') {
      store.runTest.name = newValue;
      return;
    }
    store.runTest.name = '';
  }
);

watch(
  () => store.runTest.name,
  async newValue => {
    if (newValue && newValue !== '') {
      name.value = newValue;
    } else {
      name.value = '';
    }
  }
);

function handleSession(session: RunTest | undefined) {
  if (session) {
    store.saveRunTest(session);
  }
  isNotification.value = false;
  isSkeleton.value = false;
  isLoading.value = false;
}

function handleNotification(): void {
  isNotification.value = false;
}

function handleInputFilled(value: boolean): void {
  isInputFilled.value = value;
}

function executeRunTest(): void {
  isNotification.value = false;
  isLoading.value = true;
  window.ipcRenderer.send('run', JSON.stringify(store.filterEnabledActions()));
}

function scrollToTop(): void {
  window.scrollTo(0, 0);
}

function handleRunResult(results: NavigationResult[]): void {
  storeResult.save(results);
  if (results.some(result => result.error)) {
    isNotificationType.value = 'is-danger';
    isNotificationMessage.value = t('testFailedNotification');
  } else {
    isNotificationType.value = 'is-success';
    isNotificationMessage.value = t('testSuccessNotification');
  }
  isNotification.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  scrollToTop();
}

function saveFile(): void {
  window.ipcRenderer.send('save-file', JSON.stringify(store.runTest, null, 2));
}

function goToTop() {
  window.scrollTo({ top: 0 });
}

function goToBottom() {
  window.scrollTo({ top: document.body.scrollHeight });
}
</script>

<style scoped>
.floating-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
