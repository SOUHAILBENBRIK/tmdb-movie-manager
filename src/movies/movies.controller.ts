import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateRatingDto } from './dto/create-rate.dto';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { MoviesFilterDto } from './dto/movie-filter.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'Movie created successfully.' })
  @ApiResponse({ status: 409, description: 'Movie already exists.' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Movies retrieved successfully.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'genreIds', required: false, type: [Number] })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  findAll(@Query() filterDto: MoviesFilterDto) {
    return this.moviesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @Post('rate')
  @ApiOperation({ summary: 'Rate a movie' })
  @ApiResponse({ status: 201, description: 'Movie rated successfully.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  rateMovie(@Body() createRatingDto: CreateRatingDto) {
    return this.moviesService.rateMovie(createRatingDto);
  }

  @Post('watchlist')
  @ApiOperation({ summary: 'Add movie to watchlist' })
  @ApiResponse({
    status: 201,
    description: 'Movie added to watchlist successfully.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  addToWatchlist(@Body() createWatchlistDto: CreateWatchlistDto) {
    return this.moviesService.addToWatchlist(createWatchlistDto);
  }

  @Delete(':id/watchlist/:userId')
  @ApiOperation({ summary: 'Remove movie from watchlist' })
  @ApiResponse({
    status: 200,
    description: 'Movie removed from watchlist successfully.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found in watchlist.' })
  removeFromWatchlist(
    @Param('id', ParseIntPipe) movieId: number,
    @Param('userId') userId: string,
  ) {
    return this.moviesService.removeFromWatchlist(movieId, userId);
  }
}
