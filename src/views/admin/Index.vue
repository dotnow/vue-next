<template>
  <TabMenu :model="menuItems" class="p-mb-2" />
  <FileUpload
    name="demo[]"
    accept="image/*"
    :customUpload="true"
    :maxFileSize="1000000"
    @uploader="myUploader"
    mode="basic"
    :auto="true"
  />
  <router-view></router-view>
</template>

<script>
// import { useProducts } from '@/use/products'

export default {
  setup() {
    // const { uploadFile, error } = useProducts()

    const myUploader = async event => {
      // await uploadFile(event.files[0])
      // if (error.value) {
      //   console.log('ERROR', error.value)
      // }
      // console.log(Date.now())
      console.log(Date.now() + '.' + event.files[0].name.split('.').pop())
    }

    const menuItems = [
      {
        label: 'Категории',
        icon: 'pi pi-book',
        to: '/admin/categories'
      },
      {
        label: 'Товары',
        icon: 'pi pi-file',
        to: '/admin/products'
      }
    ]
    return {
      myUploader,
      menuItems
    }
  }
}
</script>
