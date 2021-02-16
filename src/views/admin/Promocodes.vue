<template>
  <Toolbar class="p-mb-4">
    <template #left> </template>
  </Toolbar>
  <DataTable
    :value="promocodes"
    :paginator="true"
    :rows="10"
    dataKey="id"
    :filters="filters"
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
    <!-- <Column :exportable="false" headerStyle="width: 100px">
      <template #body="slotProps">
        <Button
          icon="pi pi-eye"
          class="p-button-text p-mr-2"
          @click="onShowModal(slotProps.data)"
        />
      </template>
    </Column> -->
  </DataTable>

  <!-- <teleport to="body">
    <order-modal ref="modal"></order-modal>
  </teleport> -->
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

export default {
  setup() {
    const store = useStore()

    // const modal = ref(null)
    const filters = ref({})

    // const onShowModal = order => {
    //   modal.value.show(order)
    // }

    return {
      // onShowModal,
      // modal,
      filters,
      promocodes: computed(() => store.getters['promocodes/all'])
    }
  }
}
</script>
