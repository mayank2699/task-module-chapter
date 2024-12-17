import { Association, DataTypes, Model } from "sequelize";
import sequelizeInstance from "./index";
import Task from "./task";
import Chapter from "./chapter";

class Module extends Model {
  public id!: number;
  public task_id!: number;
  public name!: string;
  public complete_percent!: number;

  public chapters?: Chapter[];

  // Optional: Define associations statically
  public static associations: {
    chapters: Association<Task, Chapter>;
  };
}

Module.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tasks",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete_percent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "Module",
    tableName: "modules",
  }
);

Task.hasMany(Module, { foreignKey: "task_id", as: "modules" });
Module.belongsTo(Task, { foreignKey: "task_id", as: "task" });

export default Module;
