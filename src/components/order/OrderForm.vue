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
      </div>
    </template>
    <template v-slot:footer>
      <div class="p-grid p-nogutter p-justify-between">
        <Button
          v-if="isAuth"
          label="Оформить заказ"
          @click="onAddOrder()"
          iconPos="right"
        />
        <Button
          v-else
          label="Войдите в систему для оформления заказа"
          @click="displayAuthModal"
        >
        </Button>
      </div>
    </template>
  </Card>
</template>

<script>
import { useOrders } from '@/use/orders'
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  setup(_, { emit }) {
    const store = useStore()
    const { addOrder, newOrderID, error } = useOrders()

    const firstName = ref('')
    const lastName = ref('')
    const validationErrors = reactive({})

    const user = computed(() => store.getters.user)
    const cartItems = computed(() => store.getters['cart/cart'])
    const cartTotalSum = computed(() => store.getters['cart/cartTotalSum'])

    const displayAuthModal = () => store.commit('SET_AUTH_MODAL', true)

    const validateForm = () => {
      if (!firstName.value) validationErrors['firstName'] = true
      else delete validationErrors['firstName']

      if (!lastName.value) validationErrors['lastName'] = true
      else delete validationErrors['lastName']

      return !Object.keys(validationErrors).length
    }

    const onAddOrder = async () => {
      if (validateForm()) {
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
          payedSum: 0,
          payType: 0,
          deliveryType: 1
        })

        if (error.value) {
          console.log('error.value', error.value)
        } else {
          emit('update:id', newOrderID.value)
        }
      }
    }

    return {
      cartItems,
      firstName,
      lastName,
      newOrderID,
      cartTotalSum,
      validationErrors,
      displayAuthModal,
      onAddOrder,
      isAuth: computed(() => store.getters.isAuth)
    }
  }
}
</script>
