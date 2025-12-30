import { Injectable } from '@nestjs/common'

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'
import { EntityManager } from 'typeorm'

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const [tableName, column] = args?.constraints as string[]

    const dataExist = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists()

    return !dataExist
  }

  defaultMessage(args?: ValidationArguments): string {
    const [tableName] = args?.constraints as string[]
    return `ALREADY_EXIST in table_name '${tableName}'`
  }
}
