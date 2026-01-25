import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { FindOptionsWhere, IsNull, Repository } from 'typeorm'

import { ImageService } from './image.service'
import { CreateImageCategoryDto } from '../dto/create-image-category.dto'
import { ImageCategoryQueryDto } from '../dto/image-category-query.dto'
import { UpdateImageCategoryDto } from '../dto/update-image-category.dto'
import { ImageCategory } from '../entities/image-category.entity'

@Injectable()
export class ImageCategoryService {
  private readonly logger = new Logger(ImageCategoryService.name)

  constructor(
    @InjectRepository(ImageCategory)
    private readonly categoryRepo: Repository<ImageCategory>,
    private readonly imageService: ImageService
  ) {}

  async create(dto: CreateImageCategoryDto): Promise<ImageCategory> {
    try {
      if (dto.parentId) {
        const parent = await this.categoryRepo.findOne({
          where: { id: dto.parentId },
        })
        if (!parent) {
          throw new NotFoundException('PARENT_NOT_FOUND')
        }
      }

      const category = this.categoryRepo.create(dto)
      return await this.categoryRepo.save(category)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      this.logger.error(`Failed to create image category: ${(error as Error).message}`, (error as Error).stack)
      throw new BadRequestException('NOT_CREATED')
    }
  }

  async findAll(query?: ImageCategoryQueryDto): Promise<ImageCategory[]> {
    const where: FindOptionsWhere<ImageCategory> = {}

    if (query?.parentId !== undefined) {
      if (query.parentId === null) {
        where.parentId = IsNull()
      } else {
        where.parentId = query.parentId
      }
    }

    return await this.categoryRepo.find({
      where,
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: number): Promise<ImageCategory> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['images'],
    })
    if (!category) {
      throw new NotFoundException('NOT_FOUND')
    }
    return category
  }

  async update(id: number, dto: UpdateImageCategoryDto): Promise<ImageCategory> {
    const category = await this.categoryRepo.findOne({ where: { id } })
    if (!category) {
      throw new NotFoundException('NOT_FOUND')
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('CANNOT_SET_SELF_AS_PARENT')
      }

      if (dto.parentId !== null) {
        const parent = await this.categoryRepo.findOne({
          where: { id: dto.parentId },
        })
        if (!parent) {
          throw new NotFoundException('PARENT_NOT_FOUND')
        }

        const isDescendant = await this.isDescendant(id, dto.parentId)
        if (isDescendant) {
          throw new BadRequestException('CANNOT_SET_DESCENDANT_AS_PARENT')
        }
      }
    }

    const updated = this.categoryRepo.merge(category, dto)
    return await this.categoryRepo.save(updated)
  }

  private async isDescendant(ancestorId: number, potentialDescendantId: number): Promise<boolean> {
    const category = await this.categoryRepo.findOne({
      where: { id: potentialDescendantId },
    })
    if (!category || !category.parentId) {
      return false
    }
    if (category.parentId === ancestorId) {
      return true
    }
    return this.isDescendant(ancestorId, category.parentId)
  }

  async delete(id: number): Promise<{ success: boolean }> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['images', 'children'],
    })

    if (!category) {
      throw new NotFoundException('NOT_FOUND')
    }

    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        await this.delete(child.id)
      }
    }

    if (category.images && category.images.length > 0) {
      for (const image of category.images) {
        await this.imageService.delete(image.id)
      }
    }

    await this.categoryRepo.delete(id)
    return { success: true }
  }
}
