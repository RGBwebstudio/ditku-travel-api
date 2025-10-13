import { IsInt, IsPositive, IsString } from 'class-validator'

export class CartUpdateUserDto {
  @IsString()
  session_id: string

  @IsInt()
  @IsPositive()
  user_id: number
}
