module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {})

  Order.associate = function (models) {
  }

  // possibly use to make order history retrieval easier?

  return Order
}
