import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const existingGenre = await this.genreRepository.findOne({
      where: { tmdbId: createGenreDto.tmdbId },
    });

    if (existingGenre) {
      throw new ConflictException('Genre already exists');
    }

    const genre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  async findAll(): Promise<Genre[]> {
    return this.genreRepository.find({
      relations: ['movies'],
    });
  }

  async findOne(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);
    Object.assign(genre, updateGenreDto);
    return this.genreRepository.save(genre);
  }

  async remove(id: number): Promise<void> {
    const genre = await this.findOne(id);
    await this.genreRepository.remove(genre);
  }

  async createMany(genres: CreateGenreDto[]): Promise<Genre[]> {
    const createdGenres: Genre[] = [];

    for (const genreDto of genres) {
      try {
        const genre = await this.create(genreDto);
        createdGenres.push(genre);
      } catch (error) {
        // Skip if genre already exists
        if (error instanceof ConflictException) {
          const existingGenre = await this.genreRepository.findOne({
            where: { tmdbId: genreDto.tmdbId },
          });
          if (existingGenre) {
            createdGenres.push(existingGenre);
          }
        }
      }
    }

    return createdGenres;
  }
}
