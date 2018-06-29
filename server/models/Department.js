module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })

  return Department
}
