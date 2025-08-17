import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({ status: 201, description: 'Genre created successfully.' })
  @ApiResponse({ status: 409, description: 'Genre already exists.' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, description: 'Genres retrieved successfully.' })
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by ID' })
  @ApiResponse({ status: 200, description: 'Genre retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a genre' })
  @ApiResponse({ status: 200, description: 'Genre updated successfully.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a genre' })
  @ApiResponse({ status: 200, description: 'Genre deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}
