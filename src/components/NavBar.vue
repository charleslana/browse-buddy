<template>
  <nav class="navbar is-fixed-top mb-5" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item is-align-items-end">
        <img :src="images.logo" alt="logo image" />
        <p class="logo is-size-4 ml-2">Browse Buddy</p>
      </span>
    </div>
  </nav>
</template>

<script setup lang="ts">
import images from '@/data/image';
</script>

<style scoped>
.logo {
  line-height: 0.6;
}
</style>
