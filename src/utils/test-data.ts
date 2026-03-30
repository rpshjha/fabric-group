import {
  generateUserRegistrationData as _generateUserRegistrationData,
  generateTransferAmount as _generateTransferAmount,
  generateBillAmount as _generateBillAmount,
  generateUniqueTestUser,
  generateRandomAmount,
} from './test-data-generator';

export function createTestUser() {
  return _generateUserRegistrationData();
}

export function getRandomTransferAmount(min = 50, max = 300) {
  return _generateTransferAmount(min, max);
}

export function getRandomBillAmount(min = 50, max = 200) {
  return _generateBillAmount(min, max);
}

export { generateUniqueTestUser, generateRandomAmount };

export { UserBuilder, TransferBuilder, BillPaymentBuilder } from './test-data-builder';

export type {
  UserRegistrationData,
  TestUser,
  AccountCreationData,
  TransferData,
  BillPaymentData,
} from './test-data-generator';
