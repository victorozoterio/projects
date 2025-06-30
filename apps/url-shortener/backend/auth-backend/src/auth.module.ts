import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TokensModule } from './modules/tokens/tokens.module';

@Module({
  imports: [UsersModule, TokensModule],
  controllers: [],
  providers: [],
})
export class AuthModule {}
