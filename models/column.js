"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Column extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Project, Task }) {
      // define association here
      this.belongsTo(Project, {
        foreignKey: "projectId",
      });

      this.hasMany(Task, {
        foreignKey: "columnId",
        as: "tasks",
      });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  Column.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      order: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      tableName: "columns",
      modelName: "Column",
    }
  );
  return Column;
};
