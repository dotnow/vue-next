<template>
  <span :class="['order-badge', current.class]">
    {{ current.label }}
  </span>
</template>

<script>
import { computed } from 'vue'
export default {
  props: {
    type: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const typeList = [
      { id: 0, label: 'Самовывоз', class: 'order-pending' },
      { id: 1, label: 'Курьер', class: 'order-in-progress' },
      { id: 2, label: 'Почтой России', class: 'order-delivered' }
    ]

    return {
      current: computed(() => typeList.find(el => el.id === props.type))
    }
  }
}
</script>
