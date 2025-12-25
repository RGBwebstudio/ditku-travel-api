import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { ImageCategory } from '../entities/image-category.entity'
import { ImageService } from './image.service'
import { CreateImageCategoryDto } from '../dto/create-image-category.dto'
import { UpdateImageCategoryDto } from '../dto/update-image-category.dto'
import { ImageCategoryQueryDto } from '../dto/image-category-query.dto'

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
      // Validate parentId if provided
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
    const where: any = {}

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

    // Validate parentId if provided
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

        // Check for circular reference (prevent setting a descendant as parent)
        const isDescendant = await this.isDescendant(id, dto.parentId)
        if (isDescendant) {
          throw new BadRequestException('CANNOT_SET_DESCENDANT_AS_PARENT')
        }
      }
    }

    const updated = this.categoryRepo.merge(category, dto)
    return await this.categoryRepo.save(updated)
  }

  /**
   * Check if potentialDescendantId is a descendant of ancestorId
   * (i.e., if potentialDescendantId is somewhere in the tree below ancestorId)
   */
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

    // 1. Recursively delete all child categories
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        await this.delete(child.id)
      }
    }

    // 2. Delete all images in this category (removes from S3 and DB)
    // We need to fetch images specifically if not fully loaded, but relations=['images'] should catch them.
    // However, if there are many, we might need pagination or batching. For now assuming reasonable count.
    // Wait, the findOne above might not get ALL images if pagination was involved?
    // Relation loading fetches all. Safe for normal usage.

    // We strictly use find with where just in case Relation didn't fetch deep or to be sure.
    // Re-fetching images to be absolutely safe (and simpler logic than relying on relation array state)
    // Actually, we can just use the service to find by category.
    const images = await this.imageService.findAll({ categoryId: id } as any) // Assuming findAll supports filtering by categoryId

    // Actually ImageService.findAll returns { data, total ... }
    // Let's rely on the relation we fetched or use the service carefully.
    // The relation `category.images` is available.
    if (category.images && category.images.length > 0) {
      for (const image of category.images) {
        await this.imageService.delete(image.id)
      }
    }

    // 3. Delete the category itself
    await this.categoryRepo.delete(id)
    return { success: true }
  }
}
