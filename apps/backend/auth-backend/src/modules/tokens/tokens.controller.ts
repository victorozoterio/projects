import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenDto } from './dto/token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { TokensService } from './tokens.service';

@ApiBearerAuth()
@ApiTags('Tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new token in the system.' })
  @ApiResponse({ status: 201, type: TokenDto })
  async create(@Body() dto: CreateTokenDto) {
    return await this.tokensService.create(dto);
  }

  @Post('validate-email')
  @ApiOperation({ summary: 'Validates an email verification token in the system.' })
  @ApiResponse({ status: 200 })
  async validateEmailVerificationToken(@Body() dto: ValidateTokenDto) {
    return await this.tokensService.validateEmailVerificationToken(dto);
  }

  @Post('validate-password-reset')
  @ApiOperation({ summary: 'Validates a password reset token in the system.' })
  @ApiResponse({ status: 200 })
  async validatePasswordResetToken(@Body() dto: ValidateTokenDto) {
    return await this.tokensService.validatePasswordResetToken(dto);
  }
}
