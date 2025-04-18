<script setup lang="ts">
import router from '@/router'
import { login } from '@/services/auth/authService'
import { Password } from 'primevue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const onLogin = async () => {
  if (email.value === '' || password.value === '') {
    alert('Please fill in all fields')
    return
  }

  login(email.value, password.value)
    .then((response) => {
      console.log('Login status:', response)
      router.push('/')
    })
    .catch((error) => {
      console.error('Error during login:', error)
      alert('An error occurred during login')
    })
}
</script>

<template>
  <div
    class="min-h-screen flex space-y-4 flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="text-3xl">Login</div>
    <form class="space-y-2">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1">
          <InputText
            id="email"
            v-model="email"
            class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1">
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            class="block flex-col w-full placeholder-gray-400 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div class="text-right">
        <Button
          label="Login"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="onLogin"
        ></Button>
      </div>
    </form>
    <div class="font-italic">
      Not having account?<span
        class="ml-1 text-indigo-600 cursor-pointer hover:underline"
        @click="$router.push('/register')"
        >Register</span
      >
    </div>
  </div>
</template>
