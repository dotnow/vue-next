import { dbService, attachCart, attachOrders } from '@/plugins/firebase'
import { useCart } from '@/use/cart'
import store from '@/store'

export const useUser = () => {
  const fetchUser = async user => {
    if (user) {
      let profile = null

      try {
        const { uid, phoneNumber } = user
        const snapshot = await dbService.ref(`users/${uid}`).once('value')

        if (snapshot.val()) {
          profile = { uid, phoneNumber, ...snapshot.toJSON() }
        } else {
          profile = { uid, phoneNumber }
        }

        store.commit('SET_USER', profile)
      } catch (err) {
        console.log(err.message)
      }

      attachCart(user.uid)

      if (profile.role === 'admin') {
        attachOrders()
      } else {
        attachOrders(user.uid)
      }
    } else {
      const cart = useCart().getLocalCart()
      store.commit('cart/SET_CART', cart.items)
      store.commit('cart/SET_PROMOCODES', cart.promocodes)
    }
  }
  return { fetchUser }
}
