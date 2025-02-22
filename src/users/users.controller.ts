import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InsertResult } from 'typeorm';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('/')
  async CreateUserDto(@Body() createUserDto: CreateUserDto): Promise<{
    id: Number | null,
    message: string,
  }> {
    const id =  await this.usersService.create(createUserDto);

    return {
      id,
      message: 'User created successfully',
    }
  }
}
