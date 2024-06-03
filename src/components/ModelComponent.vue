<template>
  <div>{{ pageName }}</div>
</template>

<script setup lang="ts">
defineProps({
  pageName: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
