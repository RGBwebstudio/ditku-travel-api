import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateBlogPage1769340413000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('blog_page')
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'blog_page',
          columns: [
            { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
            { name: 'title', type: 'varchar', isNullable: true, default: "''" },
            { name: 'meta_title', type: 'varchar', isNullable: true, default: "''" },
            { name: 'meta_description', type: 'varchar', isNullable: true, default: "''" },
            { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          ],
        }),
        true
      )

      // Initialize singleton
      await queryRunner.query(`INSERT INTO "blog_page" (title) VALUES ('Blog')`)
    }

    const hasJoinTable = await queryRunner.hasTable('blog_page_recommended_posts')
    if (!hasJoinTable) {
      await queryRunner.createTable(
        new Table({
          name: 'blog_page_recommended_posts',
          columns: [
            { name: 'blog_page_id', type: 'int', isPrimary: true },
            { name: 'post_id', type: 'int', isPrimary: true },
          ],
          foreignKeys: [
            {
              columnNames: ['blog_page_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'blog_page',
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
    const hasJoinTable = await queryRunner.hasTable('blog_page_recommended_posts')
    if (hasJoinTable) {
      await queryRunner.dropTable('blog_page_recommended_posts')
    }

    const hasTable = await queryRunner.hasTable('blog_page')
    if (hasTable) {
      await queryRunner.dropTable('blog_page')
    }
  }
}
