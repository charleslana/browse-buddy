<script setup lang="ts">
import images from '@/data/image';
import router from '@/router';

function goBack(): void {
  window.ipcRenderer.send('hide-menu');
  router.push('/');
}
</script>

<template>
  <nav class="navbar is-fixed-top mb-5" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item is-align-items-end">
        <img :src="images.logo" alt="logo image" />
        <p class="logo is-size-4 ml-2">Browse Buddy</p>
      </span>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button class="button is-primary" @click="goBack">
              <strong>Voltar</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.logo {
  line-height: 0.6;
}
</style>
