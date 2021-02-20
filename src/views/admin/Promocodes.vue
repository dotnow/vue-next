<template>
  <Toolbar class="p-mb-4">
    <template #left> </template>
  </Toolbar>
  <DataTable
    :value="promocodes"
    :paginator="true"
    :rows="10"
    dataKey="id"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 25]"
    currentPageReportTemplate="Показаны с {first} по {last} из {totalRecords} позиций"
  >
    <template #empty>
      <app-empty>Нет элементов для отображения</app-empty>
    </template>
    <Column header="Название">
      <template #body="slotProps">
        {{ slotProps.data.name }}
      </template>
    </Column>
    <Column header="Промокод">
      <template #body="slotProps">
        {{ slotProps.data.id }}
      </template>
    </Column>
  </DataTable>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    return {
      promocodes: computed(() => store.getters['promocodes/all'])
    }
  }
}
</script>
