import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from '../entities/movie.entity';
import { Rating } from '../entities/rating.entity';
import { Watchlist } from '../entities/watchlist.entity';
import { Genre } from '../entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Rating, Watchlist, Genre])],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
