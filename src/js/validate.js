export default {
  form (vue, text) {
    if (vue.$refs.form.validate()) {
      vue.alert = false
      vue.loading = true
      if (vue.save) {
        return vue.save()
      } else {
        return vue.login()
      }
    } else {
      vue.alert = true
      vue.alertMessage = text || 'Please fix errors'
    }
    return vue
  }
}
