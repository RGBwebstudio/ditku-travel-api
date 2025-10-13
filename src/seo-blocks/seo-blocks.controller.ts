import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SeoBlocksService } from './seo-blocks.service'
import { CreateSeoBlockDto } from './dto/create-seo-block.dto'
import { UpdateSeoBlockDto } from './dto/update-seo-block.dto'
import { SeoBlock } from './entities/seo-block.entity'

@ApiTags('SEO (контентні сторінки)')
@Controller('seo-blocks')
export class SeoBlocksController {
  constructor(private readonly service: SeoBlocksService) {}

  @Get(':key')
  async getByKey(@Param('key') key: string): Promise<SeoBlock | null> {
    return this.service.findByKey(key)
  }

  @Post()
  async create(@Body() dto: CreateSeoBlockDto): Promise<SeoBlock> {
    return this.service.create(dto)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSeoBlockDto
  ): Promise<SeoBlock> {
    return this.service.update(Number(id), dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.delete(Number(id))
  }
}
