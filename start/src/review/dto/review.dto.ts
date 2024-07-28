import { IsNumber, IsObject, IsString, Max, Min } from 'class-validator';
import { UserModel } from 'src/auth/auth.model';

export class CreateReviewDto {
  @IsString()
  name: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;
  @IsString()
  productId: string;
  // author: UserModel;
}
