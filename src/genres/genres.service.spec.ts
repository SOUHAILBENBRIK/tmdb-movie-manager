/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
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

describe('GenresService', () => {
  let service: GenresService;
  let genreRepo: any;
  let cache: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        { provide: getRepositoryToken(Genre), useFactory: mockRepository },
        { provide: CACHE_MANAGER, useFactory: mockCacheManager },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    genreRepo = module.get(getRepositoryToken(Genre));
    cache = module.get(CACHE_MANAGER);
  });

  describe('create', () => {
    it('should create a new genre', async () => {
      const dto = { tmdbId: 1, name: 'Action' };
      genreRepo.findOne.mockResolvedValue(null);
      genreRepo.create.mockReturnValue(dto);
      genreRepo.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result.id).toBe(1);
      expect(genreRepo.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if genre exists', async () => {
      genreRepo.findOne.mockResolvedValue({ id: 1, tmdbId: '1' });

      await expect(
        service.create({ tmdbId: 1, name: 'Action' }),
      ).rejects.toThrow('Genre already exists');
    });
  });

  describe('findAll', () => {
    it('should return cached genres if present', async () => {
      cache.get.mockResolvedValue([{ id: 1, name: 'Comedy' }]);
      const result = await service.findAll();

      expect(result).toEqual([{ id: 1, name: 'Comedy' }]);
      expect(cache.get).toHaveBeenCalledWith('genres:all');
    });
  });
});
