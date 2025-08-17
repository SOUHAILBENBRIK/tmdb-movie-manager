import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Rating } from '../entities/rating.entity';
import { Watchlist } from '../entities/watchlist.entity';
import { Genre } from '../entities/genre.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateRatingDto } from './dto/create-rate.dto';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { MoviesFilterDto } from './dto/movie-filter.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genreIds, ...movieData } = createMovieDto;

    // Check if movie with tmdbId already exists
    const existingMovie = await this.movieRepository.findOne({
      where: { tmdbId: movieData.tmdbId },
    });

    if (existingMovie) {
      throw new ConflictException('Movie already exists');
    }

    const movie = this.movieRepository.create(movieData);

    if (genreIds && genreIds.length > 0) {
      const genres = await this.genreRepository.findByIds(genreIds);
      movie.genres = genres;
    }

    return this.movieRepository.save(movie);
  }

  async findAll(
    filterDto: MoviesFilterDto,
  ): Promise<{ movies: Movie[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      genreIds,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const queryBuilder: SelectQueryBuilder<Movie> = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .leftJoinAndSelect('movie.ratings', 'rating')
      .leftJoinAndSelect('movie.watchlists', 'watchlist');

    // Search functionality
    if (search) {
      queryBuilder.andWhere(
        'movie.title LIKE :search OR movie.overview LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    // Genre filtering
    if (genreIds && genreIds.length > 0) {
      queryBuilder.andWhere('genre.id IN (:...genreIds)', { genreIds });
    }

    // Sorting
    queryBuilder.orderBy(`movie.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [movies, total] = await queryBuilder.getManyAndCount();

    return { movies, total };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['genres', 'ratings', 'watchlists'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const { genreIds, ...movieData } = updateMovieDto;

    const movie = await this.findOne(id);

    Object.assign(movie, movieData);

    if (genreIds && genreIds.length > 0) {
      const genres = await this.genreRepository.findByIds(genreIds);
      movie.genres = genres;
    }

    return this.movieRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }

  async rateMovie(createRatingDto: CreateRatingDto): Promise<Rating> {
    const { movieId, userId, rating } = createRatingDto;

    const movie = await this.findOne(movieId);

    // Check if user has already rated this movie
    let existingRating = await this.ratingRepository.findOne({
      where: { userId, movie: { id: movieId } },
      relations: ['movie'],
    });

    if (existingRating) {
      existingRating.rating = rating;
      await this.ratingRepository.save(existingRating);
    } else {
      existingRating = this.ratingRepository.create({
        userId,
        rating,
        movie,
      });
      await this.ratingRepository.save(existingRating);
    }

    // Update movie's average rating
    await this.updateMovieRating(movieId);

    return existingRating;
  }

  async addToWatchlist(
    createWatchlistDto: CreateWatchlistDto,
  ): Promise<Watchlist> {
    const { movieId, userId, isFavorite } = createWatchlistDto;

    const movie = await this.findOne(movieId);

    // Check if already in watchlist
    let watchlistEntry = await this.watchlistRepository.findOne({
      where: { userId, movie: { id: movieId } },
      relations: ['movie'],
    });

    if (watchlistEntry) {
      watchlistEntry.isFavorite = isFavorite ?? watchlistEntry.isFavorite;
      return this.watchlistRepository.save(watchlistEntry);
    }

    watchlistEntry = this.watchlistRepository.create({
      userId,
      movie,
      isFavorite: isFavorite ?? false,
    });

    return this.watchlistRepository.save(watchlistEntry);
  }

  async removeFromWatchlist(movieId: number, userId: string): Promise<void> {
    const watchlistEntry = await this.watchlistRepository.findOne({
      where: { userId, movie: { id: movieId } },
    });

    if (!watchlistEntry) {
      throw new NotFoundException('Movie not found in watchlist');
    }

    await this.watchlistRepository.remove(watchlistEntry);
  }

  private async updateMovieRating(movieId: number): Promise<void> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avg')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.movieId = :movieId', { movieId })
      .getRawOne();

    await this.movieRepository.update(movieId, {
      averageRating: parseFloat(result.avg) || 0,
      ratingCount: parseInt(result.count) || 0,
    });
  }
}
