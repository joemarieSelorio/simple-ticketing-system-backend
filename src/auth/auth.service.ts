import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login({email, password}) : Promise<{ access_token: string }> {
    const message = 'Invalid credentials';
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(message);
    }

    const hasSamePassword = await bcrypt.compare(password, user.password);

    if (!hasSamePassword) {
      throw new BadRequestException(message);
    }

    const payload = { id: user.id, username: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
