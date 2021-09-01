import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpException,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {AuthDto} from './dto/auth.dto';
import {AuthService} from './auth.service';
import {ALREADY_REGISTERED_ERROR} from './auth.constants';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const user = await this.authService.findUser(dto.login);
		if (user) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		await this.authService.validateUser(dto.login, dto.password);
		return this.authService.login(dto.login);
	}
}
