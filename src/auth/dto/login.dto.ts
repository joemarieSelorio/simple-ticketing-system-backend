import {  IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({
    example: 'sample@email.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'SamplePassword1234!',
    description: 'The password of the user',
  })
  @IsString()
  password: string;
}