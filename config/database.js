require("dotenv").config();
const Sequelize = require("sequelize");
const mysql2 = require("mysql2");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT, // You can use 'mysql', 'postgres', 'sqlite', or 'mssql'
    dialectModule: mysql2,
    port: process.env.DB_PORT,
    logging: false, // Disable SQL query logging (optional)
  }
);
module.exports = sequelize;
