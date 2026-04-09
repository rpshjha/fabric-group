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

export type TestUser = Pick<
  UserRegistrationData,
  'username' | 'password' | 'firstName' | 'lastName'
>;
