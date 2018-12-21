module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define('Entry', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    currentStock: DataTypes.REAL,
    orderAmount: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })

  Entry.associate = function (models) {
    Entry.belongsTo(models.Order)
    Entry.belongsTo(models.Item)
  }

  return Entry
}
