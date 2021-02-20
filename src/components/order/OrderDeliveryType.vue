<template>
  <span :class="['order-badge', deliveryType.class]">
    {{ deliveryType.name }}
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

    const deliveryTypeByID = computed(
      () => store.getters['orders/deliveryTypeByID']
    )

    return {
      deliveryType: computed(() => deliveryTypeByID.value(props.id))
    }
  }
}
</script>
