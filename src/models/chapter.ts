import { DataTypes, Model } from "sequelize";
import sequelizeInstance from "./index";
import Module from "./module";

class Chapter extends Model {
  public id!: number;
  public module_id!: number;
  public name!: string;
  public isComplete!: boolean;
}

Chapter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "modules",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "Chapter",
    tableName: "chapters",
  }
);

Module.hasMany(Chapter, { foreignKey: "module_id", as: "chapters" });
Chapter.belongsTo(Module, { foreignKey: "module_id", as: "module" });

export default Chapter;
