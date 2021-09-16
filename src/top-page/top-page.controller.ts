import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {FindTopPageDto} from './dto/find-top-page.dto';
import {TopPageService} from './top-page.service';
import {CreateTopPageDto} from './dto/create-top-page.dto';
import {TOP_PAGE_NOT_FOUND, TOP_PAGE_NOT_FOUND_BY_ALIAS} from './top-page.constants';
import {IdValidationPipe} from '../pipes/id-validation.pipe';
import {JwtAuthGuard} from '../auth/guards/jwt.guard';
import {HhService} from '../hh/hh.service';

@Controller('top-page')
export class TopPageController {

	constructor(private readonly topPageService: TopPageService, private readonly hhService: HhService) {
	}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const topPage = await this.topPageService.findById(id);
		if (!topPage) {
			throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return topPage;
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('id') alias: string) {
		const topPage = await this.topPageService.findByAlias(alias);
		if (!topPage) {
			throw new HttpException(TOP_PAGE_NOT_FOUND_BY_ALIAS, HttpStatus.NOT_FOUND);
		}
		return topPage;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedTopPage = await this.topPageService.deleteById(id);
		if (!deletedTopPage) {
			throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
		const updatedTopPage = await this.topPageService.updateById(id, dto);
		if (!updatedTopPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}
		return updatedTopPage;
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return await this.topPageService.findByCategory(dto.firstCategory);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return await this.topPageService.findByText(text);
	}

	@Post('test/hh')
	async testSearchHH() {
		const data  = await this.topPageService.findFoHhUpdate(new Date());
		for (let page of data) {
			const hhData = await this.hhService.getData(page.category);
			page.hh = hhData
			await this.topPageService.updateById(page._id, page);
		}
	}
}
