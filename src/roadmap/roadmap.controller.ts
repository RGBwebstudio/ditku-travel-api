import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Delete,
  Put
} from '@nestjs/common'
import { CreateRoadmapDto } from './dto/create-roadmap.dto'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto'
import { RoadmapService } from './roadmap.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Дорожня карта туру')
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати частину записів roadmap' })
  find(@Query('take') take: number = 20, @Query('skip') skip: number = 0) {
    return this.roadmapService.findAll(Number(take), Number(skip))
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати запис roadmap' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Cтворити запис roadmap' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  create(@Body() dto: CreateRoadmapDto) {
    return this.roadmapService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити запис roadmap' })
  update(@Body() dto: UpdateRoadmapDto, @Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити запис roadmap' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.delete(id)
  }
}
