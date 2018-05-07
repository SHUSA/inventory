module.exports = (sequelize, DataTypes) => {
  const Assay = sequelize.define('Assay', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    weeklyVolume: DataTypes.TINYINT,
    weeklyRuns: DataTypes.TINYINT,
    controlsPerRun: DataTypes.TINYINT,
    maxBatchSize: DataTypes.INTEGER,
    sampleReplicates: DataTypes.INTEGER
  })

  Assay.associate = function (models) {
  }

  return Assay
}
