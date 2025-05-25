import './assets/main.css'
import './assets/tailwind.css'

import Aura from '@primevue/themes/aura'

import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'system', // or 'dark' or 'light'
    },
  },
})

app.use(ConfirmationService)
app.component('ConfirmDialog', ConfirmDialog)

const pinia = createPinia()
app.use(pinia)

app.use(router)

app.mount('#app')
