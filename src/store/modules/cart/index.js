export default {
  state: {
    cart: [],
    promocodes: []
  },

  mutations: {
    SET_CART: (state, payload) => (state.cart = payload),

    SET_PROMOCODES: (state, payload) =>
      (state.promocodes = Object.values(payload)),

    PROMOCODE_ADD: (state, payload) => state.promocodes.push(payload),

    PROMOCODE_UPDATE: (state, payload) => {
      const index = state.promocodes.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.promocodes[index] = payload
      }
    },

    PROMOCODE_REMOVE: (state, payload) =>
      (state.promocodes = state.promocodes.filter(el => el !== payload)),

    CART_SET_ITEM: (state, payload) => {
      const index = state.cart.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.cart[index] = payload
      } else {
        state.cart.push(payload)
      }
    },

    CART_REMOVE_ITEM: (state, payload) =>
      (state.cart = state.cart.filter(el => el.id !== payload))
  },

  actions: {},

  getters: {
    cart: state => state.cart,
    promocodes: state => state.promocodes,
    cartSum: (state, getters) =>
      getters.cart.reduce((acc, cur) => (acc += cur.price * cur.amount), 0),
    cartTotalAmount: (state, getters) =>
      getters.cart.reduce((acc, cur) => (acc += cur.amount), 0),
    cartDiscount: (state, getters, rootState, rootGetters) =>
      state.promocodes.reduce((acc, cur) => {
        const promocode = rootGetters['promocodes/byID'](cur)
        if (
          promocode &&
          promocode.type === 0 &&
          getters.cartSum >= promocode.condition
        ) {
          acc += (getters.cartSum * promocode.value) / 100
        }
        if (promocode && promocode.type === 2) {
          acc += promocode.value
        }
        return acc
      }, 0),
    cartTotalSum: (state, getters) => {
      const sum = getters.cartSum - getters.cartDiscount
      return Math.min(Math.max(sum, 0), Number.MAX_SAFE_INTEGER)
    }
  }
}
