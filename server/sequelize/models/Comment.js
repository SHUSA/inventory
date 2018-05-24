module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.TEXT,
    updatedAt: DataTypes.DATE
  })

  Comment.associate = function (models) {
    Comment.belongsTo(models.Item)
  }

  return Comment
}
