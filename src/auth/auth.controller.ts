import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiResponse, ApiOperation} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  async CreateUserDto(@Body() credentials: LoginDto): Promise<{ access_token: string }> {
    return await this.authService.login(credentials);
  }
}
