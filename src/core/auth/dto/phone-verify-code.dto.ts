import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches, Length } from 'class-validator'

export class PhoneVerifyCodeDto {
  @ApiProperty({
    description: 'Номер телефону користувача',
    example: '+380501234567'
  })
  @IsNotEmpty({ message: "Номер телефону є обов'язковим" })
  @IsString({ message: 'Номер телефону має бути рядком' })
  @Matches(/^\+380\d{9}$/, {
    message: 'Номер телефону має бути в форматі +380XXXXXXXXX'
  })
  phone: string

  @ApiProperty({
    description: '6-значний код підтвердження',
    example: '000000'
  })
  @IsNotEmpty({ message: "Код підтвердження є обов'язковим" })
  @IsString({ message: 'Код підтвердження має бути рядком' })
  @Length(6, 6, { message: 'Код підтвердження має містити рівно 6 цифр' })
  @Matches(/^\d{6}$/, {
    message: 'Код підтвердження має містити тільки цифри'
  })
  code: string
}
