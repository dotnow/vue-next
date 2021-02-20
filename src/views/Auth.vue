<template>
  <div class="p-text-center">
    <h1>Войдите в систему</h1>
    <signin-form></signin-form>
  </div>
</template>

<script>
import SigninForm from '@/components/SigninForm'
export default {
  setup() {
    return {}
  },

  components: { SigninForm }
}
</script>
