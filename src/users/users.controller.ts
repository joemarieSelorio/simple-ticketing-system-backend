import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('/')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  async CreateUserDto(@Body() createUserDto: CreateUserDto): Promise<{
    id: Number | null;
    message: string;
  }> {
    const id = await this.usersService.create(createUserDto);

    return {
      id,
      message: 'User created successfully',
    };
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('/')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  async getUsers(
    @Query() query: GetUsersQueryDto
  ): Promise<{
    users: any;
    message: string;
  }> {
    const { role } = query;
    const users = await this.usersService.getUserByRole(role);

    return {
      users,
      message: 'Users fetched successfully',
    };
  }
}
