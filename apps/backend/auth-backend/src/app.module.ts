import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';
import { HealthzModule } from './modules/healthz/healthz.module';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig), HealthzModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
