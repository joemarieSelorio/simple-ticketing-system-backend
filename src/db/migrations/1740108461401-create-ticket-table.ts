import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TicketStatusEnum } from '../../common/enums/ticket-status-enum';

export class CreateTicketTable1740108461401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tickets',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'title',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              TicketStatusEnum.REQUESTED,
              TicketStatusEnum.DRAFT,
              TicketStatusEnum.REJECTED,
              TicketStatusEnum.APPROVED,
            ],
            default: `'${TicketStatusEnum.DRAFT}'`,
          },
          {
            name: 'created_by_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'assigned_to_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tickets');
  }
}

