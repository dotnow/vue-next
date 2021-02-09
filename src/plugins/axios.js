import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { useNotify } from '@/use/notify'

const notify = useNotify()

const Instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000
})


Instance.interceptors.response.use(
  response => {
    setTimeout(() => {
      store.commit('SET_LOADING', false)
    }, 1000)
    return response
  },
  error => {
    if (error.response) {
      const response = error.response
      if (response.status === 401) {
        notify.error('Невалидный токен')
        router.push({ name: 'auth' })
      } else {
        notify.error(error.response.data.error)
      }
    } else {
      notify.error(error)
    }

    store.commit('SET_LOADING', false)
    return Promise.reject(error)
  }
)

Instance.interceptors.request.use(
  config => {
    store.commit('SET_LOADING', true)
    return config
  },
  error => {
    notify.error(error)
    store.commit('SET_LOADING', false)
    return Promise.reject(error)
  }
)

export default Instance
