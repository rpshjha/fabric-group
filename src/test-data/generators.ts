import { BillPaymentData, TestUser, UserRegistrationData } from '@/models/user.model';
import {
  generateAddress,
  generatePhoneNumber,
  generateRandomAmount,
  generateUniqueId,
} from '@/utils/data-utils';
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

export function generateBillPaymentData(accountId: number): BillPaymentData {
  const payee = generatePayeeData();

  return {
    name: payee.name,
    address: payee.address,
    city: payee.city,
    state: payee.state,
    zipCode: payee.zipCode,
    phone: payee.phone,
    amount: generateRandomAmount(50, 200),
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
