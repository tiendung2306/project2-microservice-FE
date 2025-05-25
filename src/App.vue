<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import { RouterView } from 'vue-router';
import NavigatorHeader from './components/header/NavigatorHeader.vue';
</script>

<template>
  <NavigatorHeader />
  <RouterView />
  <ConfirmDialog :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '50vw' }" />
</template>
