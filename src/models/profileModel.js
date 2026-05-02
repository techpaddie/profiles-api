const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender_probability: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    sample_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    age_group: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country_probability: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "profiles",
    timestamps: false
  }
);

module.exports = Profile;
