import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
	@ApiProperty()
	uuid: string;

	@ApiProperty()
	token: number;

	@ApiProperty()
	expiresAt: Date;

	@ApiProperty()
	userUuid: object;

	@ApiProperty()
	createdAt: Date;
}
