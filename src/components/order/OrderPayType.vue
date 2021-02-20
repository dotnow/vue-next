<template>
  <span :class="['order-badge', payType.class]">
    {{ payType.name }}
  </span>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const store = useStore()

    const payTypeByID = computed(() => store.getters['orders/payTypeByID'])

    return {
      payType: computed(() => payTypeByID.value(props.id))
    }
  }
}
</script>
