import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import typeormConfig from './typeorm.config';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { TmdbModule } from './tmdb/tmdb.module';

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
    HttpModule.register({
      global: true,
    }),
    MoviesModule,
    GenresModule,
    TmdbModule,
    SeedModule,
  ],
})
export class AppModule {}
