import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsString } from 'class-validator'
import { Genders } from 'src/common/enums/user.enum'

export class UserCreateDto {
  @ApiProperty({ example: 'Тарас' })
  @IsString()
  first_name: string

  @ApiProperty({ example: 'Шевченко' })
  @IsString()
  second_name: string

  @ApiProperty({ example: 'Григорович' })
  @IsString()
  middle_name: string

  @ApiProperty({ example: '1814-03-09' })
  @IsString()
  birth_date: string

  @ApiProperty({ example: Genders.MALE })
  @IsEnum(Genders)
  gender: Genders

  @ApiProperty({ example: '+380 (50) 777-19-87' })
  @IsString()
  phone: string

  @ApiProperty({ example: '' })
  @IsString()
  email: string

  @ApiProperty({ example: '' })
  @IsString()
  password: string
}
