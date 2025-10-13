import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as sharp from 'sharp'

import { Post } from './entities/post.entity'
import { PostTranslate } from './entities/post-translate.entity'
import { PostImage } from './entities/post-image.entity'
import { Category } from 'src/category/entities/category.entity'

import { PostCreateDto } from './dto/post-create.dto'
import { PostUpdateDto } from './dto/post-update.dto'
import { PostFilterDto } from './dto/post-filter.dto'
import { PostCreateTranslateDto } from './dto/post-create-translate.dto'
import { PostUpdateTranslateDto } from './dto/post-update-translate.dto'
import { PostCreateImageDto } from './dto/post-create-image.dto'
import { PostUpdateImageDto } from './dto/post-update-image.dto'
import { PostDeleteImagesDto } from './dto/post-delete-images.dto'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'

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
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>
  ) {}

  async findAll(
    filter: PostFilterDto,
    lang?: LANG
  ): Promise<{ entities: Post[]; count: number }> {
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category_id', 'category')
      .leftJoinAndSelect('post.translates', 'translates')
      .leftJoinAndSelect('post.images', 'images')

    if (filter.category_id) {
      queryBuilder.andWhere('post.category_id = :categoryId', {
        categoryId: filter.category_id
      })
    }

    if (filter.is_hidden !== undefined) {
      queryBuilder.andWhere('post.is_hidden = :isHidden', {
        isHidden: filter.is_hidden
      })
    }

    if (filter.is_top_main !== undefined) {
      queryBuilder.andWhere('post.is_top_main = :isTopMain', {
        isTopMain: filter.is_top_main
      })
    }

    if (filter.is_top_side !== undefined) {
      queryBuilder.andWhere('post.is_top_side = :isTopSide', {
        isTopSide: filter.is_top_side
      })
    }

    if (filter.search) {
      queryBuilder.andWhere('LOWER(post.title) LIKE :search', {
        search: `%${filter.search.toLowerCase()}%`
      })
    }

    queryBuilder.orderBy('post.created_at', 'DESC')

    if (filter.limit) {
      queryBuilder.take(filter.limit)
    }

    if (filter.offset) {
      queryBuilder.skip(filter.offset)
    }

    const [entities, count] = await queryBuilder.getManyAndCount()

    if (lang) {
      applyTranslations(entities, lang)
    }

    return { entities, count }
  }

  async findOne(id: number, lang?: LANG): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['category_id', 'translates', 'images']
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    if (lang) {
      applyTranslations([post], lang)
    }

    return post
  }

  async findByUrl(url: string, lang?: LANG): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { url },
      relations: ['category_id', 'translates', 'images']
    })

    if (!post) {
      throw new NotFoundException(`Post with URL ${url} not found`)
    }

    if (lang) {
      applyTranslations([post], lang)
    }

    return post
  }

  async create(createDto: PostCreateDto): Promise<Post> {
    // Check if category exists
    if (createDto.category_id) {
      const category = await this.categoryRepo.findOne({
        where: { id: createDto.category_id as any }
      })
      if (!category) {
        throw new BadRequestException('Category not found')
      }
    }

    // Check if URL is unique
    const existingPost = await this.postRepo.findOne({
      where: { url: createDto.url }
    })
    if (existingPost) {
      throw new BadRequestException('Post with this URL already exists')
    }

    const post = this.postRepo.create(createDto)
    return await this.postRepo.save(post)
  }

  async update(id: number, updateDto: PostUpdateDto): Promise<Post> {
    const existingPost = await this.findOne(id)

    // Check if category exists
    if (updateDto.category_id) {
      const category = await this.categoryRepo.findOne({
        where: { id: updateDto.category_id as any }
      })
      if (!category) {
        throw new BadRequestException('Category not found')
      }
    }

    // Check if URL is unique
    if (updateDto.url && updateDto.url !== existingPost.url) {
      const existingUrlPost = await this.postRepo.findOne({
        where: { url: updateDto.url }
      })
      if (existingUrlPost) {
        throw new BadRequestException('Post with this URL already exists')
      }
    }

    Object.assign(existingPost, updateDto)
    return await this.postRepo.save(existingPost)
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id)
    await this.postRepo.remove(post)
  }

  // Translation methods
  async createTranslate(
    postId: number,
    createTranslateDto: PostCreateTranslateDto
  ): Promise<PostTranslate> {
    const post = await this.findOne(postId)

    const translate = this.postTranslateRepo.create({
      ...createTranslateDto,
      entity_id: post
    })

    return await this.postTranslateRepo.save(translate)
  }

  async updateTranslate(
    translateId: number,
    updateTranslateDto: PostUpdateTranslateDto
  ): Promise<PostTranslate> {
    const translate = await this.postTranslateRepo.findOne({
      where: { id: translateId }
    })

    if (!translate) {
      throw new NotFoundException(
        `Translation with ID ${translateId} not found`
      )
    }

    Object.assign(translate, updateTranslateDto)
    return await this.postTranslateRepo.save(translate)
  }

  async removeTranslate(translateId: number): Promise<void> {
    const translate = await this.postTranslateRepo.findOne({
      where: { id: translateId }
    })

    if (!translate) {
      throw new NotFoundException(
        `Translation with ID ${translateId} not found`
      )
    }

    await this.postTranslateRepo.remove(translate)
  }

  // Image methods
  async uploadImage(
    postId: number,
    file: Express.Multer.File,
    customId?: string
  ): Promise<PostImage> {
    const post = await this.findOne(postId)

    const uploadsDir = path.join(process.cwd(), 'uploads', 'posts')
    await fs.ensureDir(uploadsDir)

    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsDir, filename)

    // Resize and optimize image
    await sharp(file.buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filePath)

    const image = this.postImageRepo.create({
      custom_id: customId,
      name: filename,
      path: `/uploads/posts/${filename}`,
      entity_id: post,
      order: 0
    })

    return await this.postImageRepo.save(image)
  }

  async createImage(
    postId: number,
    createImageDto: PostCreateImageDto
  ): Promise<PostImage> {
    const post = await this.findOne(postId)

    const image = this.postImageRepo.create({
      ...createImageDto,
      entity_id: post
    })

    return await this.postImageRepo.save(image)
  }

  async updateImage(
    imageId: number,
    updateImageDto: PostUpdateImageDto
  ): Promise<PostImage> {
    const image = await this.postImageRepo.findOne({
      where: { id: imageId }
    })

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`)
    }

    Object.assign(image, updateImageDto)
    return await this.postImageRepo.save(image)
  }

  async deleteImages(
    postId: number,
    deleteImagesDto: PostDeleteImagesDto
  ): Promise<void> {
    const post = await this.findOne(postId)

    const images = await this.postImageRepo.find({
      where: {
        id: deleteImagesDto.imageIds[0], // TypeORM In operator
        entity_id: post
      }
    })

    // Delete physical files
    for (const image of images) {
      const filePath = path.join(process.cwd(), image.path)
      try {
        await fs.remove(filePath)
      } catch (error) {
        this.logger.warn(`Failed to delete file ${filePath}: ${error.message}`)
      }
    }

    await this.postImageRepo.remove(images)
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.postImageRepo.findOne({
      where: { id: imageId }
    })

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`)
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), image.path)
    try {
      await fs.remove(filePath)
    } catch (error) {
      this.logger.warn(`Failed to delete file ${filePath}: ${error.message}`)
    }

    await this.postImageRepo.remove(image)
  }
}
