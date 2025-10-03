import { Sequelize } from "sequelize";

let sequelize: Sequelize;

if (process.env.MYSQL_URL) {
  // If you provide a full connection string
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
    },
  });
} else {
  // Using separate env vars from .env
  sequelize = new Sequelize(
    process.env.MYSQL_DB || "studybuddy", // database name
    process.env.MYSQL_USER || "root", // username
    process.env.MYSQL_PASSWORD || "", // password
    {
      host: process.env.MYSQL_HOST || "localhost",
      port: parseInt(process.env.MYSQL_PORT || "3306"), // default MySQL port
      dialect: "mysql",
      logging: false,
      define: {
        timestamps: true,
      },
    }
  );
}

export default sequelize;
