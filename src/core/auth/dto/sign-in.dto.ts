import { ApiProperty } from '@nestjs/swagger'

import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @ApiProperty({ example: '' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  password: string
}
