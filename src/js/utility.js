export default {
  outstandingAssays (vue) {
    let obj = {}
    vue.supplies.map(item => {
      vue.recentlyUpdated(item)
      // check if assay object is attached and make sure it's not a duplicate
      let assayName = item.Assay.name
      // create object for each assay in supplies
      if (!obj.hasOwnProperty(assayName)) {
        obj[assayName] = {}
        obj[assayName].count = 0
        obj[assayName].recentlyUpdated = item.recentlyUpdated
      }
      // count number of outstanding items with same assay name
      if (!item.recentlyUpdated) obj[assayName].count += 1
    })

    let arr = []
    Object.keys(obj).forEach((key, i) => {
      arr.push({
        name: key,
        count: obj[key].count,
        recentlyUpdated: obj[key].recentlyUpdated
      })
    })

    return arr.sort((a, b) => a.name.localeCompare(b.name, 'en', { 'sensitivity': 'base' }))
  }
}
