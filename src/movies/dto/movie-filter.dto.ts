import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class MoviesFilterDto {
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 20,
    description: 'Number of items per page',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({
    example: 'fight club',
    description: 'Search term',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of genre IDs to filter by',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  @IsNumber({}, { each: true })
  genreIds?: number[];

  @ApiProperty({
    example: 'createdAt',
    description: 'Field to sort by',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    example: 'DESC',
    description: 'Sort order',
    enum: SortOrder,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
