import { HealthzModule } from '@projects/shared/backend';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@url-shortener/backend/auth-backend';
import { ManagementModule } from '@url-shortener/backend/management-backend';
import { databaseConfig } from './config';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig), HealthzModule, AuthModule, ManagementModule],
  controllers: [],
  providers: [],
})
export class AppRootModule {}
