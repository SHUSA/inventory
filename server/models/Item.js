module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    catalogNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    itemDescription: DataTypes.TEXT,
    reactionsPerItem: DataTypes.INTEGER,
    // create quantity history model instead
    quantityOnHand: DataTypes.INTEGER,
    weeksOfSafetyStock: DataTypes.TINYINT,
    leadTimeDays: DataTypes.TINYINT,
    weeksOfReorder: DataTypes.TINYINT,
    // create comment history model instead
    comments: {
      type: DataTypes.TEXT,
      autoIncrement: true,
      updatedAt: DataTypes.DATE
    },
    updatedAt: DataTypes.DATE,
    image: DataTypes.BLOB
  })

  // Item.belongsToMany

  return Item
}