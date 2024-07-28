import { Injectable } from '@nestjs/common';
import { TopPageDocument, TopPageModel } from './top-page.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopPageDto } from './dto/top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel.name)
    private readonly topPageModel: Model<TopPageDocument>,
  ) {}

  async create(dto: TopPageDto): Promise<TopPageDocument> {
    let newTopPage = new this.topPageModel(dto);
    return newTopPage.save();
  }

  async findById(id: string): Promise<TopPageDocument> {
    return this.topPageModel.findById(id).exec();
  }

  async findByCategory(
    firstCategory: FindTopPageDto,
  ): Promise<TopPageDocument[] | null> {
    return this.topPageModel
      .aggregate([
        { $match: firstCategory },
        {
          $group: {
            _id: { secondCategory: '$secondCategory' },
            pages: { $push: { alias: '$alias', title: '$title' } },
          },
        },
      ])
      .exec();
  }

  async findByAlias(alias: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async delete(id: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async patch(id: string, dto: TopPageDto): Promise<TopPageDocument | null> {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
