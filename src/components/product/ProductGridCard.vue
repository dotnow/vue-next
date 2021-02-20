<template>
  <Card class="p-m-2 p-p-2">
    <template #header>
      <router-link
        custom
        v-slot="{ navigate }"
        :to="{ name: 'product', params: { id: product.id } }"
      >
        <span @click="navigate" style="cursor: pointer">
          <div style="width: 100%; text-align: right;">
            <product-tag :stock="product.stock"></product-tag>
          </div>
          <img :src="product.imgUrl" :alt="product.name" />
          <div class="p-card-title p-text-center">
            {{ product.name }}
          </div>
          <div class="p-card-subtitle p-text-center">
            <i class="pi pi-tag product-category-icon p-mr-1"></i>
            <span class="product-category">{{
              categoryByID(product.categoryID).name
            }}</span>
          </div>
          <div class="p-card-subtitle p-text-center product-announcement">
            <span>{{ product.announcement }}</span>
          </div>
          <div class="p-card-title p-text-center">
            {{ formatCurrency(product.price) }}
          </div>
        </span>
      </router-link>
      <div class="p-card-footer">
        <cart-button
          :incart="inCart"
          :product="product"
          label="В корзину"
        ></cart-button>
      </div>
    </template>
  </Card>
</template>

<script>
import { computed, inject, toRefs } from 'vue'
import { useStore } from 'vuex'
import CartButton from '@/components/cart/CartButton'
import ProductTag from '@/components/product/ProductTag'

export default {
  props: {
    product: {
      required: true
    }
  },

  setup(props) {
    const store = useStore()

    const cart = computed(() => store.getters['cart/cart'])
    const inCart = computed(() =>
      cart.value.find(el => el.id === props.product.id)
    )

    return {
      ...toRefs(props),
      inCart,
      formatCurrency: inject('formatCurrency'),
      categoryByID: computed(() => store.getters['categories/byID'])
    }
  },

  components: { CartButton, ProductTag }
}
</script>
