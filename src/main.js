import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { authService } from '@/plugins/firebase'
import { useUser } from '@/use/user'
import PrimeVue from '@/plugins/primevue'
import '@/assets/css/styles.css'

let app = null

const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

const formatCurrency = amount => formatter.format(amount) ?? 0

authService.onAuthStateChanged(async user => {
  await useUser().fetchUser(user)

  if (!app) {
    app = createApp(App)
      .use(store)
      .use(router)
      .use(PrimeVue)
      .provide('formatCurrency', formatCurrency)
      .mount('#app')
  }
})
