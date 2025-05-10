import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('URL Shortener - Auth')
  .setDescription('Documentação do app back-end do URL Shortener - Auth.')
  .build();
