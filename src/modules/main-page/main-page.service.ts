import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Repository, In } from 'typeorm'

import { CreateMainPageDto } from './dto/create-main-page.dto'
import { UpdateMainPageDto } from './dto/update-main-page.dto'
import { MainPage } from './entities/main-page.entity'
import { Post } from '../posts/entities/post.entity'

@Injectable()
export class MainPageService {
  private readonly logger = new Logger(MainPageService.name)

  constructor(
    @InjectRepository(MainPage)
    private readonly countryRepo: Repository<MainPage>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>
  ) {}

  async create(dto: CreateMainPageDto): Promise<MainPage> {
    const entity = this.countryRepo.create(dto)
    try {
      const savedEntity = await this.countryRepo.save(entity)
      return savedEntity
    } catch (error) {
      this.logger.error(`Error creating main-page: ${error.message}`)
      throw new BadRequestException('entity of main-page NOT_CREATED')
    }
  }

  async findAll(take: number, skip: number): Promise<{ entities: MainPage[]; count: number }> {
    const entities = await this.countryRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
    })

    const count = await this.countryRepo.count()

    return { entities, count }
  }

  async findOne(lang: LANG): Promise<MainPage> {
    const entity = await this.countryRepo.findOne({
      where: { lang },
      relations: {
        recommended_posts: {
          category_id: true,
          images: true,
          translates: true,
        },
      },
    })

    if (!entity) throw new NotFoundException('entity of main-page NOT_FOUND')

    return entity
  }

  async update(dto: UpdateMainPageDto): Promise<MainPage | null> {
    const { lang, recommended_post_ids, ...rest } = dto

    if (rest.structure && 'cta_section' in rest.structure) {
      delete (rest.structure as Record<string, unknown>).cta_section
    }

    const entity = await this.countryRepo.findOne({
      where: { lang },
      relations: {
        recommended_posts: {
          category_id: true,
          images: true,
        },
      },
    })

    if (!entity) {
      const created = this.countryRepo.create({ ...rest, lang })
      if (recommended_post_ids) {
        created.recommended_posts = await this.postRepo.find({
          where: { id: In(recommended_post_ids) },
          relations: {
            category_id: true,
            images: true,
            translates: true,
          },
        })
      }
      return await this.countryRepo.save(created)
    }

    Object.assign(entity, rest)

    if (recommended_post_ids) {
      entity.recommended_posts = await this.postRepo.find({
        where: { id: In(recommended_post_ids) },
        relations: {
          category_id: true,
          images: true,
          translates: true,
        },
      })
    }

    return await this.countryRepo.save(entity)
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.countryRepo.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('entity of main-page NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of main-page HAS_CHILDS')
      }

      this.logger.error(`Error while deleting main-page entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
