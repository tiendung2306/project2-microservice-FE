<script setup lang="ts">
import router from '@/router'
import Menubar from 'primevue/menubar'
import { computed } from 'vue'

import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

const items = computed(() => {
  const menuItems = [
    { label: 'Home', command: () => router.push('/') },
    { label: 'Dashboard', command: () => router.push('/dashboard') },
    { label: 'Profile', command: () => router.push('/profile') },
    { label: 'Task', command: () => router.push('/task') },
  ]

  if (isLoggedIn.value) {
    menuItems.push({
      label: 'Logout',
      command: () => {
        // TODO: Implement logout functionality
        userStore.logout()
        return router.push('/login')
      },
    })
  }

  return menuItems
})
</script>

<template>
  <div class="flex w-full min-h-12 h-12 justify-center">
    <Menubar :model="items" class="w-full">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span>{{ item.label }}</span>
        </a>
      </template>
    </Menubar>
  </div>
</template>
