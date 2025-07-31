import { HealthzModule, XApiKeyMiddleware } from '@projects/shared/backend';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CalculatorModule } from './modules/calculator/calculator.module';

@Module({
  imports: [HealthzModule, CalculatorModule],
  controllers: [],
  providers: [],
})
export class AppRootModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XApiKeyMiddleware).exclude('healthz').forRoutes('*');
  }
}
