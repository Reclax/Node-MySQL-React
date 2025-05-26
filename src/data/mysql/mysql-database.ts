import { Sequelize } from 'sequelize';
import { envs } from '../../config/envs';

export class MySQLDatabase {
  private static instance: Sequelize;

  static getInstance(): Sequelize {
    if (!MySQLDatabase.instance) {
      MySQLDatabase.instance = new Sequelize(
        String(envs.MYSQL_DB),
        String(envs.MYSQL_USER),
        String(envs.MYSQL_PASSWORD),
        {
          host: String(envs.MYSQL_HOST),
          port: Number(envs.MYSQL_PORT),
          dialect: 'mysql',
          logging: false,
        }
      );
    }
    return MySQLDatabase.instance;
  }
}
