function setLongCat (deptId, name) {
  return `${deptId}-${name}`
}

function setCatalog (vendor) {
  if (vendor.name && vendor.DepartmentId) {
    let name = vendor.name.replace(/ /g, '').toUpperCase()
    vendor.vendorCatalog = setLongCat(vendor.DepartmentId, name)
  }
  return vendor
}

module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define('Vendor', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING
    },
    vendorCatalog: {
      type: DataTypes.STRING,
      unique: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCreate: function (vendor) {
        return setCatalog(vendor)
      },
      beforeUpdate: function (vendor) {
        return setCatalog(vendor)
      },
      beforeBulkUpdate: function (vendor) {
        let vendorAttr = vendor.attributes
        setCatalog(vendorAttr)
        return vendor
      }
    }
  })

  Vendor.associate = function (models) {
    Vendor.hasMany(models.Item)
    Vendor.belongsTo(models.Department)
  }

  return Vendor
}
