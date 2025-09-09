import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './google-oauth/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOauthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async googleCallback() {}
}
