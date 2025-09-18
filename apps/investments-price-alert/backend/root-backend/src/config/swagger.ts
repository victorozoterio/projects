import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Investments Price Alert')
  .setDescription('Documentação do app back-end do Investments Price Alert.')
  .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
  .addBearerAuth({ type: 'http', name: 'bearer-token', in: 'header' }, 'bearer-token')
  .build();
