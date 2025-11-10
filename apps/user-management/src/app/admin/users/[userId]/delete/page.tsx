'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { userService } from '@/services/userService';
import { User, USER_TYPE_LABELS } from '@/types/user';

export default function DeleteUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'F3' || e.key === 'F12') {
        e.preventDefault();
        handleReturn();
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userData]);

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

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await userService.getUserById(userId);
      
      setUserData(user);
      setInfoMessage('Press PF5 key to delete this user ...');
    } catch (err: any) {
      const errorMessage = err.message || 'Unable to lookup User...';
      if (errorMessage.toLowerCase().includes('not found')) {
        setError('User ID NOT found...');
      } else {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userData) {
      setError('Please load a user first');
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      setInfoMessage(null);

      const response = await userService.deleteUser(userData.userId);
      setSuccessMessage(response.message);
      
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || 'Unable to Update User...';
      if (errorMessage.toLowerCase().includes('not found')) {
        setError('User ID NOT found...');
      } else {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleReturn = () => {
    router.push('/admin/users');
  };

  const handleClear = () => {
    router.push('/admin/users');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Loading user data...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full border border-gray-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'User not found'}</p>
          <button
            onClick={handleReturn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Return to User List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white shadow-2xl rounded-lg p-6 max-w-3xl mx-auto border border-gray-200">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              <span className="font-mono">CU03</span>
              <span className="mx-2">|</span>
              <span className="font-mono">COUSR03C</span>
            </div>
            <span className="text-sm text-gray-600 font-mono">{currentDateTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">CardDemo</h1>
          <h2 className="text-xl font-semibold text-gray-600">Delete User</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm">
            {infoMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed uppercase font-mono"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700">First Name</label>
              <p className="mt-1 text-gray-900 text-lg">{userData.firstName}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Last Name</label>
              <p className="mt-1 text-gray-900 text-lg">{userData.lastName}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">User Type</label>
              <p className="mt-1 text-gray-900 text-lg">
                {USER_TYPE_LABELS[userData.userType]}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete User (F5)'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={deleting}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Clear (F4)
            </button>
            <button
              type="button"
              onClick={handleReturn}
              disabled={deleting}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Return (F3/F12)
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Press F5 to confirm deletion of this user</p>
          <p className="mt-1">Press F3 or F12 to return to user list without deleting</p>
          <p className="mt-1">Press F4 to cancel and return to user list</p>
        </div>
      </div>
    </div>
  );
}
