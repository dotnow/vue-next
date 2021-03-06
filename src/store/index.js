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
    layout: 'grid',
    authModal: false,
    loading: false,
    user: null
  },
  mutations: {
    SWITCH_LAYOUT: (state, payload) => (state.layout = payload),

    TOGGLE_AUTH_MODAL: state => (state.authModal = !state.authModal),

    SET_LOADING: (state, payload) => (state.loading = !!payload),

    SET_USER: (state, payload) => (state.user = payload)
  },
  actions: {},
  getters: {
    layout: state => state.layout,
    isAuth: state => !!state.user,
    user: state => state.user,
    isAdmin: state => state.user && state.user.role === 'admin',
    username: state => state.user.name ?? state.user.phoneNumber,
    authModal: state => state.authModal,
    loading: state => state.loading
  }
})
