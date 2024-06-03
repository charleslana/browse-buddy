<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">{{ $t('confirmMessage') }}</section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" @click="confirmModal">{{ $t('confirmButton') }}</button>
          <button class="button" @click="closeModal">{{ $t('cancelButton') }}</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['confirm-modal', 'close-modal']);

function confirmModal(): void {
  emit('confirm-modal');
}

function closeModal(): void {
  emit('close-modal');
}
</script>

<style scoped></style>
