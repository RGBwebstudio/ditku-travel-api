import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class GalleryFileUploadPipe implements PipeTransform {
  private readonly limit = 15 * 1024 * 1024 // 15MB
  private readonly acceptableFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

  transform(value: Express.Multer.File | Express.Multer.File[]) {
    if (!value) {
      throw new BadRequestException('INVALID_FILE')
    }

    const files = Array.isArray(value) ? value : [value]

    if (files.length === 0) {
      throw new BadRequestException('INVALID_FILE')
    }

    for (const file of files) {
      if (!file || !file.size) {
        throw new BadRequestException('INVALID_FILE')
      }

      if (file.size > this.limit) {
        throw new BadRequestException(`File ${file.originalname} exceeds the limit of 15MB LIMIT_OF_SIZE`)
      }

      if (!this.acceptableFormats.includes(file.mimetype)) {
        throw new BadRequestException(`File ${file.originalname} has unsupported format`)
      }
    }

    return value
  }
}
