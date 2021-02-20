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
    <Column header="Дата создания">
      <template #body="slotProps">
        {{ new Date(slotProps.data.timestamp).toLocaleString() }}
      </template>
    </Column>
    <Column header="Статус">
      <template #body="slotProps">
        <order-status :id="slotProps.data.status"></order-status>
      </template>
    </Column>
    <Column header="Пользователь">
      <template #body="slotProps">
        {{ slotProps.data.firstName + ' ' + slotProps.data.lastName }}
      </template>
    </Column>
    <Column header="Сумма" headerClass="p-text-right" bodyClass="p-text-right">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.sum) }}
      </template>
    </Column>
    <Column
      header="Оплачено"
      headerClass="p-text-right"
      bodyClass="p-text-right"
    >
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.payedSum) }}
      </template>
    </Column>
    <Column :exportable="false" headerStyle="width: 100px">
      <template #body="slotProps">
        <Button
          icon="pi pi-eye"
          class="p-button-text p-mr-2"
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
import { computed, inject, ref } from 'vue'
import OrderModal from '@/components/admin/orders/OrderModal'
import OrderStatus from '@/components/order/OrderStatus'

export default {
  setup() {
    const store = useStore()

    const modal = ref(null)
    const filters = ref({})

    const onShowModal = order => {
      modal.value.show(order)
    }

    return {
      onShowModal,
      modal,
      filters,
      formatCurrency: inject('formatCurrency'),
      orders: computed(() => store.getters['orders/all'])
    }
  },

  components: { OrderModal, OrderStatus }
}
</script>
