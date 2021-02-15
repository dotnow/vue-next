<template>
  <div class="p-grid p-jc-center" v-if="cartItems.length && !newOrderID">
    <div class="p-col-6">
      <Card class="p-p-3">
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
            <i></i>
            <Button
              label="Оформить заказ"
              @click="onAddOrder()"
              icon="pi pi-angle-right"
              iconPos="right"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
  <div v-else-if="newOrderID" class="p-text-center">
    <h4>
      Ваш заказ <b> №{{ newOrderID }}</b> успешно оформлен!
    </h4>
    <h5>Наш менеджер свяжется с вами!</h5>
    <router-link :to="{ name: 'shop' }">
      Вернуться на главную
    </router-link>
  </div>
  <app-empty v-else>Нет элементов для отображения</app-empty>
</template>

<script>
import { useOrders } from '@/use/orders'
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const { addOrder, newOrderID, error } = useOrders()

    const firstName = ref('')
    const lastName = ref('')
    const validationErrors = reactive({})

    const user = computed(() => store.getters.user)
    const cartItems = computed(() => store.getters['cart/cart'])
    const cartTotalSum = computed(() => store.getters['cart/cartTotalSum'])

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
      onAddOrder
    }
  }
  // methods: {
  //   validateForm() {
  //     if (!this.firstName.trim()) this.validationErrors['firstName'] = true
  //     else delete this.validationErrors['firstName']

  //     if (!this.lastName.trim()) this.validationErrors['lastName'] = true
  //     else delete this.validationErrors['lastName']

  //     return !Object.keys(this.validationErrors).length
  //   }
  // }
}
</script>
