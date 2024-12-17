import { Association, DataTypes, Model } from "sequelize";
import sequelizeInstance from "./index";
import Module from "./module";

class Task extends Model {
  public id!: number;
  public name!: string;
  public complete_percent!: number;

  public modules?: Module[];

  // Optional: Define associations statically
  public static associations: {
    modules: Association<Task, Module>;
  };
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    modelName: "Task",
    tableName: "tasks", // Consistent with references in Module
  }
);

Task.hasMany(Module, { foreignKey: "task_id", as: "modules" });

export default Task;
