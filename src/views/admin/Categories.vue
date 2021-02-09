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
        @click="removeCategoriesDialog.open()"
        :disabled="!selectedCategories.length"
      />
    </template>
  </Toolbar>
  <DataTable
    :value="categories"
    :paginator="true"
    :rows="10"
    v-model:selection="selectedCategories"
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
    <Column header="Наименование" filterField="name" filterMatchMode="contains">
      <template #body="slotProps">
        {{ slotProps.data.name }}
      </template>
      <template #filter>
        <span class="p-input-icon-right" style="width: 30%">
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
      header="Товаров"
      headerStyle="width: 200px; text-align: center"
      bodyStyle="text-align: center"
    >
      <template #body="slotProps">
        {{ haveProducts(slotProps.data.id) }}
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
          @click="confirmRemoveCategory(slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>

  <category-modal ref="modal"></category-modal>

  <app-confirm ref="removeCategoryDialog" @onConfirm="onRemoveCategory">
    Вы действительно хотите удалить <b>{{ category.name }}</b> ?
  </app-confirm>

  <app-confirm
    ref="removeCategoriesDialog"
    @onConfirm="removeSelectedCategories"
  >
    Вы действительно хотите удалить выбранные позиции?
  </app-confirm>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useCategories } from '@/use/categories'
import { useToast } from 'primevue/usetoast'
import CategoryModal from '@/components/admin/categories/CategoryModal'
import AppConfirm from '@/components/app/AppConfirm'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()

    const modal = ref(null)

    const filters = ref({})
    const removeCategoryDialog = ref(null)
    const removeCategoriesDialog = ref(null)
    const category = ref({})
    const selectedCategories = ref([])

    const { removeCategory, error } = useCategories()

    const onShowModal = category => {
      modal.value.show(category)
    }

    const haveProducts = id => store.getters['products/byCategoryID'](id).length

    const confirmRemoveCategory = item => {
      category.value = item
      removeCategoryDialog.value.open()
    }

    const removeSelectedCategories = async () => {
      for (const item of selectedCategories.value) {
        await onRemoveCategory(item.id)
      }

      removeCategoriesDialog.value = false
      selectedCategories.value = []

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Категории удалены',
        life: 3000
      })
    }

    const onRemoveCategory = async categoryID => {
      if (
        (categoryID && haveProducts(categoryID)) ||
        haveProducts(category.value.id)
      ) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: `Категория содержит товары`,
          life: 3000
        })
        return
      }
      if (categoryID) {
        await removeCategory(categoryID)
      } else {
        await removeCategory(category.value.id)
      }

      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при удалении',
          life: 3000
        })
      } else if (!categoryID) {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Категория удалена',
          life: 3000
        })
      }
      category.value = {}
      if (removeCategoryDialog.value) {
        removeCategoryDialog.value = false
      }
    }
    return {
      removeCategoryDialog,
      removeCategoriesDialog,
      confirmRemoveCategory,
      removeSelectedCategories,
      category,
      selectedCategories,
      onShowModal,
      modal,
      filters,
      onRemoveCategory,
      haveProducts,
      categories: computed(() => store.getters['categories/all'])
    }
  },

  components: { CategoryModal, AppConfirm }
}
</script>
