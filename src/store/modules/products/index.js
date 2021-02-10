export default {
  state: {
    products: []
  },

  mutations: {
    SET_FILTER: (state, payload) => (state.filter = payload),

    PRODUCT_ADD: (state, payload) => state.products.push(payload),

    PRODUCT_UPDATE: (state, payload) => {
      const index = state.products.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.products[index] = payload
      }
    },

    PRODUCT_REMOVE: (state, payload) =>
      (state.products = state.products.filter(el => el.id != payload))
  },

  actions: {},

  getters: {
    all: state =>
      state.products.sort((a, b) =>
        a.stock < b.stock ? 1 : a.stock > b.stock ? -1 : 0
      ),
    byID: state => id => state.products.find(el => el.id === id),

    byCategoryID: state => categoryID =>
      state.products.filter(el => el.categoryID === categoryID)
  }
}
