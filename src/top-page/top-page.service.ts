import {Injectable} from '@nestjs/common';
import {InjectModel} from 'nestjs-typegoose';
import {DocumentType, ModelType} from '@typegoose/typegoose/lib/types';
import {TopLevelCategory, TopPageModel} from './top-page.model';
import {CreateTopPageDto} from './dto/create-top-page.dto';
import {FindTopPageDto} from './dto/find-top-page.dto';
import {addDays} from 'date-fns';
import {Types} from 'mongoose';

@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {
  }

  async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    return this.topPageModel.create(dto);
  }


  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string | Types.ObjectId, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true}).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias: alias }).exec()
  }

  async findAll() {
    return this.topPageModel.find({ }).exec()
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate([{
        $match: {
          firstCategory: firstCategory,
        }}, {
          $group: {
            _id: { secondCategory: '$secondCategory'},
            pages: {
              $push: { alias: '$alias', title: '$title'}
            }
          }
        }
      ]).exec();
      // .find({firstCategory: firstCategory},
      //   { alias: 1, secondCategory: 1, title: 1})
      // .exec();
  }

  async findByText(text: string) {
    // @ts-ignore
    return this.topPageModel.find({
      $text: {
        $search: text,
        $caseSensitive: false,
      }
    }).exec();
  }

  async findFoHhUpdate(date: Date) {
    return this.topPageModel.find( {
      firstCategory: 0,
      $or: [
        {'hh.updateAd': {$lt: addDays(date, -1)}},
        {'hh.updateAd': {$exists: false}},
  ]
    }).exec();
  }
}
