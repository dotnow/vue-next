import { dbService } from './init'
import store from '@/store'

// Товары
const productsRef = dbService.ref('products')

productsRef.on('child_added', data => {
  store.commit('products/PRODUCT_ADD', { id: data.key, ...data.val() })
})

productsRef.on('child_changed', data => {
  store.commit('products/PRODUCT_UPDATE', { id: data.key, ...data.val() })
})

productsRef.on('child_removed', data =>
  store.commit('products/PRODUCT_REMOVE', data.key)
)

export { productsRef }
