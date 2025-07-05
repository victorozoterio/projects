import { HealthzModule, XApiKeyMiddleware } from '@projects/shared/backend';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@url-shortener/backend/auth-backend';
import { ManagementModule } from '@url-shortener/backend/management-backend';
import { databaseConfig } from './config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forRootAsync(databaseConfig), HealthzModule, AuthModule, ManagementModule],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppRootModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XApiKeyMiddleware).exclude('healthz').forRoutes('*');
  }
}
