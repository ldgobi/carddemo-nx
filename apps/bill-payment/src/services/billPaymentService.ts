import { AccountBalance, BillPaymentRequest, BillPaymentResponse } from '@/types/billPayment';

const API_BASE_URL = '/api';

class BillPaymentService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAccountBalance(accountId: string): Promise<AccountBalance> {
    const response = await fetch(`${API_BASE_URL}/bill-payment/account/${accountId}/balance`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch account balance' }));
      throw new Error(errorData.error || 'Failed to fetch account balance');
    }

    return response.json();
  }

  async processBillPayment(data: BillPaymentRequest): Promise<BillPaymentResponse> {
    const response = await fetch(`${API_BASE_URL}/bill-payment/process`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to process bill payment' }));
      throw new Error(errorData.error || 'Failed to process bill payment');
    }

    return response.json();
  }
}

export const billPaymentService = new BillPaymentService();
