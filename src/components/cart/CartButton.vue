<template>
  <cart-input
    v-if="incart && !incart.promo"
    :amount="incart.amount"
    :product="product"
  ></cart-input>
  <Button
    :label="product.stock ? label : 'Нет в наличии'"
    icon="pi pi-shopping-cart"
    @click="addToCart"
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
    },
    label: {
      type: String
    }
  },

  setup(props) {
    const { setCartItem } = useCart()

    const addToCart = async () => {
      if (props.product.stock) {
        await setCartItem({
          id: props.product.id,
          amount: 1,
          price: props.product.price
        })
      }
    }

    return {
      ...toRefs(props),
      addToCart
    }
  },

  components: { CartInput }
}
</script>
