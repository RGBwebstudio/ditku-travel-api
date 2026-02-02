import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class CascadeDeleteRoadmaps1770026400000 implements MigrationInterface {
  name = 'CascadeDeleteRoadmaps1770026400000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('roadmap')
    if (!table) {
      return
    }

    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('product_id') !== -1)
    if (foreignKey) {
      await queryRunner.dropForeignKey('roadmap', foreignKey)
    }

    await queryRunner.createForeignKey(
      'roadmap',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('roadmap')
    if (!table) {
      return
    }
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('product_id') !== -1)
    if (foreignKey) {
      await queryRunner.dropForeignKey('roadmap', foreignKey)
    }

    await queryRunner.createForeignKey(
      'roadmap',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'SET NULL',
      })
    )
  }
}
