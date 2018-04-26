module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    number: DataTypes.FLOAT,
    text: DataTypes.STRING,
    json: DataTypes.JSON
  })

  return Test
}
