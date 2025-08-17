import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 1, description: 'Movie ID' })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({ example: 'user123', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 8.5, description: 'Rating value (1-10)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  rating: number;
}
