import { createStore, createLogger } from 'vuex'
import modules from './modules'

const plugins = []

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  modules,
  state: {
    displayAuthModal: false,
    loading: false,
    user: null
  },
  mutations: {
    SET_AUTH_MODAL: (state, payload) => (state.displayAuthModal = !!payload),

    SET_LOADING: (state, payload) => (state.loading = !!payload),

    SET_USER: (state, payload) => (state.user = payload)
  },
  actions: {},
  getters: {
    isAuth: state => !!state.user,
    user: state => state.user,
    isAdmin: state => state.user && state.user.role === 'admin',
    username: state => state.user.name ?? state.user.phoneNumber,
    displayAuthModal: state => state.displayAuthModal,
    loading: state => state.loading
  }
})
