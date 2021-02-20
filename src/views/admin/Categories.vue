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
        @click="confirmRemoveCategories"
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

  <teleport to="body">
    <category-modal ref="modal"></category-modal>
  </teleport>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useCategories } from '@/use/categories'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import CategoryModal from '@/components/admin/categories/CategoryModal'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()
    const confirm = useConfirm()
    const { removeCategory, error } = useCategories()

    const modal = ref(null)

    const filters = ref({})
    const category = ref({})
    const selectedCategories = ref([])

    const onShowModal = category => {
      modal.value.show(category)
    }

    const haveProducts = id => store.getters['products/byCategoryID'](id).length

    const confirmRemoveCategory = item => {
      category.value = item
      confirm.require({
        message: `Вы действительно хотите удалить ${category.value.name}`,
        header: 'Подтвердите удаление',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          onRemoveCategory()
        },
        reject: () => {}
      })
    }

    const confirmRemoveCategories = () => {
      confirm.require({
        message: 'Вы действительно хотите удалить выбранные позиции?',
        header: 'Подтвердите удаление',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          for (const item of selectedCategories.value) {
            await onRemoveCategory(item.id)
          }

          selectedCategories.value = []
          toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Категории удалены',
            life: 3000
          })
        },
        reject: () => {}
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
    }

    return {
      confirmRemoveCategory,
      confirmRemoveCategories,
      category,
      selectedCategories,
      onShowModal,
      modal,
      filters,
      haveProducts,
      categories: computed(() => store.getters['categories/all'])
    }
  },

  components: { CategoryModal }
}
</script>
