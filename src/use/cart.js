import { ref } from 'vue'
import store from '@/store'
import { authService, cartRef } from '@/plugins/firebase'

const CART_KEY = 'USER_CART'

export const useCart = () => {
  const error = ref(null)

  const setCartItem = async item => {
    error.value = null

    const [key, value] = Object.values(item)

    if (authService.currentUser) {
      // db cart
      try {
        if (!value) {
          await cartRef.child(key).remove()
        } else {
          await cartRef.child(key).transaction(() => value)
        }
        error.value = null
      } catch (err) {
        console.log(err.message)
        error.value = err.message
      }
    } else {
      // local cart
      try {
        let cartItems = JSON.parse(localStorage.getItem(CART_KEY))

        if (!value) {
          delete cartItems[key]
          store.commit('cart/CART_REMOVE_ITEM', key)
        } else {
          if (!cartItems) {
            cartItems = {
              [key]: value
            }
          } else {
            cartItems[key] = value
          }

          store.commit('cart/CART_SET_ITEM', { id: key, value })
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
        error.value = null
      } catch (err) {
        console.log(err.message)
        error.value = err.message
      }
    }
  }

  const getLocalCart = () => JSON.parse(localStorage.getItem(CART_KEY))

  return { getLocalCart, setCartItem, error }
}
