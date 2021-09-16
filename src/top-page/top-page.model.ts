import {Base, TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {index, prop} from '@typegoose/typegoose';

export enum TopLevelCategory {
	Courses,
	Services,
	Books,
	Products
}

export class HhData{
	@prop()
	count: number;
	@prop()
	juniorSalary: number;
	@prop()
	middleSalary: number;
	@prop()
	seniorSalary: number;
	@prop()
	updatedAt: Date;
}

class TopPageAdvantage {
	@prop()
	title: string;
	@prop()
	description: string;
}


export interface TopPageModel extends Base{ }

// @index({ title: 'text', seoText: 'text'})
@index({ '$**': 'text'})
export class TopPageModel extends TimeStamps {
	@prop({ enum: TopLevelCategory })
	firstCategory: TopLevelCategory;
	@prop({unique: true})
	alias: string;
	@prop()
	secondCategory: string;
	@prop()
	title: string;
	@prop()
	category: string;
	@prop()
	hh?: HhData;
	@prop({ type: () => [TopPageAdvantage]})
	advantages: TopPageAdvantage[];
	@prop()
	seoText: string;
	@prop()
	tagsTitle: string;
	@prop({ type: () => [String]})
	tags: string[];
}
