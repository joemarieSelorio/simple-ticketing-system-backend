import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserTicketLink1740115204440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'tickets',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
        'tickets',
        new TableForeignKey({
          columnNames: ['assigned_to_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const ticketTable = await queryRunner.getTable('tickets') as Table;
    const ticketForeignKeys = ticketTable.foreignKeys;
    await queryRunner.dropForeignKeys(ticketTable, ticketForeignKeys);
  }
}

