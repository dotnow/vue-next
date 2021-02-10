<template>
  <Dialog
    header="Детали товара"
    v-model:visible="showModal"
    :style="{ width: '450px' }"
    class="p-fluid"
    :modal="true"
    @hide="onHideDialog"
  >
    <img
      :src="product.imgUrl"
      :alt="product.name"
      class="product-image"
      v-if="product.imgUrl"
    />
    <Button
      v-if="product.imgFileName"
      label="Удалить изображение"
      icon="pi pi-trash"
      class="p-button-danger p-button-sm p-mb-3"
      @click="imageRemove"
    ></Button>
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

      <div class="p-field" v-if="!product.imgFileName">
        <label for="imgUrl">Картинка товара</label>
        <div class="p-text-center">
          <FileUpload
            v-if="!progress"
            chooseLabel="Загрузить изображение"
            invalidFileSizeMessage="{0}: Слишком большой файл, размер файла должен быть меньше {1}."
            accept="image/*"
            :customUpload="true"
            :maxFileSize="500000"
            @uploader="imageUpload"
            mode="basic"
            :auto="true"
          />
          <ProgressBar :value="progress" v-else />
        </div>
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
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast'
import { useProducts } from '@/use/products'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()
    const {
      uploadFile,
      removeFile,
      addProduct,
      updateProduct,
      imgUrl,
      imgFileName,
      progress,
      error
    } = useProducts()

    const showModal = ref(false)
    const product = ref({})
    const isNew = ref(false)
    const productSaved = ref(false)

    const actionText = computed(() => (isNew.value ? 'Создать' : 'Обновить'))

    watch(imgUrl, () => {
      product.value.imgUrl = imgUrl.value
      product.value.imgFileName = imgFileName.value

      console.log(product.value.imgUrl, product.value.imgFileName)

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Картинка загружена на сервер',
        life: 3000
      })
    })

    const onHideDialog = async () => {
      if (isNew.value && product.value.imgFileName && !productSaved.value) {
        await imageRemove()
      }
    }

    const imageRemove = async () => {
      await removeFile(product.value.imgFileName)
      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при удалении файла',
          life: 3000
        })
      } else {
        product.value.imgFileName = ''
        product.value.imgUrl = ''
      }
    }

    const imageUpload = async event => {
      if (product.value.imgFileName) {
        await imageRemove()
        if (error.value) {
          return
        }
      }

      await uploadFile(event.files[0])

      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: error.value,
          life: 3000
        })
      }
    }

    const show = item => {
      if (item) {
        isNew.value = false
        product.value = item
      } else {
        isNew.value = true
        product.value = {
          name: '',
          categoryID: '',
          imgUrl: '',
          imgFileName: '',
          price: 0,
          stock: 0
        }
      }
      showModal.value = true
    }

    const onSaveProduct = async () => {
      if (isNew.value) {
        await onAddProduct(product.value)
      } else {
        await onUpdateProduct(product.value)
      }
      productSaved.value = true
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
          detail: 'Товар обновлён',
          life: 3000
        })
      }
    }

    return {
      imgUrl,
      imageUpload,
      imageRemove,
      progress,
      showModal,
      show,
      product,
      actionText,
      onSaveProduct,
      onHideDialog,
      categories: computed(() => store.getters['categories/all'])
    }
  }
}
</script>

<style></style>
