<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const user = userStore.getUser
if (user === null) {
  const router = useRouter()
  router.push('/login')
}
const isEditing = ref<string | null>(null) // Define isEditing as a reactive property
const editableUser = ref({
  username: user?.username || '',
  email: user?.email || '',
  password: '',
  confirmPassword: '',
})
console.log('User:', user)

function toggleEdit(field: string) {
  if (isEditing.value === field) {
    // Save changes
    const updatedUser = userStore.getUser
    if (updatedUser === null) {
      console.error('User not found')
      return
    }
    if (field === 'username') {
      updatedUser.username = editableUser.value.username
    } else if (field === 'email') {
      updatedUser.email = editableUser.value.email
    } else if (field === 'password') {
      if (editableUser.value.password !== editableUser.value.confirmPassword) {
        alert('Passwords do not match')
        return
      }
    }
  }
  isEditing.value = isEditing.value === field ? null : field
}
</script>

<template>
  <div class="flex flex-col items-center mt-10 min-h-screen py-12 px-6 sm:px-8 lg:px-10">
    <div class="text-3xl font-bold text-gray-800 mb-8">User Profile</div>
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-6">
      <div class="flex items-center space-x-2 justify-between">
        <div class="flex items-center space-x-2">
          <span class="font-medium text-gray-700">Username:</span>
          <span v-if="isEditing !== 'username'" class="text-gray-900">{{ user?.username }}</span>
          <input
            v-else
            v-model="editableUser.username"
            type="text"
            class="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-col items-end">
          <button
            @click="toggleEdit('username')"
            class="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
          >
            {{ isEditing === 'username' ? 'Save' : 'Edit' }}
          </button>
        </div>
      </div>

      <div class="flex items-center space-x-2 justify-between">
        <div class="flex items-center space-x-2">
          <span class="font-medium text-gray-700">Email:</span>
          <span v-if="isEditing !== 'email'" class="text-gray-900">{{ user?.email }}</span>
          <input
            v-else
            v-model="editableUser.email"
            type="email"
            class="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-col items-end">
          <button
            @click="toggleEdit('email')"
            class="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
          >
            {{ isEditing === 'email' ? 'Save' : 'Edit' }}
          </button>
        </div>
      </div>

      <div class="flex items-center space-x-2 justify-between">
        <div class="flex items-center space-x-2">
          <span class="font-medium text-gray-700">Password:</span>
          <span v-if="isEditing !== 'password'" class="text-gray-900">**********</span>
          <div v-else class="space-y-2">
            <input
              v-model="editableUser.password"
              type="password"
              placeholder="New Password"
              class="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="editableUser.confirmPassword"
              type="password"
              placeholder="Confirm Password"
              class="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-sm text-gray-500">Leave blank to keep the same password</p>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <button
            @click="toggleEdit('password')"
            class="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
          >
            {{ isEditing === 'password' ? 'Save' : 'Edit' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
