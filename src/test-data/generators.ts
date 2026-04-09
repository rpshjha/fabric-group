import { BillPaymentData, TestUser, UserRegistrationData } from '@/models';
import { faker } from '@/utils/faker';

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
    ssn: generateUniqueId(),
    username: testUser.username,
    password: testUser.password,
  };
}

export function generateBillPaymentData(accountId: number, amount?: number): BillPaymentData {
  const payee = generatePayeeData();

  return {
    name: payee.name,
    address: payee.address,
    city: payee.city,
    state: payee.state,
    zipCode: payee.zipCode,
    phone: payee.phone,
    amount: amount ?? generateRandomAmount(50, 200),
    toAccount: payee.accountNumber,
    fromAccount: accountId.toString(),
  };
}

function generateUniqueTestUser(): TestUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    username: `${firstName}${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, ''),
    password: `Admin@123`,
    firstName,
    lastName,
  };
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

  const payeeName = faker.helpers.arrayElement(payeeNames);
  const address = generateAddress();
  const accountNumber = faker.number.int({ min: 100000000, max: 999999999 }).toString();

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
