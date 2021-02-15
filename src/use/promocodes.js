import { ref } from 'vue'
import { promocodesRef } from '@/plugins/firebase'

export const usePromocodes = () => {
  const error = ref(null)

  const addPromocode = async promocode => {
    error.value = null

    try {
      await promocodesRef.push().set(promocode)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const updatePromocode = async promocode => {
    error.value = null

    try {
      await promocodesRef.child(promocode.id).set(promocode)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const removePromocode = async promocode => {
    error.value = null

    try {
      await promocodesRef.child(promocode).remove()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  return {
    addPromocode,
    updatePromocode,
    removePromocode,
    error
  }
}
