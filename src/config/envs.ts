import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  MYSQL_DB: process.env.MYSQL_DB || 'auth_db',
  MYSQL_USER: process.env.MYSQL_USER || 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
  MYSQL_PORT: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  JWT_SEED: process.env.JWT_SEED || 'defaultsecret', // <--- agrega esta línea
};

