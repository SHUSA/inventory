module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    createDate: {
      type: DataTypes.DATE,
      defaultValue: Date.now()
    },
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
