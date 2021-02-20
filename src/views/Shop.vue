<template>
  <div class="p-grid">
    <div class="p-col-3">
      <h4>Категории</h4>
      <app-categpries-list
        v-model:filter="filter"
        :name="name"
        :categoryID="categoryID"
      ></app-categpries-list>
    </div>
    <div class="p-col">
      <DataView :value="products" :layout="layout" :paginator="true" :rows="12">
        <template #empty>
          <app-empty>Нет элементов для отображения</app-empty>
        </template>

        <template #header>
          <div class="p-grid p-nogutter">
            <div class="p-col-6" style="text-align: left">
              <span class="p-input-icon-right">
                <InputText
                  type="text"
                  v-model="filter['name']"
                  placeholder="Поиск..."
                  autofocus
                />
                <i
                  class="pi pi-times"
                  style="cursor: pointer"
                  v-if="filter['name']"
                  @click="filter['name'] = ''"
                />
              </span>
            </div>
            <div class="p-col-6" style="text-align: right">
              <DataViewLayoutOptions v-model="layout" />
            </div>
          </div>
        </template>

        <template #list="slotProps">
          <div class="p-col-12">
            <product-list-card :product="slotProps.data"></product-list-card>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="p-col-12 p-md-3">
            <product-grid-card :product="slotProps.data"></product-grid-card>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive, toRefs, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import ProductGridCard from '@/components/product/ProductGridCard'
import ProductListCard from '@/components/product/ProductListCard'
import AppCategpriesList from '@/components/app/AppCategpriesList'

export default {
  props: ['name', 'categoryID'],

  setup(props) {
    const store = useStore()

    const layout = ref(null)
    const filter = reactive({})

    onMounted(() => {
      layout.value = store.getters.layout
    })

    watch(layout, () => {
      store.commit('SWITCH_LAYOUT', layout.value)
    })

    const categoryByID = computed(() => store.getters['categories/byID'])

    const products = computed(() =>
      store.getters['products/all']
        .filter(el =>
          filter['categoryID'] && filter['categoryID'].length
            ? filter['categoryID'].includes(el.categoryID) ||
              filter['categoryID'].includes(
                categoryByID.value(el.categoryID).parentID
              )
            : el
        )
        .filter(el =>
          filter['name']
            ? el.name.toLowerCase().includes(filter['name'].toLowerCase()) ||
              categoryByID
                .value(el.categoryID)
                .name.toLowerCase()
                .includes(filter['name'].toLowerCase())
            : el
        )
    )

    return {
      ...toRefs(props),
      layout,
      filter,
      products,
      cart: computed(() => store.getters['cart/cart'])
    }
  },

  components: { ProductGridCard, ProductListCard, AppCategpriesList }
}
</script>
