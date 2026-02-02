import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class CascadeDeleteRoadmaps1770026400000 implements MigrationInterface {
  name = 'CascadeDeleteRoadmaps1770026400000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('roadmap')
    if (!table) {
      return
    }

    const column = table.columns.find(
      (c) => c.name === 'product_id' || c.name === 'productId' || c.name === 'product_idId'
    )
    if (!column) {
      console.log(
        'Columns found:',
        table.columns.map((c) => c.name)
      )
    }
    const columnName = column ? column.name : 'product_id'

    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf(columnName) !== -1)
    if (foreignKey) {
      await queryRunner.dropForeignKey('roadmap', foreignKey)
    }

    await queryRunner.createForeignKey(
      'roadmap',
      new TableForeignKey({
        columnNames: [columnName],
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

    const column = table.columns.find(
      (c) => c.name === 'product_id' || c.name === 'productId' || c.name === 'product_idId'
    )
    const columnName = column ? column.name : 'product_id'

    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf(columnName) !== -1)
    if (foreignKey) {
      await queryRunner.dropForeignKey('roadmap', foreignKey)
    }

    await queryRunner.createForeignKey(
      'roadmap',
      new TableForeignKey({
        columnNames: [columnName],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'SET NULL',
      })
    )
  }
}
