import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name)
  private readonly s3Client: S3Client
  private readonly bucketName: string
  private readonly uploadDir: string
  private readonly endpoint: string

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('S3_REGION')
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID')
    const secretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY')
    const awsEndpointUrl = this.configService.get<string>('S3_ENDPOINT_URL') || 'https://fsn1.your-objectstorage.com'
    this.endpoint = awsEndpointUrl
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME') || ''
    this.uploadDir = process.env.S3_UPLOAD_DIR || 'images'

    if (!accessKeyId || !secretAccessKey) {
      this.logger.warn(
        'credentials not configured. S3 operations will fail. Set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY environment variables.'
      )
    }

    this.logger.log(`Config - Region: ${region}`)
    this.logger.log(`Config - Bucket: ${this.bucketName}`)
    this.logger.log(`Config - AccessKeyId: ${accessKeyId ? 'Set' : 'Not Set'}`)
    this.logger.log(`Config - SecretAccessKey: ${secretAccessKey ? 'Set' : 'Not Set'}`)

    this.s3Client = new S3Client({
      region,
      endpoint: awsEndpointUrl,
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
      forcePathStyle: true,
    })
  }

  getPublicUrl(key: string): string {
    // Assuming path-style access for Hetzner/generic S3 compability when forcePathStyle is true
    // URL: https://endpoint/bucket/key
    // Remove trailing slash from endpoint if present
    const cleanEndpoint = this.endpoint.replace(/\/$/, '')
    // Ensure key doesn't have leading slash to avoid double slash
    const cleanKey = key.replace(/^\//, '')

    return `${cleanEndpoint}/${this.bucketName}/${cleanKey}`
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })

      await this.s3Client.send(command)
      this.logger.log(`File uploaded successfully: ${key}`)
      return key
    } catch (error) {
      this.logger.error(`Failed to upload file to S3 (${key}): ${(error as Error).message}`, (error as Error).stack)
      throw new BadRequestException('FILE_UPLOAD_FAILED')
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      await this.s3Client.send(command)
      this.logger.log(`File deleted successfully: ${key}`)
    } catch (error) {
      this.logger.error(`Failed to delete file from S3 (${key}): ${(error as Error).message}`, (error as Error).stack)
      // Don't throw error - file might not exist, which is acceptable
    }
  }

  getUploadDir(): string {
    return this.uploadDir
  }
}
