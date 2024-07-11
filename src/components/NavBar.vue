<script setup lang="ts">
import images from '@/data/image';
import { RouterLink } from 'vue-router';
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
            <RouterLink to="/" class="button is-primary">
              <strong>Voltar</strong>
            </RouterLink>
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
