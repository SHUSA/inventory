module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    tableName: {
      type: DataTypes.STRING
    },
    rowId: {
      type: DataTypes.UUID
    },
    changedValues: {
      type: DataTypes.JSONB
    },
    changedBy: {
      type: DataTypes.STRING
    }
  }, {
    createdAt: false
  })

  return History
}
