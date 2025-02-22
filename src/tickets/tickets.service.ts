import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch, Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/user-role.enum';
import { TicketStatusEnum } from '../common/enums/ticket-status-enum';
import { AuditsService } from '../audits/audits.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { processBatchedArray } from '../common/utils/process-batched-array-';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
    private readonly auditsService: AuditsService,
  ) {}

  async createTicket({
    title,
    description,
    status = TicketStatusEnum.CREATED,
    createdBy,
    assignedEmail,
  }): Promise<Number | null> {
    let assignee: User | null = null;

    if (assignedEmail) {
      assignee = await this.userService.getUserByEmailAndRole(assignedEmail, UserRole.ADMIN);

      if (!assignee) {
        throw new NotFoundException('Admin user not found');
      }
    } else {
      assignee = createdBy;
    }

    console.log('assignee', {
      title,
      description,
      status,
      createdBy: createdBy,
      assignedTo: assignee as User,
    });

    const newTicket = this.ticketRepository.create({
      title,
      description,
      status,
      createdBy: createdBy,
      assignedTo: assignee as User,
    });

    const savedTicket = await this.ticketRepository.save(newTicket);

    await this.auditsService.createAuditLog({
      id: savedTicket.id,
      performedBy: createdBy,
      ticket: savedTicket,
      action: status,
    });

    return savedTicket.id;
  }

  async updateTicket({
    id,
    title,
    description,
    status,
    user,
    assignedEmail,
    reasonOfRejection,
  }): Promise<Number | null> {
    let assignee: User | null = null;
    const ticket = await this.ticketRepository
      .createQueryBuilder('tickets')
      .select([
        'tickets.id',
        'tickets.title',
        'tickets.status',
        'tickets.createdAt',
        'createdBy.id',
        'createdBy.email',
        'assignedTo.id',
        'assignedTo.email',
      ])
      .leftJoinAndSelect('tickets.createdBy', 'createdBy')
      .leftJoinAndSelect('tickets.assignedTo', 'assignedTo')
      .where('tickets.id = :id', { id })
      .getOne();

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (user.role === UserRole.USER) {
      if (ticket.createdBy.id !== user.id) {
        throw new ForbiddenException('You are not allowed to update this ticket');
      }

      if (status === TicketStatusEnum.CREATED && !assignedEmail) {
        throw new ForbiddenException('You must provide an assignee for the ticket');
      }

      const forbiddenStatuses = [TicketStatusEnum.APPROVED, TicketStatusEnum.REJECTED];

      if (forbiddenStatuses.includes(status)) {
        throw new ForbiddenException('You are not allowed to approve or reject this ticket');
      }

      if (reasonOfRejection) {
        throw new ForbiddenException('You cannot reject this ticket');
      }

      if (assignedEmail && (!ticket.assignedTo || ticket.assignedTo.email !== assignedEmail)) {
        assignee = await this.userService.getUserByEmailAndRole(assignedEmail, UserRole.ADMIN);
        if (!assignee) {
          throw new NotFoundException('Admin user not found');
        }
      } else {
        assignee = ticket.createdBy;
      }
    } else {
      // automatically sets assigned user to the admin user who updates the ticket
      assignee = user;

      if (status === TicketStatusEnum.REJECTED && !reasonOfRejection) {
        throw new ForbiddenException('You must provide a reason for rejection');
      }

      if (
        (reasonOfRejection && status === TicketStatusEnum.APPROVED) ||
        status === TicketStatusEnum.CREATED
      ) {
        reasonOfRejection = '';
      }
    }

    const result = await this.ticketRepository
      .createQueryBuilder()
      .update(Ticket)
      .set({
        title,
        description,
        rejection_reason: reasonOfRejection,
        status,
        assignedTo: assignee as User,
      })
      .where('id = :id', { id })
      .returning(['id'])
      .execute();

    const updateTicket = result.raw[0];

    await this.auditsService.createAuditLog({
      id: updateTicket.id,
      performedBy: user,
      ticket: updateTicket,
      action: status,
    });

    return result.raw[0];
  }

  async getUserTickets({ userId, page = 1, limit = 10 }) {
    const validatedLimit = Math.min(100, Math.max(1, limit));
    const validatedPage = Math.max(1, page);
    const skip = (validatedPage - 1) * validatedLimit;

    const [tickets, total] = await this.ticketRepository
      .createQueryBuilder('tickets')
      .select([
        'tickets.id',
        'tickets.title',
        'tickets.status',
        'tickets.priority',
        'tickets.createdAt',
        'createdBy.id',
        'createdBy.email',
        'assignedTo.id',
        'assignedTo.email',
      ])
      .leftJoin('tickets.createdBy', 'createdBy')
      .leftJoin('tickets.assignedTo', 'assignedTo')
      .where('tickets.createdBy = :id', { id: userId })
      .skip(skip)
      .take(validatedLimit)
      .getManyAndCount();

    return {
      tickets,
      total,
      page,
      limit,
    };
  }

  async getAssignedTickets({ adminUserId, page = 1, limit = 10 }) {
    const validatedLimit = Math.min(100, Math.max(1, limit));
    const validatedPage = Math.max(1, page);
    const skip = (validatedPage - 1) * validatedLimit;

    const [tickets, total] = await this.ticketRepository
      .createQueryBuilder('tickets')
      .select([
        'tickets.id',
        'tickets.title',
        'tickets.status',
        'tickets.priority',
        'tickets.createdAt',
        'createdBy.id',
        'createdBy.email',
        'assignedTo.id',
        'assignedTo.email',
      ])
      .leftJoin('tickets.createdBy', 'createdBy')
      .leftJoin('tickets.assignedTo', 'assignedTo')
      .where('tickets.assignedTo = :id', { id: adminUserId })
      .orderBy('tickets.priority', 'ASC')
      .addOrderBy('tickets.createdAt', 'DESC')
      .skip(skip)
      .take(validatedLimit)
      .getManyAndCount();

    return {
      tickets,
      total,
      page,
      limit,
    };
  }

  // Runs every hour
  @Cron(CronExpression.EVERY_HOUR)
  async updateTicketPriority() {
    try {
      const BATCH_SIZE = 100;
      const tickets = await this.ticketRepository
        .createQueryBuilder('tickets')
        .select(['tickets.id', 'tickets.priority', 'tickets.createdAt'])
        .where('tickets.status = :status', { status: TicketStatusEnum.CREATED })
        .andWhere(`tickets.created_at < NOW() - INTERVAL '24 hours'`)
        .orderBy('tickets.createdAt', 'ASC')
        .getMany();

      await processBatchedArray(tickets, BATCH_SIZE, this.batchUpdateTickets.bind(this));
    } catch (error) {
      console.log('error', error);
    }
  }

  private async batchUpdateTickets(tickets: Partial<Ticket>[]): Promise<void> {
    const queryRunner = await this.ticketRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const ticket of tickets) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Ticket)
          .set({
            ...ticket,
            priority: 1,
          })
          .where('id = :id', { id: ticket.id })
          .execute();
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
