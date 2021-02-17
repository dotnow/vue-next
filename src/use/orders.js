import { ref } from 'vue'
import { ordersRef, productsRef } from '@/plugins/firebase'
import { useCart } from '@/use/cart'

export const useOrders = () => {
  const error = ref(null)
  const newOrderID = ref('')

  const addOrder = async order => {
    error.value = null
    newOrderID.value = null

    try {
      const newOrderRef = await ordersRef.push()
      newOrderID.value = newOrderRef.key
      await newOrderRef.set(order)

      for (const item of order.items) {
        productsRef.child(item.id.replace('-promo', '')).transaction(el => {
          if (el && el.stock) {
            el.stock -= item.amount
          }
          return el
        })
      }
      await useCart().clearCart()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const updateOrder = async order => {
    error.value = null

    try {
      await ordersRef.child(order.id).set(order)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const removeOrder = async orderID => {
    error.value = null

    try {
      await ordersRef.child(orderID).remove()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  return {
    addOrder,
    updateOrder,
    removeOrder,
    newOrderID,
    error
  }
}
