'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { SignOnRequest } from '@/types/user';

export default function SignOnPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignOnRequest>({
    userId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault();
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: '2-digit',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.userId.trim()) {
      setError('Please enter User ID ...');
      return;
    }

    if (!formData.password.trim()) {
      setError('Please enter Password ...');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.signOn(formData);

      if (response.success) {
        userService.setCurrentUser(response);
        
        if (response.userType === 'A') {
          router.push('/admin/menu');
        } else {
          router.push('/menu');
        }
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Wrong Password. Try again ...');
      console.error('Sign on error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    setShowThankYou(true);
  };

  const handleInputChange = (field: keyof SignOnRequest, value: string) => {
    setFormData({
      ...formData,
      [field]: value.toUpperCase(),
    });
    setError(null);
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-2xl rounded-lg p-12 max-w-md w-full text-center border border-gray-200">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You</h1>
          <p className="text-gray-600 mb-8">Thank you for using CardDemo Application.</p>
          <button
            onClick={() => {
              setShowThankYou(false);
              setFormData({ userId: '', password: '' });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Return to Sign On
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full border border-gray-200">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              <span className="font-mono">CC00</span>
              <span className="mx-2">|</span>
              <span className="font-mono">COSGN00C</span>
            </div>
            <span className="text-sm text-gray-600 font-mono">{currentDateTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">CardDemo</h1>
          <h2 className="text-xl font-semibold text-gray-600">Application Sign On</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={formData.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              maxLength={8}
              required
              autoFocus
              disabled={loading}
              placeholder="Enter User ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed uppercase font-mono"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              maxLength={8}
              required
              disabled={loading}
              placeholder="Enter Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed uppercase font-mono"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing On...' : 'Sign On (Enter)'}
            </button>
            <button
              type="button"
              onClick={handleExit}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Exit (F3)
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Press F3 or click Exit to leave the application</p>
          <p className="mt-1">All inputs are converted to uppercase</p>
        </div>
      </div>
    </div>
  );
}
