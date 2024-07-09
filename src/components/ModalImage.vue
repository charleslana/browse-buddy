<script setup lang="ts">
defineProps({
  screenshot: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

function closeModal(): void {
  emit('close');
}
</script>

<template>
  <div class="modal is-active modal-full-screen modal-fx-fadeInScale">
    <div class="modal-content modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('screenshotTitle') }}</p>
        <button class="modal-button-close delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <figure class="image is-16by9">
          <img :src="`data:image/png;base64,${screenshot}`" alt="Screenshot" />
        </figure>
      </section>
      <footer class="modal-card-foot">
        <button class="modal-button-close button" @click="closeModal">
          {{ $t('closeButton') }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>
