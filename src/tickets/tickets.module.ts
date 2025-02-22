import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { AuditLog } from '../audits/audits.entity';
import { User } from '../users/users.entity';
import { LoggingService } from '../common/logger/logger.service';
import { UsersService } from '../users/users.service';
import { AuditsService } from '../audits/audits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, User, AuditLog])],
  controllers: [TicketsController],
  providers: [TicketsService, LoggingService, UsersService, AuditsService],
})
export class TicketsModule {}
