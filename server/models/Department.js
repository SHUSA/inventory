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
      type: DataTypes.STRING
    },
    all: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    Department.hasMany(models.Item)
  }

  return Department
}
