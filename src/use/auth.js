import { authService, appVerifier, detachCart } from '@/plugins/firebase'
import { useUser } from '@/use/user'
import { ref } from 'vue'
import store from '@/store'

export const useAuth = () => {
  const error = ref(null)
  const isPending = ref(false)
  let confirmationResult = null

  const signIn = async phoneNumber => {
    error.value = null
    isPending.value = true

    try {
      confirmationResult = await authService.signInWithPhoneNumber(
        `+${phoneNumber}`,
        appVerifier
      )
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    } finally {
      isPending.value = false
    }
  }

  const confirm = async smsCode => {
    error.value = null
    isPending.value = true

    try {
      await confirmationResult.confirm(smsCode)
      await useUser().fetchUser()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    } finally {
      isPending.value = false
    }
  }

  // Выход
  const signOut = async () => {
    error.value = null
    isPending.value = true

    try {
      detachCart()
      await authService.signOut()
      store.commit('SET_USER', null)
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    } finally {
      isPending.value = false
    }
  }

  return { error, signIn, confirm, signOut, isPending }
}
