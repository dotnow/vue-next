<template>
  <div class="p-grid">
    <div class="p-col-2">
      <h4>Категории</h4>
      <Listbox
        v-model="filter['categoryID']"
        :options="categoriesList"
        optionLabel="name"
        optionValue="id"
      />
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
            <product-list :product="slotProps.data"></product-list>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="p-col-12 p-md-3">
            <product-grid :product="slotProps.data"></product-grid>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import ProductGrid from '@/components/product/ProductGrid'
import ProductList from '@/components/product/ProductList'

export default {
  props: ['name', 'categoryID'],

  setup(props) {
    const store = useStore()
    const layout = ref('grid')
    const filter = reactive({})

    const categories = computed(() => store.getters['categories/all'])

    const categoriesList = computed(() => {
      return [{ id: '', name: 'Все' }, ...categories.value]
    })

    onMounted(() => {
      if (props.name || props.categoryID) {
        filter['name'] = props.name
        filter['categoryID'] = props.categoryID
      }
    })

    watch(filter, () => {
      store.dispatch('products/setFilter', {
        name: filter['name'],
        categoryID: filter['categoryID']
      })
    })

    return {
      layout,
      filter,
      categoriesList,
      products: computed(() => store.getters['products/byFilter']),
      categoryByID: computed(() => store.getters['categories/byID']),
      cart: computed(() => store.getters['cart/cart'])
    }
  },

  components: { ProductGrid, ProductList }
}
</script>
