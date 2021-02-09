<template>
  <Tag
    style="position: relative"
    :value="stock ? 'В наличии' : 'Нет в наличии'"
    :severity="stock ? 'success' : 'danger'"
  ></Tag>
</template>

<script>
import { toRefs } from 'vue'
export default {
  props: {
    stock: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    return {
      ...toRefs(props)
    }
  }
}
</script>
