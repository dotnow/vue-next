<template>
  <div class="p-card p-m-2 p-px-2">
    <div class="p-card-content">
      <div class="p-grid nested-grid">
        <router-link
          custom
          v-slot="{ navigate }"
          :to="{ name: 'product', params: { id: product.id } }"
        >
          <div class="p-col-10" @click="navigate" style="cursor: pointer">
            <div class="p-grid">
              <div class="p-col-2">
                <img
                  :src="product.imgUrl"
                  :alt="product.name"
                  style="max-width: 100px"
                />
              </div>
              <div class="p-col">
                <div class="p-card-title">
                  {{ product.name }}
                </div>

                <div class="p-my-2">
                  <i class="pi pi-tag product-category-icon p-mr-2"></i>
                  <span class="product-category">{{
                    categoryByID(product.categoryID).name
                  }}</span>
                </div>

                <div class="p-card-subtitle">
                  {{ product.announcement }}
                </div>
              </div>
            </div>
          </div>
        </router-link>
        <div class="p-col">
          <div class="p-grid p-text-right" style="height: 100%">
            <div class="p-col-12 p-as-start">
              <div>
                <product-tag :stock="product.stock"></product-tag>
              </div>
            </div>

            <div class="p-col-12">
              <h4 class="p-m-0">
                {{ formatCurrency(product.price) }}
              </h4>
            </div>

            <div class="p-col-12 p-as-end">
              <cart-button :incart="inCart" :product="product"></cart-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs, inject } from 'vue'
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
