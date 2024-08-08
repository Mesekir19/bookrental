"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });
      Book.hasMany(models.Rental, { foreignKey: "bookId", as: "rentals" });
    }
  }

  Book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      category: DataTypes.STRING,
      ownerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Name of the User model/table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      available: DataTypes.BOOLEAN,
      quantity: DataTypes.INTEGER,
      rentPrice: DataTypes.INTEGER,
      cover: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );

  return Book;
};
