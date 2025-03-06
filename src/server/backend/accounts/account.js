const { DataTypes } = require("sequelize");
const database = require("../../config/database.js"); // Use the correct reference

const Account = database.define("account", { // Use `database`, not `sequelize`
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "ROLE_USER" } 
}, { timestamps: false });

module.exports = Account;
