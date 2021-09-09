import {ITelegramOptions} from '../telegram/telegram.interface';
import {ConfigService} from '@nestjs/config';

export const getTelegramConfig = (configService: ConfigService): ITelegramOptions => {
	const token = configService.get('TELEGRAM_TOKEN');
	if (!token) {
		throw new Error("Telegram token is not set");
	}
	return {
		token,
		chatId: configService.get('TELEGRAM_CHAT_ID') ?? ''
	}
}
