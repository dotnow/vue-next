<template>
  <h3 class="p-text-center">Корзина</h3>

  <div v-if="cartItems.length">
    <div
      class="p-datatable p-component p-datatable-sm p-mb-3"
      data-scrollselectors=".p-datatable-scrollable-body, .p-datatable-unfrozen-view .p-datatable-scrollable-body"
    >
      <div class="p-datatable-wrapper">
        <table role="grid">
          <thead class="p-datatable-thead">
            <tr>
              <th class="p-text-center" style="width: 100px">
                <span class="p-column-title">Картинка</span>
              </th>
              <th>
                <span class="p-column-title">Наименование</span>
              </th>
              <th class="p-text-center" style="width: 150px">
                <span class="p-column-title">Кол-во</span>
              </th>
              <th class="p-text-right" style="width: 200px">
                <span class="p-column-title">Сумма</span>
              </th>
              <th style="width: 70px"></th>
            </tr>
          </thead>
          <tbody class="p-datatable-tbody">
            <template v-for="cartItem in cartItems" :key="cartItem.id">
              <cart-row :item="cartItem"></cart-row>
            </template>
          </tbody>
        </table>
      </div>
      <div class="p-col-12 p-text-right">
        <inline-message severity="info"
          ><b>123-123-123</b> – Скидка 10%, если сумма товаров в корзине больше
          500 ₽</inline-message
        >
      </div>
      <div class="p-col-12 p-text-right">
        <inline-message severity="info"
          ><b>222-222-222</b> – Добавляет товар `Укроп` в корзину в качестве
          подарка</inline-message
        >
      </div>
      <div class="p-col-12 p-text-right">
        <inline-message severity="info"
          ><b>333-333-333</b> – Фиксированная скидка 200 ₽ на общую сумму
          корзины</inline-message
        >
      </div>
      <div class="p-datatable-footer p-grid p-jc-end">
        <div class="p-grid p-ai-end vertical-container">
          <div class="p-col">
            <Chip
              class="p-m-2"
              :label="el"
              v-for="el in inCartPromocodes"
              :key="`promocode_${el}`"
            />
          </div>
        </div>
        <div class="p-col-3">
          <label for="promocode">Промокод</label>
          <div class="p-inputgroup">
            <InputMask id="promocode" mask="***-***-***" v-model="promocode" />
            <Button
              label="Применить"
              @click="onEnterPromocode"
              :disabled="isPromocodeButtonDisabled"
            />
          </div>
        </div>
      </div>
      <div class="p-datatable-footer">
        <div style="text-align: right" v-if="cartDiscount">
          Скидка: -{{ formatCurrency(cartDiscount) }}
        </div>
        <div style="text-align: right">
          Всего: {{ formatCurrency(cartTotalSum) }}
        </div>
      </div>
    </div>
    <div class="p-text-center">
      <div v-if="isAuth">
        <Button
          icon="pi pi-credit-card"
          label="Перейти к оформлению заказа"
          @click="onOrder"
        ></Button>
      </div>
      <Button
        v-else
        label="Войдите в систему для оформления заказа"
        @click="displayAuthModal"
      >
      </Button>
    </div>
  </div>
  <app-empty v-else>Нет элементов для отображения</app-empty>
</template>

<script>
import { ref, inject, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useCart } from '@/use/cart'
import { useToast } from 'primevue/usetoast'
import CartRow from '@/components/cart/CartRow'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()

    const promocode = ref('')
    const { applyPromocode, error } = useCart()

    const promocodeByID = computed(() => store.getters['promocodes/byID'])
    const inCartPromocodes = computed(() => store.getters['cart/promocodes'])

    const onOrder = () => {
      router.push('/order')
    }

    const displayAuthModal = () => store.commit('SET_AUTH_MODAL', true)

    const onEnterPromocode = async () => {
      if (!promocodeByID.value(promocode.value)) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Промокод не найден',
          life: 3000
        })
        return
      } else if (inCartPromocodes.value.includes(promocode.value)) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Вы уже применили этот промокод',
          life: 3000
        })
        promocode.value = ''
        return
      } else {
        await applyPromocode(promocode.value)
        if (!error.value) {
          toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Промокод применён',
            life: 3000
          })
          promocode.value = ''
        } else {
          toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error.value,
            life: 3000
          })
        }
      }
    }
    return {
      promocode,
      isPromocodeButtonDisabled: computed(
        () => promocode.value.replace('_', '').length !== 11
      ),
      inCartPromocodes,
      onEnterPromocode,
      onOrder,
      cartItems: computed(() => store.getters['cart/cart']),
      cartTotalSum: computed(() => store.getters['cart/cartTotalSum']),
      cartDiscount: computed(() => store.getters['cart/cartDiscount']),
      formatCurrency: inject('formatCurrency'),
      isAuth: computed(() => store.getters.isAuth),
      displayAuthModal
    }
  },

  components: { CartRow }
}
</script>
