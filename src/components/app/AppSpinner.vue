<template>
  <div :uk-spinner="`ratio: ${ratio}`"></div>
</template>

<script>
export default {
  props: {
    ratio: {
      type: [Number, String],
      default: 1
    }
  },

  setup() {
    return {}
  }
}
</script>
