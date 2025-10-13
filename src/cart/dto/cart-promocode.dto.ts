import { IsString } from 'class-validator'

export class CartPromocodeDto {
  @IsString()
  title: string
}
