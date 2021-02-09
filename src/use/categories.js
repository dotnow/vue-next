import { ref } from 'vue'
import { categoriesRef } from '@/plugins/firebase'

export const useCategories = () => {
  const error = ref(null)

  const addCategory = async category => {
    error.value = null

    try {
      await categoriesRef.push().set(category)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const updateCategory = async category => {
    error.value = null

    try {
      await categoriesRef.child(category.id).set(category)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const removeCategory = async categoryID => {
    error.value = null

    try {
      await categoriesRef.child(categoryID).remove()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  return {
    addCategory,
    updateCategory,
    removeCategory,
    error
  }
}
