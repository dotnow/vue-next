<template>
  <app-navbar></app-navbar>
  <div class="layout-content">
    <div class="content-section">
      <router-view />
    </div>
  </div>
  <div class="layout-footer p-text-center">
    &copy; Vladilen Online
  </div>

  <Dialog
    header="Авторизация"
    v-model:visible="authModal"
    :style="{ width: '50vw ' }"
    :modal="true"
    :closable="false"
  >
    <signin-form></signin-form>
    <template #footer>
      <Button label="Отмена" @click="closeModal" class="p-button-text" />
    </template>
  </Dialog>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppNavbar from '@/components/app/AppNavbar'
import SigninForm from '@/components/SigninForm'

export default {
  setup() {
    const store = useStore()

    return {
      closeModal: () => {
        store.commit('TOGGLE_AUTH_MODAL')
      },
      authModal: computed(() => store.getters.authModal)
    }
  },
  components: { AppNavbar, SigninForm }
}
</script>
