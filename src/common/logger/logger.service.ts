// src/common/logger/simple-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';

enum LogLevel {
  LOG = 'LOG',
  ERROR = 'ERROR',
  WARN = 'WARN',
  DEBUG = 'DEBUG',
  VERBOSE = 'VERBOSE',
}

@Injectable()
export class LoggingService implements LoggerService {
  /**
   * Format log message with timestamp and context
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';

    return `${timestamp} ${level} ${contextStr}: ${this.stringify(message)}`;
  }

  /**
   * Convert message to a string, handling different types
   */
  private stringify(message: string): string {
    if (message === null || message === undefined) {
      return 'null';
    }

    if (typeof message === 'object') {
      try {
        return JSON.stringify(message, null, 2);
      } catch {
        return message;
      }
    }

    return String(message);
  }

  /**
   * Core logging method
   */
  private print(
    level: LogLevel,
    message: any,
    context?: string,
    ...optionalParams: unknown[]
  ): void {
    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, ...optionalParams);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...optionalParams);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage, ...optionalParams);
        break;
      case LogLevel.VERBOSE:
        console.trace(formattedMessage, ...optionalParams);
        break;
      default:
        console.log(formattedMessage, ...optionalParams);
    }
  }

  /**
   * Implement LoggerService interface methods
   */
  log(message: any, context?: string, ...optionalParams: unknown[]): void {
    this.print(LogLevel.LOG, message, context, ...optionalParams);
  }

  error(message: any, context?: string, ...optionalParams: unknown[]): void {
    this.print(LogLevel.ERROR, message, context, ...optionalParams);
  }

  warn(message: any, context?: string, ...optionalParams: unknown[]): void {
    this.print(LogLevel.WARN, message, context, ...optionalParams);
  }

  debug(message: any, context?: string, ...optionalParams: unknown[]): void {
    this.print(LogLevel.DEBUG, message, context, ...optionalParams);
  }

  verbose(message: any, context?: string, ...optionalParams: unknown[]): void {
    this.print(LogLevel.VERBOSE, message, context, ...optionalParams);
  }
}
