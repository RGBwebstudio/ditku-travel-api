import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class AddRecommendedPostsToCategory1769363000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('post_category_recommended_posts')
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'post_category_recommended_posts',
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
    const tableExists = await queryRunner.hasTable('post_category_recommended_posts')
    if (tableExists) {
      await queryRunner.dropTable('post_category_recommended_posts')
    }
  }
}
