module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    location: {
      type: DataTypes.STRING,
      required: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })

  Department.associate = function (models) {
    Department.hasMany(models.Order)
    Department.hasMany(models.Assay)
    Department.hasMany(models.User)
  }

  return Department
}
