import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController } from './audits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../audits/audits.entity';
import { LoggingService } from '../common/logger/logger.service';

@Module({
   imports: [
      TypeOrmModule.forFeature([AuditLog]),
    ],
  controllers: [AuditsController],
  providers: [AuditsService, LoggingService],
})
export class AuditsModule {}
