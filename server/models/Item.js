module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: {
      type: DataTypes.STRING,
      required: true
    },
    catalogNumber: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    itemDescription: DataTypes.TEXT,
    reactionsPerItem: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    currentStock: {
      type: DataTypes.REAL,
      defaultValue: 0
    },
    weeksOfSafetyStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    safetyStock: {
      type: DataTypes.REAL,
      defaultValue: 0
    },
    leadTimeDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    weeksOfReorder: {
      type: DataTypes.INTEGER,
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
    lastUpdate: {
      type: DataTypes.DATE,
      defaultValue: Date.now()
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    image: DataTypes.BLOB
  })

  Item.associate = function (models) {
    Item.belongsTo(models.Assay)
    Item.belongsTo(models.Vendor)
  }

  return Item
}
