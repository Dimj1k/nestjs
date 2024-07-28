import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TopPageDocument = HydratedDocument<TopPageModel>;

export enum TopLevelCategory {
  COURSES,
  SERVICES,
  BOOKS,
  PRODUCTS,
}

export class HhStats {
  @Prop()
  count: number;
  @Prop()
  juniorSalary: number;
  @Prop()
  middleSalary: number;
  @Prop()
  seniorSalary: number;
}

export class AdvantagesTopPage {
  @Prop()
  title: string;
  @Prop()
  description: string;
}

@Schema({ timestamps: true })
export class TopPageModel {
  @Prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;
  @Prop()
  secondCategory: string;
  @Prop()
  title: string;
  @Prop({ unique: true })
  alias: string;
  @Prop()
  category: string;
  @Prop(HhStats)
  hh?: HhStats;
  @Prop([AdvantagesTopPage])
  advantages: AdvantagesTopPage[];
  @Prop()
  seoText: string;
  @Prop()
  tagsTitle: string;
  @Prop([String])
  tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
TopPageSchema.index(
  {
    title: 'text',
    category: 'text',
    alias: 'text',
    secondCategory: 'text',
  },
  { weights: { title: 2, category: 4, alias: 6, secondCategory: 3 } },
);
