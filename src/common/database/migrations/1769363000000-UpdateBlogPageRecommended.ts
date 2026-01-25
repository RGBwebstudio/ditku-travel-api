import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class UpdateBlogPageRecommended1769363000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('blog_page', 'top_post_id')
    if (!hasColumn) {
      await queryRunner.addColumn(
        'blog_page',
        new TableColumn({
          name: 'top_post_id',
          type: 'int',
          isNullable: true,
        })
      )

      await queryRunner.createForeignKey(
        'blog_page',
        new TableForeignKey({
          columnNames: ['top_post_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'post',
          onDelete: 'SET NULL',
        })
      )
    }

    const hasOldTable = await queryRunner.hasTable('blog_page_recommended_posts')
    const hasNewTable = await queryRunner.hasTable('blog_page_side_posts')

    if (hasOldTable && !hasNewTable) {
      await queryRunner.renameTable('blog_page_recommended_posts', 'blog_page_side_posts')
    } else if (!hasOldTable && !hasNewTable) {
      await queryRunner.query(`
        CREATE TABLE "blog_page_side_posts" (
          "blog_page_id" integer NOT NULL,
          "post_id" integer NOT NULL,
          CONSTRAINT "PK_blog_page_side_posts" PRIMARY KEY ("blog_page_id", "post_id")
        )
      `)
      await queryRunner.createForeignKey(
        'blog_page_side_posts',
        new TableForeignKey({
          columnNames: ['blog_page_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'blog_page',
          onDelete: 'CASCADE',
        })
      )
      await queryRunner.createForeignKey(
        'blog_page_side_posts',
        new TableForeignKey({
          columnNames: ['post_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'post',
          onDelete: 'CASCADE',
        })
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasNewTable = await queryRunner.hasTable('blog_page_side_posts')
    if (hasNewTable) {
      await queryRunner.renameTable('blog_page_side_posts', 'blog_page_recommended_posts')
    }

    const hasColumn = await queryRunner.hasColumn('blog_page', 'top_post_id')
    if (hasColumn) {
      const table = await queryRunner.getTable('blog_page')
      const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('top_post_id') !== -1)
      if (foreignKey) {
        await queryRunner.dropForeignKey('blog_page', foreignKey)
      }
      await queryRunner.dropColumn('blog_page', 'top_post_id')
    }
  }
}
