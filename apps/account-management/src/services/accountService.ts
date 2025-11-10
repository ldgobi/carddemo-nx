import { AccountViewResponse, UpdateAccountRequest } from '@/types/account';

const API_BASE_URL = '/api';

class AccountService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Get account view with customer details by account ID
   * @param accountId - The 11-digit account ID
   * @returns Promise<AccountViewResponse>
   */
  async getAccountView(accountId: string): Promise<AccountViewResponse> {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/view`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch account view' }));
      throw new Error(error.error || `HTTP ${response.status}: Failed to fetch account view`);
    }

    return response.json();
  }

  /**
   * Update account and customer information
   * @param accountId - The 11-digit account ID
   * @param data - Partial update data for account and customer
   * @returns Promise<string> - Success message
   */
  async updateAccount(accountId: string, data: UpdateAccountRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/update`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to update account' }));
      throw new Error(error.error || `HTTP ${response.status}: Failed to update account`);
    }

    const result = await response.json();
    return typeof result === 'string' ? result : result.message || 'Account updated successfully';
  }

  /**
   * Validate account ID format
   * @param accountId - The account ID to validate
   * @returns boolean
   */
  validateAccountId(accountId: string): boolean {
    const cleaned = accountId.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned !== '00000000000';
  }

  /**
   * Format account ID for display
   * @param accountId - The account ID to format
   * @returns string - Formatted account ID
   */
  formatAccountId(accountId: number | string): string {
    const id = typeof accountId === 'number' ? accountId.toString() : accountId;
    return id.padStart(11, '0');
  }
}

export const accountService = new AccountService();
