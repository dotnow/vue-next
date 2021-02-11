<template>
  <ul class="paginate">
    <li>
      <Button
        class="p-button-text p-button-secondary"
        icon="pi pi-arrow-left"
        :disabled="value === 1"
        @click="$emit('setPage', value - 1)"
      ></Button>
    </li>
    <li v-for="(page, index) of pages" :key="`page_${index}`">
      <Button
        :class="['p-button-text', { 'p-button-secondary': page !== value }]"
        :label="page"
        @click="$emit('setPage', page)"
      ></Button>
    </li>
    <li>
      <Button
        class="p-button-text p-button-secondary"
        icon="pi pi-arrow-right"
        :disabled="value === pages"
        @click="$emit('setPage', value + 1)"
      ></Button>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['amount', 'perPage', 'value'],
  emits: ['setPage'],

  setup(props) {
    return {
      pages: Math.floor(props.amount / props.perPage)
    }
  }
}
</script>
