<template>
  <h3 class="p-text-center">Оформление заказа</h3>
  <order-form></order-form>
</template>

<script>
import OrderForm from '@/components/order/OrderForm'

export default {
  setup() {
    return {}
  },

  components: { OrderForm }
}
</script>
