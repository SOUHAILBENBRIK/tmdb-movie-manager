import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const typeormConfig = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'tmdb_app',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/subscribers/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsTableName: 'migrations',
  migrationsRun: false,
} as DataSourceOptions;

export default registerAs('typeorm', () => typeormConfig);
export const connectionSource = new DataSource(typeormConfig);
