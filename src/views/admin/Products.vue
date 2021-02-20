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
        @click="confirmRemoveProducts"
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
</template>

<script>
import { useStore } from 'vuex'
import { computed, inject, ref } from 'vue'
import { useProducts } from '@/use/products'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import ProductModal from '@/components/admin/products/ProductModal'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()
    const confirm = useConfirm()
    const { removeProduct, error } = useProducts()

    const filters = ref({})
    const modal = ref(null)
    const selectedProducts = ref([])

    const onShowModal = product => {
      modal.value.show(product)
    }

    const confirmRemoveProduct = item => {
      confirm.require({
        message: `Вы действительно хотите удалить ${item.name}`,
        header: 'Подтвердите удаление',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          await onRemoveProduct(item)
          toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Товар удалён',
            life: 3000
          })
        },
        reject: () => {}
      })
    }

    const confirmRemoveProducts = () => {
      confirm.require({
        message: 'Вы действительно хотите удалить выбранные позиции',
        header: 'Подтвердите удаление',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          for (const item of selectedProducts.value) {
            await onRemoveProduct(item)
          }
          selectedProducts.value = []

          toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Товары удалены',
            life: 3000
          })
        },
        reject: () => {}
      })
    }

    const onRemoveProduct = async item => {
      await removeProduct(item)
      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при удалении',
          life: 3000
        })
      }
    }

    return {
      modal,
      filters,
      onShowModal,
      formatCurrency: inject('formatCurrency'),
      confirmRemoveProduct,
      confirmRemoveProducts,
      onRemoveProduct,
      selectedProducts,
      products: computed(() => store.getters['products/all']),
      categoryByID: computed(() => store.getters['categories/byID']),
      categories: computed(() => store.getters['categories/all'])
    }
  },

  components: { ProductModal }
}
</script>
