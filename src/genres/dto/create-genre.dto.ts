import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({ example: 28, description: 'TMDB genre ID' })
  @IsNumber()
  @IsNotEmpty()
  tmdbId: number;

  @ApiProperty({ example: 'Action', description: 'Genre name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
