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
  })

  Item.associate = function (models) {
    Item.belongsTo(models.Assay)
    Item.belongsTo(models.Vendor)
  }

  return Item
}
