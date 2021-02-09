import router from '@/router'

export default {
  state: {
    products: [],
    filter: {
      name: '',
      categoryID: ''
    }
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

  actions: {
    setFilter: ({ commit }, { name, categoryID }) => {
      commit('SET_FILTER', { name, categoryID })

      router.replace({
        name: router.currentRoute.value.name,
        query: { n: name, c: categoryID }
      })
    }
  },

  getters: {
    all: state =>
      state.products.sort((a, b) =>
        a.stock < b.stock ? 1 : a.stock > b.stock ? -1 : 0
      ),
    byFilter: (state, getters, rootState, rootGetters) =>
      getters.all
        .filter(el =>
          state.filter.categoryID
            ? el.categoryID === state.filter.categoryID
            : el
        )
        .filter(el =>
          state.filter.name
            ? el.name.toLowerCase().includes(state.filter.name.toLowerCase()) ||
              rootGetters['categories/byID'](el.categoryID)
                .name.toLowerCase()
                .includes(state.filter.name.toLowerCase())
            : el
        ),
    byID: state => id => state.products.find(el => el.id === id),

    byCategoryID: state => categoryID =>
      state.products.filter(el => el.categoryID === categoryID)
  }
}
