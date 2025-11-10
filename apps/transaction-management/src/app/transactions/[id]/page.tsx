'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui';

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactionById(transactionId);
      setTransaction(data);
    } catch (err: any) {
      console.error('Failed to fetch transaction:', err);
      setError(err.message || 'Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const maskCardNumber = (cardNumber: string) => {
    if (cardNumber.length !== 16) return cardNumber;
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transaction details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error || 'Transaction not found'}</p>
          </div>
          <Button onClick={() => router.push('/transactions')}>
            Back to Transactions
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
            <h1 className="text-2xl font-bold text-gray-800">Transaction Details</h1>
            <Button onClick={() => router.push('/transactions')}>
              Back to List
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Transaction ID
              </label>
              <p className="text-gray-900 font-mono">{transaction.transactionId}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Account ID
              </label>
              <p className="text-gray-900 font-mono">{transaction.accountId}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Card Number
              </label>
              <p className="text-gray-900 font-mono">{maskCardNumber(transaction.cardNumber)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Amount
              </label>
              <p className="text-gray-900 font-semibold text-lg">
                {formatAmount(transaction.amount)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type Code
              </label>
              <p className="text-gray-900">{transaction.typeCode}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category Code
              </label>
              <p className="text-gray-900">{transaction.categoryCode}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Source
              </label>
              <p className="text-gray-900">{transaction.source}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Original Timestamp
              </label>
              <p className="text-gray-900">{formatDate(transaction.originalTimestamp)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Processed Timestamp
              </label>
              <p className="text-gray-900">{formatDate(transaction.processedTimestamp)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <p className="text-gray-900 bg-gray-50 border border-gray-200 rounded p-3">
              {transaction.description}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Merchant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Merchant ID
                </label>
                <p className="text-gray-900">{transaction.merchantId}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Merchant Name
                </label>
                <p className="text-gray-900">{transaction.merchantName}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  City
                </label>
                <p className="text-gray-900">{transaction.merchantCity}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ZIP Code
                </label>
                <p className="text-gray-900">{transaction.merchantZip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
