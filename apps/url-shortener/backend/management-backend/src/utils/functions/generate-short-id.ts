import { Repository } from 'typeorm';
import { UrlEntity } from '../../modules/urls/entities/url.entity';

export const generateShortId = async (repository: Repository<UrlEntity>) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 6;
  let shortId = '';
  let isUnique = false;

  while (!isUnique) {
    shortId = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortId += characters[randomIndex];
    }

    const shortIdAlreadyExists = await repository.findOneBy({ shortId });
    if (!shortIdAlreadyExists) isUnique = true;
  }

  return shortId;
};
