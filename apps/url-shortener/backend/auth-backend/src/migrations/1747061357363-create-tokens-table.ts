import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTokensTable1747061357363 implements MigrationInterface {
  private readonly tableName = 'tokens';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'token',
            type: 'integer',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'expires_at',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'user_uuid',
            type: 'uuid',
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
        name: `${this.tableName}_user_uuid_fk`,
        columnNames: ['user_uuid'],
        referencedColumnNames: ['uuid'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey(this.tableName, foreignKey);
      }
    }

    await queryRunner.dropTable(this.tableName);
  }
}
