import { HealthzModule } from '@projects/shared/backend';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig), HealthzModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
