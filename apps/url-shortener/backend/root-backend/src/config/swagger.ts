import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('URL Shortener')
  .setDescription('Documentação do app back-end do URL Shortener.')
  .build();
