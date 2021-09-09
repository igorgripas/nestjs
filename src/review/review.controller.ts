import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post, UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {ReviewService} from './review.service';
import {REVIEW_NOT_FOUND} from './review.constants';
import {CreateReviewDto} from './dto/create-review.dto';
import {JwtAuthGuard} from '../auth/guards/jwt.guard';
import {UserEmail} from '../decorators/user-email.decorator';
import {IdValidationPipe} from '../pipes/id-validation.pipe';
import {TelegramService} from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService, private readonly telegramService: TelegramService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(@Body() dto: CreateReviewDto) {
		const message = `Name: ${dto.name}\n`
		+` Title: ${dto.title}\n`
		+ `Description: ${dto.description}\n`
		+ `Product Id: ${dto.productId}`
		return this.telegramService.sendMessage(message)
	}
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('byProduct/:productId')
	async getByProduct(@Param('productId', IdValidationPipe) productId: string, @UserEmail() email: string) {
		return this.reviewService.findByProductId(productId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('byProduct/:productId')
	async deleteByProduct(@Param('productId', IdValidationPipe) productId: string) {
		return this.reviewService.deleteByProductId(productId);
	}
}
