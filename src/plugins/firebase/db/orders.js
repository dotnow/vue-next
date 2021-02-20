import { dbService, transfrom } from './init'
import store from '@/store'

// Типы оплаты
const payTypesRef = dbService.ref('payTypes')

payTypesRef.on('child_added', data => {
  store.commit('orders/PAY_TYPE_ADD', transfrom(data))
})

payTypesRef.on('child_changed', data => {
  store.commit('orders/PAY_TYPE_UPDATE', transfrom(data))
})

payTypesRef.on('child_removed', data =>
  store.commit('orders/PAY_TYPE_REMOVE', data.key)
)

// Типы доставки
const deliveryTypesRef = dbService.ref('deliveryTypes')

deliveryTypesRef.on('child_added', data => {
  store.commit('orders/DELIVERY_TYPE_ADD', transfrom(data))
})

deliveryTypesRef.on('child_changed', data => {
  store.commit('orders/DELIVERY_TYPE_UPDATE', transfrom(data))
})

deliveryTypesRef.on('child_removed', data =>
  store.commit('orders/DELIVERY_TYPE_REMOVE', data.key)
)

// Статусы заказа
const orderStatusRef = dbService.ref('orderStatus')

orderStatusRef.on('child_added', data => {
  store.commit('orders/ORDER_STATUS_ADD', transfrom(data))
})

orderStatusRef.on('child_changed', data => {
  store.commit('orders/ORDER_STATUS_UPDATE', transfrom(data))
})

orderStatusRef.on('child_removed', data =>
  store.commit('orders/ORDER_STATUS_REMOVE', data.key)
)

// Заказы
const ordersRef = dbService.ref('orders')

const attachOrders = (uid = null) => {
  ordersRef.on('child_added', data => {
    if (!uid || (uid && data.val().userID === uid)) {
      store.commit('orders/ORDER_ADD', transfrom(data))
    }
  })

  ordersRef.on('child_changed', data => {
    store.commit('orders/ORDER_UPDATE', transfrom(data))
  })

  ordersRef.on('child_removed', data =>
    store.commit('orders/ORDER_REMOVE', data.key)
  )
}

export { ordersRef, attachOrders }
