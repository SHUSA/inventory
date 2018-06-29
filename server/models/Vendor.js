module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define('Vendor', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })

  return Vendor
}
