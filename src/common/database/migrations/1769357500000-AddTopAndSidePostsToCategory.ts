import { MigrationInterface, QueryRunner, TableColumn, Table, TableForeignKey } from 'typeorm'

export class AddTopAndSidePostsToCategory1769357500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add top_post_id to post_category
    const table = await queryRunner.getTable('post_category')
    if (table) {
      const hasColumn = table.columns.find((c) => c.name === 'top_post_id')
      if (!hasColumn) {
        await queryRunner.addColumn(
          'post_category',
          new TableColumn({
            name: 'top_post_id',
            type: 'int',
            isNullable: true,
          })
        )
      }

      const hasForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('top_post_id') !== -1)
      if (!hasForeignKey) {
        await queryRunner.createForeignKey(
          'post_category',
          new TableForeignKey({
            columnNames: ['top_post_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'post',
            onDelete: 'SET NULL',
            name: 'FK_post_category_top_post',
          })
        )
      }
    }

    // Create post_category_side_posts table
    const sidePostsTableExists = await queryRunner.hasTable('post_category_side_posts')
    if (!sidePostsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'post_category_side_posts',
          columns: [
            {
              name: 'category_id',
              type: 'int',
              isPrimary: true,
            },
            {
              name: 'post_id',
              type: 'int',
              isPrimary: true,
            },
          ],
          foreignKeys: [
            {
              columnNames: ['category_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'post_category',
              onDelete: 'CASCADE',
            },
            {
              columnNames: ['post_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'post',
              onDelete: 'CASCADE',
            },
          ],
        }),
        true
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sidePostsTableExists = await queryRunner.hasTable('post_category_side_posts')
    if (sidePostsTableExists) {
      await queryRunner.dropTable('post_category_side_posts')
    }

    const table = await queryRunner.getTable('post_category')
    if (table) {
      const hasColumn = table.columns.find((c) => c.name === 'top_post_id')
      if (hasColumn) {
        // Drop FK first
        await queryRunner.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FK_post_category_top_post') THEN
              ALTER TABLE "post_category" DROP CONSTRAINT "FK_post_category_top_post";
            END IF;
          END $$;
        `)
        await queryRunner.dropColumn('post_category', 'top_post_id')
      }
    }
  }
}
