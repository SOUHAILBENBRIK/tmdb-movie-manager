import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TmdbService } from './tmdb.service';

@ApiTags('tmdb')
@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Post('sync/genres')
  @ApiOperation({ summary: 'Sync genres from TMDB' })
  @ApiResponse({ status: 201, description: 'Genres synced successfully.' })
  syncGenres() {
    return this.tmdbService.syncGenres();
  }

  @Post('sync/popular-movies')
  @ApiOperation({ summary: 'Sync popular movies from TMDB' })
  @ApiResponse({
    status: 201,
    description: 'Popular movies synced successfully.',
  })
  @ApiQuery({
    name: 'pages',
    required: false,
    type: Number,
    description: 'Number of pages to sync (default: 5)',
  })
  syncPopularMovies(@Query('pages') pages?: number) {
    return this.tmdbService.syncPopularMovies(pages || 5);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search movies from TMDB' })
  @ApiResponse({ status: 200, description: 'Movies search results from TMDB.' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
  })
  searchMovies(@Query('q') query: string) {
    return this.tmdbService.searchMovies(query);
  }

  @Get('movie/:tmdbId')
  @ApiOperation({ summary: 'Get movie details from TMDB' })
  @ApiResponse({ status: 200, description: 'Movie details from TMDB.' })
  getMovieDetails(@Param('tmdbId', ParseIntPipe) tmdbId: number) {
    return this.tmdbService.getMovieDetails(tmdbId);
  }
}
