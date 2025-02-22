import { IsOptional, IsBooleanString, IsNumberString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTicketsQueryDto {
  @IsOptional()
  @IsIn(['true', 'false'])
  @ApiPropertyOptional({ description: 'Filter by assigned status', enum: ['true', 'false'] })
  assigned?: string;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page: number;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  limit: number;
}