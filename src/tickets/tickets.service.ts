import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  async createTicket({ title, description, status, createdBy, assignedEmail }) {
    let adminUser: User | null = null;

    if (assignedEmail) {
      adminUser = await this.userRepository
        .createQueryBuilder('users')
        .where('users.email = :email', { email: assignedEmail })
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

  async updateTicket({ id, title, description, status, user, assignedEmail, reasonOfRejection }) {
    let adminUser: User | null = null;

    const ticket = await this.ticketRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.createdBy', 'createdBy')
      .leftJoinAndSelect('tickets.assignedTo', 'assignedTo')
      .where('tickets.id = :id', { id })
      .getOne();

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (user.role !== UserRole.USER) {
      // automatically sets assigned user to the admin user who updates the ticket
      adminUser = user;

      if (status === TicketStatusEnum.REJECTED && !reasonOfRejection) {
        throw new ForbiddenException('You must provide a reason for rejection');
      }
      if (
        status === TicketStatusEnum.APPROVED ||
        (status === TicketStatusEnum.DRAFT && reasonOfRejection)
      ) {
        reasonOfRejection = '';
      }
    } else {
      if (ticket.createdBy.id !== user.id) {
        throw new ForbiddenException('You are not allowed to update this ticket');
      }

      const forbiddenStatuses = [TicketStatusEnum.APPROVED, TicketStatusEnum.REJECTED];

      if (forbiddenStatuses.includes(status)) {
        throw new ForbiddenException('You are not allowed to approve or reject this ticket');
      }

      if (reasonOfRejection) {
        throw new ForbiddenException('You cannot reject this ticket');
      }

      if (assignedEmail && (!ticket.assignedTo || ticket.assignedTo.email !== assignedEmail)) {
        adminUser = await this.userRepository
          .createQueryBuilder('users')
          .where('users.email = :email', { email: assignedEmail })
          .andWhere('users.role = :role', { role: UserRole.ADMIN })
          .getOne();
        if (!adminUser) {
          throw new NotFoundException('Admin user not found');
        }
      }
    }

    console.log('adminUser', JSON.stringify({
      title,
      description,
      rejection_reason: reasonOfRejection,
      status,
      ...{ ...(adminUser && { assignedTo: adminUser }) },
    }));

    return await this.ticketRepository.update(id, {
      title,
      description,
      rejection_reason: reasonOfRejection,
      status,
      ...{ ...(adminUser && { assignedTo: adminUser }) },
    });
  }
}
