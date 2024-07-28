import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { UserModel } from 'src/auth/auth.model';
import { ProductModel } from 'src/product/product.model';

export type ReviewDocument = HydratedDocument<ReviewModel>;

@Schema({ timestamps: true })
export class ReviewModel {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  rating: number;
  @Prop({ type: MSchema.Types.ObjectId, ref: ProductModel.name })
  productId: ProductModel;
  @Prop({ type: MSchema.Types.ObjectId, ref: UserModel.name })
  author: UserModel;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
