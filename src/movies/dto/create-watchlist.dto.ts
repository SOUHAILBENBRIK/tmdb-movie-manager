import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWatchlistDto {
  @ApiProperty({ example: 1, description: 'Movie ID' })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({ example: 'user123', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: false,
    description: 'Mark as favorite',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}
