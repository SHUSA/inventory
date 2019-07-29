function setLongCat (deptId, catNum) {
  return `${deptId}-${catNum}`
}

function setCatalog (item) {
  if (item.catalogNumber && item.DepartmentId) {
    item.catalogNumber = item.catalogNumber.toUpperCase()
    item.longCatalog = setLongCat(item.DepartmentId, item.catalogNumber)
  }
  return item
}

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      required: true
    },
    catalogNumber: {
      type: DataTypes.STRING,
      required: true
    },
    longCatalog: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    itemDescription: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    reactionsPerItem: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    currentStock: {
      type: DataTypes.REAL,
      defaultValue: 0
    },
    baseWeeks: {
      type: DataTypes.REAL,
      defaultValue: 4
    },
    weeksOfSafetyStock: {
      type: DataTypes.REAL,
      defaultValue: 0
    },
    safetyStock: {
      type: DataTypes.REAL,
      defaultValue: 0
    },
    leadTimeDays: {
      type: DataTypes.REAL,
      defaultValue: 0
    },
    weeksOfReorder: {
      type: DataTypes.REAL,
      defaultValue: 0
    },
    reorderPoint: {
      type: DataTypes.REAL,
      defaultValue: 0
    },
    reorderQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    comment: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    image: DataTypes.BLOB
  }, {
    hooks: {
      beforeCreate: function (item) {
        return setCatalog(item)
      },
      beforeUpdate: function (item) {
        return setCatalog(item)
      },
      beforeBulkUpdate: function (item) {
        let itemAttr = item.attributes
        setCatalog(itemAttr)
        return item
      }
    }
  })

  Item.associate = function (models) {
    Item.belongsTo(models.Assay)
    Item.belongsTo(models.Vendor)
    Item.belongsTo(models.Department)
  }

  return Item
}
