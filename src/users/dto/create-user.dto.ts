import { IsEmail, IsString, IsEnum, isEnum } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: string;
}