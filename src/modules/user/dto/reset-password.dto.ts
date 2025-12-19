import { IsEmail, IsString, Length } from 'class-validator'

export class ResetPasswordDto {
  @Length(6, 6)
  code: string

  @IsEmail()
  email: string

  @IsString()
  password: string
}
