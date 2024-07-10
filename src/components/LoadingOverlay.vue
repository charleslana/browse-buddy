<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

interface Props {
  active: boolean;
  message: string;
  lockScroll: boolean;
  fillProgress: boolean;
}

const props = defineProps<Props>();
const progressValue = ref(0);
const interval = ref<NodeJS.Timeout | null>(null);
const logs = ref<string[]>([]);

onMounted(() => {
  window.ipcRenderer.on('log-result', (_, response) => handleLogResult(response));
});

watch(
  () => props.fillProgress,
  newVal => {
    if (newVal) {
      progressValue.value = 100;
    } else {
      progressValue.value = 0;
    }
  }
);

watch(
  () => props.lockScroll,
  newVal => {
    if (newVal) {
      progressValue.value = 0;
      logs.value.length = 0;
      document.documentElement.style.overflow = 'hidden';
      startProgress();
    } else {
      document.documentElement.style.overflow = 'auto';
      if (interval.value) {
        clearInterval(interval.value);
      }
    }
  }
);

function startProgress() {
  interval.value = setInterval(() => {
    if (progressValue.value < 100) {
      progressValue.value += 1;
    } else {
      if (interval.value) {
        clearInterval(interval.value);
      }
    }
  }, 100);
}

function handleLogResult(result: string): void {
  logs.value.push(result);
}
</script>

<template>
  <div v-if="active" class="loading-overlay">
    <div class="loading-content box">
      <p class="title is-4">{{ message }}</p>
      <progress class="progress is-primary" :value="progressValue" max="100"></progress>
      <p v-for="(log, index) in logs" :key="index">{{ log }}</p>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}
</style>
