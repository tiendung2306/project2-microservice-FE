<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigatorHeader from './components/header/NavigatorHeader.vue'
</script>

<template>
  <NavigatorHeader />
  <RouterView />
</template>
