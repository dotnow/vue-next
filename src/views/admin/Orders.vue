<template>
  <Toolbar class="p-mb-4">
    <template #left> </template>
  </Toolbar>
  <DataTable
    :value="orders"
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
    <Column
      selectionMode="multiple"
      headerStyle="width: 3rem"
      :exportable="false"
    ></Column>
    <Column header="Дата создания">
      <template #body="slotProps">
        {{ new Date(slotProps.data.date).toLocaleString() }}
      </template>
    </Column>
    <Column header="Пользователь">
      <template #body="slotProps">
        {{ slotProps.data.userID }}
      </template>
    </Column>
    <Column header="Сумма">
      <template #body="slotProps">
        {{ slotProps.data.sum }}
      </template>
    </Column>
    <Column header="Тип оплаты">
      <template #body="slotProps">
        {{ slotProps.data.payType }}
      </template>
    </Column>
    <Column header="Оплачено">
      <template #body="slotProps">
        {{ slotProps.data.payedSum }}
      </template>
    </Column>
    <Column header="Доставка">
      <template #body="slotProps">
        {{ slotProps.data.deliveryType }}
      </template>
    </Column>
    <Column :exportable="false" headerStyle="width: 100px">
      <template #body="slotProps">
        <Button
          icon="pi pi-eye"
          class="p-button-text p-button-warning p-mr-2"
          @click="onShowModal(slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>

  <teleport to="body">
    <order-modal ref="modal"></order-modal>
  </teleport>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
// import { useCategories } from '@/use/categories'
// import { useToast } from 'primevue/usetoast'
// import { useConfirm } from 'primevue/useconfirm'
import OrderModal from '@/components/admin/orders/OrderModal'

export default {
  setup() {
    const store = useStore()
    // const toast = useToast()
    // const confirm = useConfirm()

    const modal = ref(null)

    const filters = ref({})

    // const { removeCategory, error } = useCategories()

    const onShowModal = order => {
      modal.value.show(order)
    }

    return {
      onShowModal,
      modal,
      filters,
      orders: computed(() => store.getters['orders/all'])
    }
  },

  components: { OrderModal }
}
</script>
