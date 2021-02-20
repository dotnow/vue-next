import { ref } from 'vue'
import { pay as _pay } from '@/plugins/cloudpayments'

export const usePay = () => {
  const error = ref(null)

  const pay = async data => {
    error.value = null

    try {
      await _pay({ ...data })
    } catch (err) {
      console.log(err)
      error.value = err
    }
  }

  return { pay, error }
}
