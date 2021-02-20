import { dbService, transfrom } from './init'
import { useCart } from '@/use/cart'
import store from '@/store'

// Корзина
let cartRef = null

const attachCart = uid => {
  cartRef = dbService.ref(`carts/${uid}`)

  cartRef.once('value').then(snapshot => {
    if (!snapshot.exists()) {
      useCart().transferCart()
    }
  })

  cartRef.on('child_added', async data => {
    if (data.key === 'promocodes') {
      store.commit('cart/SET_PROMOCODES', data.val())
    } else {
      store.commit('cart/CART_SET_ITEM', transfrom(data))
    }
  })

  cartRef.on('child_changed', async data => {
    if (data.key === 'promocodes') {
      store.commit('cart/SET_PROMOCODES', data.val())
    } else {
      if (!data.val().amount) {
        data.ref.remove()
      } else {
        store.commit('cart/CART_SET_ITEM', transfrom(data))
      }
    }
  })

  cartRef.on('child_removed', async data => {
    if (data.key === 'promocodes') {
      store.commit('cart/SET_PROMOCODES', [])
    } else {
      store.commit('cart/CART_REMOVE_ITEM', data.key)
    }
  })
}

const detachCart = () => {
  cartRef.off()
}

export { cartRef, attachCart, detachCart }
