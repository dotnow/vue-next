<template>
  <Card v-if="cartItems.length && !newOrderID">
    <template v-slot:title>
      Персональная информация
    </template>
    <template v-slot:subtitle>
      Введите ваши персональные данные
    </template>
    <template v-slot:content>
      <div class="p-fluid">
        <div class="p-field">
          <label for="firstname">Имя</label>
          <InputText id="firstname" v-model="firstname" />
          <!-- <small
            v-show="validationErrors.firstname && submitted"
            class="p-error"
            >Заполните поле</small
          > -->
        </div>
        <div class="p-field">
          <label for="lastname">Фамилия</label>
          <InputText id="lastname" v-model="lastname" />
          <!-- <small v-show="validationErrors.lastname && submitted" class="p-error"
            >Заполните поле</small
          > -->
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
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const { addOrder, newOrderID, error } = useOrders()

    const firstname = ref('')
    const lastname = ref('')
    const submitted = ref(false)
    // const validationErrors = reactive(false)

    const user = computed(() => store.getters.user)

    const cartItems = computed(() => store.getters['cart/cart'])

    const cartTotalSum = computed(() => store.getters['cart/cartTotalSum'])

    const onAddOrder = async () => {
      submitted.value = true

      await addOrder({
        userID: user.value.uid,
        phoneNumber: user.value.phoneNumber,
        date: Date.now(),
        items: store.getters['cart/all'],
        sum: cartTotalSum.value,
        payedSum: 0,
        deliveryType: 1
      })

      if (error.value) {
        console.log('error.value', error.value)
      }
    }

    return {
      cartItems,
      firstname,
      lastname,
      submitted,
      newOrderID,
      cartTotalSum,
      onAddOrder
    }
  }
  // methods: {
  //   validateForm() {
  //     if (!this.firstname.trim()) this.validationErrors['firstname'] = true
  //     else delete this.validationErrors['firstname']

  //     if (!this.lastname.trim()) this.validationErrors['lastname'] = true
  //     else delete this.validationErrors['lastname']

  //     return !Object.keys(this.validationErrors).length
  //   }
  // }
}
</script>
