import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { AuditActions } from '../../common/enums/audit-actions-enum';

export class CreateAuditTable1740193850960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ticket_id',
            type: 'int',
          },
          {
            name: 'action',
            type: 'enum',
            enum:[
                AuditActions.CREATED,
                AuditActions.SUBMITTED,
                AuditActions.UPDATE,
                AuditActions.APPROVED,
                AuditActions.REJECTED,
            ],
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          }
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_logs');
  }
}
