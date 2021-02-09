<template>
  <h3 class="p-text-center">Корзина</h3>

  <div v-if="cartItems.length">
    <div
      class="p-datatable p-component p-datatable-sm p-mb-3"
      data-scrollselectors=".p-datatable-scrollable-body, .p-datatable-unfrozen-view .p-datatable-scrollable-body"
    >
      <div class="p-datatable-wrapper">
        <table role="grid">
          <thead class="p-datatable-thead">
            <tr>
              <th class="p-text-center" style="width: 100px">
                <span class="p-column-title">Картинка</span>
              </th>
              <th>
                <span class="p-column-title">Наименование</span>
              </th>
              <th class="p-text-center" style="width: 150px">
                <span class="p-column-title">Кол-во</span>
              </th>
              <th class="p-text-right" style="width: 200px">
                <span class="p-column-title">Сумма</span>
              </th>
              <th style="width: 70px"></th>
            </tr>
          </thead>
          <tbody class="p-datatable-tbody">
            <cart-row v-for="item in cartItems" :key="item[0]" :item="item">
            </cart-row>
          </tbody>
        </table>
      </div>
      <div class="p-datatable-footer">
        <div style="text-align: right">
          Всего: {{ formatCurrency(cartTotalSum) }}
        </div>
      </div>
    </div>
    <div class="p-text-center">
      <Button
        class="p-button-lg"
        icon="pi pi-credit-card"
        label="Оплатить"
      ></Button>
    </div>
  </div>
  <app-empty v-else>Нет элементов для отображения</app-empty>
</template>

<script>
import { useStore } from 'vuex'
import { computed, inject } from 'vue'
import CartRow from '@/components/cart/CartRow'

export default {
  setup() {
    const store = useStore()

    const product = computed(() => store.getters['products/byID'])
    const cartItems = computed(() => store.getters['cart/cart'])
    const cartTotalSum = computed(() =>
      cartItems.value.reduce(
        (acc, cur) => acc + product.value(cur[0]).price * cur[1],
        0
      )
    )

    return {
      cartItems,
      formatCurrency: inject('formatCurrency'),
      product,
      cartTotalSum
    }
  },

  components: { CartRow }
}
</script>
