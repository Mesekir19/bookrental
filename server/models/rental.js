"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rental extends Model {
    static associate(models) {
      Rental.belongsTo(models.Book, { foreignKey: "bookId", as: "book" });
      Rental.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  Rental.init(
    {
      userId: DataTypes.INTEGER,
      bookId: DataTypes.INTEGER,
      amount: DataTypes.FLOAT, // Add this line to include the amount field
      status: DataTypes.STRING, // "rented" or "returned"
    },
    {
      sequelize,
      modelName: "Rental",
    }
  );

  return Rental;
};
