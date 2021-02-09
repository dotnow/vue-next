export default {
  state: {
    cart: {}
  },

  mutations: {
    SET_CART: (state, payload) => (state.cart = payload),

    CART_SET_ITEM: (state, payload) => {
      if (!state.cart) {
        state.cart = {
          [payload.id]: payload.value
        }
      } else {
        state.cart[payload.id] = payload.value
      }
    },

    CART_REMOVE_ITEM: (state, payload) => delete state.cart[payload]
  },

  actions: {},

  getters: {
    cart: state => (state.cart ? Object.entries(state.cart) : []),
    cartTotalAmount: (state, getters) =>
      getters.cart.reduce((acc, cur) => (acc += cur[1]), 0)
  }
}
