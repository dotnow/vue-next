<template>
  <Dialog
    v-model:visible="showDialog"
    :style="{ width: '450px' }"
    :header="header"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span>
        <slot></slot>
      </span>
    </div>
    <template #footer>
      <Button
        label="Нет"
        icon="pi pi-times"
        class="p-button-text"
        @click="showDialog = false"
      />
      <Button
        label="Да"
        icon="pi pi-check"
        class="p-button-text"
        @click="onConfirm"
      />
    </template>
  </Dialog>
</template>

<script>
import { ref, toRefs } from 'vue'
export default {
  props: {
    header: {
      type: String,
      default: 'Подтверждение'
    }
  },

  emits: ['onConfirm'],

  setup(props, { emit }) {
    const showDialog = ref(false)

    const open = () => {
      showDialog.value = true
    }

    const onConfirm = () => {
      emit('onConfirm')
      showDialog.value = false
    }

    return {
      ...toRefs(props),
      open,
      onConfirm,
      showDialog
    }
  }
}
</script>
