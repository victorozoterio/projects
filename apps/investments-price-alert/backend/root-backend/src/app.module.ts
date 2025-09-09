import { HealthzModule } from '@projects/shared/backend';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [HealthzModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppRootModule {}
