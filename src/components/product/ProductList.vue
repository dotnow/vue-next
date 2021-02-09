<template>
  <div class="p-card p-m-2 p-px-2">
    <div class="p-card-content">
      <div class="p-grid nested-grid">
        <div class="p-col-8">
          <div class="p-grid">
            <div class="p-col-2">
              <img
                :src="product.imgUrl"
                :alt="product.name"
                style="max-width: 100px"
              />
            </div>
            <div class="p-col-6">
              <h4>
                {{ product.name }}
              </h4>

              <div>
                <i class="pi pi-tag product-category-icon p-mr-2"></i>
                <span class="product-category">{{
                  categoryByID(product.categoryID).name
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-col">
          <div class="p-grid p-text-right" style="height: 100%">
            <div class="p-col-12 p-as-start">
              <div>
                <product-tag :stock="product.stock"></product-tag>
              </div>
            </div>

            <div class="p-col-12 p-as-end">
              <product-button
                :incart="inCart"
                :product="product"
              ></product-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
