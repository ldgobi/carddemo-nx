'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { billPaymentService } from '@/services/billPaymentService';
import {
  AccountBalance,
  BillPaymentRequest,
  BillPaymentResponse,
  formatAccountId,
  formatCurrency,
  canProcessPayment,
} from '@/types/billPayment';
import { Input, Button } from '@/components/ui';

export default function BillPaymentPage() {
  const router = useRouter();
  const [accountId, setAccountId] = useState('');
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(null);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<BillPaymentResponse | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  React.useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    setCurrentDateTime(`${dateStr} ${timeStr}`);
  };

  const handleAccountIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccountId(value);
    setAccountBalance(null);
    setConfirmPayment(false);
    setError(null);
    setPaymentSuccess(null);
  };

  const handleRetrieveBalance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountId.trim()) {
      setError('Acct ID can NOT be empty...');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAccountBalance(null);
      setConfirmPayment(false);
      setPaymentSuccess(null);

      const balance = await billPaymentService.getAccountBalance(accountId.trim());
      setAccountBalance(balance);

      if (!canProcessPayment(balance.currentBalance)) {
        setError('You have nothing to pay...');
      }
    } catch (err: any) {
      console.error('Failed to retrieve balance:', err);
      setError(err.message || 'Failed to retrieve account balance');
      setAccountBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!accountBalance || !confirmPayment) {
      setError('Confirm to make a bill payment...');
      return;
    }

    if (!canProcessPayment(accountBalance.currentBalance)) {
      setError('You have nothing to pay...');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const request: BillPaymentRequest = {
        accountId: accountBalance.accountId,
        confirmPayment: true,
      };

      const response = await billPaymentService.processBillPayment(request);
      setPaymentSuccess(response);
      setAccountBalance(null);
      setAccountId('');
      setConfirmPayment(false);
    } catch (err: any) {
      console.error('Failed to process payment:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setAccountId('');
    setAccountBalance(null);
    setConfirmPayment(false);
    setError(null);
    setPaymentSuccess(null);
  };

  const canSubmitPayment =
    accountBalance &&
    canProcessPayment(accountBalance.currentBalance) &&
    confirmPayment &&
    !processing;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Bill Payment</h1>
              <span className="text-sm text-gray-500 font-mono">COBIL00C</span>
            </div>
            <span className="text-sm text-gray-600 font-mono">{currentDateTime}</span>
          </div>
          <p className="text-gray-600">Pay your account balance in full</p>
        </div>

        {/* Success Message */}
        {paymentSuccess && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <svg
                className="h-8 w-8 text-green-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Payment Successful!</h3>
                <div className="space-y-2 text-sm text-green-800">
                  <p className="font-medium">{paymentSuccess.message}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-green-200">
                    <div>
                      <span className="text-green-700 font-semibold">Transaction ID:</span>
                      <p className="font-mono text-green-900">{paymentSuccess.transactionId}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-semibold">Account:</span>
                      <p className="font-mono text-green-900">{formatAccountId(paymentSuccess.accountId)}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-semibold">Payment Amount:</span>
                      <p className="font-mono text-green-900">{formatCurrency(paymentSuccess.paymentAmount)}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-semibold">New Balance:</span>
                      <p className="font-mono text-green-900">{formatCurrency(paymentSuccess.newBalance)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button onClick={handleReset} variant="secondary" size="sm">
                    Make Another Payment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <svg
                className="h-6 w-6 text-red-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        {!paymentSuccess && (
          <>
            <form onSubmit={handleRetrieveBalance} className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Account Information</h3>
                <p className="text-sm text-blue-800 mb-6">
                  Enter your account ID to retrieve your current balance and proceed with payment.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      label="Account ID"
                      value={accountId}
                      onChange={handleAccountIdChange}
                      placeholder="Enter 11-digit account ID"
                      required
                      disabled={loading || processing}
                      maxLength={11}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={loading || processing || !accountId.trim()}>
                      {loading ? 'Retrieving...' : 'Retrieve Balance'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Account Balance Display */}
            {accountBalance && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Balance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Account ID
                      </label>
                      <p className="text-gray-900 font-mono text-xl">
                        {formatAccountId(accountBalance.accountId)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Current Balance
                      </label>
                      <p className={`text-3xl font-bold ${
                        accountBalance.currentBalance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(accountBalance.currentBalance)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Confirmation */}
                {canProcessPayment(accountBalance.currentBalance) && (
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Confirmation</h3>
                    
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <svg
                          className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-yellow-900 mb-2">
                            Payment Confirmation Required
                          </p>
                          <p className="text-sm text-yellow-800">
                            You are about to pay{' '}
                            <span className="font-bold">
                              {formatCurrency(accountBalance.currentBalance)}
                            </span>{' '}
                            for account{' '}
                            <span className="font-mono font-bold">
                              {formatAccountId(accountBalance.accountId)}
                            </span>
                            . This will pay your account balance in full.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-5 bg-gray-50 rounded-lg mb-6">
                      <input
                        type="checkbox"
                        id="confirmPayment"
                        checked={confirmPayment}
                        onChange={(e) => setConfirmPayment(e.target.checked)}
                        disabled={processing}
                        className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="confirmPayment" className="text-sm text-gray-700 cursor-pointer flex-1">
                        <span className="font-semibold">I confirm</span> that I want to process this payment and understand that this action cannot be undone.
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleProcessPayment}
                        disabled={!canSubmitPayment}
                      >
                        {processing ? 'Processing Payment...' : 'Process Payment'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleReset}
                        disabled={processing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button variant="secondary" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
