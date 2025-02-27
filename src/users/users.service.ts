import { Injectable } from '@nestjs/common';
import { Repository, InsertResult, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async create({ email, password, role }): Promise<Number | null> {
    const existingUser = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already taken');
    }

    const hashedPassword = (await bcrypt.hash(password, 10)) as string;

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    const result = await this.usersRepository.save(newUser);

    return result.id;
  }

  async getUserByEmailAndRole(email: string, role: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .andWhere('users.role = :role', { role })
      .getOne();
  }

  async getUserByRole(role: string = UserRole.ADMIN): Promise<User[] | null> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.role = :role', { role })
      .getMany();
  }
}
