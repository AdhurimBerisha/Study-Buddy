import { Sequelize } from "sequelize";

let sequelize: Sequelize;

if (process.env.MYSQL_URL) {
  // Use Railway internal connection string if available
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
    },
  });
} else {
  // Fallback for local development or manual env vars
  sequelize = new Sequelize(
    process.env.MYSQLDATABASE ||
      process.env.DB_NAME ||
      process.env.NAME ||
      "railway",
    process.env.MYSQLUSER || process.env.DB_USER || process.env.USER || "root",
    process.env.MYSQLPASSWORD ||
      process.env.DB_PASSWORD ||
      process.env.PASSWORD ||
      "",
    {
      host:
        process.env.MYSQLHOST ||
        process.env.DB_HOST ||
        process.env.HOST ||
        "localhost",
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
      dialect: "mysql",
      logging: false,
      define: {
        timestamps: true,
      },
    }
  );
}

export default sequelize;
