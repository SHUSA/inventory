module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    completeDate: DataTypes.DATE,
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })

  Order.associate = function (models) {
    Order.belongsTo(models.Department)
    Order.hasMany(models.Entry)
  }

  return Order
}
