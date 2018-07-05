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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })

  return Department
}
