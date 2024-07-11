<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div
    class="container is-flex is-justify-content-center is-align-content-center is-align-items-center is-align-self-center"
  >
    <div class="columns is-centered is-multiline">
      <div class="column is-half">
        <RouterLink to="/interface">
          <div class="card">
            <div class="card-content">
              <p class="title">Testes de interfaces</p>
              <p class="subtitle">Normalmente usado para testes de elementos na página</p>
            </div>
          </div>
        </RouterLink>
      </div>
      <div class="column is-half">
        <RouterLink to="/api">
          <div class="card">
            <div class="card-content">
              <p class="title">Testes de API</p>
              <p class="subtitle">Normalmente usado para testes de requisição de API</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  height: 100%;
}
</style>
