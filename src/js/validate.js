export default {
  form (vue, text) {
    if (vue.$refs.form.validate()) {
      vue.alert = false
      vue.loading = true
      vue.save()
    } else {
      vue.alert = true
      vue.alertMessage = text || 'Please fix errors'
    }
    return vue
  }
}
