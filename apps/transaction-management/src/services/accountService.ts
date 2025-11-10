import { Account, AccountResponse, AccountListResponse, ApiError } from '@/types/account';

const API_BASE_URL = '/api';

class AccountService {
  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        success: false,
        error: 'An unexpected error occurred',
      }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getAccountById(accountId: number): Promise<Account> {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const data = await this.handleResponse<AccountResponse>(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching account ${accountId}:`, error);
      throw error;
    }
  }

  async getAllAccounts(): Promise<Account[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const data = await this.handleResponse<AccountListResponse>(response);
      return data.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  async getAccountsByCustomerId(customerId: number): Promise<Account[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/customer/${customerId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const data = await this.handleResponse<AccountListResponse>(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching accounts for customer ${customerId}:`, error);
      throw error;
    }
  }
}

export const accountService = new AccountService();
export default AccountService;
