export default {
  state: {
    promocodes: []
  },

  mutations: {
    PROMOCODE_ADD: (state, payload) => state.promocodes.push(payload),

    PROMOCODE_UPDATE: (state, payload) => {
      const index = state.promocodes.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.promocodes[index] = payload
      }
    },

    PROMOCODE_REMOVE: (state, payload) =>
      (state.promocodes = state.promocodes.filter(el => el.id != payload))
  },

  actions: {},

  getters: {
    all: state => state.promocodes,
    byID: state => id => state.promocodes.find(el => el.id === id)
  }
}
