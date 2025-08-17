import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 550, description: 'TMDB movie ID' })
  @IsNumber()
  @IsNotEmpty()
  tmdbId: number;

  @ApiProperty({ example: 'Fight Club', description: 'Movie title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A ticking-time-bomb insomniac...',
    description: 'Movie overview',
    required: false,
  })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiProperty({
    example: '1999-10-15',
    description: 'Release date',
    required: false,
  })
  @IsString()
  @IsOptional()
  releaseDate?: string;

  @ApiProperty({
    example: 8.8,
    description: 'TMDB vote average',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  voteAverage?: number;

  @ApiProperty({
    example: 26280,
    description: 'TMDB vote count',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  voteCount?: number;

  @ApiProperty({
    example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    description: 'Poster path',
    required: false,
  })
  @IsString()
  @IsOptional()
  posterPath?: string;

  @ApiProperty({
    example: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
    description: 'Backdrop path',
    required: false,
  })
  @IsString()
  @IsOptional()
  backdropPath?: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of genre IDs',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  genreIds?: number[];
}
