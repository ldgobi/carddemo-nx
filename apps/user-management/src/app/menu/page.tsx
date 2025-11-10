'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { USER_MENU_ITEMS } from '@/types/user';

export default function UserMenuPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3' || e.key === 'F12') {
        e.preventDefault();
        handleReturn();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedOption.trim()) {
      setError('Please enter a valid option number...');
      return;
    }

    const option = USER_MENU_ITEMS.find(
      (opt) => opt.id === selectedOption.trim()
    );

    if (!option) {
      setError('Please enter a valid option number...');
      return;
    }

    router.push(option.path);
  };

  const handleReturn = () => {
    router.push('/signon');
  };

  const handleInputChange = (value: string) => {
    setSelectedOption(value);
    setError(null);
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl w-full border border-gray-200">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              <span className="font-mono">CM00</span>
              <span className="mx-2">|</span>
              <span className="font-mono">COMEN01C</span>
            </div>
            <span className="text-sm text-gray-600 font-mono">{currentDateTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">CardDemo</h1>
          <h2 className="text-xl font-semibold text-gray-600">
            Main Menu
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-6 space-y-2">
          {USER_MENU_ITEMS.map((option) => (
            <div
              key={option.id}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200"
              onClick={() => handleMenuClick(option.path)}
            >
              <span className="font-bold text-blue-600 mr-4 text-lg w-8">
                {option.id}.
              </span>
              <span className="text-gray-700 font-medium">{option.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="menuOption"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Option Number
            </label>
            <input
              id="menuOption"
              type="text"
              value={selectedOption}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="Enter 1-3"
              maxLength={1}
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Select (Enter)
            </button>
            <button
              type="button"
              onClick={handleReturn}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Return (F3/F12)
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Press F3 or F12 to return to sign-on screen</p>
        </div>
      </div>
    </div>
  );
}
