/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { Rating } from '../entities/rating.entity';
import { Watchlist } from '../entities/watchlist.entity';
import { Genre } from '../entities/genre.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  findByIds: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockCacheManager = () => ({
  get: jest.fn(),
  set: jest.fn(),
});

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepo: any;
  let genreRepo: any;
  let cache: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useFactory: mockRepository },
        { provide: getRepositoryToken(Rating), useFactory: mockRepository },
        { provide: getRepositoryToken(Watchlist), useFactory: mockRepository },
        { provide: getRepositoryToken(Genre), useFactory: mockRepository },
        { provide: CACHE_MANAGER, useFactory: mockCacheManager },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepo = module.get(getRepositoryToken(Movie));
    genreRepo = module.get(getRepositoryToken(Genre));
    cache = module.get(CACHE_MANAGER);
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const dto = { tmdbId: '123', title: 'Test Movie', genreIds: [1] };
      movieRepo.findOne.mockResolvedValue(null);
      movieRepo.create.mockReturnValue(dto);
      genreRepo.findByIds.mockResolvedValue([{ id: 1, name: 'Action' }]);
      movieRepo.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto as any);

      expect(movieRepo.findOne).toHaveBeenCalledWith({
        where: { tmdbId: '123' },
      });
      expect(movieRepo.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('should throw ConflictException if movie exists', async () => {
      movieRepo.findOne.mockResolvedValue({ id: 1, tmdbId: '123' });

      await expect(
        service.create({ tmdbId: '123', title: 'Dup Movie' } as any),
      ).rejects.toThrow('Movie already exists');
    });
  });

  describe('findAll', () => {
    it('should return cached movies if cache exists', async () => {
      cache.get.mockResolvedValue({ movies: [], total: 0 });
      const result = await service.findAll({} as any);

      expect(result).toEqual({ movies: [], total: 0 });
      expect(cache.get).toHaveBeenCalled();
    });
  });
});
