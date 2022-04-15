'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate({User, FavouritePost }) {
      // this.belongsTo(User, { foreignKey: 'userId' });
      // this.hasMany(FavouritePost, { foreignKey: 'postId', as:'favouritePost'})
    // }
  }
  Post.init({
    userId: DataTypes.INTEGER,
    post: DataTypes.STRING
  }, {
    sequelize,
    tableName:"posts",
    modelName: 'Post',
  });
  return Post;
};