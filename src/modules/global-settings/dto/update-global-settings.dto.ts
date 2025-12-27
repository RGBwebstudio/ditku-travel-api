import { PartialType } from '@nestjs/swagger'

import { CreateGlobalSettingsDto } from './create-global-settings.dto'

export class UpdateGlobalSettingsDto extends PartialType(CreateGlobalSettingsDto) {}
