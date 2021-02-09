<template>
  <button :class="classes" :disabled="isDisabled">
    <app-spinner v-if="loading" ratio="0.8"></app-spinner>
    <slot v-else></slot>
  </button>
</template>

<script>
import { useStore } from 'vuex'
import { computed, toRefs } from 'vue'
import AppSpinner from '@/components/AppSpinner.vue'

export default {
  props: {
    type: {
      type: String,
      default: 'default',
      validator: value =>
        ['default', 'primary', 'secondary', 'danger'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const { disabled } = toRefs(props)
    const loading = computed(() => useStore().getters.loading)
    const classes = computed(() => [
      'uk-button',
      'uk-width-small',
      { 'uk-button-default': loading.value || props.type === 'default' },
      { 'uk-button-primary': !loading.value && props.type === 'primary' },
      { 'uk-button-secondary': !loading.value && props.type === 'secondary' },
      { 'uk-button-danger': !loading.value && props.type === 'danger' }
    ])

    return {
      loading,
      classes,
      isDisabled: computed(() => loading.value || disabled.value)
    }
  },

  components: { AppSpinner }
}
</script>
