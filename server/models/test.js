module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    number: DataTypes.FLOAT,
    text: DataTypes.STRING
  })

  return Test
}
