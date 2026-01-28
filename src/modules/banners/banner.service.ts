import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { BannerType } from 'src/common/types/banner-group.types'
import { Repository } from 'typeorm'

import { AddBannerImageDto } from './dto/add-banner-image.dto'
import { BannerCreateImageDto } from './dto/banner-create-image.dto'
import { BannerCreateDto } from './dto/banner-create.dto'
import { BannerUpdateDto } from './dto/banner-update.dto'
import { BannerImage } from './entities/banner-image.entity'
import { BannerGroup } from './entities/banners.entity'

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name)

  constructor(
    @InjectRepository(BannerGroup)
    private readonly bannerRepo: Repository<BannerGroup>,
    @InjectRepository(BannerImage)
    private readonly entityImageRepo: Repository<BannerImage>
  ) {}

  async findOne(id: number): Promise<BannerGroup | null> {
    const entity = await this.bannerRepo
      .createQueryBuilder('banner')
      .leftJoinAndSelect('banner.images', 'image')
      .where('banner.id = :id', { id })
      .orderBy('image.order', 'ASC')
      .getOne()

    if (!entity) throw new NotFoundException('entity of banner is NOT_FOUND')

    return entity
  }

  async create(dto: BannerCreateDto): Promise<BannerGroup> {
    const exists = await this.bannerRepo
      .createQueryBuilder('banner')
      .where('LOWER(banner.title) = :title', {
        title: (dto.title || '').toLowerCase(),
      })
      .getOne()

    if (exists) throw new BadRequestException('NAME_ALREADY_RESERVED')

    const data = this.bannerRepo.create(dto)

    try {
      return await this.bannerRepo.save(data)
    } catch (error) {
      this.logger.error(`Error creating banner: ${error}`)
      throw new BadRequestException('entity of banner is NOT_CREATED')
    }
  }

  async findAllList(): Promise<{ entities: BannerGroup[] }> {
    const entities = await this.bannerRepo
      .createQueryBuilder('banner')
      .leftJoinAndSelect('banner.images', 'image')
      .orderBy('banner.created_at', 'DESC')
      .addOrderBy('image.order', 'ASC')
      .getMany()

    return { entities }
  }

  async findMainPageBanners(): Promise<{ entities: BannerGroup[] }> {
    const entities = await this.bannerRepo
      .createQueryBuilder('banner')
      .leftJoinAndSelect('banner.images', 'image')
      .where('banner.type = :type', { type: BannerType.MAIN_PAGE })
      .orderBy('banner.created_at', 'DESC')
      .addOrderBy('image.order', 'ASC')
      .getMany()

    return { entities }
  }

  async findAll(take: number, skip: number): Promise<{ entities: BannerGroup[]; count: number }> {
    const queryBuilder = this.bannerRepo
      .createQueryBuilder('banner')
      .leftJoinAndSelect('banner.images', 'image')
      .orderBy('banner.created_at', 'DESC')
      .addOrderBy('image.order', 'ASC')

    const [entities, count] = await queryBuilder.skip(skip).take(take).getManyAndCount()

    return { entities: entities, count }
  }

  async update(id: number, dto: BannerUpdateDto): Promise<BannerGroup | null> {
    if (dto.title) {
      const exists = await this.bannerRepo
        .createQueryBuilder('banner')
        .where('LOWER(banner.title) = :title', {
          title: dto.title.toLowerCase(),
        })
        .andWhere('banner.id != :id', { id })
        .getOne()

      if (exists) throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    const result = await this.bannerRepo.update(id, { ...dto })

    if (result.affected === 0) throw new NotFoundException('entity of banner is NOT_FOUND')

    const updatedBanner = await this.bannerRepo.findOne({
      where: { id },
    })

    return updatedBanner
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      await this.deleteImages(id)

      const result = await this.bannerRepo.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('entity of banner is NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of banner HAS_CHILDS')
      }
      this.logger.error(`Error while deleting banner \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async createImage(dto: BannerCreateImageDto): Promise<BannerImage> {
    const entity_id = typeof dto.entity_id === 'number' ? { id: dto.entity_id } : dto.entity_id

    const newImage = this.entityImageRepo.create({
      ...dto,
      entity_id,
    })
    return await this.entityImageRepo.save(newImage)
  }

  async addImage(groupId: number, dto: AddBannerImageDto): Promise<{ message: string }> {
    const banner = await this.bannerRepo.findOne({
      where: { id: groupId },
    })

    if (!banner) throw new NotFoundException('entity of banner group is NOT_FOUND')

    const newImage = this.entityImageRepo.create({
      entity_id: banner,
      path: dto.path,
      path_md: dto.path_md,
      path_sm: dto.path_sm,
      link: dto.link || '',
      name: dto.path.split('/').pop() || 'image',
    })

    try {
      await this.entityImageRepo.save(newImage)
      return { message: 'Image added successfully' }
    } catch (err) {
      this.logger.error(`Error adding image to banner: ${err}`)
      throw new BadRequestException('Image not added')
    }
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.entityImageRepo.findOne({ where: { id } })

    if (!image) throw new NotFoundException('entity of brand is NOT_FOUND')

    await this.entityImageRepo.delete(id)
  }

  async updateImage(id: number, link: string): Promise<BannerImage> {
    const image = await this.entityImageRepo.findOne({ where: { id } })

    if (!image) {
      throw new NotFoundException('entity of brand image is NOT_FOUND')
    }

    image.link = link

    try {
      return await this.entityImageRepo.save(image)
    } catch (err) {
      this.logger.error(`Failed to update image ${id}: ${err}`)
      throw new BadRequestException('entity of brand image is NOT_UPDATED')
    }
  }

  async deleteImages(entity_id: number): Promise<{ message: string } | void> {
    const deleteCandidates = await this.entityImageRepo.find({
      where: { entity_id: { id: entity_id } },
    })

    if (deleteCandidates?.length) {
      const ids = deleteCandidates.map((c) => c.id)
      try {
        if (ids.length) await this.entityImageRepo.delete(ids)
      } catch (err) {
        this.logger.error(`Failed to delete image records for entity ${entity_id}: ${err}`)
      }
    }
  }

  async reorderImages(bannerGroupId: number, orders: { id: number; order: number }[]): Promise<{ message: string }> {
    const banner = await this.bannerRepo.findOne({
      where: { id: bannerGroupId },
      relations: ['images'],
    })

    if (!banner) throw new NotFoundException('banner group is NOT_FOUND')

    if (!Array.isArray(orders)) throw new BadRequestException('orders is required')

    const imageIds = banner.images.map((i) => i.id)
    for (const o of orders) {
      if (!imageIds.includes(o.id)) {
        throw new BadRequestException(`image id ${o.id} is not part of banner group ${bannerGroupId}`)
      }
    }

    for (const o of orders) {
      await this.entityImageRepo.update(o.id, { order: o.order })
    }

    return { message: 'Order updated' }
  }
}
