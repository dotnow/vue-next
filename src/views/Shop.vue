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
import { computed, ref, onMounted, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ProductGridCard from '@/components/product/ProductGridCard'
import ProductListCard from '@/components/product/ProductListCard'

export default {
  props: ['name', 'categoryID'],

  setup(props) {
    const { name, categoryID } = toRefs(props)
    const store = useStore()
    const router = useRouter()
    const layout = ref('grid')
    const filter = reactive({})

    const categories = computed(() => store.getters['categories/all'])

    const categoriesList = computed(() => {
      return [{ id: '', name: 'Все' }, ...categories.value]
    })

    const categoryByID = computed(() => store.getters['categories/byID'])

    const products = computed(() =>
      store.getters['products/all']
        .filter(el =>
          filter['categoryID'] ? el.categoryID === filter['categoryID'] : el
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

    onMounted(() => {
      filter['name'] = name.value
      filter['categoryID'] = categoryID.value
    })

    watch(filter, () => {
      if (!filter['name']) {
        delete filter['name']
      }

      if (!filter['categoryID']) {
        delete filter['categoryID']
      }

      router.replace({ query: filter })
    })

    return {
      layout,
      filter,
      categoriesList,
      products,
      cart: computed(() => store.getters['cart/cart'])
    }
  },

  components: { ProductGridCard, ProductListCard }
}
</script>
