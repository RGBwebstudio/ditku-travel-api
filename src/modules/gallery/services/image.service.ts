import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import sharp from 'sharp'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { S3Service } from './s3.service'
import { ImageQueryDto } from '../dto/image-query.dto'
import { UpdateImageDto } from '../dto/update-image.dto'
import { Image } from '../entities/image.entity'

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name)
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  private readonly avifQuality: number

  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
    private readonly s3Service: S3Service
  ) {
    this.avifQuality = parseInt(process.env.AVIF_CONVERTING_QUALITY || '80', 10)
  }

  private parseSize(sizeString: string): { width: number; height: number } {
    const parts = sizeString.split('x')
    if (parts.length !== 2) {
      throw new BadRequestException(
        `Invalid size format: ${sizeString}. Expected format: "widthxheight" (e.g., "320x540")`
      )
    }

    const width = parseInt(parts[0], 10)
    const height = parseInt(parts[1], 10)

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      throw new BadRequestException(`Invalid size values: ${sizeString}. Width and height must be positive numbers.`)
    }

    return { width, height }
  }

  private async resizeAndConvertImage(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return await sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
      })
      .avif({ quality: this.avifQuality })
      .toBuffer()
  }

  async uploadImage(
    file: Express.Multer.File,
    categoryId?: number | null,
    lg?: string,
    md?: string,
    sm?: string
  ): Promise<Image> {
    if (!file || !file.buffer) {
      throw new BadRequestException('INVALID_FILE')
    }

    // Validate MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('UNSUPPORTED_FILE_FORMAT')
    }

    // Validate size parameters
    if (!lg || !md || !sm) {
      throw new BadRequestException(
        'Size parameters (lg, md, sm) are required. Format: "widthxheight" (e.g., "320x540")'
      )
    }

    try {
      // Parse size parameters
      const lgSize = this.parseSize(lg)
      const mdSize = this.parseSize(md)
      const smSize = this.parseSize(sm)

      // Generate UUID for filename base
      const fileId = uuidv4()
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const uploadDir = this.s3Service.getUploadDir()

      // Resize and convert images
      const [lgBuffer, mdBuffer, smBuffer] = await Promise.all([
        this.resizeAndConvertImage(file.buffer, lgSize.width, lgSize.height),
        this.resizeAndConvertImage(file.buffer, mdSize.width, mdSize.height),
        this.resizeAndConvertImage(file.buffer, smSize.width, smSize.height),
      ])

      // Construct S3 keys
      const s3KeyLg = `${uploadDir}/${year}/${month}/${fileId}_lg.avif`
      const s3KeyMd = `${uploadDir}/${year}/${month}/${fileId}_md.avif`
      const s3KeySm = `${uploadDir}/${year}/${month}/${fileId}_sm.avif`

      // Upload all three versions to S3
      await Promise.all([
        this.s3Service.uploadFile(s3KeyLg, lgBuffer, 'image/avif'),
        this.s3Service.uploadFile(s3KeyMd, mdBuffer, 'image/avif'),
        this.s3Service.uploadFile(s3KeySm, smBuffer, 'image/avif'),
      ])

      // Save metadata to database
      const image = this.imageRepo.create({
        originalName: file.originalname,
        path_lg: s3KeyLg,
        path_md: s3KeyMd,
        path_sm: s3KeySm,
        contentType: 'image/avif',
        categoryId: categoryId || null,
      })

      return this.mapToPublicUrl(await this.imageRepo.save(image))
    } catch (error) {
      this.logger.error(`Failed to upload image: ${(error as Error).message}`, (error as Error).stack)
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new BadRequestException('NOT_UPLOADED')
    }
  }

  async uploadImages(
    files: Express.Multer.File[],
    categoryId?: number | null,
    lg?: string,
    md?: string,
    sm?: string
  ): Promise<Image[]> {
    const images: Image[] = []
    for (const file of files) {
      images.push(await this.uploadImage(file, categoryId, lg, md, sm))
    }
    return images
  }

  async findAll(query: ImageQueryDto): Promise<{
    data: Image[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const { page = 1, limit = 20, categoryId, originalName } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.imageRepo.createQueryBuilder('image')

    // Apply filters
    if (categoryId) {
      queryBuilder.where('image.categoryId = :categoryId', { categoryId })
    }

    if (originalName) {
      queryBuilder.andWhere('image.originalName ILIKE :originalName', {
        originalName: `%${originalName}%`,
      })
    }

    // Get total count
    const total = await queryBuilder.getCount()

    // Apply pagination and ordering
    const data = await queryBuilder
      .leftJoinAndSelect('image.category', 'category')
      .orderBy('image.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany()

    return {
      data: data.map((img) => this.mapToPublicUrl(img)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepo.findOne({
      where: { id },
      relations: ['category'],
    })
    if (!image) {
      throw new NotFoundException('NOT_FOUND')
    }
    return this.mapToPublicUrl(image)
  }

  async update(id: number, dto: UpdateImageDto): Promise<Image> {
    const image = await this.imageRepo.findOne({ where: { id } })
    if (!image) {
      throw new NotFoundException('NOT_FOUND')
    }

    // Only allow updating categoryId
    if (dto.categoryId !== undefined) {
      image.categoryId = dto.categoryId || null
    }

    return this.mapToPublicUrl(await this.imageRepo.save(image))
  }

  async delete(id: number): Promise<{ success: boolean }> {
    const image = await this.imageRepo.findOne({ where: { id } })
    if (!image) {
      throw new NotFoundException('NOT_FOUND')
    }

    // Delete all three versions from S3
    const filesToDelete = [image.path_lg, image.path_md, image.path_sm].filter((path): path is string => path !== null)

    for (const filePath of filesToDelete) {
      try {
        await this.s3Service.deleteFile(filePath)
      } catch (error) {
        this.logger.warn(`Failed to delete file from S3 (${filePath}): ${(error as Error).message}`)
        // Continue with other deletions even if one fails
      }
    }

    // Delete from database
    await this.imageRepo.delete(id)
    return { success: true }
  }

  private mapToPublicUrl(image: Image): Image {
    if (image.path_lg) {
      image.path_lg = this.s3Service.getPublicUrl(image.path_lg)
    }
    if (image.path_md) {
      image.path_md = this.s3Service.getPublicUrl(image.path_md)
    }
    if (image.path_sm) {
      image.path_sm = this.s3Service.getPublicUrl(image.path_sm)
    }
    return image
  }
}
