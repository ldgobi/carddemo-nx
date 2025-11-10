'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { reportService } from '@/services/reportService';
import { ReportType, GenerateReportRequest } from '@/types/report';
import { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui';

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reportType, setReportType] = useState<ReportType>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [reportData, setReportData] = useState<Transaction[] | null>(null);
  const [reportInfo, setReportInfo] = useState<{
    reportType: ReportType;
    transactionCount: number;
    startDate: string;
    endDate: string;
  } | null>(null);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmation !== 'Y' && confirmation !== 'y') {
      setError('Please confirm the report generation by entering Y');
      return;
    }

    if (reportType === 'CUSTOM') {
      if (!startDate || !endDate) {
        setError('Start date and end date are required for custom reports');
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        setError('Start date must be before or equal to end date');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setReportData(null);
      setReportInfo(null);

      const request: GenerateReportRequest = {
        reportType,
        confirmation,
        ...(reportType === 'CUSTOM' && { startDate, endDate }),
      };

      const result = await reportService.generateTransactionReport(request);
      
      setSuccess(result.message);
      setReportData(result.data);
      setReportInfo({
        reportType: result.reportType,
        transactionCount: result.transactionCount,
        startDate: result.startDate,
        endDate: result.endDate,
      });

      // Reset confirmation
      setConfirmation('');
    } catch (err: any) {
      console.error('Failed to generate report:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const calculateTotalAmount = () => {
    if (!reportData) return 0;
    return reportData.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Transaction Reports</h1>
            <Button onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleGenerateReport} className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reportType"
                  value="MONTHLY"
                  checked={reportType === 'MONTHLY'}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="mr-2"
                />
                <span className="text-gray-700">Monthly Report (Current Month)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reportType"
                  value="YEARLY"
                  checked={reportType === 'YEARLY'}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="mr-2"
                />
                <span className="text-gray-700">Yearly Report (Current Year)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reportType"
                  value="CUSTOM"
                  checked={reportType === 'CUSTOM'}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="mr-2"
                />
                <span className="text-gray-700">Custom Date Range</span>
              </label>
            </div>
          </div>

          {reportType === 'CUSTOM' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={reportType === 'CUSTOM'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={reportType === 'CUSTOM'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmation (Y/N) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              maxLength={1}
              placeholder="Enter Y to confirm"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter 'Y' to confirm the report generation
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </form>

        {reportInfo && reportData && (
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                {reportInfo.reportType} Report
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-semibold">Period:</span>
                  <p className="text-blue-900">
                    {formatDate(reportInfo.startDate)} - {formatDate(reportInfo.endDate)}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-semibold">Total Transactions:</span>
                  <p className="text-blue-900">{reportInfo.transactionCount}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-semibold">Total Amount:</span>
                  <p className="text-blue-900 font-bold">{formatCurrency(calculateTotalAmount())}</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((transaction) => (
                    <tr key={transaction.transactionId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.originalTimestamp)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">{transaction.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.typeCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
