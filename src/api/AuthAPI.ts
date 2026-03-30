import { APIRequestContext } from '@playwright/test';
import { API_ENDPOINTS } from '@constants/endpoints';

export class AuthAPI {
  private readonly apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.apiContext.post(API_ENDPOINTS.LOGIN, {
      data: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()}`);
    }

    const data = await response.json();
    return {
      success: true,
      userId: this.getString(data, 'userId'),
      username: this.getString(data, 'username'),
      firstName: this.getString(data, 'firstName'),
      lastName: this.getString(data, 'lastName'),
    };
  }

  public async register(user: {
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
  }): Promise<RegisterResponse> {
    const response = await this.apiContext.post(API_ENDPOINTS.REGISTER, {
      data: user,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok()) {
      throw new Error(`Registration failed: ${response.status()}`);
    }

    const data = await response.json();
    return {
      success: true,
      userId: this.getString(data, 'userId'),
      username: this.getString(data, 'username'),
    };
  }

  private getString(obj: unknown, key: string): string {
    if (typeof obj === 'object' && obj !== null && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      return typeof value === 'string' ? value : String(value ?? '');
    }
    return '';
  }
}

export interface LoginResponse {
  success: boolean;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  success: boolean;
  userId: string;
  username: string;
}
