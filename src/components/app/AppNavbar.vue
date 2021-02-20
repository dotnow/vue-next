<template>
  <div class="layout-topbar">
    <router-link custom v-slot="{ navigate }" :to="{ name: 'shop' }">
      <a href="#" class="logo" @click="navigate">{{ appName }}</a>
    </router-link>

    <ul class="topbar-menu">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'cart' }">
        <li>
          <a href="#" @click="navigate">
            <i
              v-if="cartTotalAmount"
              class="pi pi-shopping-cart p-mr-4"
              style="font-size: 1.5rem"
              v-badge.danger="cartTotalAmount"
            ></i>
            <i
              v-else
              class="pi pi-shopping-cart p-mr-4"
              style="font-size: 1.5rem"
            ></i>
          </a>
        </li>

        <router-link
          v-if="isAdmin"
          custom
          v-slot="{ navigate }"
          :to="{ name: 'admin' }"
        >
          <li @click="navigate">
            <a href="#">Админ</a>
          </li>
        </router-link>

        <li @click="authModal" v-if="!isAuth">
          <a href="#">Вход</a>
        </li>

        <li @click="toggleMenu($event)" v-else>
          <a href="#">{{ username }}</a>
        </li>

        <Menu ref="userMenu" :model="menuItems" :popup="true" />
      </router-link>
    </ul>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useAuth } from '@/use/auth'

export default {
  setup() {
    const userMenu = ref(null)
    const auth = useAuth()
    const store = useStore()
    const appName = process.env.VUE_APP_NAME

    const menuItems = [
      {
        label: 'Выход',
        icon: 'pi pi-chevron-circle-right',
        command: () => auth.signOut()
      }
    ]

    return {
      userMenu,
      menuItems,
      appName,
      toggleMenu: event => userMenu.value.toggle(event),
      authModal: () => store.commit('TOGGLE_AUTH_MODAL'),
      isAuth: computed(() => store.getters.isAuth),
      isAdmin: computed(() => store.getters.isAdmin),
      username: computed(() => store.getters.username),
      cartTotalAmount: computed(() => store.getters['cart/cartTotalAmount'])
    }
  }
}
</script>
