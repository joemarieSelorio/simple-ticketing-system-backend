import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

export class GetUsersQueryDto {
  @IsOptional()
  @IsEnum(UserRole, { message: `role must be one of: ${Object.values(UserRole).join(', ')}` })
  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user role' })
  role?: UserRole;
}
