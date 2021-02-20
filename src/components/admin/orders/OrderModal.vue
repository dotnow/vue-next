<template>
  <Dialog
    maximizable
    :header="headerText"
    v-model:visible="showModal"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="p-grid p-jc-center">
      <div class="p-col-6">
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
            <Dropdown
              v-model="order.status"
              :options="orderStatuses"
              optionLabel="name"
              optionValue="id"
            >
              <template #value="slotProps">
                <order-status :id="slotProps.value"></order-status>
              </template>
              <template #option="slotProps">
                <order-status :id="slotProps.option.id"></order-status>
              </template>
            </Dropdown>
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
          <div class="p-col-6 p-text-right p-text-bold" style="color: red">
            {{ formatCurrency(order.sum) }}
          </div>

          <div class="p-col-6 p-text-bold">
            Скидка
          </div>
          <div class="p-col-6 p-text-right">
            {{ formatCurrency(order.discount) }}
          </div>

          <div class="p-col-6 p-text-bold">
            Промокоды
          </div>
          <div class="p-col-6 p-text-right">
            <Chip
              class="p-m-2"
              :label="el"
              v-for="el in order.promocodes"
              :key="`promocode_${el}`"
            />
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
            <Dropdown
              v-model="order.payType"
              :options="payTypes"
              optionLabel="name"
              optionValue="id"
            >
              <template #value="slotProps">
                <order-pay-type :id="slotProps.value"></order-pay-type>
              </template>
              <template #option="slotProps">
                <order-pay-type :id="slotProps.option.id"></order-pay-type>
              </template>
            </Dropdown>
          </div>

          <div class="p-col-6 p-text-bold">
            Тип доставки
          </div>
          <div class="p-col-6 p-text-right">
            <Dropdown
              v-model="order.deliveryType"
              :options="deliveryTypes"
              optionLabel="name"
              optionValue="id"
            >
              <template #value="slotProps">
                <order-delivery-type
                  :id="slotProps.value"
                ></order-delivery-type>
              </template>
              <template #option="slotProps">
                <order-delivery-type
                  :id="slotProps.option.id"
                ></order-delivery-type>
              </template>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>

    <h4 class="p-text-center">Состав заказа</h4>

    <DataTable :value="order.items">
      <template #empty>
        <app-empty>Нет элементов для отображения</app-empty>
      </template>
      <Column header="Картинка" headerStyle="width: 100px">
        <template #body="slotProps">
          <img
            :src="product(slotProps.data.id).imgUrl"
            :alt="product(slotProps.data.id).name"
            style="max-width: 50px"
          />
        </template>
      </Column>
      <Column header="Наименование">
        <template #body="slotProps">
          {{ product(slotProps.data.id).name }}
        </template>
      </Column>
      <Column
        header="Кол-во"
        headerClass="p-text-right"
        bodyClass="p-text-right"
        headerStyle="width: 100px"
      >
        <template #body="slotProps">
          {{ slotProps.data.amount }}
        </template>
      </Column>
      <Column
        header="Цена"
        headerClass="p-text-right"
        bodyClass="p-text-right"
        headerStyle="width: 150px"
      >
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.price) }}
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <Button
        label="Удалить заказ"
        class="p-button-text"
        icon="pi pi-trash"
        @click="onRemoveOrder"
      />
      <Button
        label="Обновить заказ"
        class="p-button-text"
        icon="pi pi-check"
        @click="onSaveOrder"
      />
    </template>
  </Dialog>
</template>

<script>
import { computed, inject, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useOrders } from '@/use/orders'
import { useStore } from 'vuex'
import { useConfirm } from 'primevue/useconfirm'
import OrderStatus from '@/components/order/OrderStatus'
import OrderPayType from '@/components/order/OrderPayType'
import OrderDeliveryType from '@/components/order/OrderDeliveryType'

export default {
  setup() {
    const store = useStore()
    const toast = useToast()
    const confirm = useConfirm()
    const { updateOrder, removeOrder, error } = useOrders()

    const showModal = ref(false)
    const order = ref({})

    const product = computed(() => store.getters['products/byID'])
    const headerText = computed(() => `Заказ #${order.value.id}`)

    // Открытие модального окна
    const show = item => {
      // FIXME: unref() не убирает реактивность, приходится маршалить и парсить
      //  объект 'item' для того, чтобы поля объекта обновлялись при 2-м и последующих
      //  открытиях модального окна
      //  Для того, чтобы понять, что не так:
      //  ––> order.value = item
      //  Открыть существующий элемент, закрыть модальное окно,
      //  затем открыть другой существующий элемент/создать новый
      order.value = JSON.parse(JSON.stringify(item))
      showModal.value = true
    }

    // Нажатие на кнопку действия
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

    // Удаление заказа
    const onRemoveOrder = () => {
      confirm.require({
        message: 'Вы действительно хотите удалить заказ?',
        header: 'Подтверждение',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          await removeOrder(order.value.id)
          showModal.value = false
        },
        reject: () => {}
      })
    }

    return {
      headerText,
      showModal,
      show,
      order,
      onSaveOrder,
      onRemoveOrder,
      product,
      formatCurrency: inject('formatCurrency'),
      orderStatuses: computed(() => store.getters['orders/orderStatuses']),
      payTypes: computed(() => store.getters['orders/payTypes']),
      deliveryTypes: computed(() => store.getters['orders/deliveryTypes'])
    }
  },

  components: { OrderStatus, OrderPayType, OrderDeliveryType }
}
</script>
