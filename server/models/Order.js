module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    completeDate: DataTypes.DATE,
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })

  Order.associate = function (models) {
    Order.belongsTo(models.Department)
  }

  return Order
}
