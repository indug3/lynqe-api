const { DataTypes } = require("sequelize");
const database = require("../../config/database.js"); // Use correct reference

const User = database.define("user", {  // Changed from account to user
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "ROLE_USER" }
}, { timestamps: false });

module.exports = User;
