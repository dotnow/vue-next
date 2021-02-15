import { ref } from 'vue'
import store from '@/store'
import { authService, cartRef, promocodesRef } from '@/plugins/firebase'

const CART_KEY = 'USER_CART'

export const useCart = () => {
  const error = ref(null)

  const applyPromocode = async (promocode, isTransfer = false) => {
    error.value = null
    const rules = ref(null)

    try {
      const snapshot = await promocodesRef.child(promocode).get()

      if (!isTransfer) {
        if (!snapshot.exists()) {
          error.value = 'Промокод не найден'
          return
        }
        rules.value = snapshot.val()
        if (rules.value.type === 1) {
          await setCartItem({
            id: rules.value.value,
            amount: 1,
            price: 0,
            promo: true
          })
        }
      }
    } catch (err) {
      console.log(err.message)
      error.value = err.message
      return
    }

    if (authService.currentUser) {
      // db cart
      try {
        await cartRef.child('promocodes').push(promocode)
        error.value = null
      } catch (err) {
        console.log(err.message)
        error.value = err.message
      }
    } else {
      // local cart
      try {
        let cart = getLocalCart()

        cart.promocodes.push(promocode)
        store.commit('cart/SET_PROMOCODES', cart.promocodes)
        localStorage.setItem(CART_KEY, JSON.stringify(cart))
        error.value = null
      } catch (err) {
        console.log(err.message)
        error.value = err.message
      }
    }
  }

  const setCartItem = async item => {
    error.value = null

    if (authService.currentUser) {
      // db cart
      try {
        if (item.promo) {
          item.id = `${item.id}-promo`
        }
        if (!item.amount) {
          await cartRef.child(item.id).remove()
        } else {
          await cartRef.child(item.id).set(item)
        }
        error.value = null
      } catch (err) {
        console.log(err.message)
        error.value = err.message
      }
    } else {
      // local cart
      try {
        let cart = getLocalCart()

        if (!item.amount) {
          cart.items = cart.items.filter(el => el.id !== item.id)
          store.commit('cart/CART_REMOVE_ITEM', item.id)
        } else {
          const index = cart.items.findIndex(el => el.id === item.id)

          if (index !== -1) {
            cart.items[index] = item
          } else {
            cart.items.push(item)
          }
        }

        store.commit('cart/SET_CART', cart.items)
        localStorage.setItem(CART_KEY, JSON.stringify(cart))
        error.value = null
      } catch (err) {
        console.log(err.message)
        error.value = err.message
      }
    }
  }

  const clearCart = async () => {
    try {
      await cartRef.remove()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const transferCart = async () => {
    const localCart = getLocalCart()

    if (localCart) {
      for (const cartItem of localCart.items) {
        await setCartItem(cartItem)
      }

      for (const promocode of localCart.promocodes) {
        await applyPromocode(promocode, true)
      }

      clearLocalCart()
    }
  }

  const getLocalCart = () =>
    JSON.parse(localStorage.getItem(CART_KEY)) ?? { items: [], promocodes: [] }

  const clearLocalCart = () => {
    store.commit('cart/SET_CART', [])
    store.commit('cart/SET_PROMOCODES', [])
    localStorage.removeItem(CART_KEY)
  }

  return {
    getLocalCart,
    setCartItem,
    clearLocalCart,
    transferCart,
    clearCart,
    applyPromocode,
    error
  }
}
