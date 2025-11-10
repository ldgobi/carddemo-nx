'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { accountService } from '@/services/accountService';
import { AccountViewResponse } from '@/types/account';
import {
  formatSSN,
  formatPhoneNumber,
  formatCurrency,
  formatDate,
  getStatusLabel,
  getStatusBadgeColor,
  getFicoScoreLabel,
  getFicoScoreColor,
  calculateAvailableCredit,
  calculateCreditUtilization,
  getCreditUtilizationColor,
  getFullName,
  getFullAddress,
} from '@/types/account';
import { Button } from '@/components/ui';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<AccountViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.accountId) {
      fetchAccount(params.accountId as string);
    }
  }, [params.accountId]);

  const fetchAccount = async (accountId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountService.getAccountView(accountId);
      setAccount(data);
    } catch (err) {
      console.error('Failed to load account:', err);
      setError(err instanceof Error ? err.message : 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Account</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => router.push('/accounts')}>
                Back to Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-600">Account not found</p>
            <div className="mt-4">
              <Button onClick={() => router.push('/accounts')}>Back to Search</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableCredit = calculateAvailableCredit(account.creditLimit, account.currentBalance);
  const creditUtilization = calculateCreditUtilization(account.creditLimit, account.currentBalance);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Details</h1>
            <p className="mt-1 text-sm text-gray-600">
              Account ID: {accountService.formatAccountId(account.accountId)}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => router.push(`/accounts/${params.accountId}/edit`)}>
              Edit Account
            </Button>
            <Button variant="secondary" onClick={() => router.push('/accounts')}>
              Back to Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(account.activeStatus)}`}>
                    {getStatusLabel(account.activeStatus)}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
                <dd className="text-sm font-semibold text-gray-900">{formatCurrency(account.currentBalance)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Credit Limit</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(account.creditLimit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Available Credit</dt>
                <dd className="text-sm font-semibold text-green-600">{formatCurrency(availableCredit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Credit Utilization</dt>
                <dd className={`text-sm font-semibold ${getCreditUtilizationColor(creditUtilization)}`}>
                  {creditUtilization.toFixed(1)}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Cash Credit Limit</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(account.cashCreditLimit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Current Cycle Credit</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(account.currentCycleCredit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Current Cycle Debit</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(account.currentCycleDebit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Account Group</dt>
                <dd className="text-sm text-gray-900">{account.groupId || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          {/* Account Dates */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Dates</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Open Date</dt>
                <dd className="text-sm text-gray-900">{formatDate(account.openDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Expiration Date</dt>
                <dd className="text-sm text-gray-900">{formatDate(account.expirationDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Reissue Date</dt>
                <dd className="text-sm text-gray-900">{formatDate(account.reissueDate)}</dd>
              </div>
            </dl>
          </div>

          {/* Customer Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
                <dd className="text-sm text-gray-900">{account.customerId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="text-sm text-gray-900">
                  {getFullName(account.firstName, account.middleName, account.lastName)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">SSN</dt>
                <dd className="text-sm text-gray-900 font-mono">{formatSSN(account.ssn)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="text-sm text-gray-900">{formatDate(account.dateOfBirth)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">FICO Score</dt>
                <dd>
                  <span className={`text-sm font-semibold ${getFicoScoreColor(account.ficoScore)}`}>
                    {account.ficoScore} - {getFicoScoreLabel(account.ficoScore)}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Primary Card Holder</dt>
                <dd className="text-sm text-gray-900">
                  {account.primaryCardHolderIndicator === 'Y' ? 'Yes' : 'No'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Address</dt>
                <dd className="text-sm text-gray-900">
                  {getFullAddress(
                    account.addressLine1,
                    account.addressLine2,
                    account.city,
                    account.stateCode,
                    account.zipCode
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="text-sm text-gray-900">{account.countryCode}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Primary Phone</dt>
                <dd className="text-sm text-gray-900 font-mono">
                  {formatPhoneNumber(account.phoneNumber1)}
                </dd>
              </div>
              {account.phoneNumber2 && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Secondary Phone</dt>
                  <dd className="text-sm text-gray-900 font-mono">
                    {formatPhoneNumber(account.phoneNumber2)}
                  </dd>
                </div>
              )}
              {account.governmentIssuedId && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Government ID</dt>
                  <dd className="text-sm text-gray-900">{account.governmentIssuedId}</dd>
                </div>
              )}
              {account.eftAccountId && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">EFT Account ID</dt>
                  <dd className="text-sm text-gray-900">{account.eftAccountId}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
