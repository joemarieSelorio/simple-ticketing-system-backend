import { Injectable} from '@nestjs/common';
import { Repository, InsertResult, UpdateResult } from 'typeorm';
import { InjectRepository} from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async create({email, password, role}): Promise<InsertResult> {

    const existingUser = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already taken');
    }

    const hashedPassword = (await bcrypt.hash(password, 10)) as string;

    return this.usersRepository.insert({
      email,
      password: hashedPassword,
      role
    });
  }
}
