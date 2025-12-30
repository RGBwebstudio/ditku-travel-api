import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class PhoneLoginDto {
  @ApiProperty({
    description: 'Номер телефону користувача',
    example: '+380501234567',
  })
  @IsNotEmpty({ message: "Номер телефону є обов'язковим" })
  @IsString({ message: 'Номер телефону має бути рядком' })
  @Matches(/^\+380\d{9}$/, {
    message: 'Номер телефону має бути в форматі +380XXXXXXXXX',
  })
  phone: string
}
