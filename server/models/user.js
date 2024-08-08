"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Book, { foreignKey: "ownerId", as: "books" });
      User.hasMany(models.Rental, { foreignKey: "userId", as: "rentals" });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING, // "admin", "owner", or "customer"
      isApproved: DataTypes.BOOLEAN, // Approval status
      walletBalance: DataTypes.INTEGER, // Wallet balance for the owner
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
