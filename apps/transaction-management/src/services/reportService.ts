import { GenerateReportRequest, ReportResponse, ApiError } from '@/types/report';

const API_BASE_URL = '/api';

class ReportService {
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

  async generateTransactionReport(data: GenerateReportRequest): Promise<ReportResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/transactions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<ReportResponse>(response);
    } catch (error) {
      console.error('Error generating transaction report:', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
export default ReportService;
