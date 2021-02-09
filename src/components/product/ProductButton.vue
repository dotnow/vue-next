<template>
  <cart-input
    v-if="incart"
    :amount="incart[1]"
    :id="product.id"
    :max="product.stock"
  ></cart-input>
  <Button
    icon="pi pi-shopping-cart"
    @click="addToCart(product.id)"
    v-else
    :disabled="!product.stock"
  ></Button>
</template>

<script>
import { toRefs } from 'vue'
import { useCart } from '@/use/cart'
import CartInput from '@/components/cart/CartInput'

export default {
  props: {
    incart: {
      required: true
    },
    product: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const { setCartItem } = useCart()

    const addToCart = async id => {
      await setCartItem({ id, value: 1 })
    }

    return {
      ...toRefs(props),
      addToCart
    }
  },

  components: { CartInput }
}
</script>
