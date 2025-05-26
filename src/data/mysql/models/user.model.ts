import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../mysql-database';

export class UserModel extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
}

const sequelize = MySQLDatabase.getInstance();

UserModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  sequelize,
  timestamps: true,
});
