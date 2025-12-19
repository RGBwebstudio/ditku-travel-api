import { PartialType } from '@nestjs/swagger'
import { CreateTermsOfUseDto } from './create-terms-of-use.dto'

export class UpdateTermsOfUseDto extends PartialType(CreateTermsOfUseDto) {}
