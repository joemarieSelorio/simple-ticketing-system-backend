import { IsOptional, IsBooleanString, IsNumberString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTicketsQueryDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page: number;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Number of items per page', default: 5 })
  limit: number;
}