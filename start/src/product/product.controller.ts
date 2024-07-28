import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id', IdValidationPipe) id: string) {
    const findedProduct = await this.productService.findById(id);
    if (!findedProduct)
      throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    return findedProduct;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteById(@Param('id', IdValidationPipe) id: string) {
    const deletedProduct = await this.productService.deleteById(id);
    if (!deletedProduct)
      throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateProductDto,
  ) {
    const patchedProduct = await this.productService.patch(id, dto);
    if (!patchedProduct)
      throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    return patchedProduct;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
