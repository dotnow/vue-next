<template>
  <div class="p-text-center">
    <h5 class="p-mt-0">Данные администратора</h5>
    <div class="p-mb-3">
      <InlineMessage severity="info">
        Телефон: +7 999 999-99-99
      </InlineMessage>
    </div>
    <div class="p-mb-3">
      <InlineMessage severity="info">
        SMS код: 000000
      </InlineMessage>
    </div>
  </div>
  <form @submit.prevent="onSubmit">
    <div class="p-fluid p-formgrid p-grid p-jc-center p-mb-2">
      <div class="p-col-12 p-md-6">
        <InputMask
          v-model="phone"
          id="phone"
          mask="+7 (999) 999 99 99"
          slotChar=""
          autofocus
          autocomplete="tel"
          :disabled="isCodeSended"
        />
      </div>
    </div>

    <div class="p-fluid p-formgrid p-grid p-jc-center" v-if="!isDisabled">
      <div class="p-col-12 p-md-6">
        <Button
          type="submit"
          label="Отправить код"
          class="p-button-sm"
          :disabled="isSendDisabled"
        />
      </div>
    </div>

    <div class="p-fluid p-formgrid p-grid p-jc-center" v-if="isCodeSended">
      <div class="p-col-12 p-md-6">
        <InputMask
          id="code"
          v-model="code"
          mask="999-999"
          slotChar=""
          autocomplete="off"
          placeholder="Код из SMS"
          autofocus
        />
      </div>
    </div>
  </form>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useAuth } from '@/use/auth'
import { useToast } from 'primevue/usetoast'

export default {
  setup() {
    const { signIn, confirm, error } = useAuth()
    const toast = useToast()
    const store = useStore()
    const router = useRouter()
    const CODE_LENGTH = 6
    const PHONE_MASKED_LENGTH = 11

    const phone = ref('')
    const code = ref('')
    const isCodeSended = ref(false)
    const isSendDisabled = ref(false)

    const unMask = masked => masked.replace(/[^0-9]/g, '')

    const isValidPhone = computed(
      () => unMask(phone.value).length === PHONE_MASKED_LENGTH
    )

    const isDisabled = computed(() => !isValidPhone.value || isCodeSended.value)

    watch(code, async maskedValue => {
      const value = unMask(maskedValue)

      if (value.length === CODE_LENGTH) {
        await confirm(value)

        if (error.value) {
          code.value = ''

          toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Неверный код',
            life: 3000
          })
        } else {
          toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Успешный вход',
            life: 3000
          })

          if (store.getters.displayAuthModal) {
            store.commit('SET_AUTH_MODAL', false)
          } else {
            router.replace({ name: 'shop' })
          }

          reset()
        }
      }
    })

    const onSubmit = async () => {
      if (phone.value && !isDisabled.value) {
        isSendDisabled.value = true

        await signIn(unMask(phone.value))

        if (error.value) {
          isSendDisabled.value = false

          toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Код не отправлен, повторите попытку',
            life: 3000
          })
        } else {
          isCodeSended.value = true

          toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Код отправлен',
            life: 3000
          })
        }
      }
    }

    const reset = () => {
      phone.value = ''
      code.value = ''
      isCodeSended.value = false
      isSendDisabled.value = false
    }

    return {
      phone,
      code,
      isDisabled,
      isCodeSended,
      isSendDisabled,
      isValidPhone,
      onSubmit,
      reset
    }
  }
}
</script>
