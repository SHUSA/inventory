export default {
  form (vue, text, formRef = 'form') {
    if (vue.$refs[formRef].validate()) {
      vue.alert = false
      vue.loading = true
      if (vue.save) {
        return vue.save()
      } else if (vue.register && formRef === 'regForm') {
        return vue.register()
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
