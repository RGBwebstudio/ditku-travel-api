import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { PostCategory } from 'src/modules/post-category/entities/post-category.entity'
import { Repository, In } from 'typeorm'

import { AddPostImageDto } from './dto/add-post-image.dto'
import { PostCreateImageDto } from './dto/post-create-image.dto'
import { PostCreateTranslateDto } from './dto/post-create-translate.dto'
import { PostCreateDto } from './dto/post-create.dto'
import { PostDeleteImagesDto } from './dto/post-delete-images.dto'
import { PostFilterDto } from './dto/post-filter.dto'
import { PostUpdateImageDto } from './dto/post-update-image.dto'
import { PostUpdateTranslateDto } from './dto/post-update-translate.dto'
import { PostUpdateDto } from './dto/post-update.dto'
import { PostImage } from './entities/post-image.entity'
import { PostSectionImage } from './entities/post-section-image.entity'
import { PostSectionTranslate } from './entities/post-section-translate.entity'
import { PostSection } from './entities/post-section.entity'
import { PostSocial } from './entities/post-social.entity'
import { PostTranslate } from './entities/post-translate.entity'
import { Post } from './entities/post.entity'

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name)

  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(PostTranslate)
    private postTranslateRepo: Repository<PostTranslate>,
    @InjectRepository(PostImage)
    private postImageRepo: Repository<PostImage>,
    @InjectRepository(PostCategory)
    private categoryRepo: Repository<PostCategory>,
    @InjectRepository(PostSection)
    private postSectionRepo: Repository<PostSection>,
    @InjectRepository(PostSectionTranslate)
    private postSectionTranslateRepo: Repository<PostSectionTranslate>,
    @InjectRepository(PostSectionImage)
    private postSectionImageRepo: Repository<PostSectionImage>,
    @InjectRepository(PostSocial)
    private postSocialRepo: Repository<PostSocial>
  ) {}

  async findAll(filter: PostFilterDto, lang?: LANG): Promise<{ entities: Post[]; count: number }> {
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category_id', 'category')
      .leftJoinAndSelect('post.translates', 'translates')
      .leftJoinAndSelect('post.images', 'images')

    if (filter.category_id) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: filter.category_id,
      })
    }

    if (filter.is_hidden !== undefined) {
      queryBuilder.andWhere('post.is_hidden = :isHidden', {
        isHidden: filter.is_hidden,
      })
    }

    if (filter.search) {
      queryBuilder.andWhere('LOWER(post.title) LIKE :search', {
        search: `%${filter.search.toLowerCase()}%`,
      })
    }

    queryBuilder.orderBy('post.created_at', 'DESC')

    if (filter.take) {
      queryBuilder.take(filter.take)
    }

    if (filter.skip) {
      queryBuilder.skip(filter.skip)
    }

    const [entities, count] = await queryBuilder.getManyAndCount()

    if (lang) {
      applyTranslations(entities, lang)
    }

    return {
      entities,
      count,
    }
  }

  async findOne(id: number, lang?: LANG): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: [
        'category_id',
        'translates',
        'images',
        'sections',
        'sections.translates',
        'sections.images',
        'socials',
        'recommended_posts',
        'recommended_posts.category_id',
        'recommended_posts.translates',
        'recommended_posts.images',
      ],
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    if (lang) {
      applyTranslations([post], lang)
      if (post.sections) {
        applyTranslations(post.sections, lang)
      }
    }

    return post
  }

  async findByUrl(url: string, lang?: LANG): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { url },
      relations: [
        'category_id',
        'translates',
        'images',
        'sections',
        'sections.translates',
        'sections.images',
        'socials',
        'recommended_posts',
        'recommended_posts.category_id',
        'recommended_posts.translates',
        'recommended_posts.images',
      ],
    })

    if (!post) {
      throw new NotFoundException(`Post with URL ${url} not found`)
    }

    if (lang) {
      applyTranslations([post], lang)
      if (post.sections) {
        applyTranslations(post.sections, lang)
      }
    }

    return post
  }

  async create(createDto: PostCreateDto): Promise<Post> {
    const { sections, title_ua, title_en, content_ua, content_en, recommended_posts, ...rest } = createDto

    const translationFields = { title_ua, title_en, content_ua, content_en }

    if (rest.category_id && typeof rest.category_id === 'number') {
      const category = await this.categoryRepo.findOne({
        where: { id: rest.category_id },
      })
      if (!category) {
        throw new BadRequestException('Category is NOT_FOUND')
      }
    } else {
      throw new BadRequestException('Category is NOT_FOUND')
    }

    const existingPost = await this.postRepo.findOne({
      where: { url: rest.url },
    })
    if (existingPost) {
      throw new BadRequestException('Post with this URL ALREADY_EXISTS')
    }

    const post = this.postRepo.create(rest)
    if (recommended_posts) {
      post.recommended_posts = recommended_posts.map((id) => ({ id }) as Post)
    }
    const savedPost = await this.postRepo.save(post)

    if (sections && sections.length > 0) {
      await this.saveSections(savedPost, sections)
    }

    if (createDto.socials && createDto.socials.length > 0) {
      await this.saveSocials(savedPost, createDto.socials)
    }

    await this.savePostTranslations(savedPost, translationFields)

    return this.findOne(savedPost.id)
  }

  async update(id: number, updateDto: PostUpdateDto): Promise<Post> {
    const { sections, title_ua, title_en, content_ua, content_en, recommended_posts, ...rest } = updateDto
    const translationFields = { title_ua, title_en, content_ua, content_en }
    const existingPost = await this.findOne(id)

    if (rest.category_id !== undefined && rest.category_id !== null) {
      const categoryId = Number(rest.category_id)
      if (Number.isNaN(categoryId)) {
        throw new BadRequestException('Category NOT_FOUND')
      }

      const category = await this.categoryRepo.findOne({
        where: { id: categoryId },
      })
      if (!category) {
        throw new BadRequestException('Category NOT_FOUND')
      }
    }

    if (rest.url && rest.url !== existingPost.url) {
      const existingUrlPost = await this.postRepo.findOne({
        where: { url: rest.url },
      })
      if (existingUrlPost) {
        throw new BadRequestException('Post with this URL ALREADY_EXISTS')
      }
    }

    if (recommended_posts) {
      existingPost.recommended_posts = recommended_posts.map((id) => ({ id }) as Post)
    }

    Object.assign(existingPost, rest)
    await this.postRepo.save(existingPost)

    if (sections) {
      await this.postSectionRepo.delete({ post: { id } })
      await this.saveSections(existingPost, sections)
    }

    if (updateDto.socials) {
      await this.postSocialRepo.delete({ post: { id } })
      await this.saveSocials(existingPost, updateDto.socials)
    }

    await this.savePostTranslations(existingPost, translationFields)

    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id)

    const images = await this.postImageRepo.find({
      where: { entity_id: post },
    })

    if (images.length > 0) {
      await this.postImageRepo.remove(images)
    }

    await this.postRepo.remove(post)
  }

  async createTranslate(postId: number, createTranslateDto: PostCreateTranslateDto): Promise<PostTranslate> {
    const post = await this.findOne(postId)

    const translate = this.postTranslateRepo.create({
      ...createTranslateDto,
      entity_id: post,
    })

    return await this.postTranslateRepo.save(translate)
  }

  async updateTranslate(translateId: number, updateTranslateDto: PostUpdateTranslateDto): Promise<PostTranslate> {
    const translate = await this.postTranslateRepo.findOne({
      where: { id: translateId },
    })

    if (!translate) {
      throw new NotFoundException(`Translation with ID ${translateId} NOT_FOUND`)
    }

    Object.assign(translate, updateTranslateDto)
    return await this.postTranslateRepo.save(translate)
  }

  async removeTranslate(translateId: number): Promise<void> {
    const translate = await this.postTranslateRepo.findOne({
      where: { id: translateId },
    })

    if (!translate) {
      throw new NotFoundException(`Translation with ID ${translateId} NOT_FOUND`)
    }

    await this.postTranslateRepo.remove(translate)
  }

  async addImage(postId: number, dto: AddPostImageDto): Promise<PostImage> {
    const post = await this.findOne(postId)

    // Check if image already exists? Maybe not needed for simple add.
    // If we want to prevent duplicates, we can check here.

    const image = this.postImageRepo.create({
      path: dto.path,
      entity_id: post,
      name: dto.path.split('/').pop() || 'image',
      order: 0,
    })

    return await this.postImageRepo.save(image)
  }

  async createImage(postId: number, createImageDto: PostCreateImageDto): Promise<PostImage> {
    const post = await this.findOne(postId)

    const image = this.postImageRepo.create({
      ...createImageDto,
      entity_id: post,
    })

    return await this.postImageRepo.save(image)
  }

  async updateImage(imageId: number, updateImageDto: PostUpdateImageDto): Promise<PostImage> {
    const image = await this.postImageRepo.findOne({
      where: { id: imageId },
    })

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} NOT_FOUND`)
    }

    Object.assign(image, updateImageDto)
    return await this.postImageRepo.save(image)
  }

  async deleteImages(postId: number, deleteImagesDto: PostDeleteImagesDto): Promise<void> {
    const post = await this.findOne(postId)

    const images = await this.postImageRepo.find({
      where: {
        id: In(deleteImagesDto.imageIds), // Assuming array of IDs logic needs to be verified
        entity_id: { id: post.id },
      },
    })

    if (images.length > 0) {
      await this.postImageRepo.remove(images)
    }
  }

  private async saveSections(post: Post, sectionsDto: any[]) {
    for (const [index, sectionDto] of sectionsDto.entries()) {
      const section = this.postSectionRepo.create({
        post,
        order: sectionDto.order !== undefined ? sectionDto.order : index,
        type: sectionDto.type || 'content',
      })
      const savedSection = await this.postSectionRepo.save(section)

      // Translations
      const translationsToSave: { field: string; value: string; lang: LANG }[] = []
      if (sectionDto.title_ua) translationsToSave.push({ field: 'title', value: sectionDto.title_ua, lang: LANG.UA })
      if (sectionDto.title_en) translationsToSave.push({ field: 'title', value: sectionDto.title_en, lang: LANG.EN })
      if (sectionDto.description_ua)
        translationsToSave.push({ field: 'description', value: sectionDto.description_ua, lang: LANG.UA })
      if (sectionDto.description_en)
        translationsToSave.push({ field: 'description', value: sectionDto.description_en, lang: LANG.EN })

      // Banner 1
      if (sectionDto.banner1_title_ua)
        translationsToSave.push({ field: 'banner1_title', value: sectionDto.banner1_title_ua, lang: LANG.UA })
      if (sectionDto.banner1_title_en)
        translationsToSave.push({ field: 'banner1_title', value: sectionDto.banner1_title_en, lang: LANG.EN })
      if (sectionDto.banner1_button_text_ua)
        translationsToSave.push({
          field: 'banner1_button_text',
          value: sectionDto.banner1_button_text_ua,
          lang: LANG.UA,
        })
      if (sectionDto.banner1_button_text_en)
        translationsToSave.push({
          field: 'banner1_button_text',
          value: sectionDto.banner1_button_text_en,
          lang: LANG.EN,
        })
      if (sectionDto.banner1_link_ua)
        translationsToSave.push({ field: 'banner1_link', value: sectionDto.banner1_link_ua, lang: LANG.UA })
      if (sectionDto.banner1_link_en)
        translationsToSave.push({ field: 'banner1_link', value: sectionDto.banner1_link_en, lang: LANG.EN })

      // Banner 2
      if (sectionDto.banner2_title_ua)
        translationsToSave.push({ field: 'banner2_title', value: sectionDto.banner2_title_ua, lang: LANG.UA })
      if (sectionDto.banner2_title_en)
        translationsToSave.push({ field: 'banner2_title', value: sectionDto.banner2_title_en, lang: LANG.EN })
      if (sectionDto.banner2_button_text_ua)
        translationsToSave.push({
          field: 'banner2_button_text',
          value: sectionDto.banner2_button_text_ua,
          lang: LANG.UA,
        })
      if (sectionDto.banner2_button_text_en)
        translationsToSave.push({
          field: 'banner2_button_text',
          value: sectionDto.banner2_button_text_en,
          lang: LANG.EN,
        })
      if (sectionDto.banner2_link_ua)
        translationsToSave.push({ field: 'banner2_link', value: sectionDto.banner2_link_ua, lang: LANG.UA })
      if (sectionDto.banner2_link_en)
        translationsToSave.push({ field: 'banner2_link', value: sectionDto.banner2_link_en, lang: LANG.EN })

      for (const t of translationsToSave) {
        await this.postSectionTranslateRepo.save({
          section_id: savedSection,
          field: t.field,
          value: t.value,
          lang: t.lang,
        })
      }

      // Images
      if (sectionDto.images && sectionDto.images.length > 0) {
        for (const url of sectionDto.images) {
          await this.postSectionImageRepo.save({
            section_id: savedSection,
            url,
          })
        }
      }
    }
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.postImageRepo.findOne({
      where: { id: imageId },
    })

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} NOT_FOUND`)
    }

    await this.postImageRepo.remove(image)
  }

  private async savePostTranslations(
    post: Post,
    dto: { title_ua?: string; title_en?: string; content_ua?: string; content_en?: string }
  ) {
    const translationsToSave: { field: string; value: string; lang: LANG }[] = []

    if (dto.title_ua) translationsToSave.push({ field: 'title', value: dto.title_ua, lang: LANG.UA })
    if (dto.title_en) translationsToSave.push({ field: 'title', value: dto.title_en, lang: LANG.EN })
    if (dto.content_ua) translationsToSave.push({ field: 'content', value: dto.content_ua, lang: LANG.UA })
    if (dto.content_en) translationsToSave.push({ field: 'content', value: dto.content_en, lang: LANG.EN })

    for (const t of translationsToSave) {
      // Check if translation exists to update or create
      const existingTranslation = await this.postTranslateRepo.findOne({
        where: {
          entity_id: { id: post.id },
          field: t.field,
          lang: t.lang,
        },
      })

      if (existingTranslation) {
        existingTranslation.value = t.value
        await this.postTranslateRepo.save(existingTranslation)
      } else {
        await this.postTranslateRepo.save({
          entity_id: post,
          field: t.field,
          value: t.value,
          lang: t.lang,
        })
      }
    }
  }

  private async saveSocials(post: Post, socialsDto: any[]) {
    for (const socialDto of socialsDto) {
      const social = this.postSocialRepo.create({
        post,
        type: socialDto.type,
        url: socialDto.url,
      })
      await this.postSocialRepo.save(social)
    }
  }
}
