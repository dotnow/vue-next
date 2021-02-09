<template>
  <InputNumber
    :modelValue="amount"
    inputStyle="text-align: center; max-width: 60px"
    showButtons
    buttonLayout="horizontal"
    :decrementButtonClass="isLastAmount ? 'p-button-danger' : ''"
    incrementButtonIcon="pi pi-plus"
    :decrementButtonIcon="isLastAmount ? 'pi pi-times' : 'pi pi-minus'"
    :max="max"
    @input="e => changeCartItemAmount(e.value)"
  />
</template>

<script>
import { computed, toRefs } from 'vue'
import { useCart } from '@/use/cart'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const { setCartItem } = useCart()

    const changeCartItemAmount = async amount => {
      if (amount > props.max) {
        amount = props.max
      }
      await setCartItem({ id: props.id, amount })
    }

    return {
      ...toRefs(props),
      changeCartItemAmount,
      isLastAmount: computed(() => props.amount === 1)
    }
  }
}
</script>
