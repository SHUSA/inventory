module.exports = (sequelize, DataTypes) => {
  const Assay = sequelize.define('Assay', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    weeklyVolume: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    weeklyRuns: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    controlsPerRun: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    maxBatchSize: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    sampleReplicates: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })

  Assay.associate = function (models) {
    Assay.belongsTo(models.Department)
  }

  return Assay
}
