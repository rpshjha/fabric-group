import { faker } from './faker';

export function generateAddress() {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
  };
}

export function generatePhoneNumber(): string {
  return faker.number.int({ min: 6000000000, max: 9999999999 }).toString();
}

export function generateUniqueId(): string {
  return faker.number.int({ min: 100000000000, max: 999999999999 }).toString();
}

export function generateRandomAmount(min = 10, max = 2500): number {
  return Math.round(faker.number.float({ min, max, multipleOf: 0.01 }) * 100) / 100;
}
