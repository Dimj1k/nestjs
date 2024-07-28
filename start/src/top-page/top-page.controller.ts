import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageDto as CreateTopPageDto } from './dto/top-page.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TopPageService } from './top-page.service';
import { TOP_PAGE_IS_NOT_FOUND } from './top-page-constants';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    let topPage = this.topPageService.findByAlias(alias);
    if (!topPage) throw new BadRequestException(TOP_PAGE_IS_NOT_FOUND);
    return topPage;
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    let topPage = this.topPageService.findById(id);
    if (!topPage) throw new BadRequestException(TOP_PAGE_IS_NOT_FOUND);
    return topPage;
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    let deletedTopPage = this.topPageService.delete(id);
    if (!deletedTopPage) throw new BadRequestException(TOP_PAGE_IS_NOT_FOUND);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    let patchedTopPage = this.topPageService.patch(id, dto);
    if (!patchedTopPage) throw new BadRequestException(TOP_PAGE_IS_NOT_FOUND);
    return patchedTopPage;
  }

  @HttpCode(200)
  @Post('findByCategory')
  async find(@Body() dto: FindTopPageDto) {
    let foundedTopPages = this.topPageService.findByCategory(dto);
    if (!foundedTopPages) throw new BadRequestException(TOP_PAGE_IS_NOT_FOUND);
    return foundedTopPages;
  }
}
