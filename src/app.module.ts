import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { ActivitiesModule } from './activities/activities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { AuditLog } from './audits/audits.entity';
import { Ticket } from './tickets/ticket.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggingService } from './common/logger/logger.service';
import { AuditsModule } from './audits/audits.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Ticket, AuditLog],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User, Ticket, AuditLog]),
    UsersModule,
    TicketsModule,
    ActivitiesModule,
    AuthModule,
    AuditsModule,
  ],
  controllers: [],
  providers: [LoggingService],
})
export class AppModule {}
