<script setup lang="ts">
import { changePassword, getUser, updateUser } from '@/services/profile/profile.service'
import { useUserStore } from '@/stores/userStore'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// Use computed to get reactive user data
const user = computed(() => userStore.getUser)

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  try {
    // Fetch latest user data
    const latestUserData = await getUser(user.value.user_id.toString())
    console.log(latestUserData)
    // Update store with latest data
    userStore.setUser(latestUserData)
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
})

const isEditing = ref<string | null>(null)
const editableUser = ref({
  username: user.value?.username || '',
  email: user.value?.email || '',
  password: '',
  confirmPassword: '',
})

async function toggleEdit(field: string) {
  if (isEditing.value === field) {
    // Save changes
    const updatedUser = userStore.getUser
    if (!updatedUser) {
      console.error('User not found')
      return
    }
    try {
      if (field === 'username') {
        updatedUser.username = editableUser.value.username
        const response = await updateUser(updatedUser.user_id, { username: updatedUser.username })
        userStore.setUser(response) // Update store with response data
      } else if (field === 'email') {
        updatedUser.email = editableUser.value.email
        const response = await updateUser(updatedUser.user_id, { email: updatedUser.email })
        userStore.setUser(response) // Update store with response data
      } else if (field === 'password') {
        if (editableUser.value.password !== editableUser.value.confirmPassword) {
          alert('Passwords do not match')
          return
        }
        // If password is empty, user wants to keep the same password
        if (!editableUser.value.password) {
          isEditing.value = null
          return
        }
        await changePassword(editableUser.value.password)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user information')
      return
    }
  }
  isEditing.value = isEditing.value === field ? null : field
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Profile Header -->
      <div class="text-center mb-10">
        <div
          class="h-24 w-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
          {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <h1 class="text-3xl font-extrabold text-gray-800">User Profile</h1>
        <p class="text-gray-500 mt-2">Manage your account information</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <!-- Card Header -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h2 class="text-xl font-bold text-white">Personal Information</h2>
        </div>

        <!-- Card Content -->
        <div class="p-6 space-y-6">
          <!-- Username Field -->
          <div class="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span class="font-medium text-gray-700 mb-1 sm:mb-0">Username:</span>
                <div class="flex-1">
                  <span v-if="isEditing !== 'username'" class="text-gray-900 font-semibold">
                    {{ user?.username }}
                  </span>
                  <input v-else v-model="editableUser.username" type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter username" />
                </div>
              </div>
              <button @click="toggleEdit('username')"
                class="ml-4 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="isEditing === 'username'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'">
                {{ isEditing === 'username' ? 'Save' : 'Edit' }}
              </button>
            </div>
          </div>

          <!-- Email Field -->
          <div class="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span class="font-medium text-gray-700 mb-1 sm:mb-0">Email:</span>
                <div class="flex-1">
                  <span v-if="isEditing !== 'email'" class="text-gray-900 font-semibold">
                    {{ user?.email }}
                  </span>
                  <input v-else v-model="editableUser.email" type="email"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter email" />
                </div>
              </div>
              <button @click="toggleEdit('email')"
                class="ml-4 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="isEditing === 'email'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'">
                {{ isEditing === 'email' ? 'Save' : 'Edit' }}
              </button>
            </div>
          </div>

          <!-- Password Field -->
          <div class="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between">
              <div class="flex flex-col space-y-2 flex-grow">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-700">Password:</span>
                  <span v-if="isEditing !== 'password'" class="text-gray-900 font-semibold">••••••••</span>
                </div>
                <div v-if="isEditing === 'password'" class="space-y-3 mt-2">
                  <input v-model="editableUser.password" type="password" placeholder="New Password"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  <input v-model="editableUser.confirmPassword" type="password" placeholder="Confirm Password"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  <p class="text-sm text-gray-500 italic">Leave blank to keep the same password</p>
                </div>
              </div>
              <button @click="toggleEdit('password')"
                class="mt-3 sm:mt-0 ml-0 sm:ml-4 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="isEditing === 'password'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'">
                {{ isEditing === 'password' ? 'Save' : 'Edit' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p class="text-sm text-gray-500">Last updated: {{ new Date().toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.97);
}
</style>