import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { ImageCategory } from '../entities/image-category.entity'
import { Image } from '../entities/image.entity'
import { CreateImageCategoryDto } from '../dto/create-image-category.dto'
import { UpdateImageCategoryDto } from '../dto/update-image-category.dto'
import { ImageCategoryQueryDto } from '../dto/image-category-query.dto'

@Injectable()
export class ImageCategoryService {
  private readonly logger = new Logger(ImageCategoryService.name)

  constructor(
    @InjectRepository(ImageCategory)
    private readonly categoryRepo: Repository<ImageCategory>,
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>
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
      relations: ['parent', 'children'],
    })
  }

  async findOne(id: number): Promise<ImageCategory> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['images', 'parent', 'children'],
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
    const category = await this.categoryRepo.findOne({ where: { id } })
    if (!category) {
      throw new NotFoundException('NOT_FOUND')
    }

    // Check if category has child categories
    const childCount = await this.categoryRepo.count({
      where: { parentId: id },
    })

    if (childCount > 0) {
      throw new ConflictException('HAS_CHILDS')
    }

    // Check if category has related images
    const imageCount = await this.imageRepo.count({
      where: { categoryId: id },
    })

    if (imageCount > 0) {
      throw new ConflictException('HAS_CHILDS')
    }

    await this.categoryRepo.delete(id)
    return { success: true }
  }
}
