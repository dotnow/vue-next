<template>
  <tr draggable="false" v-if="product">
    <td class="p-text-center" v-if="product.imgUrl">
      <img :src="product.imgUrl" :alt="product.name" style="max-width: 50px" />
    </td>
    <router-link
      custom
      v-slot="{ navigate }"
      :to="{ name: 'product', params: { id: product.id } }"
    >
      <td @click="navigate" style="cursor: pointer">
        {{ product.name }}
      </td>
    </router-link>
    <td class="p-text-center">
      <cart-input
        :amount="item.amount"
        :product="product"
        v-if="!item.promo"
      ></cart-input>
    </td>
    <td class="p-text-right">
      {{ formatCurrency(item.amount * item.price) }}
    </td>
    <td class="p-text-center">
      <Button
        v-if="item.price"
        icon="pi pi-times"
        class="p-button-rounded p-button-danger p-button-text"
        @click="removeCartItem"
      />
    </td>
  </tr>
</template>

<script>
import { computed, toRefs, inject } from 'vue'
import { useStore } from 'vuex'
import { useCart } from '@/use/cart'
import { useToast } from 'primevue/usetoast'
import CartInput from '@/components/cart/CartInput'

export default {
  props: {
    item: {
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const toast = useToast()

    const { setCartItem, error } = useCart()

    const product = computed(() =>
      store.getters['products/byID'](props.item.id)
    )

    const removeCartItem = async () => {
      await setCartItem({ id: props.item.id, amount: 0 })

      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при удалении',
          life: 3000
        })
      } else {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Товар удалён из корзины',
          life: 3000
        })
      }
    }

    return {
      product,
      removeCartItem,
      formatCurrency: inject('formatCurrency'),
      ...toRefs(props)
    }
  },

  components: { CartInput }
}
</script>
