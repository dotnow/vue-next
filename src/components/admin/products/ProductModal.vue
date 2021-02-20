<template>
  <teleport to="body">
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
      <div class="p-d-flex p-jc-center">
        <div>
          <Button
            v-if="imgFileNameForm"
            label="Удалить изображение"
            icon="pi pi-trash"
            class="p-button-danger p-button-sm p-mb-3"
            @click="imageRemove"
          ></Button>
        </div>
      </div>
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
          <CascadeSelect
            v-model="categoryID"
            :options="categoriesList"
            optionLabel="name"
            optionValue="id"
            optionGroupLabel="name"
            :optionGroupChildren="['children']"
            aria-describedby="categoryID-help"
            :class="{ 'p-invalid': categoryIDError }"
            placeholder="Выберите категорию"
            style="width: 14rem"
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
          <label for="announcement">Краткое описание товара</label>
          <div>
            <Textarea
              id="announcement"
              v-model="announcement"
              :autoResize="true"
              rows="2"
              cols="30"
            />
          </div>
        </div>

        <div class="p-field">
          <label for="description">Детальное описание товара</label>
          <div>
            <Editor
              id="description"
              v-model="description"
              editorStyle="height: 250px"
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
  </teleport>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast'
import { useProducts } from '@/use/products'
import { useForm, useField } from 'vee-validate'
import { onBeforeRouteLeave } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import * as yup from 'yup'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()
    const confirm = useConfirm()
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
    const initialItem = reactive({})

    // Минимальное кол-во символов в названии
    const NAME_MIN_LENGTH = 3
    // Максимальное кол-во символов в названии
    const NAME_MAX_LENGTH = 20

    // Функция-помощник для установки ключе и детей
    const setKeysAndChildren = item => {
      const children = store.getters['categories/getChildrens'](item.id)

      if (children.length) {
        item.children = store.getters['categories/getChildrens'](
          item.id
        ).map(ch => setKeysAndChildren(ch))
      }
      return item
    }

    const categoriesList = computed(() =>
      store.getters['categories/all']
        .filter(el => !el.parentID)
        .map(el => setKeysAndChildren(el))
    )

    const schema = yup.object({
      name: yup
        .string()
        .required('Введите название товара')
        .min(
          NAME_MIN_LENGTH,
          `Название должно быть больше ${NAME_MIN_LENGTH} символов`
        )
        .max(
          NAME_MAX_LENGTH,
          `Название должно быть меньше ${NAME_MAX_LENGTH} символов`
        ),
      categoryID: yup.string().required('Выберите категорию'),
      imgUrl: yup.string(),
      imgFileName: yup.string(),
      announcement: yup.string(),
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
    const { value: announcement } = useField('announcement')
    const { value: description } = useField('description')
    const { value: price } = useField('price')
    const { value: stock } = useField('stock')

    // Текст кнопки действия
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

    onBeforeRouteLeave((_, from, next) => {
      if (hasDifference.value) {
        confirm.require({
          message:
            'У вас есть несохранённые изменения. Вы действительно хотите покинуть страницу?',
          header: 'Подтверждение',
          acceptLabel: 'Да',
          rejectLabel: 'Нет',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
            await onHideDialog()
            next()
          },
          reject: () => {
            next(false)
          }
        })
      } else {
        next()
      }
    })

    const onHideDialog = async () => {
      if (isNew.value && imgFileNameForm.value && !productSaved.value) {
        await imageRemove()
      }
    }

    // Удаление изображения
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

    // Загрузка изображения на сервер
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

    // Открытие модального окна
    const show = item => {
      if (item) {
        isNew.value = false
        id.value = item['id']
        name.value = item['name']
        categoryID.value = item['categoryID']
        imgUrlForm.value = item['imgUrl'] ?? ''
        imgFileNameForm.value = item['imgFileName'] ?? ''
        announcement.value = item['announcement'] ?? ''
        description.value = item['description'] ?? ''
        price.value = item['price']
        stock.value = item['stock']
      } else {
        isNew.value = true
        name.value = ''
        categoryID.value = ''
        imgUrlForm.value = ''
        imgFileNameForm.value = ''
        announcement.value = ''
        description.value = ''
        price.value = 0
        stock.value = 0
      }

      initialItem.name = name.value
      initialItem.categoryID = categoryID.value
      initialItem.imgUrl = imgUrlForm.value
      initialItem.imgFileName = imgFileNameForm.value
      initialItem.announcement = announcement.value
      initialItem.description = description.value
      initialItem.price = price.value
      initialItem.stock = stock.value

      showModal.value = true
    }

    const hasDifference = computed(() => {
      if (
        initialItem.name !== name.value ||
        initialItem.categoryID !== categoryID.value ||
        initialItem.imgUrl !== imgUrlForm.value ||
        initialItem.imgFileName !== imgFileNameForm.value ||
        initialItem.announcement !== announcement.value ||
        initialItem.description !== description.value ||
        initialItem.price !== price.value ||
        initialItem.stock !== stock.value
      ) {
        return true
      } else {
        return false
      }
    })

    // Нажатие на кнопку действия
    const onSaveProduct = async () => {
      const product = {
        id: id.value,
        name: name.value,
        categoryID: categoryID.value,
        imgUrl: imgUrlForm.value ?? '',
        imgFileName: imgFileNameForm.value ?? '',
        announcement: announcement.value,
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

    // Создание нового товара
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

    // Обновление существующего товара
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
      announcement,
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
      categoriesList,
      categories: computed(() => store.getters['categories/all'])
    }
  }
}
</script>
