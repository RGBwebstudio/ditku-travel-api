import { Injectable } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'
import { EntityManager } from 'typeorm'

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsExistIdInArray implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(ids: number[], args?: ValidationArguments): Promise<boolean> {
    const [tableName] = args?.constraints as string[]

    if (!ids || ids.length === 0) return true

    for (const id of ids) {
      const dataExist = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where(`${tableName}.id = :id`, { id })
        .getExists()

      if (!dataExist) {
        return false
      }
    }

    return true
  }

  defaultMessage(args?: ValidationArguments): string {
    const [tableName] = args?.constraints as string[]
    return `NOT_EXIST in table_name '${tableName}'`
  }
}
