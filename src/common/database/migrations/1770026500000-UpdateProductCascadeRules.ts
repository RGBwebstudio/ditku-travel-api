import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class UpdateProductCascadeRules1770026500000 implements MigrationInterface {
  name = 'UpdateProductCascadeRules1770026500000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.updateForeignKey(queryRunner, 'product', 'parent_id', 'product', 'CASCADE')

    await this.updateForeignKey(queryRunner, 'product', 'category_id', 'category', 'CASCADE')

    await this.updateForeignKey(queryRunner, 'product_posts', 'product_id', 'product', 'CASCADE')
    await this.updateForeignKey(queryRunner, 'product_posts', 'post_id', 'post', 'CASCADE')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.updateForeignKey(queryRunner, 'product', 'parent_id', 'product', 'SET NULL')
    await this.updateForeignKey(queryRunner, 'product', 'category_id', 'category', 'SET NULL')
  }

  private async updateForeignKey(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
    referencedTable: string,
    onDelete: string
  ) {
    const table = await queryRunner.getTable(tableName)
    if (!table) {
      console.log(`Table ${tableName} not found, skipping FK update for ${columnName}`)
      return
    }

    const existingFk = table.foreignKeys.find((fk) => fk.columnNames.indexOf(columnName) !== -1)
    if (existingFk) {
      await queryRunner.dropForeignKey(tableName, existingFk)
    }

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: [columnName],
        referencedColumnNames: ['id'],
        referencedTableName: referencedTable,
        onDelete: onDelete,
      })
    )
  }
}
