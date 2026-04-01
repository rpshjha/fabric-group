import { faker as baseFaker, allFakers } from '@faker-js/faker';

function getFakerInstance() {
  const locale = process.env.FAKER_LOCALE?.replace('-', '_') || 'en_AU';
  return (allFakers as Record<string, typeof baseFaker>)[locale] || baseFaker;
}

const faker = getFakerInstance();

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
}

export interface TestUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TransferData {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}

export interface BillPaymentData {
  payee: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  amount: number;
  accountId: number;
  accountNumber: string;
}

function generateAddress() {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
  };
}

function generatePhoneNumber(): string {
  return faker.number.int({ min: 6000000000, max: 9999999999 }).toString();
}

function generateUniqueId(): string {
  return faker.number.int({ min: 100000000000, max: 999999999999 }).toString();
}

export function generateUniqueTestUser(): TestUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    username: `${firstName}${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, ''),
    password: `Admin@123`,
    firstName,
    lastName,
  };
}

function generateUserRegistrationData(): UserRegistrationData {
  const testUser = generateUniqueTestUser();
  const address = generateAddress();

  return {
    firstName: testUser.firstName,
    lastName: testUser.lastName,
    address: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    phone: generatePhoneNumber(),
    ssn: generateUniqueId(),
    username: testUser.username,
    password: testUser.password,
  };
}

function generateTransferAmount(min = 10, max = 2500): number {
  return Math.round(faker.number.float({ min, max, multipleOf: 0.01 }) * 100) / 100;
}

function generateBillAmount(min = 10, max = 500): number {
  return Math.round(faker.number.float({ min, max, multipleOf: 0.01 }) * 100) / 100;
}

function generatePayeeData() {
  const payeeNames = [
    'City Power Company',
    'Metropolitan Water Authority',
    'Regional Gas Provider',
    'Digital Communications Inc',
    'Interstate Insurance Group',
    'National Cable Services',
    'Mobile Carrier LLC',
    'Consolidated Utilities',
  ];

  const payeeName = payeeNames[Math.floor(Math.random() * payeeNames.length)];
  const address = generateAddress();
  const accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();

  return {
    name: payeeName,
    address: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    phone: generatePhoneNumber(),
    accountNumber,
  };
}

export function generateRandomAmount(min = 1, max = 1000): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export {
  generateUserRegistrationData,
  generateTransferAmount,
  generateBillAmount,
  generatePayeeData,
};
