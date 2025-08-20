/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MoviesService } from '../movies/movies.service';
import { GenresService } from '../genres/genres.service';

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  poster_path: string;
  backdrop_path: string;
  genre_ids: number[];
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

interface TmdbGenreResponse {
  genres: TmdbGenre[];
}

@Injectable()
export class TmdbService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TmdbService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly moviesService: MoviesService,
    private readonly genresService: GenresService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
    this.baseUrl = this.configService.get<string>(
      'TMDB_BASE_URL',
      'https://api.themoviedb.org/3',
    );
  }

  async onApplicationBootstrap() {
    this.logger.log('Bootstrapping TMDB sync...');

    // Run only on first launch or always depending on your needs
    try {
      await this.syncGenres();
      await this.syncPopularMovies(5);
      this.logger.log('Initial TMDB sync completed');
    } catch (error) {
      this.logger.error('Initial TMDB sync failed', error);
    }
  }

  async syncGenres(): Promise<void> {
    try {
      this.logger.log('Starting genres sync from TMDB...');

      const response = await firstValueFrom(
        this.httpService.get<TmdbGenreResponse>(
          `${this.baseUrl}/genre/movie/list`,
          {
            params: { api_key: this.apiKey },
          },
        ),
      );

      const genresData = response.data.genres.map((genre) => ({
        tmdbId: genre.id,
        name: genre.name,
      }));

      await this.genresService.createMany(genresData);

      this.logger.log(`Successfully synced ${genresData.length} genres`);
    } catch (error) {
      this.logger.error('Failed to sync genres from TMDB', error);
      throw error;
    }
  }

  async syncPopularMovies(pages: number = 5): Promise<void> {
    try {
      this.logger.log(
        `Starting popular movies sync from TMDB (${pages} pages)...`,
      );

      // First, sync genres to ensure they exist
      await this.syncGenres();

      let totalMoviesSynced = 0;

      for (let page = 1; page <= pages; page++) {
        const response = await firstValueFrom(
          this.httpService.get<TmdbResponse>(`${this.baseUrl}/movie/popular`, {
            params: { api_key: this.apiKey, page },
          }),
        );

        const movies = response.data.results;

        for (const movie of movies) {
          try {
            await this.moviesService.create({
              tmdbId: movie.id,
              title: movie.title,
              overview: movie.overview,
              releaseDate: movie.release_date,
              voteAverage: movie.vote_average,
              voteCount: movie.vote_count,
              posterPath: movie.poster_path,
              backdropPath: movie.backdrop_path,
              genreIds: movie.genre_ids,
            });
            totalMoviesSynced++;
          } catch (error) {
            if (error.status !== 409) {
              this.logger.warn(
                `Failed to create movie: ${movie.title}`,
                error.message,
              );
            }
          }
        }

        this.logger.log(`Processed page ${page}/${pages}`);
      }

      this.logger.log(`Successfully synced ${totalMoviesSynced} new movies`);
    } catch (error) {
      this.logger.error('Failed to sync popular movies from TMDB', error);
      throw error;
    }
  }

  async searchMovies(query: string): Promise<TmdbMovie[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbResponse>(`${this.baseUrl}/search/movie`, {
          params: { api_key: this.apiKey, query },
        }),
      );

      return response.data.results;
    } catch (error) {
      this.logger.error(`Failed to search movies from TMDB: ${query}`, error);
      throw error;
    }
  }

  async getMovieDetails(tmdbId: number): Promise<TmdbMovie> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMovie>(`${this.baseUrl}/movie/${tmdbId}`, {
          params: { api_key: this.apiKey },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get movie details from TMDB: ${tmdbId}`,
        error,
      );
      throw error;
    }
  }
}
