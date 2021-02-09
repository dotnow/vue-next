export default {
  state: {
    categories: []
  },

  mutations: {
    CATEGORY_ADD: (state, payload) => state.categories.push(payload),

    CATEGORY_UPDATE: (state, payload) => {
      const index = state.categories.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.categories[index] = payload
      }
    },

    CATEGORY_REMOVE: (state, payload) =>
      (state.categories = state.categories.filter(el => el.id != payload))
  },

  actions: {},

  getters: {
    all: state => state.categories,
    byID: state => id =>
      state.categories.find(el => el.id === id) ?? { name: 'Неизвестно' }
  }
}
