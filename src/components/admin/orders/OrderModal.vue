<template>
  <Dialog
    :header="headerText"
    v-model:visible="showModal"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="p-grid p-jc-between">
      <div class="p-col-6 p-text-bold">
        Дата создания
      </div>
      <div class="p-col-6 p-text-right">
        {{ new Date(order.timestamp).toLocaleString() }}
      </div>

      <div class="p-col-6 p-text-bold">
        Статус
      </div>
      <div class="p-col-6 p-text-right">
        {{ order.status }}
      </div>

      <div class="p-col-6 p-text-bold">
        Заказчик
      </div>
      <div class="p-col-6 p-text-right">
        {{ order.firstName + ' ' + order.lastName }}
      </div>

      <div class="p-col-6 p-text-bold">
        Телефон
      </div>
      <div class="p-col-6 p-text-right">
        <a :href="`tel:${order.phoneNumber}`">{{ order.phoneNumber }}</a>
      </div>

      <div class="p-col-6 p-text-bold">
        Сумма
      </div>
      <div class="p-col-6 p-text-right">
        {{ formatCurrency(order.sum) }}
      </div>

      <div class="p-col-6 p-text-bold">
        Оплачено
      </div>
      <div class="p-col-6 p-text-right">
        {{ formatCurrency(order.payedSum) }}
      </div>

      <div class="p-col-6 p-text-bold">
        Тип оплаты
      </div>
      <div class="p-col-6 p-text-right">
        {{ order.payType }}
      </div>

      <div class="p-col-6 p-text-bold">
        Тип доставки
      </div>
      <div class="p-col-6 p-text-right">
        {{ order.deliveryType }}
      </div>
    </div>

    <h4 class="p-text-center">Состав заказа</h4>

    <DataTable :value="Object.entries(order.items)">
      <template #empty>
        <app-empty>Нет элементов для отображения</app-empty>
      </template>
      <Column header="Наименование">
        <template #body="slotProps">
          {{ product(slotProps.data[0]).name }}
        </template>
      </Column>
      <Column header="Кол-во">
        <template #body="slotProps">
          {{ slotProps.data[1] }}
        </template>
      </Column>
      <Column header="Цена">
        <template #body="slotProps">
          {{ product(slotProps.data[0]).price }}
        </template>
      </Column>
    </DataTable>
    <!-- <div class="p-fluid">
      <div class="p-field">
        <label for="name">Наименование</label>
        <InputText id="name" type="text" v-model="category.name" />
      </div>

      <div class="p-field p-mb-5">
        <label for="parentID">Родительский каталог</label>
        <Dropdown
          id="parentID"
          v-model="category.parentID"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите родительскую категорию"
        />
      </div>
    </div> -->

    <template #footer>
      <Button label="Удалить заказ" icon="pi pi-trash" @click="onRemoveOrder" />
      <Button label="Обновить заказ" icon="pi pi-check" @click="onSaveOrder" />
    </template>
  </Dialog>
</template>

<script>
import { computed, inject, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useOrders } from '@/use/orders'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()

    const showModal = ref(false)
    const order = ref({})

    const { updateOrder, removeOrder, error } = useOrders()

    const product = computed(() => store.getters['products/byID'])

    const show = item => {
      order.value = JSON.parse(JSON.stringify(item))
      showModal.value = true
    }

    const headerText = computed(() => `Заказ #${order.value.id}`)

    const onSaveOrder = async () => {
      await updateOrder(order.value)

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
          detail: 'Заказ обновлён',
          life: 3000
        })

        showModal.value = false
      }
    }

    const onRemoveOrder = async () => {
      await removeOrder(order.value.id)
    }

    return {
      headerText,
      showModal,
      show,
      order,
      onSaveOrder,
      onRemoveOrder,
      product,
      formatCurrency: inject('formatCurrency')
    }
  }
}
</script>
