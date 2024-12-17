import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const config = {
  username: process.env.CONFIG_USERNAME || "",
  password: process.env.CONFIG_PASSWORD || "",
  database: process.env.CONFIG_DATABASE || "",
  host: process.env.CONFIG_HOST || "",
  dialect: (process.env.CONFIG_DIALECT as Dialect) || "postgres",
};
let sequelize;
if (config.username || config.password || config.database) {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
} else {
  throw new Error("database variable not exist");
}
export default sequelize;
