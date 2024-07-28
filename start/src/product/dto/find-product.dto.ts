import { IsNumber, IsString, Min } from 'class-validator';

export class FindProductDto {
  @IsString()
  category: string;
  @Min(1)
  @IsNumber()
  limit: number;
}
