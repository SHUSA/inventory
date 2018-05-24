module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define('Vendor', {
    longName: DataTypes.STRING,
    shortName: DataTypes.STRING
  })

  Vendor.associate = function (models) {
  }

  return Vendor
}
