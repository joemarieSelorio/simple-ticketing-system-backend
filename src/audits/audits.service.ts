import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './audits.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AuditsService {
  constructor(@InjectRepository(AuditLog) private readonly auditRepository: Repository<AuditLog>) {}


  async createAuditLog(data: Partial<AuditLog>) { 
    return await this.auditRepository.insert(data);
  }

  async getAuditLogs({userId, role, page = 1, limit = 10}) {
    const validatedLimit = Math.min(100, Math.max(1, limit));
    const validatedPage = Math.max(1, page);
    const skip = (validatedPage - 1) * validatedLimit;

    let total = 0;
    let auditLogs: AuditLog[] = [];

    if(role !== UserRole.ADMIN) {
      const [result, totalCount] = await this.auditRepository
      .createQueryBuilder('audit_logs')
      .select([
        'audit_logs.id',
        'audit_logs.action',
        'audit_logs.createdAt',
        'performedBy.id',
        'performedBy.email',
        'ticket',
      ])
      .leftJoin('audit_logs.performedBy', 'performedBy')
      .leftJoin('audit_logs.ticket', 'ticket')
      .where('audit_logs.performedBy = :id', { id: userId })
      .skip(skip)
      .take(validatedLimit)
      .getManyAndCount();

      auditLogs = result;
      total = totalCount;

    } else {
      const [result, totalCount] = await this.auditRepository
      .createQueryBuilder('audit_logs')
      .select([
        'audit_logs.id',
        'audit_logs.action',
        'audit_logs.createdAt',
        'performedBy.id',
        'performedBy.email',
        'ticket',
      ])
      .leftJoin('audit_logs.performedBy', 'performedBy')
      .leftJoin('audit_logs.ticket', 'ticket')
      .skip(skip)
      .take(validatedLimit)
      .getManyAndCount();

      auditLogs = result;
      total = totalCount;
    }

    return {
      auditLogs,
      total,
      page,
      limit,
    }
  }
}
