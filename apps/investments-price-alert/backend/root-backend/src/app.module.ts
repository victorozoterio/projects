import { HealthzModule } from '@projects/shared/backend';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, envConfig } from './config';

@Module({
  imports: [ConfigModule.forRoot(envConfig), TypeOrmModule.forRootAsync(databaseConfig), HealthzModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppRootModule {}
