import { ref } from 'vue'
import { productsRef } from '@/plugins/firebase'

export const useProducts = () => {
  const error = ref(null)

  const addProduct = async product => {
    error.value = null

    try {
      await productsRef.push().set(product)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const updateProduct = async product => {
    error.value = null

    try {
      await productsRef.child(product.id).set(product)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const removeProduct = async productID => {
    error.value = null

    try {
      await productsRef.child(productID).remove()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  return {
    addProduct,
    updateProduct,
    removeProduct,
    error
  }
}
