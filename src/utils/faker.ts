import { allFakers, faker as baseFaker } from '@faker-js/faker';

export function getFakerInstance() {
  const locale = process.env.FAKER_LOCALE?.replace('-', '_') || 'en_AU';
  return (allFakers as Record<string, typeof baseFaker>)[locale] || baseFaker;
}

export const faker = getFakerInstance();
