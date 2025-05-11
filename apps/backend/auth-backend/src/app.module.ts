import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';
import { HealthzModule } from './modules/healthz/healthz.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig), HealthzModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
