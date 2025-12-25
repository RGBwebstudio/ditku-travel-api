import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { UploadedFile } from 'src/common/types/uploaded-file.types'

@Injectable()
export class GalleryFileUploadPipe implements PipeTransform {
  private readonly limit = 5 * 1024 * 1024 // 5MB
  private readonly acceptableFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

  transform(value: UploadedFile | UploadedFile[]) {
    if (!value) {
      throw new BadRequestException('INVALID_FILE')
    }

    const file = Array.isArray(value) ? value[0] : value

    if (!file || !file.size) {
      throw new BadRequestException('INVALID_FILE')
    }

    if (file.size > this.limit) {
      throw new BadRequestException('File size exceeds the limit of 5MB LIMIT_OF_SIZE')
    }

    if (!this.acceptableFormats.includes(file.mimetype)) {
      throw new BadRequestException('UNSUPPORTED_FILE_FORMAT')
    }

    return file
  }
}
