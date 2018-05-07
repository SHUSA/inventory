module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    catalogNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    itemDescription: DataTypes.TEXT,
    reactionsPerItem: DataTypes.INTEGER,
    weeksOfSafetyStock: DataTypes.TINYINT,
    leadTimeDays: DataTypes.TINYINT,
    weeksOfReorder: DataTypes.TINYINT,
    updatedAt: DataTypes.DATE,
    image: DataTypes.BLOB
  })

  Item.associate = function (models) {
    Item.belongsT
  }

  return Item
}
