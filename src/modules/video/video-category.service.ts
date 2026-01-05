import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Repository } from 'typeorm'

import { CreateVideoCategoryDto } from './dto/create-video-category.dto'
import { UpdateVideoCategoryDto } from './dto/update-video-category.dto'
import { VideoCategoryTranslate } from './entities/video-category-translate.entity'
import { VideoCategory } from './entities/video-category.entity'

@Injectable()
export class VideoCategoryService {
  private readonly logger = new Logger(VideoCategoryService.name)
  constructor(
    @InjectRepository(VideoCategory)
    private readonly repo: Repository<VideoCategory>,
    @InjectRepository(VideoCategoryTranslate)
    private readonly translationsRepo: Repository<VideoCategoryTranslate>
  ) {}

  async findAll(lang: LANG): Promise<VideoCategory[]> {
    const list = await this.repo.find({
      order: { created_at: 'DESC' },
      relations: { translates: true },
    })

    return applyTranslations(list, lang)
  }

  async findOne(id: number, lang: LANG): Promise<VideoCategory> {
    const entity = await this.repo.findOne({ where: { id }, relations: { translates: true } })
    if (!entity) throw new NotFoundException('video category is NOT_FOUND')
    return applyTranslations([entity], lang)[0]
  }

  async create(dto: CreateVideoCategoryDto): Promise<VideoCategory> {
    const { title_en, title_ua, ...rest } = dto
    const data = this.repo.create({ title: rest.title })
    try {
      const saved = await this.repo.save(data)

      if (title_ua) await this.saveTranslate(saved, 'title', title_ua, LANG.UA)
      if (title_en) await this.saveTranslate(saved, 'title', title_en, LANG.EN)

      return await this.findOne(saved.id, LANG.UA) // Default to UA for admin response or just return created
    } catch (e) {
      this.logger.error('video category create error', e)
      if (e.code === '23505') {
        throw new ConflictException('Video category with this title already exists')
      }
      throw new BadRequestException('video category is NOT_CREATED')
    }
  }

  async update(id: number, dto: UpdateVideoCategoryDto): Promise<VideoCategory> {
    this.logger.log(`Updating video category ${id}. Payload: ${JSON.stringify(dto)}`)
    const { title_en, title_ua, ...rest } = dto
    const updatePayload: Partial<VideoCategory> = {}
    if (typeof rest.title !== 'undefined') updatePayload.title = rest.title

    try {
      if (Object.keys(updatePayload).length > 0) {
        const result = await this.repo.update(id, updatePayload)
        if (result.affected === 0) throw new NotFoundException('video category is NOT_FOUND')
      }

      const entity = await this.repo.findOne({ where: { id } })
      if (!entity) throw new NotFoundException('video category is NOT_FOUND')

      if (title_ua !== undefined) {
        this.logger.log(`Saving UA title: ${title_ua}`)
        await this.saveTranslate(entity, 'title', title_ua, LANG.UA)
      }
      if (title_en !== undefined) {
        this.logger.log(`Saving EN title: ${title_en}`)
        await this.saveTranslate(entity, 'title', title_en, LANG.EN)
      }
    } catch (e) {
      this.logger.error('video category update error', e)
      if (e.code === '23505') {
        throw new ConflictException('Video category with this title already exists')
      }
      throw e
    }

    return await this.findOne(id, LANG.UA)
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id)
    if (result.affected === 0) throw new NotFoundException('video category is NOT_FOUND')
    return { message: 'SUCCESS' }
  }

  private async saveTranslate(category: VideoCategory, field: string, value: string, lang: LANG) {
    const exist = await this.translationsRepo.findOne({
      where: {
        entity_id: { id: category.id },
        field,
        lang,
      },
    })

    if (exist) {
      await this.translationsRepo.update(exist.id, { value })
    } else {
      await this.translationsRepo.save({
        entity_id: category,
        field,
        value,
        lang,
      })
    }
  }
}
