import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async CreateUserDto(@Body() credentials: LoginDto): Promise<{ access_token: string }> {
    return await this.authService.login(credentials);
  }
}
