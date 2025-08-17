import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT') || '3306', 10) || 3306,
  username: configService.get('DB_USERNAME') || 'root',
  password: configService.get('DB_PASSWORD') || 'password',
  database: configService.get('DB_NAME') || 'tmdb_app',
  synchronize: configService.get('NODE_ENV') !== 'production', // Only for development
  logging: configService.get('NODE_ENV') === 'development',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/subscribers/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
