import { dbService } from './init'
import store from '@/store'

// Типы оплаты и доставки
const payTypesRef = dbService.ref('payTypes')
const deliveryTypesRef = dbService.ref('deliveryTypes')

payTypesRef.on('child_added', data => {
  store.commit('orders/PAY_TYPE_ADD', { id: data.key, ...data.val() })
})

payTypesRef.on('child_changed', data => {
  store.commit('orders/PAY_TYPE_UPDATE', { id: data.key, ...data.val() })
})

payTypesRef.on('child_removed', data =>
  store.commit('orders/PAY_TYPE_REMOVE', data.key)
)

deliveryTypesRef.on('child_added', data => {
  store.commit('orders/DELIVERY_TYPE_ADD', { id: data.key, ...data.val() })
})

deliveryTypesRef.on('child_changed', data => {
  store.commit('orders/DELIVERY_TYPE_UPDATE', { id: data.key, ...data.val() })
})

deliveryTypesRef.on('child_removed', data =>
  store.commit('orders/DELIVERY_TYPE_REMOVE', data.key)
)

// Заказы
let ordersRef = dbService.ref('orders')

const attachOrders = (uid = null) => {
  ordersRef.on('child_added', data => {
    if (!uid || (uid && data.val().userID === uid)) {
      store.commit('orders/ORDER_ADD', { id: data.key, ...data.val() })
    }
  })

  ordersRef.on('child_changed', data => {
    store.commit('orders/ORDER_UPDATE', { id: data.key, ...data.val() })
  })

  ordersRef.on('child_removed', data =>
    store.commit('orders/ORDER_REMOVE', data.key)
  )
}

export { ordersRef, attachOrders }
