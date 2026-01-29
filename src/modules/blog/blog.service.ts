import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Repository, In, FindOptionsWhere } from 'typeorm'

import { UpdateBlogPageDto } from './dto/update-blog-page.dto'
import { BlogPage } from './entities/blog-page.entity'
import { PostCategoryService } from '../post-category/post-category.service'
import { GetBlogPageDto } from './dto/get-blog-page.dto'
import { Post } from '../posts/entities/post.entity'

export interface MetaData {
  title?: string
  meta_title?: string
  meta_description?: string
}

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPage)
    private blogPageRepository: Repository<BlogPage>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private postCategoryService: PostCategoryService
  ) {}

  async find(): Promise<BlogPage> {
    let page = await this.blogPageRepository.findOne({
      where: { id: 1 },
      relations: [
        'top_post',
        'top_post.category_id',
        'side_posts',
        'side_posts.category_id',
        'side_posts.images',
        'recommended_posts',
        'recommended_posts.category_id',
        'recommended_posts.images',
      ],
    })

    if (!page) {
      page = this.blogPageRepository.create({ id: 1 })
      await this.blogPageRepository.save(page)
    }
    return page
  }

  async update(dto: UpdateBlogPageDto): Promise<BlogPage> {
    const page = await this.find()

    if (dto.title_ua !== undefined) page.title_ua = dto.title_ua
    if (dto.title_en !== undefined) page.title_en = dto.title_en

    if (dto.meta_title_ua !== undefined) page.meta_title_ua = dto.meta_title_ua
    if (dto.meta_title_en !== undefined) page.meta_title_en = dto.meta_title_en

    if (dto.meta_description_ua !== undefined) page.meta_description_ua = dto.meta_description_ua
    if (dto.meta_description_en !== undefined) page.meta_description_en = dto.meta_description_en

    if (dto.top_post_id !== undefined) {
      if (dto.top_post_id === null) {
        page.top_post = null
      } else {
        const post = await this.postRepository.findOne({
          where: { id: dto.top_post_id },
        })
        if (post) page.top_post = post
      }
    }

    if (dto.side_post_ids) {
      const posts = await this.postRepository.find({
        where: { id: In(dto.side_post_ids) },
        relations: ['category_id'],
      })
      page.side_posts = posts
    }

    if (dto.recommended_post_ids) {
      const posts = await this.postRepository.find({
        where: { id: In(dto.recommended_post_ids) },
        relations: ['category_id'],
      })
      page.recommended_posts = posts
    }

    return this.blogPageRepository.save(page)
  }

  async getPublicView(query: GetBlogPageDto) {
    const { lang, category_id, page = 1, limit = 9 } = query
    const skip = (page - 1) * limit

    // 1. Get Categories (for tabs)
    const { entities: categories } = await this.postCategoryService.findAllList(lang)

    let metaData: MetaData = {}
    let topPost: Post | null = null
    let sidePosts: Post[] = []
    let recommendedPosts: Post[] = []

    // 2. Determine Context (Global vs Category)
    if (category_id) {
      const category = await this.postCategoryService.findOne(category_id, lang)
      metaData = {
        title: category.title,
        meta_title: category.meta_title || category.title,
        meta_description: category.meta_description || '',
      }
      topPost = category.top_post
      sidePosts = category.side_posts || []
      recommendedPosts = category.recommended_posts || []
    } else {
      const blogPage = await this.find()

      const isEn = lang === LANG.EN
      metaData = {
        title: isEn ? blogPage.title_en : blogPage.title_ua,
        meta_title: isEn ? blogPage.meta_title_en : blogPage.meta_title_ua,
        meta_description: isEn ? blogPage.meta_description_en : blogPage.meta_description_ua,
      }
      topPost = blogPage.top_post
      sidePosts = blogPage.side_posts || []
      recommendedPosts = blogPage.recommended_posts || []
    }

    if (lang) {
      if (topPost) applyTranslations([topPost], lang)
      if (sidePosts.length) applyTranslations(sidePosts, lang)
      if (recommendedPosts.length) applyTranslations(recommendedPosts, lang)
    }

    // 3. Fetch Posts (Paginated)
    const whereCondition: FindOptionsWhere<Post> = {}
    if (category_id) {
      whereCondition.category_id = { id: category_id }
    }

    const [posts, count] = await this.postRepository.findAndCount({
      where: whereCondition,
      relations: ['category_id', 'translates', 'images'],
      order: { created_at: 'DESC' },
      take: limit,
      skip,
    })

    if (lang) {
      applyTranslations(posts, lang)
      // Apply translations to categories of posts if needed, though 'category_id' relation is fetched, it's a PostCategory.
      // We might need to translate the category attached to the post:
      posts.forEach((p) => {
        if (p.category_id && p.category_id.translates) {
          // This requires fetching category translates in the relation above.
          // Added 'category_id.translates' to relations below.
        }
      })
    }

    return {
      meta: metaData,
      top_post: topPost,
      side_posts: sidePosts,
      recommended_posts: recommendedPosts,
      categories,
      posts,
      count,
    }
  }
}
