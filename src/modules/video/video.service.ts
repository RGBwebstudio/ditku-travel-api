import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeepPartial } from 'typeorm'
import { Video } from './entities/video.entity'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { VideoCategory } from './entities/video-category.entity'

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name)
  constructor(
    @InjectRepository(Video)
    private readonly repo: Repository<Video>
  ) {}

  async findAll(): Promise<Video[]> {
    return this.repo.find({
      relations: ['category_id'],
      order: { created_at: 'DESC' }
    })
  }

  async findOne(id: number): Promise<Video | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['category_id']
    })
    if (!entity) throw new NotFoundException('video is NOT_FOUND')
    return entity
  }

  async create(dto: CreateVideoDto): Promise<Video> {
    const payload: DeepPartial<Video> = {
      youtube_link: dto.youtube_link,
      order: dto.order ?? 0
    }

    if (typeof dto.category_id !== 'undefined' && dto.category_id !== null) {
      payload.category_id = Object.assign({
        id: dto.category_id
      } as VideoCategory)
    }

    const data = this.repo.create(payload)
    try {
      return await this.repo.save(data)
    } catch (e) {
      this.logger.error('video create error', e)
      throw new BadRequestException('video is NOT_CREATED')
    }
  }

  async update(id: number, dto: UpdateVideoDto): Promise<Video> {
    const updatePayload: Partial<Video> = {}

    if (typeof dto.category_id !== 'undefined') {
      if (dto.category_id === null) {
        updatePayload.category_id = null
      } else {
        updatePayload.category_id = Object.assign({
          id: dto.category_id
        } as VideoCategory)
      }
    }

    if (typeof dto.youtube_link !== 'undefined')
      updatePayload.youtube_link = dto.youtube_link
    if (typeof dto.order !== 'undefined') updatePayload.order = dto.order

    const result = await this.repo.update(id, updatePayload)
    if (result.affected === 0) throw new NotFoundException('video is NOT_FOUND')
    return (await this.repo.findOne({
      where: { id },
      relations: ['category_id']
    })) as Video
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id)
    if (result.affected === 0) throw new NotFoundException('video is NOT_FOUND')
    return { message: 'SUCCESS' }
  }
}
