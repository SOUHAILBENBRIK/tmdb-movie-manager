import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TmdbService } from './tmdb.service';
import { TmdbController } from './tmdb.controller';
import { MoviesModule } from '../movies/movies.module';
import { GenresModule } from '../genres/genres.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MoviesModule,
    GenresModule,
  ],
  controllers: [TmdbController],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
