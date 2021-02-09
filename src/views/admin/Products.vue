<template>
  <Toolbar class="p-mb-4">
    <template #left>
      <Button
        label="Создать"
        icon="pi pi-plus"
        class="p-button-success p-mr-2"
        @click="onShowModal(null)"
      />
      <Button
        label="Удалить"
        icon="pi pi-trash"
        class="p-button-danger"
        @click="removeProductsDialog.open()"
        :disabled="!selectedProducts.length"
      />
    </template>
  </Toolbar>
  <DataTable
    :value="products"
    paginator
    :rows="5"
    v-model:selection="selectedProducts"
    dataKey="id"
    :filters="filters"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 25]"
    currentPageReportTemplate="Показаны с {first} по {last} из {totalRecords} позиций"
  >
    <template #empty>
      <app-empty>Нет элементов для отображения</app-empty>
    </template>
    <Column
      selectionMode="multiple"
      headerStyle="width: 3rem"
      :exportable="false"
    ></Column>
    <Column
      header="Картинка"
      headerStyle="width: 100px; text-align: center"
      bodyStyle="text-align: center"
    >
      <template #body="slotProps">
        <img
          :src="slotProps.data.imgUrl"
          :alt="slotProps.data.name"
          style="max-width:50px"
        />
      </template>
    </Column>
    <Column header="Наименование" filterField="name" filterMatchMode="contains">
      <template #body="slotProps">
        {{ slotProps.data.name }}
      </template>
      <template #filter>
        <span class="p-input-icon-right" style="width: 100%">
          <InputText
            type="text"
            v-model="filters['name']"
            class="p-column-filter"
            style="width: 100%"
            placeholder="Поиск по наименованию"
          />
          <i
            class="pi pi-times"
            style="cursor: pointer"
            v-if="filters['name']"
            @click="filters['name'] = ''"
          />
        </span>
      </template>
    </Column>
    <Column
      header="Категория"
      headerStyle="width: 300px; text-align: center"
      bodyStyle="text-align: center"
      filterField="categoryID"
      filterMatchMode="in"
    >
      <template #body="slotProps">
        {{ categoryByID(slotProps.data.categoryID).name }}
      </template>

      <template #filter>
        <MultiSelect
          v-model="filters['categoryID']"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          placeholder="Все"
          class="p-column-filter"
          style="width: 100%"
        >
          <template #option="slotProps">
            <div class="p-multiselect-representative-option">
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </MultiSelect>
      </template>
    </Column>
    <Column
      header="Цена"
      headerStyle="width: 150px; text-align: center"
      bodyStyle="text-align: right"
    >
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.price) }}
      </template>
    </Column>
    <Column
      header="Остаток"
      headerStyle="width: 150px"
      bodyStyle="text-align: center"
    >
      <template #body="slotProps">
        {{ slotProps.data.stock }}
      </template>
    </Column>
    <Column :exportable="false" headerStyle="width: 150px">
      <template #body="slotProps">
        <Button
          icon="pi pi-pencil"
          class="p-button-text p-button-success p-mr-2"
          @click="onShowModal(slotProps.data)"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-text p-button-danger"
          @click="confirmRemoveProduct(slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>

  <product-modal ref="modal"></product-modal>

  <app-confirm ref="removeProductDialog" @onConfirm="onRemoveProduct">
    Вы действительно хотите удалить <b>{{ product.name }}</b> ?
  </app-confirm>

  <app-confirm ref="removeProductsDialog" @onConfirm="removeSelectedProducts">
    Вы действительно хотите удалить выбранные позиции?
  </app-confirm>
</template>

<script>
import { useStore } from 'vuex'
import { computed, inject, ref } from 'vue'
import { useProducts } from '@/use/products'
import { useToast } from 'primevue/usetoast'
import AppEmpty from '@/components/app/AppEmpty'
import ProductModal from '@/components/admin/products/ProductModal'
import AppConfirm from '@/components/app/AppConfirm'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()

    const filters = ref({})
    const modal = ref(null)
    const removeProductDialog = ref(null)
    const removeProductsDialog = ref(null)
    const product = ref({})
    const selectedProducts = ref([])

    const { removeProduct, error } = useProducts()

    const onShowModal = product => {
      modal.value.show(product)
    }

    const confirmRemoveProduct = item => {
      product.value = item
      removeProductDialog.value.open()
    }

    const removeSelectedProducts = async () => {
      for (const item of selectedProducts.value) {
        await onRemoveProduct(item.id)
      }
      removeProductsDialog.value = false
      selectedProducts.value = []

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Товары удалены',
        life: 3000
      })
    }

    const onRemoveProduct = async itemID => {
      if (itemID) {
        await removeProduct(itemID)
      } else {
        await removeProduct(product.value.id)
      }
      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при удалении',
          life: 3000
        })
      } else if (!itemID) {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Товар удалён',
          life: 3000
        })
      }
      product.value = {}
      if (removeProductDialog.value) {
        removeProductDialog.value = false
      }
    }
    return {
      modal,
      filters,
      onShowModal,
      formatCurrency: inject('formatCurrency'),
      removeProductDialog,
      confirmRemoveProduct,
      removeProductsDialog,
      removeSelectedProducts,
      onRemoveProduct,
      product,
      selectedProducts,
      products: computed(() => store.getters['products/all']),
      categoryByID: computed(() => store.getters['categories/byID']),
      categories: computed(() => store.getters['categories/all'])
    }
  },

  components: { AppEmpty, ProductModal, AppConfirm }
}
</script>
