export default {
  state: {
    orders: [],
    orderStatuses: [],
    payTypes: [],
    deliveryTypes: []
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
      (state.orders = state.orders.filter(el => el.id != payload)),

    ORDER_STATUS_ADD: (state, payload) => state.orderStatuses.push(payload),

    ORDER_STATUS_UPDATE: (state, payload) => {
      const index = state.orderStatuses.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.orderStatuses[index] = payload
      }
    },

    ORDER_STATUS_REMOVE: (state, payload) =>
      (state.orderStatuses = state.orderStatuses.filter(
        el => el.id != payload
      )),

    PAY_TYPE_ADD: (state, payload) => state.payTypes.push(payload),

    PAY_TYPE_UPDATE: (state, payload) => {
      const index = state.payTypes.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.payTypes[index] = payload
      }
    },

    PAY_TYPE_REMOVE: (state, payload) =>
      (state.payTypes = state.payTypes.filter(el => el.id != payload)),

    DELIVERY_TYPE_ADD: (state, payload) => state.deliveryTypes.push(payload),

    DELIVERY_TYPE_UPDATE: (state, payload) => {
      const index = state.deliveryTypes.findIndex(el => el.id === payload.id)

      if (index !== -1) {
        state.deliveryTypes[index] = payload
      }
    },

    DELIVERY_TYPE_REMOVE: (state, payload) =>
      (state.deliveryTypes = state.deliveryTypes.filter(el => el.id != payload))
  },

  actions: {},

  getters: {
    all: state => state.orders,
    orderStatuses: state => state.orderStatuses,
    orderStatusByID: state => id =>
      state.orderStatuses.find(el => el.id === id),
    payTypes: state => state.payTypes,
    payTypeByID: state => id => state.payTypes.find(el => el.id === id),
    deliveryTypes: state => state.deliveryTypes,
    deliveryTypeByID: state => id =>
      state.deliveryTypes.find(el => el.id === id),
    byID: state => id => state.orders.find(el => el.id === id)
  }
}
