import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [UsersModule, TicketsModule, ActivitiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
