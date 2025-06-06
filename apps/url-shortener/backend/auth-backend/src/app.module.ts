import { HealthzModule } from '@projects/shared/backend';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';
import { UsersModule } from './modules/users/users.module';
import { TokensModule } from './modules/tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig), HealthzModule, UsersModule, TokensModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
