import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.NAME!,
  process.env.USER!,
  process.env.PASSWORD!,
  {
    host: process.env.HOST!,
    port: parseInt(process.env.DB_PORT!), // Change from PORT to DB_PORT
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
    },
  }
);

export default sequelize;
