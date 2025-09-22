import { HealthzModule, XApiKeyMiddleware } from '@projects/shared/backend';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, envConfig } from './config';
import { InvestmentsModule } from './modules/investments/investments.module';
import { UserEntity } from './modules/users/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(databaseConfig),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    HealthzModule,
    AuthModule,
    UsersModule,
    InvestmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppRootModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XApiKeyMiddleware).exclude('healthz', 'auth/(.*)').forRoutes('*');
  }
}
