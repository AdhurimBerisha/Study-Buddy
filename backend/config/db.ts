import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.NAME!,
  process.env.USER!,
  process.env.PASSWORD!,
  {
    host: process.env.HOST!,
    port: parseInt(process.env.PORT!),
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
    },
  }
);

export default sequelize;
