import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import googleOAuthConfig from './google-oauth/google-oauth.config';
import { GoogleOauthStrategy } from './google-oauth/google-oauth.strategy';

@Module({
  imports: [ConfigModule.forFeature(googleOAuthConfig)],
  controllers: [AuthController],
  providers: [AuthService, GoogleOauthStrategy],
})
export class AuthModule {}
