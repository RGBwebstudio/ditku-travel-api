import * as path from 'path'

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import * as fs from 'fs-extra'
import sharp from 'sharp'
import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { PostCategory } from 'src/modules/post-category/entities/post-category.entity'
import { Repository } from 'typeorm'

import { PostCreateImageDto } from './dto/post-create-image.dto'
import { PostCreateTranslateDto } from './dto/post-create-translate.dto'
import { PostCreateDto } from './dto/post-create.dto'
import { PostDeleteImagesDto } from './dto/post-delete-images.dto'
import { PostFilterDto } from './dto/post-filter.dto'
import { PostUpdateImageDto } from './dto/post-update-image.dto'
import { PostUpdateTranslateDto } from './dto/post-update-translate.dto'
import { PostUpdateDto } from './dto/post-update.dto'
import { PostImage } from './entities/post-image.entity'
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
    private categoryRepo: Repository<PostCategory>
  ) {}

  async findAll(filter: PostFilterDto, lang?: LANG): Promise<{ entities: Post[]; count: number }> {
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category_id', 'category')
      .leftJoinAndSelect('post.translates', 'translates')
      .leftJoinAndSelect('post.images', 'images')

    if (filter.category_id) {
      queryBuilder.andWhere('post.category_id = :categoryId', {
        categoryId: filter.category_id,
      })
    }

    if (filter.is_hidden !== undefined) {
      queryBuilder.andWhere('post.is_hidden = :isHidden', {
        isHidden: filter.is_hidden,
      })
    }

    if (filter.is_top_main !== undefined) {
      queryBuilder.andWhere('post.is_top_main = :isTopMain', {
        isTopMain: filter.is_top_main,
      })
    }

    if (filter.is_top_side !== undefined) {
      queryBuilder.andWhere('post.is_top_side = :isTopSide', {
        isTopSide: filter.is_top_side,
      })
    }

    if (filter.search) {
      queryBuilder.andWhere('LOWER(post.title) LIKE :search', {
        search: `%${filter.search.toLowerCase()}%`,
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
      relations: ['category_id', 'translates', 'images'],
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
      relations: ['category_id', 'translates', 'images'],
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
    if (createDto.category_id && typeof createDto.category_id === 'number') {
      const category = await this.categoryRepo.findOne({
        where: { id: createDto.category_id },
      })
      if (!category) {
        throw new BadRequestException('Category is NOT_FOUND')
      }
    } else {
      throw new BadRequestException('Category is NOT_FOUND')
    }

    const existingPost = await this.postRepo.findOne({
      where: { url: createDto.url },
    })
    if (existingPost) {
      throw new BadRequestException('Post with this URL ALREADY_EXISTS')
    }

    const post = this.postRepo.create(createDto)
    return await this.postRepo.save(post)
  }

  async update(id: number, updateDto: PostUpdateDto): Promise<Post> {
    const existingPost = await this.findOne(id)

    if (updateDto.category_id !== undefined && updateDto.category_id !== null) {
      const categoryId = Number(updateDto.category_id)
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

    if (updateDto.url && updateDto.url !== existingPost.url) {
      const existingUrlPost = await this.postRepo.findOne({
        where: { url: updateDto.url },
      })
      if (existingUrlPost) {
        throw new BadRequestException('Post with this URL ALREADY_EXISTS')
      }
    }

    Object.assign(existingPost, updateDto)
    return await this.postRepo.save(existingPost)
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id)

    const images = await this.postImageRepo.find({
      where: { entity_id: post },
    })

    for (const image of images) {
      const filePath = path.isAbsolute(image.path)
        ? image.path
        : path.join(process.cwd(), image.path.replace(/^\/+/, ''))
      try {
        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath)
        } else {
          this.logger.warn(`File at path ${filePath} does not exist`)
        }
      } catch (error) {
        this.logger.warn(`Failed to delete file ${filePath}: ${error.message}`)
      }
    }

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

  async uploadImage(postId: number, file: Express.Multer.File): Promise<PostImage> {
    const post = await this.findOne(postId)

    const uploadsDir = path.join(process.cwd(), 'uploads', 'posts')
    await fs.ensureDir(uploadsDir)

    const filename = `${Date.now()}-${file.originalname}`
    const filePath = path.join(uploadsDir, filename)

    await sharp(file.buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filePath)

    const image = this.postImageRepo.create({
      name: filename,
      path: `/uploads/posts/${filename}`,
      entity_id: post,
      order: 0,
    })

    return await this.postImageRepo.save(image)
  }

  async uploadImages(files: Express.Multer.File[], postId: number): Promise<PostImage[]> {
    const post = await this.findOne(postId)

    const uploadsDir = path.join(process.cwd(), 'uploads', 'posts')
    await fs.ensureDir(uploadsDir)

    const savedImages: PostImage[] = []

    for (const file of files) {
      const filename = `${Date.now()}-${file.originalname}`
      const filePath = path.join(uploadsDir, filename)

      await sharp(file.buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(filePath)

      const image = this.postImageRepo.create({
        name: filename,
        path: `/uploads/posts/${filename}`,
        entity_id: post,
        order: 0,
      })

      const saved = await this.postImageRepo.save(image)
      savedImages.push(saved)
    }

    return savedImages
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
        id: deleteImagesDto.imageIds[0],
        entity_id: post,
      },
    })

    for (const image of images) {
      const filePath = path.isAbsolute(image.path)
        ? image.path
        : path.join(process.cwd(), image.path.replace(/^\/+/, ''))
      try {
        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath)
        } else {
          this.logger.warn(`File at path ${filePath} does not exist`)
        }
      } catch (error) {
        this.logger.warn(`Failed to delete file ${filePath}: ${error.message}`)
      }
    }

    await this.postImageRepo.remove(images)
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.postImageRepo.findOne({
      where: { id: imageId },
    })

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} NOT_FOUND`)
    }

    const filePath = path.isAbsolute(image.path) ? image.path : path.join(process.cwd(), image.path.replace(/^\/+/, ''))
    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath)
      } else {
        this.logger.warn(`File at path ${filePath} does not exist`)
      }
    } catch (error) {
      this.logger.warn(`Failed to delete file ${filePath}: ${error.message}`)
    }

    await this.postImageRepo.remove(image)
  }
}
