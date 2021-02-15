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
      { id: 0, label: 'Наличными', class: 'order-cash' },
      { id: 1, label: 'Картой', class: 'order-in-progress' },
      { id: 2, label: 'Расчётный счёт', class: 'order-delivered' }
    ]

    return {
      current: computed(() => typeList.find(el => el.id === props.type))
    }
  }
}
</script>
