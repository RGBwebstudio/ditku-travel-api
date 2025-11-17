import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { SeoFilter } from './entities/seo-filter.entity'
import { SeoFilterCreateDto } from './dto/seo-filter-create.dto'
import { SeoFilterUpdateDto } from './dto/seo-filter-update.dto'
import { Category } from 'src/category/entities/category.entity'
import { City } from 'src/city/entities/city.entity'
import { Country } from 'src/country/entities/country.entity'
import { Section } from 'src/section/entities/section.entity'

type SeoFilterRel = Omit<
  SeoFilter,
  'category_id' | 'city_id' | 'country_id' | 'parent'
> & {
  category_id?: Category | null
  city_id?: City | null
  country_id?: Country | null
  parent?: SeoFilter | null
}

@Injectable()
export class SeoFilterService {
  private readonly logger = new Logger(SeoFilterService.name)

  constructor(
    @InjectRepository(SeoFilter)
    private readonly seoFilterRepository: Repository<SeoFilter>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>
  ) {}

  async find(): Promise<{ entities: SeoFilter[]; count: number }> {
    const treeRepository =
      this.seoFilterRepository.manager.getTreeRepository(SeoFilter)
    const treeRoots = await treeRepository.findTrees()
    const totalCount = await this.seoFilterRepository.count()
    return { entities: treeRoots, count: totalCount }
  }

  async findOne(id: number): Promise<SeoFilter | null> {
    const treeRepository =
      this.seoFilterRepository.manager.getTreeRepository(SeoFilter)
    const seoFilterEntity = await this.seoFilterRepository.findOne({
      where: { id }
    })
    if (!seoFilterEntity) throw new NotFoundException('seo_filter is NOT_FOUND')

    const descendantTree =
      await treeRepository.findDescendantsTree(seoFilterEntity)

    const collectedIds: number[] = []
    const collectNodes = (nodeList: SeoFilter[]) => {
      for (const node of nodeList) {
        collectedIds.push(node.id)
        if (node.children && node.children.length) collectNodes(node.children)
      }
    }
    collectNodes(
      Array.isArray(descendantTree) ? descendantTree : [descendantTree]
    )

    const enrichedEntities = collectedIds.length
      ? await this.seoFilterRepository.find({
          where: { id: In(collectedIds) },
          relations: ['sections', 'category_id', 'city_id', 'country_id']
        })
      : []

    const enrichedMap = new Map<number, SeoFilter>(
      enrichedEntities.map((entity) => [entity.id, entity])
    )

    const enrichNode = (node: SeoFilter): SeoFilter => {
      const enrichedNode = enrichedMap.get(node.id) as SeoFilter
      if (!enrichedNode) return node
      if (node.children && node.children.length) {
        enrichedNode.children = node.children.map(enrichNode)
      } else {
        enrichedNode.children = []
      }
      return enrichedNode
    }

    const rootNode = Array.isArray(descendantTree)
      ? descendantTree[0]
      : descendantTree
    return enrichNode(rootNode)
  }

  async findOneByUrl(url: string): Promise<SeoFilter | null> {
    const treeRepository =
      this.seoFilterRepository.manager.getTreeRepository(SeoFilter)
    const seoFilterEntity = await this.seoFilterRepository.findOne({
      where: { url }
    })
    if (!seoFilterEntity) throw new NotFoundException('seo_filter is NOT_FOUND')

    const descendantTree =
      await treeRepository.findDescendantsTree(seoFilterEntity)

    const collectedIds: number[] = []
    const collectNodes = (nodeList: SeoFilter[]) => {
      for (const node of nodeList) {
        collectedIds.push(node.id)
        if (node.children && node.children.length) collectNodes(node.children)
      }
    }
    collectNodes(
      Array.isArray(descendantTree) ? descendantTree : [descendantTree]
    )

    const enrichedEntities = collectedIds.length
      ? await this.seoFilterRepository.find({
          where: { id: In(collectedIds) },
          relations: ['sections', 'category_id', 'city_id', 'country_id']
        })
      : []

    const enrichedMap = new Map<number, SeoFilter>(
      enrichedEntities.map((entity) => [entity.id, entity])
    )

    const enrichNode = (node: SeoFilter): SeoFilter => {
      const enrichedNode = enrichedMap.get(node.id) as SeoFilter
      if (!enrichedNode) return node
      if (node.children && node.children.length) {
        enrichedNode.children = node.children.map(enrichNode)
      } else {
        enrichedNode.children = []
      }
      return enrichedNode
    }

    const rootNode = Array.isArray(descendantTree)
      ? descendantTree[0]
      : descendantTree
    return enrichNode(rootNode)
  }

