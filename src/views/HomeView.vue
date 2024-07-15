<script setup lang="ts">
import router from '@/router';

function goToMenuInterface(): void {
  window.ipcRenderer.send('show-menu-interface');
  router.push('/interface');
}

function goToMenuApi(): void {
  window.ipcRenderer.send('show-menu-api');
  router.push('/api');
}
</script>

<template>
  <div
    class="container is-flex is-justify-content-center is-align-content-center is-align-items-center is-align-self-center"
  >
    <div class="columns is-centered is-multiline">
      <div class="column is-half">
        <div class="card is-clickable" @click="goToMenuInterface">
          <div class="card-content">
            <p class="title">{{ $t('interfaceTitle') }}</p>
            <p class="subtitle">{{ $t('interfaceDescription') }}</p>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="card is-clickable" @click="goToMenuApi">
          <div class="card-content">
            <p class="title">{{ $t('apiTitle') }}</p>
            <p class="subtitle">{{ $t('apiDescription') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  height: 100%;
}
</style>
