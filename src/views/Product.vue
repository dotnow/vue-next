<template>
  <div v-if="product">
    <Card>
      <template #content>
        <h2 class="p-text-center p-p-2">{{ product.name }}</h2>
        <div class="p-text-center" v-if="isAdmin">
          <Button
            icon="pi pi-pencil"
            label="Редактировать"
            @click="onShowModal"
          ></Button>
        </div>
        <div class="p-grid p-m-2">
          <div class="p-col-3 p-text-center">
            <img
              :src="product.imgUrl"
              :alt="product.name"
              style="max-width: 300px"
            />
          </div>
          <div class="p-col-6">
            <h4>Описание:</h4>
            <div v-html="product.description"></div>
          </div>
          <div class="p-col p-text-right p-mr-4">
            <router-link
              custom
              v-slot="{ navigate }"
              :to="{ name: 'shop', query: { categoryID: product.categoryID } }"
            >
              <h4
                class="p-card-subtitle"
                @click="navigate"
                style="text-decoration: underline; cursor: pointer"
              >
                <i class="pi pi-tag product-category-icon p-mr-2"></i>
                <span class="product-category">
                  {{ categoryByID(product.categoryID).name }}
                </span>
              </h4>
            </router-link>
            <div class="p-my-2">
              <h3>{{ formatCurrency(product.price) }}</h3>
            </div>
            <div class="">
              <cart-button
                :incart="inCart"
                :product="product"
                label="В корзину"
              ></cart-button>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <div v-if="sameProducts.length">
      <h2>Похожие товары:</h2>
      <div class="p-grid">
        <div
          class="p-col-2"
          v-for="sameProduct in sameProducts"
          :key="`sameProduct_${sameProduct.id}`"
        >
          <product-grid-card :product="sameProduct"></product-grid-card>
        </div>
      </div>
    </div>
  </div>
  <app-empty v-else>
    <h4>Такого товара не существует</h4>
    <router-link :to="{ name: 'shop' }">
      Вернуться к списку товаров</router-link
    >
  </app-empty>
  <product-modal ref="modal"></product-modal>
</template>

<script>
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import CartButton from '@/components/cart/CartButton'
import ProductGridCard from '@/components/product/ProductGridCard'
import ProductModal from '@/components/admin/products/ProductModal'

export default {
  setup() {
    const store = useStore()
    const route = useRoute()

    const modal = ref(false)

    const cart = computed(() => store.getters['cart/cart'])
    const product = computed(() =>
      store.getters['products/byID'](route.params.id)
    )
    const inCart = computed(() =>
      cart.value.find(el => el.id === product.value.id)
    )
    const sameProducts = computed(() =>
      store.getters['products/byCategoryID'](product.value.categoryID).filter(
        el => el.id !== product.value.id
      )
    )

    const onShowModal = () => {
      modal.value.show(product.value)
    }

    return {
      modal,
      product,
      inCart,
      onShowModal,
      isAdmin: computed(() => store.getters.isAdmin),
      formatCurrency: inject('formatCurrency'),
      categoryByID: computed(() => store.getters['categories/byID']),
      sameProducts
    }
  },

  components: { CartButton, ProductGridCard, ProductModal }
}
</script>
