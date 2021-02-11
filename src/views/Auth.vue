<template>
  <div class="p-text-center">
    <h1>Войдите в систему</h1>
    <div
      class="uk-margin-auto uk-margin-auto-vertical uk-width-1-2@s uk-card uk-card-body uk-background-default uk-box-shadow-large"
    >
      <signin-form></signin-form>
    </div>
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
