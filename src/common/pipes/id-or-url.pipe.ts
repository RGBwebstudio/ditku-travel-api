import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common'

@Injectable()
export class IdOrUrlValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { data } = metadata

    if (typeof value === 'string') {
      if (/^\d+$/.test(value)) {
        return parseInt(value, 10)
      }
      return value
    }

    if (typeof value === 'number') {
      return value
    }

    throw new BadRequestException(`param ${data} must be a number or string`)
  }
}
