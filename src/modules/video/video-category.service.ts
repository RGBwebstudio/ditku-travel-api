import { Injectable, NotFoundException, BadRequestException, Logger, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { CreateVideoCategoryDto } from './dto/create-video-category.dto'
import { UpdateVideoCategoryDto } from './dto/update-video-category.dto'
import { VideoCategory } from './entities/video-category.entity'

@Injectable()
export class VideoCategoryService {
  private readonly logger = new Logger(VideoCategoryService.name)
  constructor(
    @InjectRepository(VideoCategory)
    private readonly repo: Repository<VideoCategory>
  ) {}

  async findAll(): Promise<VideoCategory[]> {
    return this.repo.find({ order: { created_at: 'DESC' } })
  }

  async findOne(id: number): Promise<VideoCategory | null> {
    const entity = await this.repo.findOne({ where: { id } })
    if (!entity) throw new NotFoundException('video category is NOT_FOUND')
    return entity
  }

  async create(dto: CreateVideoCategoryDto): Promise<VideoCategory> {
    const data = this.repo.create({ title: dto.title })
    try {
      return await this.repo.save(data)
    } catch (e) {
      this.logger.error('video category create error', e)
      if (e.code === '23505') {
        throw new ConflictException('Video category with this title already exists')
      }
      throw new BadRequestException('video category is NOT_CREATED')
    }
  }

  async update(id: number, dto: UpdateVideoCategoryDto): Promise<VideoCategory> {
    const updatePayload: Partial<VideoCategory> = {}
    if (typeof dto.title !== 'undefined') updatePayload.title = dto.title

    try {
      const result = await this.repo.update(id, updatePayload)
      if (result.affected === 0) throw new NotFoundException('video category is NOT_FOUND')
    } catch (e) {
      this.logger.error('video category update error', e)
      if (e.code === '23505') {
        throw new ConflictException('Video category with this title already exists')
      }
      throw e
    }
    return (await this.repo.findOne({ where: { id } })) as VideoCategory
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id)
    if (result.affected === 0) throw new NotFoundException('video category is NOT_FOUND')
    return { message: 'SUCCESS' }
  }
}
