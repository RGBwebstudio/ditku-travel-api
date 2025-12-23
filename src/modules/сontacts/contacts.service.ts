import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Repository } from 'typeorm'

import { CreateContactsDto } from './dto/create-contacts.dto'
import { UpdateContactsDto } from './dto/update-contacts.dto'
import { Contacts } from './entities/contacts.entity'

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name)

  constructor(
    @InjectRepository(Contacts)
    private readonly contactsRepo: Repository<Contacts>
  ) {}

  async create(dto: CreateContactsDto): Promise<Contacts> {
    const entity = this.contactsRepo.create(dto)
    try {
      const savedEntity = await this.contactsRepo.save(entity)
      return savedEntity
    } catch (error) {
      this.logger.error(`Error creating contacts: ${error.message}`)
      throw new BadRequestException('user is NOT_CREATED')
    }
  }

  async findAll(take: number, skip: number): Promise<{ entities: Contacts[]; count: number }> {
    const entities = await this.contactsRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
    })

    const count = await this.contactsRepo.count()

    return { entities, count }
  }

  async findOne(lang: LANG): Promise<Contacts> {
    const entity = await this.contactsRepo.findOne({
      where: { lang },
    })

    if (!entity) throw new NotFoundException('user is NOT_FOUND')

    return entity
  }
  async update(dto: UpdateContactsDto): Promise<Contacts | null> {
    const { lang } = dto
    const result = await this.contactsRepo.update({ lang }, dto)

    if (result.affected === 0) {
      const entity = this.contactsRepo.create(dto)
      try {
        const savedEntity = await this.contactsRepo.save(entity)
        return savedEntity
      } catch (error) {
        this.logger.error(`Error creating contacts: ${error.message}`)
        throw new BadRequestException('user is NOT_CREATED')
      }
    }

    const entity = await this.contactsRepo.findOne({ where: { lang } })
    return entity
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.contactsRepo.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('user is NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('user HAS_CHILDS')
      }

      this.logger.error(`Error while deleting contacts entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
