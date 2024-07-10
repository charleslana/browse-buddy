<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

interface Props {
  active: boolean;
  message: string;
}

const props = defineProps<Props>();
const logs = ref<string[]>([]);
const logsContainerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  window.ipcRenderer.on('log-result', (_, response) => handleLogResult(response));
});

watch(
  () => props.active,
  newVal => {
    if (newVal) {
      logs.value.length = 0;
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }
  }
);

function handleLogResult(result: string): void {
  logs.value.push(result);
  scrollToBottom();
}

function scrollToBottom(): void {
  nextTick(() => {
    if (logsContainerRef.value) {
      logsContainerRef.value.scrollTop = logsContainerRef.value.scrollHeight;
    }
  });
}
</script>

<template>
  <div v-if="active" class="loading-overlay">
    <div
      ref="logsContainerRef"
      class="loading-content box"
      :class="{ 'scroll-down': logs.length > 0 }"
    >
      <p class="title is-4">{{ message }}</p>
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
  overflow-y: auto;
}

.loading-content {
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  overflow-y: auto;
  max-height: 80vh;
}

.scroll-down {
  scroll-behavior: smooth;
}
</style>
