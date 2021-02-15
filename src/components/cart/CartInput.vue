<template>
  <InputNumber
    :modelValue="amount"
    inputStyle="text-align: center; max-width: 60px"
    showButtons
    buttonLayout="horizontal"
    :decrementButtonClass="isLastAmount ? 'p-button-danger' : ''"
    incrementButtonIcon="pi pi-plus"
    :decrementButtonIcon="isLastAmount ? 'pi pi-times' : 'pi pi-minus'"
    :max="product.stock"
    @input="e => changeCartItemAmount(e.value)"
  />
</template>

<script>
import { computed, toRefs } from 'vue'
import { useCart } from '@/use/cart'

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const { setCartItem } = useCart()

    const changeCartItemAmount = async amount => {
      if (amount > props.product.stock) {
        amount = props.product.stock
      }
      await setCartItem({
        id: props.product.id,
        amount,
        price: props.product.price
      })
    }

    return {
      ...toRefs(props),
      changeCartItemAmount,
      isLastAmount: computed(() => props.amount === 1)
    }
  }
}
</script>
