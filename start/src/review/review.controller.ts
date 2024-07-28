import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';
import { REVIEW_IS_NOT_FOUND, REVIEWS_IS_NOT_FOUND } from './review.constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { JwtGuard } from 'src/guards/jwt.guard';

export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  @Post('create')
  async create(@Body() dto: CreateReviewDto, @UserEmail() email: string) {
    console.log(email);
    return this.reviewService.create(dto);
  }

  @Get('byProduct/:id')
  async getByProduct(@Param('id', IdValidationPipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_IS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('byProduct/:productId')
  async deleteReviewsByProduct(
    @Param('productId', IdValidationPipe) productId: string,
  ) {
    const deletedReviews =
      await this.reviewService.deleteByProductId(productId);
    if (!deletedReviews.deletedCount)
      throw new HttpException(REVIEWS_IS_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
