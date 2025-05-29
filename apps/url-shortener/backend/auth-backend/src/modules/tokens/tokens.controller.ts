import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { TokensService } from './tokens.service';

@ApiBearerAuth()
@ApiTags('Tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

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
