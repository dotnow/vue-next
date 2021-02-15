export default {
  state: {
    orders: []
  },

  mutations: {
    ORDER_ADD: (state, payload) => state.orders.push(payload),

    ORDER_UPDATE: (state, payload) => {
      const index = state.orders.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.orders[index] = payload
      }
    },

    ORDER_REMOVE: (state, payload) =>
      (state.orders = state.orders.filter(el => el.id != payload))
  },

  actions: {},

  getters: {
    all: state => state.orders,
    byID: state => id => state.orders.find(el => el.id === id)
  }
}
