import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from '../users/users.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { TicketStatusEnum } from '../common/enums/ticket-status-enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createTicket({ title, description, status, createdBy, assignedAdminEmail }) {
    let adminUser: User | null = null;

    if (assignedAdminEmail) {
      adminUser = await this.userRepository
        .createQueryBuilder('users')
        .where('users.email = :email', { email: assignedAdminEmail})
        .andWhere('users.role = :role', { role: UserRole.ADMIN })
        .getOne();

      if (!adminUser) {
        throw new NotFoundException('Admin user not found');
      }
    }

    return await this.ticketRepository.insert({
      title,
      description,
      ...{ ...(adminUser && { status }) },
      createdBy: createdBy,
      assignedTo: adminUser as User,
    });
  }
}
