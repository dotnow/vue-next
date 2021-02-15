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
      { id: 0, label: 'В обработке', class: 'order-pending' },
      { id: 1, label: 'В пути', class: 'order-in-progress' },
      { id: 2, label: 'Доставлен', class: 'order-delivered' },
      { id: 3, label: 'Отменён', class: 'order-cancelled' }
    ]

    return {
      current: computed(() => typeList.find(el => el.id === props.type))
    }
  }
}
</script>
