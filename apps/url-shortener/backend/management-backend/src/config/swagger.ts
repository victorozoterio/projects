import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('URL Shortener - Management')
  .setDescription('Documentação do app back-end do URL Shortener - Management.')
  .build();
