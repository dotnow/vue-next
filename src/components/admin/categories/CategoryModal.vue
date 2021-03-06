<template>
  <Dialog
    header="Детали категории"
    v-model:visible="showModal"
    :style="{ width: '50vw' }"
    :contentStyle="{ height: '50vh' }"
    :modal="true"
  >
    <div class="p-fluid">
      <div class="p-field">
        <label for="name">Наименование</label>
        <InputText id="name" type="text" v-model="category.name" />
      </div>

      <div class="p-field p-mb-5">
        <label for="parentID">Родительский каталог</label>
        <Dropdown
          id="parentID"
          v-model="category.parentID"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите родительскую категорию"
        />
      </div>
    </div>

    <template #footer>
      <Button :label="actionText" icon="pi pi-check" @click="onSaveCategory" />
    </template>
  </Dialog>
</template>

<script>
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCategories } from '@/use/categories'
import { useStore } from 'vuex'

export default {
  setup() {
    const toast = useToast()
    const store = useStore()

    const showModal = ref(false)
    const category = ref({})
    const isNew = ref(false)

    const { addCategory, updateCategory, error } = useCategories()

    const categories = computed(() =>
      store.getters['categories/all'].filter(el =>
        category.value.id
          ? el.id !== category.value.id &&
            !store.getters['categories/getChildrens'](category.value.id).some(
              ch => ch.id === el.id
            )
          : el
      )
    )

    // Открытие модального окна
    const show = item => {
      if (item) {
        isNew.value = false
        // FIXME: unref() не убирает реактивность, приходится маршалить и парсить
        //  объект 'item' для того, чтобы поля объекта обновлялись при 2-м и последующих
        //  открытиях модального окна
        //  Для того, чтобы понять, что не так:
        //  ––> category.value = item
        //  Открыть существующий элемент, закрыть модальное окно,
        //  затем открыть другой существующий элемент/создать новый
        category.value = JSON.parse(JSON.stringify(item))
      } else {
        isNew.value = true
        delete category.value.id
        category.value.name = ''
        category.value.parentID = ''
      }

      showModal.value = true
    }

    // Текст кнопки действия
    const actionText = computed(() => (isNew.value ? 'Создать' : 'Обновить'))

    // Нажатие на кнопку действия
    const onSaveCategory = async () => {
      if (isNew.value) {
        await onAddCategory(category.value)
      } else {
        await onUpdateCategory(category.value)
      }
      showModal.value = false
    }

    // Создание новой категории
    const onAddCategory = async category => {
      await addCategory(category)

      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при создании',
          life: 3000
        })
      } else {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Категория создана',
          life: 3000
        })
      }
    }

    // Обновление существующей категории
    const onUpdateCategory = async category => {
      await updateCategory(category)

      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при обновлении',
          life: 3000
        })
      } else {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Категория обновлена',
          life: 3000
        })
      }
    }

    return {
      showModal,
      show,
      category,
      actionText,
      onSaveCategory,
      categories
    }
  }
}
</script>

<style></style>
