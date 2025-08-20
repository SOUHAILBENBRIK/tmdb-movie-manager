import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import typeormConfig from './typeorm.config';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { TmdbModule } from './tmdb/tmdb.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...typeormConfig(),
        autoLoadEntities: true,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        ttl: 60, // default cache 60s
      }),
    }),
    HttpModule.register({
      global: true,
    }),
    MoviesModule,
    GenresModule,
    TmdbModule,
  ],
})
export class AppModule {}
