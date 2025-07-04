import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUrlsTable1751668669507 implements MigrationInterface {
  private readonly tableName = 'urls';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'short_id',
            type: 'varchar',
            length: '6',
            isPrimary: true,
          },
          {
            name: 'clicks',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'original_url',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'shortened_url',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expiration_time_in_minutes',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'campaign_uuid',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['campaign_uuid'],
        referencedColumnNames: ['uuid'],
        referencedTableName: 'campaigns',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);
    if (table) {
      for (const foreignKey of table.foreignKeys) {
        await queryRunner.dropForeignKey(this.tableName, foreignKey);
      }
    }

    await queryRunner.dropTable(this.tableName);
  }
}
