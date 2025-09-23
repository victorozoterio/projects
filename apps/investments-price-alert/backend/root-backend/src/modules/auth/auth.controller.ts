import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './google-oauth/google-oauth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleOauthGuard)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleCallback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.login(req.user);
    const baseUrl = process.env.APP_URL || `http://${req.get('host')}`;
    return res.redirect(`${baseUrl}/docs?accessToken=${accessToken}`);
  }
}
