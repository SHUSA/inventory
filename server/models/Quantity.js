module.exports = (sequelize, DataTypes) => {
  const Quantity = sequelize.define('Quantity', {
    amount: DataTypes.INTEGER,
    updatedAt: DataTypes.DATE
  })

  Quantity.associate = function (models) {
    Quantity.belongsTo(models.Item)
  }

  return Quantity
}
