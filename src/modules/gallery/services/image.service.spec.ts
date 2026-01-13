import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { ImageService } from './image.service'
import { S3Service } from './s3.service'
import { ImageQueryDto } from '../dto/image-query.dto'
import { Image } from '../entities/image.entity'

describe('ImageService', () => {
  let service: ImageService
  let repo: Repository<Image>
  let queryBuilder: any

  beforeEach(async () => {
    queryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
      getMany: jest.fn().mockResolvedValue([]),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: getRepositoryToken(Image),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {
            getPublicUrl: jest.fn((key) => `https://s3.example.com/${key}`),
          },
        },
      ],
    }).compile()

    service = module.get<ImageService>(ImageService)
    repo = module.get<Repository<Image>>(getRepositoryToken(Image))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return paginated results with default parameters', async () => {
      const query: ImageQueryDto = {}
      const mockImages = [new Image(), new Image()]
      const total = 10

      queryBuilder.getCount.mockResolvedValue(total)
      queryBuilder.getMany.mockResolvedValue(mockImages)

      const result = await service.findAll(query)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repo.createQueryBuilder).toHaveBeenCalledWith('image')
      expect(queryBuilder.skip).toHaveBeenCalledWith(0) // (1 - 1) * 20
      expect(queryBuilder.take).toHaveBeenCalledWith(20) // default limit
      expect(queryBuilder.getCount).toHaveBeenCalled()
      expect(result).toEqual({
        data: expect.any(Array),
        total,
        page: 1,
        limit: 20,
        totalPages: 1,
      })
      expect(result.data.length).toBe(2)
    })

    it('should respect custom page and limit', async () => {
      const query: ImageQueryDto = { page: 2, limit: 10 }
      const total = 25

      queryBuilder.getCount.mockResolvedValue(total)
      queryBuilder.getMany.mockResolvedValue([])

      const result = await service.findAll(query)

      expect(queryBuilder.skip).toHaveBeenCalledWith(10) // (2 - 1) * 10
      expect(queryBuilder.take).toHaveBeenCalledWith(10)
      expect(result).toEqual({
        data: [],
        total,
        page: 2,
        limit: 10,
        totalPages: 3, // Math.ceil(25 / 10)
      })
    })

    it('should apply filters correctly', async () => {
      const query: ImageQueryDto = { categoryId: 5, originalName: 'test' }

      await service.findAll(query)

      expect(queryBuilder.where).toHaveBeenCalledWith('image.categoryId = :categoryId', { categoryId: 5 })
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('image.originalName ILIKE :originalName', {
        originalName: '%test%',
      })
    })

    it('should correctly calculate total pages', async () => {
      const query: ImageQueryDto = { limit: 5 }
      queryBuilder.getCount.mockResolvedValue(12)

      const result = await service.findAll(query)

      expect(result.totalPages).toBe(3) // 12 / 5 = 2.4 => 3
    })
  })
})
