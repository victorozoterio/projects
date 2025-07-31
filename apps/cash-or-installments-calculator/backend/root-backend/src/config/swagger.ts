import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Cash or Installments Calculator')
  .setDescription('Documentação do app back-end do Cash or Installments Calculator.')
  .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
  .build();
