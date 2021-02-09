<template>
  <tr draggable="false">
    <td class="p-text-center">
      <img :src="product.imgUrl" :alt="product.name" style="max-width: 50px" />
    </td>
    <td>
      {{ product.name }}
    </td>
    <td class="p-text-center">
      <cart-input
        :amount="item[1]"
        :id="item[0]"
        :max="product.stock"
      ></cart-input>
    </td>
    <td class="p-text-right">
      {{ formatCurrency(item[1] * product.price) }}
    </td>
    <td class="p-text-center">
      <Button
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
import CartInput from '@/components/cart/CartInput.vue'

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
      store.getters['products/byID'](props.item[0])
    )

    const removeCartItem = async () => {
      await setCartItem({ id: props.item[0], amount: 0 })

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

<style></style>
