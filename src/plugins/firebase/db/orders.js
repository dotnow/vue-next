import { dbService } from './init'
import store from '@/store'

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
