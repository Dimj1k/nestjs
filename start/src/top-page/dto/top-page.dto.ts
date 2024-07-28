import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum TopLevelCategory {
  COURSES,
  SERVICES,
  BOOKS,
  PRODUCTS,
}

export class HhStatsDto {
  @IsNumber()
  count: number;
  @IsNumber()
  juniorSalary: number;
  @IsNumber()
  middleSalary: number;
  @IsNumber()
  seniorSalary: number;
}

export class AdvantagesTopPageDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}

export class TopPageDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;
  @IsString()
  secondCategory: string;
  @IsString()
  title: string;
  @IsString()
  category: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => HhStatsDto)
  hh?: HhStatsDto;
  @ValidateNested()
  @Type(() => AdvantagesTopPageDto)
  @IsArray()
  advantages: AdvantagesTopPageDto[];
  @IsString()
  seoText: string;
  @IsString()
  tagsTitle: string;
  @IsString({ each: true })
  @IsArray()
  tags: string[];
}
