<template>
  <span :class="['order-badge', orderStatus.class]">
    {{ orderStatus.name }}
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

    const orderStatusByID = computed(
      () => store.getters['orders/orderStatusByID']
    )

    return {
      orderStatus: computed(() => orderStatusByID.value(props.id))
    }
  }
}
</script>
