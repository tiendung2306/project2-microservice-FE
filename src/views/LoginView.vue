<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <div class="login-container">
    <div class="counter">
      <p>Count: {{ count }}</p>
      <Button @click="increment" label="Submit" />
    </div>

    <main class="login-content">
      <h1>Đăng nhập</h1>
      <form>
        <!-- Các trường đăng nhập -->
      </form>
    </main>
  </div>
</template>
