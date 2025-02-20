import { LoggingService } from './logger.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class AuthModule {}
