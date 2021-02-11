<template>
  <Dialog
    header="Детали товара"
    v-model:visible="showModal"
    :style="{ width: '800px' }"
    class="p-fluid"
    :modal="true"
    @hide="onHideDialog"
  >
    <img
      :src="imgUrlForm"
      :alt="name"
      class="product-image"
      v-if="imgUrlForm"
    />
    <Button
      v-if="imgFileNameForm"
      label="Удалить изображение"
      icon="pi pi-trash"
      class="p-button-danger p-button-sm p-mb-3"
      @click="imageRemove"
    ></Button>
    <div class="p-fluid">
      <div class="p-field">
        <label for="name">Наименование</label>
        <InputText
          id="name"
          type="text"
          aria-describedby="name-help"
          :class="{ 'p-invalid': nameError }"
          v-model="name"
        />
        <small id="name-help" class="p-error" v-if="nameError">{{
          nameError
        }}</small>
      </div>

      <div class="p-field">
        <label for="categoryID">Категория</label>
        <Dropdown
          id="categoryID"
          v-model="categoryID"
          :options="categories"
          aria-describedby="categoryID-help"
          :class="{ 'p-invalid': categoryIDError }"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите категорию"
        />
        <small id="categoryID-help" class="p-error" v-if="categoryIDError">{{
          categoryIDError
        }}</small>
      </div>

      <div class="p-field" v-if="!imgFileNameForm">
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

      <div class="p-field">
        <label for="description">Описание товара</label>
        <div class="p-text-center">
          <Editor
            id="description"
            v-model="description"
            editorStyle="height: 320px"
          />
        </div>
      </div>
    </div>

    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col">
        <label for="price">Цена</label>
        <InputNumber
          id="price"
          v-model="price"
          mode="currency"
          currency="RUB"
          locale="ru-RU"
          :maxFractionDigits="0"
        />
      </div>

      <div class="p-field p-col">
        <label for="stock">Остаток на складе</label>
        <InputNumber id="stock" v-model="stock" :min="0" />
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
        :disabled="!isFormValid"
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
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

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
    const id = ref('')
    const isNew = ref(false)
    const productSaved = ref(false)

    const schema = yup.object({
      name: yup
        .string()
        .required('Введите название товара')
        .min(3, 'Название должно быть больше 3 символов')
        .max(20, 'Название должно быть меньше 20 символов'),
      categoryID: yup.string().required('Выберите категорию'),
      imgUrl: yup.string(),
      imgFileName: yup.string(),
      description: yup.string(),
      price: yup.number(),
      stock: yup.number()
    })

    useForm({
      validationSchema: schema
    })

    const { value: name, errorMessage: nameError } = useField('name')
    const { value: categoryID, errorMessage: categoryIDError } = useField(
      'categoryID'
    )
    const { value: imgUrlForm } = useField('imgUrl')
    const { value: imgFileNameForm } = useField('imgFileName')
    const { value: description } = useField('description')
    const { value: price } = useField('price')
    const { value: stock } = useField('stock')

    const actionText = computed(() => (isNew.value ? 'Создать' : 'Обновить'))

    const isFormValid = computed(
      () => !nameError.value && !categoryIDError.value
    )

    watch(imgUrl, () => {
      imgUrlForm.value = imgUrl.value
      imgFileNameForm.value = imgFileName.value

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Картинка загружена на сервер',
        life: 3000
      })
    })

    const onHideDialog = async () => {
      if (isNew.value && imgFileNameForm.value && !productSaved.value) {
        await imageRemove()
      }
    }

    const imageRemove = async () => {
      await removeFile(imgFileNameForm.value)
      if (error.value) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Ошибка при удалении файла',
          life: 3000
        })
      } else {
        imgFileNameForm.value = ''
        imgUrlForm.value = ''
      }
    }

    const imageUpload = async event => {
      if (imgFileNameForm.value) {
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
        id.value = item['id']
        name.value = item['name']
        categoryID.value = item['categoryID']
        imgUrlForm.value = item['imgUrl']
        imgFileNameForm.value = item['imgFileName']
        description.value = item['description']
        price.value = item['price']
        stock.value = item['stock']
      } else {
        isNew.value = true
        name.value = ''
        categoryID.value = ''
        imgUrlForm.value = ''
        imgFileNameForm.value = ''
        description.value = ''
        price.value = 0
        stock.value = 0
      }
      showModal.value = true
    }

    const onSaveProduct = async () => {
      const product = {
        id: id.value,
        name: name.value,
        categoryID: categoryID.value,
        imgUrl: imgUrlForm.value ?? '',
        imgFileName: imgFileNameForm.value ?? '',
        description: description.value,
        price: price.value,
        stock: stock.value
      }

      if (isNew.value) {
        delete product.id
        await onAddProduct(product)
      } else {
        await onUpdateProduct(product)
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
      name,
      nameError,
      categoryID,
      categoryIDError,
      imgUrlForm,
      imgFileNameForm,
      description,
      price,
      stock,
      imgUrl,
      imageUpload,
      imageRemove,
      progress,
      showModal,
      show,
      isFormValid,
      actionText,
      onSaveProduct,
      onHideDialog,
      categories: computed(() => store.getters['categories/all'])
    }
  }
}
</script>
