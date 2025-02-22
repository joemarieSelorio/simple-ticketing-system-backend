import { MigrationInterface, QueryRunner, TableForeignKey, Table } from 'typeorm';

export class CreateAuditTableLinks1740195548806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        columnNames: ['ticket_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tickets',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const auditTable = (await queryRunner.getTable('audit_logs')) as Table;
    const auditForeignKeys = auditTable.foreignKeys;
    await queryRunner.dropForeignKeys(auditTable, auditForeignKeys);
  }
}

