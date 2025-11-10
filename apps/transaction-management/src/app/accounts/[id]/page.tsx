'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { accountService } from '@/services/accountService';
import { Account } from '@/types/account';
import { Button } from '@/components/ui';

export default function AccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = parseInt(params.id as string);
  
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accountId) {
      fetchAccount();
    }
  }, [accountId]);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountService.getAccountById(accountId);
      setAccount(data);
    } catch (err: any) {
      console.error('Failed to fetch account:', err);
      setError(err.message || 'Failed to load account');
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

  const getStatusBadge = (status: string) => {
    if (status === 'Y') {
      return (
        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  const calculateAvailableCredit = (account: Account) => {
    return account.creditLimit - account.currentBalance;
  };

  const calculateUtilization = (account: Account) => {
    if (account.creditLimit === 0) return 0;
    return ((account.currentBalance / account.creditLimit) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading account details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error || 'Account not found'}</p>
          </div>
          <Button onClick={() => router.push('/accounts')}>
            Back to Accounts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Account Details</h1>
            <Button onClick={() => router.push('/accounts')}>
              Back to List
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700 mb-1">Account ID</p>
                <p className="text-2xl font-bold text-blue-900">{account.accountId}</p>
              </div>
              <div>
                {getStatusBadge(account.activeStatus)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Customer ID
              </label>
              <p className="text-gray-900 font-mono">{account.customerId}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Open Date
              </label>
              <p className="text-gray-900">{formatDate(account.openDate)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Expiration Date
              </label>
              <p className="text-gray-900">{formatDate(account.expirationDate)}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Balance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Current Balance
                </label>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(account.currentBalance)}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Credit Limit
                </label>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(account.creditLimit)}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Available Credit
                </label>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculateAvailableCredit(account))}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Credit Utilization
                </label>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateUtilization(account)}%
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Cash Credit Limit
                </label>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(account.cashCreditLimit)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Cycle Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-green-700 mb-1">
                  Cycle Credits
                </label>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(account.currentCycleCredit)}
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-red-700 mb-1">
                  Cycle Debits
                </label>
                <p className="text-xl font-bold text-red-900">
                  {formatCurrency(account.currentCycleDebit)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button onClick={() => router.push(`/transactions?accountId=${account.accountId}`)}>
              View Transactions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
