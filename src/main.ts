import './assets/main.css'
import './assets/tailwind.css'

import Aura from '@primevue/themes/aura'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'system', // or 'dark' or 'light'
    },
  },
})

app.use(router)

app.mount('#app')
