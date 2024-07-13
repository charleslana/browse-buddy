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
            <p class="title">Testes de interfaces</p>
            <p class="subtitle">Normalmente usado para testes de elementos na página</p>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="card is-clickable" @click="goToMenuApi">
          <div class="card-content">
            <p class="title">Testes de API</p>
            <p class="subtitle">Normalmente usado para testes de requisição de API</p>
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
