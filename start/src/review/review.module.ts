import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModel, ReviewSchema } from './review.model';
import { UserModel, UserSchema } from 'src/auth/auth.model';
import { ProductModel, ProductSchema } from 'src/product/product.model';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    MongooseModule.forFeature([
      { name: ReviewModel.name, schema: ReviewSchema },
      { name: UserModel.name, schema: UserSchema },
      { name: ProductModel.name, schema: ProductSchema },
    ]),
  ],
})
export class ReviewModule {}
