<template>
  <Card class="p-m-2 p-p-2">
    <template #header>
      <div
        style="width: 250px;
    position: absolute;
    text-align: right;"
      >
        <product-tag :stock="product.stock"></product-tag>
      </div>
      <img :src="product.imgUrl" :alt="product.name" />
    </template>

    <template #title>
      <div class="p-text-center">
        {{ product.name }}
      </div>
    </template>

    <template #subtitle>
      <div class="p-text-center">
        <i class="pi pi-tag product-category-icon p-mr-2"></i>
        <span class="product-category">{{
          categoryByID(product.categoryID).name
        }}</span>
      </div>
    </template>

    <template #footer>
      <product-button :incart="inCart" :product="product"></product-button>
    </template>
  </Card>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import ProductButton from '@/components/product/ProductButton'
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
      cart.value.find(([key]) => key === props.product.id)
    )

    return {
      ...toRefs(props),
      inCart,
      categoryByID: computed(() => store.getters['categories/byID'])
    }
  },

  components: { ProductButton, ProductTag }
}
</script>
