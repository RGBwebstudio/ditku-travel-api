import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

import { UploadedFile } from '../types/uploaded-file.types'

@Injectable()
export class FilesSizeValidationPipe implements PipeTransform {
  private readonly limit = 15 * 1024 * 1024
  private readonly acceptableFormats = ['image/webp', 'image/jpeg', 'image/png']

  transform(values: UploadedFile[]) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new BadRequestException('No files uploaded NO_FILES')
    }

    for (const value of values) {
      if (!value || !value.size) {
        throw new BadRequestException('Invalid file INVALID_FILE ')
      }

      if (value.size > this.limit) {
        throw new BadRequestException('File size exceeds the limit of 15MB LIMIT_OF_SIZE ')
      }

      if (!this.acceptableFormats.includes(value.mimetype)) {
        throw new BadRequestException('UNSUPPORTED_FILE_FORMAT')
      }
    }

    return values
  }
}
