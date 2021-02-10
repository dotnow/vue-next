<template>
  <TabMenu :model="menuItems" class="p-mb-2" />
  <router-view></router-view>
</template>

<script>
export default {
  setup() {
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
      menuItems
    }
  }
}
</script>
