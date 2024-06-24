"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Project, Action }) {
      // define association here
      this.hasMany(Project, {
        foreignKey: "creatorId",
        as: "projects",
      });

      this.belongsToMany(Project, {
        foreignKey: "userId",
        as: "participant",
        through: "participants",
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
  User.init(
    {
      uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING },
      name: { type: DataTypes.STRING, allowNull: false },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      sequelize,
      tableName: "users",
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        },
      },
    }
  );

  User.prototype.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
  };

  return User;
};
