import { createApp } from 'vue'
import App from '@/App'
import AppEmpty from '@/components/app/AppEmpty'
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
  minimumFractionDigits: 0, // ie, Safari fix
  maximumFractionDigits: 0
})

const formatCurrency = value => formatter.format(value) ?? 0

authService.onAuthStateChanged(async user => {
  await useUser().fetchUser(user)

  if (!app) {
    app = createApp(App)
      .use(store)
      .use(router)
      .use(PrimeVue)
      .component('AppEmpty', AppEmpty)
      .provide('formatCurrency', formatCurrency)
      .mount('#app')
  }
})
