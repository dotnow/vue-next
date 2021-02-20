<template>
  <Card class="p-p-3" v-if="cartItems.length && !newOrderID">
    <template v-slot:title>
      Персональная информация
    </template>
    <template v-slot:subtitle>
      Введите ваши персональные данные
    </template>
    <template v-slot:content>
      <div class="p-fluid">
        <div class="p-field">
          <label for="firstName">Имя</label>
          <InputText id="firstName" v-model.trim="firstName" />
          <small v-show="validationErrors.firstName" class="p-error"
            >Заполните поле</small
          >
        </div>
        <div class="p-field">
          <label for="lastName">Фамилия</label>
          <InputText id="lastName" v-model.trim="lastName" />
          <small v-show="validationErrors.lastName" class="p-error"
            >Заполните поле</small
          >
        </div>

        <div class="p-field">
          <label for="lastName">Способ оплаты</label>
          <Dropdown
            v-model="payType"
            :options="payTypes"
            optionValue="id"
            optionLabel="name"
            placeholder="Выберите способ оплаты"
          />
        </div>

        <div class="p-field">
          <label for="lastName">Способ доставки</label>
          <Dropdown
            v-model="deliveryType"
            :options="deliveryTypes"
            optionValue="id"
            optionLabel="name"
            placeholder="Способ доставки"
          />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="p-grid p-nogutter p-justify-between">
        <Button
          v-if="isAuth"
          :label="isNoCashPayType ? 'Оплатить заказ' : 'Оформить заказ'"
          @click="onSubmit"
          iconPos="right"
        />
        <Button
          v-else
          label="Войдите в систему для оформления заказа"
          @click="authModal"
        >
        </Button>
      </div>
    </template>
  </Card>
</template>

<script>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { usePay } from '@/use/pay'
import { useOrders } from '@/use/orders'
import { useToast } from 'primevue/usetoast'

export default {
  setup(_, { emit }) {
    const store = useStore()
    const toast = useToast()
    const { pay, error: payError } = usePay()
    const { addOrder, newOrderID, error } = useOrders()

    const firstName = ref('')
    const lastName = ref('')
    const validationErrors = reactive({})
    const payType = ref(0)
    const deliveryType = ref(0)

    const user = computed(() => store.getters.user)
    const cartItems = computed(() => store.getters['cart/cart'])
    const cartTotalSum = computed(() => store.getters['cart/cartTotalSum'])
    const payTypes = computed(() => store.getters['orders/payTypes'])
    const deliveryTypes = computed(() => store.getters['orders/deliveryTypes'])
    const isNoCashPayType = computed(() => payType.value === 0)

    const validateForm = () => {
      if (!firstName.value) validationErrors['firstName'] = true
      else delete validationErrors['firstName']

      if (!lastName.value) validationErrors['lastName'] = true
      else delete validationErrors['lastName']

      return !Object.keys(validationErrors).length
    }

    const onSubmit = async () => {
      if (validateForm()) {
        if (isNoCashPayType.value) {
          await onPay()
        } else {
          await onAddOrder()
        }
      }
    }

    const onPay = async () => {
      try {
        await pay({
          description: 'Покупка товаров Vladilen Online',
          amount: cartTotalSum.value,
          accountId: user.value.uid,
          data: {
            firstName: firstName.value,
            lastName: lastName.value,
            phone: user.value.phoneNumber
          }
        })

        if (!payError.value) {
          await onAddOrder()
        } else {
          toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: payError.value,
            life: 3000
          })
        }
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Вы отменили оплату',
          life: 3000
        })
      }
    }

    const onAddOrder = async () => {
      await addOrder({
        timestamp: Date.now(),
        status: 0,
        userID: user.value.uid,
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: user.value.phoneNumber,
        items: store.getters['cart/cart'],
        promocodes: store.getters['cart/promocodes'],
        sum: cartTotalSum.value,
        discount: store.getters['cart/cartDiscount'],
        payedSum: cartTotalSum.value,
        payType: payType.value,
        deliveryType: deliveryType.value
      })

      if (error.value) {
        console.log('error.value', error.value)
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при оформлении заказа. Попробуйте позже',
          life: 3000
        })
      } else {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Заказ оформлен',
          life: 3000
        })
        emit('update:id', newOrderID.value)
      }
    }

    return {
      payType,
      deliveryType,
      payTypes,
      deliveryTypes,
      cartItems,
      firstName,
      lastName,
      newOrderID,
      cartTotalSum,
      validationErrors,
      authModal: () => store.commit('TOGGLE_AUTH_MODAL'),
      onSubmit,
      onPay,
      isNoCashPayType,
      isAuth: computed(() => store.getters.isAuth)
    }
  }
}
</script>
