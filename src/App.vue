<template>
  <component :is="layout" v-if="layout" />
  <teleport to="body">
    <toast></toast>
    <confirm-dialog></confirm-dialog>
  </teleport>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout'
import CleanLayout from '@/layouts/CleanLayout'

export default {
  setup() {
    const route = useRoute()

    return {
      layout: computed(() =>
        route.meta.layout ? `${route.meta.layout}-layout` : 'clean-layout'
      )
    }
  },

  components: { MainLayout, CleanLayout }
}
</script>
