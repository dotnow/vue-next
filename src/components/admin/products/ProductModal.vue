<template>
  <Dialog
    header="Детали товара"
    v-model:visible="showModal"
    :style="{ width: '450px' }"
    class="p-fluid"
    :modal="true"
  >
    <img
      :src="product.imgUrl"
      :alt="product.name"
      class="product-image"
      v-if="product.imgUrl"
    />
    <div class="p-fluid">
      <div class="p-field">
        <label for="name">Наименование</label>
        <InputText id="name" type="text" v-model="product.name" />
      </div>

      <div class="p-field">
        <label for="categoryID">Категория</label>
        <Dropdown
          id="categoryID"
          v-model="product.categoryID"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите категорию"
        />
      </div>

      <div class="p-field">
        <label for="imgUrl">Ссылка на картинку</label>
        <InputText id="imgUrl" type="text" v-model="product.imgUrl" />
      </div>
    </div>

    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col">
        <label for="price">Цена</label>
        <InputNumber
          id="price"
          v-model="product.price"
          mode="currency"
          currency="RUB"
          locale="ru-RU"
          :maxFractionDigits="0"
        />
      </div>

      <div class="p-field p-col">
        <label for="stock">Остаток на складе</label>
        <InputNumber id="stock" v-model="product.stock" :min="0" />
      </div>
    </div>

    <template #footer>
      <Button
        label="Отмена"
        icon="pi pi-times"
        class="p-button-text"
        @click="showModal = false"
      />
      <Button
        :label="actionText"
        icon="pi pi-check"
        class="p-button-text"
        @click="onSaveProduct"
      />
    </template>
  </Dialog>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast'
import { useProducts } from '@/use/products'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()
    const { addProduct, updateProduct, error } = useProducts()

    const showModal = ref(false)
    const product = ref({})
    const isNew = ref(false)

    const show = item => {
      if (item) {
        isNew.value = false
        product.value = JSON.parse(JSON.stringify(item))
      } else {
        isNew.value = true
        product.value = {
          name: '',
          categoryID: '',
          mgUrl: '',
          price: 0,
          stock: 0
        }
      }
      showModal.value = true
    }
    const actionText = computed(() => (isNew.value ? 'Создать' : 'Обновить'))

    const onSaveProduct = async () => {
      if (isNew.value) {
        await onAddProduct(product.value)
      } else {
        await onUpdateProduct(product.value)
      }
      showModal.value = false
    }

    const onAddProduct = async product => {
      await addProduct(product)

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
          detail: 'Товар создан',
          life: 3000
        })
      }
    }

    const onUpdateProduct = async product => {
      await updateProduct(product)
      if (error.value) {
        // !ok
      } else {
        // ok
      }
    }

    return {
      showModal,
      show,
      product,
      actionText,
      onSaveProduct,
      categories: computed(() => store.getters['categories/all'])
    }
  }
}
</script>

<style></style>
