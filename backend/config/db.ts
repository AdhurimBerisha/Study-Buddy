// db.ts
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.MYSQL_URL as string, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true, // required for Aiven
    },
  },
  define: {
    timestamps: true,
  },
});

export default sequelize;
