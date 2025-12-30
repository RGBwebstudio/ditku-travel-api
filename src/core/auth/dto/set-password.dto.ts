import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SetPasswordDto {
  @ApiProperty({
    description: 'Email користувача для якого встановлюється пароль',
    example: 'example@email.com',
  })
  @IsString({ message: 'Email користувача має бути валідним email' })
  @IsNotEmpty({ message: "Email користувача є обов'язковим" })
  email: string

  @ApiProperty({
    description: 'Новий пароль користувача',
    example: 'newSecurePassword123',
  })
  @IsString({ message: 'Пароль має бути рядком' })
  @IsNotEmpty({ message: "Пароль є обов'язковим" })
  @MinLength(6, { message: 'Пароль має містити мінімум 6 символів' })
  password: string
}
