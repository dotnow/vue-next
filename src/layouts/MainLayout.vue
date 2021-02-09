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
    v-model:visible="displayAuthModal"
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

    const closeModal = () => {
      store.commit('SET_AUTH_MODAL', false)
    }

    return {
      closeModal,
      displayAuthModal: computed(() => store.getters.displayAuthModal)
    }
  },
  components: { AppNavbar, SigninForm }
}
</script>

<style></style>
