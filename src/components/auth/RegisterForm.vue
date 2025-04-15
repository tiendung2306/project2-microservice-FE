<script setup lang="ts">
import { Password } from 'primevue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const onRegister = () => {
  console.log(username.value, password.value, confirmPassword.value)
}
</script>

<template>
  <div
    class="min-h-screen flex space-y-4 flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="text-3xl">Register</div>
    <form class="space-y-2">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <div class="mt-1">
          <InputText
            id="username"
            v-model="username"
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
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Confirm password</label
        >
        <div class="mt-1">
          <Password
            id="password"
            v-model="confirmPassword"
            :feedback="false"
            class="block flex-col w-full placeholder-gray-400 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div class="text-right">
        <Button
          label="Register"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="onRegister"
        ></Button>
      </div>
    </form>
    <div class="font-italic">
      Having an account?<span
        class="ml-1 text-indigo-600 cursor-pointer hover:underline"
        @click="$router.push('/login')"
        >Login</span
      >
    </div>
  </div>
</template>
