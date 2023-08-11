import { DataTypes, Model } from "sequelize";
import { compareSync } from "../../util/encrypt";
import sequelizeConnection from "../connection";

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;

  public status!: boolean;
  public has_changed_password!: boolean;

  // timestamps!
  public readonly created_at!: Date;
  public readonly last_updated!: Date;

  static validPassword: (password: string, hash: string) => boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    date_of_birth: {
      type: DataTypes.DATE,
    },
    background_color: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    has_changed_password: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.TINYINT,
      defaultValue: 2,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    }
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "last_updated",
  }
);

User.validPassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};

export default User;
