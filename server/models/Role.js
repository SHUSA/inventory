module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    isSubAdmin: {
      type: DataTypes.BOOLEAN,
      required: true,
      defaultValue: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      required: true,
      defaultValue: false
    },
    isSuperAdmin: {
      type: DataTypes.BOOLEAN,
      required: true,
      defaultValue: false
    }
  })

  Role.associate = function (models) {
    Role.hasMany(models.User)
  }

  return Role
}
