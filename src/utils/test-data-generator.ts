import { fakerEN_AU as faker } from '@faker-js/faker';

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

export interface AccountCreationData {
  accountType: 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET';
  accountName: string;
  initialDeposit?: number;
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
}

export function seedFaker(seed?: number): void {
  const actualSeed = seed || Math.floor(Date.now() / 1000);
  faker.seed(actualSeed);
}

export function generateAddress() {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
  };
}

export function generatePhoneNumber(): string {
  return faker.phone.number().replace(/\D/g, '');
}

export function generateSSN(): string {
  const area = String(faker.number.int({ min: 100, max: 665 })).padStart(3, '0');
  const group = String(faker.number.int({ min: 1, max: 99 })).padStart(2, '0');
  const serial = String(faker.number.int({ min: 1, max: 9999 })).padStart(4, '0');
  return `${area}-${group}-${serial}`;
}

export function generateUniqueTestUser(): TestUser {
  const timestamp = Date.now();

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    username: `${firstName.toLowerCase()}${lastName.toLowerCase()}_${timestamp}`,
    password: `Admin@123`,
    firstName,
    lastName,
  };
}

export function generateUserRegistrationData(): UserRegistrationData {
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
    ssn: generateSSN(),
    username: testUser.username,
    password: testUser.password,
  };
}

export function generateAccountName(accountType: 'CHECKING' | 'SAVINGS' = 'SAVINGS'): string {
  const adjectives = [
    'Primary',
    'Secondary',
    'Emergency',
    'Vacation',
    'College',
    'Retirement',
    'Investment',
    'Joint',
  ];
  const purposes = ['Fund', 'Account', 'Reserve'];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const purpose = purposes[Math.floor(Math.random() * purposes.length)];
  const type = accountType === 'CHECKING' ? 'Checking' : 'Savings';

  return `${adjective} ${type} ${purpose}`;
}

export function generateTransferAmount(min = 10, max = 2500): number {
  return Math.round(faker.number.float({ min, max, multipleOf: 0.01 }) * 100) / 100;
}

export function generateBillAmount(min = 10, max = 500): number {
  return Math.round(faker.number.float({ min, max, multipleOf: 0.01 }) * 100) / 100;
}

export function generatePayeeData() {
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

  return {
    name: payeeName,
    address: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    phone: generatePhoneNumber(),
  };
}

export function generateRandomAmount(min = 1, max = 1000): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