  async create(createDto: SeoFilterCreateDto): Promise<SeoFilter> {
    const seoFilterData = this.seoFilterRepository.create()
    if (createDto.title !== undefined) {
      seoFilterData.title = createDto.title
    }
    if (createDto.url !== undefined) {
      seoFilterData.url = createDto.url
    }
    if (createDto.seo_title !== undefined) {
      seoFilterData.seo_title = createDto.seo_title
    }
    if (createDto.seo_description !== undefined) {
      seoFilterData.seo_description = createDto.seo_description
    }
    if (createDto.seo_text !== undefined) {
      seoFilterData.seo_text = createDto.seo_text
    }

    if (createDto.category_id) {
      seoFilterData.category_id = {
        id: createDto.category_id
      } as Category
    }
    if (createDto.city_id) {
      seoFilterData.city_id = {
        id: createDto.city_id
      } as City
    }
    if (createDto.country_id) {
      seoFilterData.country_id = {
        id: createDto.country_id
      } as Country
    }

    if (createDto.sections?.length) {
      const sectionEntities = await this.sectionRepository.find({
        where: {
          id: In(createDto.sections)
        }
      })
      seoFilterData.sections = sectionEntities
    }

    if (createDto.parent_id) {
      seoFilterData.parent = {
        id: createDto.parent_id
      } as SeoFilter
    }

    try {
      const savedEntity = await this.seoFilterRepository.save(seoFilterData)
      return (await this.findOne(savedEntity.id)) as SeoFilter
    } catch (err) {
      this.logger.error(`Error while creating seo_filter: ${err}`)
      throw new BadRequestException('seo_filter is NOT_CREATED')
    }
  }

  async update(id: number, updateDto: SeoFilterUpdateDto): Promise<SeoFilter> {
    const existingEntity = await this.seoFilterRepository.findOne({
      where: {
        id
      }
    })
    if (!existingEntity) throw new NotFoundException('seo_filter is NOT_FOUND')

    if (updateDto.title !== undefined) {
      existingEntity.title = updateDto.title
    }
    if (updateDto.url !== undefined) {
      existingEntity.url = updateDto.url
    }
    if (updateDto.seo_title !== undefined) {
      existingEntity.seo_title = updateDto.seo_title
    }
    if (updateDto.seo_description !== undefined) {
      existingEntity.seo_description = updateDto.seo_description
    }
    if (updateDto.seo_text !== undefined) {
      existingEntity.seo_text = updateDto.seo_text
    }

    const relEntity = existingEntity as SeoFilterRel
    if (updateDto.category_id !== undefined) {
      if (updateDto.category_id === null) {
        relEntity.category_id = null
      } else {
        relEntity.category_id = {
          id: updateDto.category_id
        } as Category
      }
    }
    if (updateDto.city_id !== undefined) {
      if (updateDto.city_id === null) {
        relEntity.city_id = null
      } else {
        relEntity.city_id = {
          id: updateDto.city_id
        } as City
      }
    }
    if (updateDto.country_id !== undefined) {
      if (updateDto.country_id === null) {
        relEntity.country_id = null
      } else {
        relEntity.country_id = {
          id: updateDto.country_id
        } as Country
      }
    }

    if (updateDto.sections !== undefined) {
      const sectionEntities = await this.sectionRepository.find({
        where: {
          id: In(updateDto.sections)
        }
      })
      relEntity.sections = sectionEntities
    }

    if (updateDto.parent_id !== undefined) {
      if (updateDto.parent_id === null) {
        relEntity.parent = null
      } else {
        relEntity.parent = {
          id: updateDto.parent_id
        } as SeoFilter
      }
    }

    try {
      await this.seoFilterRepository.save(relEntity as SeoFilter)
    } catch (err) {
      this.logger.error(`Error while updating seo_filter: ${err}`)
      throw new BadRequestException('seo_filter is NOT_UPDATED')
    }

    return (await this.findOne(id)) as SeoFilter
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const deleteResult = await this.seoFilterRepository.delete(id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException('seo_filter is NOT_FOUND')
      }
    } catch (err) {
      this.logger.error(`Error while deleting seo_filter: ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async findByCategory(id: number): Promise<SeoFilter[]> {
    const treeRepository =
      this.seoFilterRepository.manager.getTreeRepository(SeoFilter)

    // find filters directly attached to category
    const roots = await this.seoFilterRepository.find({
      where: { category_id: { id } }
    })

    if (!roots || roots.length === 0) return []

    const resultTrees: SeoFilter[] = []
    for (const root of roots) {
      const tree = await treeRepository.findDescendantsTree(root)
      resultTrees.push(tree as SeoFilter)
    }

    return resultTrees
  }
}
