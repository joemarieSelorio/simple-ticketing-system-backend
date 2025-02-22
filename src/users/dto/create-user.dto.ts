import { IsEmail, IsString, IsEnum, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@email.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SamplePassword1234!',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ApiProperty({
    example: 'admin',
    description: 'role of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;
}