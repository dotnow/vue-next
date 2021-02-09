<template>
  <div v-if="product">
    <Card>
      <template #header>
        <div class="p-text-center p-p-2">
          <h3>{{ product.name }}</h3>
          <h4 class="p-card-subtitle p-text-center">
            <i class="pi pi-tag product-category-icon p-mr-2"></i>
            <span class="product-category">
              {{ categoryByID(product.categoryID).name }}
            </span>
          </h4>
          <img
            :src="product.imgUrl"
            :alt="product.name"
            style="max-width: 300px"
          />
        </div>
        <div class="p-text-center">
          <product-button
            :incart="inCart"
            :product="product"
            label="В корзину"
          ></product-button>
        </div>
      </template>
    </Card>
  </div>
  <app-empty v-else>
    <h4>Такого товара не существует</h4>
    <router-link :to="{ name: 'shop' }">
      Вернуться к списку товаров</router-link
    >
  </app-empty>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ProductButton from '@/components/product/ProductButton'

export default {
  setup() {
    const store = useStore()
    const route = useRoute()

    const cart = computed(() => store.getters['cart/cart'])

    const product = computed(() =>
      store.getters['products/byID'](route.params.id)
    )
    const inCart = computed(() =>
      cart.value.find(([key]) => key === product.value.id)
    )
    return {
      product,
      inCart,
      categoryByID: computed(() => store.getters['categories/byID'])
    }
  },

  components: { ProductButton }
}
</script>
