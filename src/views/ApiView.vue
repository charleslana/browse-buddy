<script setup lang="ts">
import ImportClearTestBox from '@/components/ImportClearTestBox.vue';
import NavBar from '@/components/NavBar.vue';
import SettingsComponent from '@/components/SettingsComponent.vue';
import { ref } from 'vue';

const isSkeleton = ref(true);
</script>

<template>
  <NavBar />
  <div class="container">
    <div class="columns">
      <div class="column is-two-thirds mx-5">
        <ImportClearTestBox :is-skeleton="isSkeleton" />
      </div>
      <SettingsComponent :is-skeleton="isSkeleton" />
    </div>
  </div>
</template>

<style scoped></style>
