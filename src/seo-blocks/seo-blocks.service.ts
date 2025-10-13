import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SeoBlock } from './entities/seo-block.entity'
import { CreateSeoBlockDto } from './dto/create-seo-block.dto'
import { UpdateSeoBlockDto } from './dto/update-seo-block.dto'

@Injectable()
export class SeoBlocksService {
  constructor(
    @InjectRepository(SeoBlock)
    private repo: Repository<SeoBlock>
  ) {}

  async findByKey(key: string): Promise<SeoBlock | null> {
    return this.repo.findOne({ where: { key } })
  }

  async create(dto: CreateSeoBlockDto): Promise<SeoBlock> {
    // Ensure unique meta_title if provided
    if (dto.meta_title) {
      const exists = await this.repo
        .createQueryBuilder('seoBlock')
        .where('LOWER(seoBlock.meta_title) = :title', {
          title: dto.meta_title.toLowerCase()
        })
        .getOne()

      if (exists) throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    const entity = this.repo.create(dto)
    return this.repo.save(entity)
  }

  async update(id: number, dto: UpdateSeoBlockDto): Promise<SeoBlock> {
    if (dto.meta_title) {
      const exists = await this.repo
        .createQueryBuilder('seoBlock')
        .where('LOWER(seoBlock.meta_title) = :title', {
          title: dto.meta_title.toLowerCase()
        })
        .andWhere('seoBlock.id != :id', { id })
        .getOne()

      if (exists) throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    await this.repo.update(id, dto)
    const updated = await this.repo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('seo block not found')
    return updated
  }

  async delete(id: number): Promise<{ message: string }> {
    const res = await this.repo.delete(id)
    if (res.affected === 0) throw new NotFoundException('seo block not found')
    return { message: 'OK' }
  }
}
