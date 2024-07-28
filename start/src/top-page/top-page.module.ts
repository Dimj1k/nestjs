import { Module } from '@nestjs/common';
import { TopPageService } from './top-page.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageModel, TopPageSchema } from './top-page.model';
import { TopPageController } from './top-page.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopPageModel.name, schema: TopPageSchema },
    ]),
  ],
  providers: [TopPageService],
  controllers: [TopPageController],
})
export class TopPageModule {}
