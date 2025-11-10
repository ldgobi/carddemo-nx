'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { User, UserListResponse, DEFAULT_PAGE_SIZE, USER_TYPE_LABELS } from '@/types/user';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [firstUserId, setFirstUserId] = useState<string>('');
  const [lastUserId, setLastUserId] = useState<string>('');
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3' || e.key === 'F12') {
        e.preventDefault();
        handleReturn();
      } else if (e.key === 'F7') {
        e.preventDefault();
        handlePreviousPage();
      } else if (e.key === 'F8') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevious, hasNext, firstUserId, lastUserId]);

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

  const fetchUsers = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const data: UserListResponse = await userService.listUsers({
        search: search || searchTerm,
        page: 0,
        size: DEFAULT_PAGE_SIZE,
      });
      setUsers(data.content);
      setPageNumber(data.pageNumber);
      setTotalPages(data.totalPages);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
      setFirstUserId(data.firstUserId);
      setLastUserId(data.lastUserId);
      setSelections({});

      if (data.content.length === 0) {
        setMessage('No users found');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = async () => {
    if (!hasNext) {
      setMessage('You are already at the bottom of the page...');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const data: UserListResponse = await userService.getNextPage(
        lastUserId,
        DEFAULT_PAGE_SIZE
      );
      setUsers(data.content);
      setPageNumber(data.pageNumber);
      setTotalPages(data.totalPages);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
      setFirstUserId(data.firstUserId);
      setLastUserId(data.lastUserId);
      setSelections({});
    } catch (err) {
      setError('Failed to load next page');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = async () => {
    if (!hasPrevious) {
      setMessage('You are already at the top of the page...');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const data: UserListResponse = await userService.getPreviousPage(
        firstUserId,
        DEFAULT_PAGE_SIZE
      );
      setUsers(data.content);
      setPageNumber(data.pageNumber);
      setTotalPages(data.totalPages);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
      setFirstUserId(data.firstUserId);
      setLastUserId(data.lastUserId);
      setSelections({});
    } catch (err) {
      setError('Failed to load previous page');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelections({});
    fetchUsers('');
  };

  const handleReturn = () => {
    router.push('/admin/menu');
  };

  const handleSelectionChange = (userId: string, value: string) => {
    const upperValue = value.toUpperCase();
    if (upperValue === '' || upperValue === 'U' || upperValue === 'D') {
      setSelections((prev) => ({
        ...prev,
        [userId]: upperValue,
      }));
      setError(null);
      setMessage(null);
    } else {
      setError('Invalid selection. Valid values are U and D');
    }
  };

  const handleProcessSelections = async () => {
    const selectedEntries = Object.entries(selections).filter(
      ([_, value]) => value === 'U' || value === 'D'
    );

    if (selectedEntries.length === 0) {
      setError('Please select a user to update or delete');
      return;
    }

    const [userId, action] = selectedEntries[0];

    if (action === 'U') {
      router.push(`/admin/users/${userId}/edit`);
    } else if (action === 'D') {
      router.push(`/admin/users/${userId}/delete`);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white shadow-2xl rounded-lg p-6 max-w-7xl mx-auto border border-gray-200">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              <span className="font-mono">CU00</span>
              <span className="mx-2">|</span>
              <span className="font-mono">COUSR00C</span>
            </div>
            <span className="text-sm text-gray-600 font-mono">{currentDateTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">CardDemo</h1>
          <h2 className="text-xl font-semibold text-gray-600">User List</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search by User ID
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                placeholder="Enter User ID"
                maxLength={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase font-mono"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Search (Enter)
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Clear (F4)
              </button>
            </div>
          </div>
        </form>

        <div className="mb-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-20">
                  Sel
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  User Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userId} className="hover:bg-blue-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        value={selections[user.userId] || ''}
                        onChange={(e) =>
                          handleSelectionChange(user.userId, e.target.value)
                        }
                        className="w-12 px-2 py-1 border border-gray-300 rounded text-center uppercase font-mono focus:ring-2 focus:ring-blue-500"
                        maxLength={1}
                        placeholder="U/D"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                      {user.userId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {user.firstName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {user.lastName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {USER_TYPE_LABELS[user.userType]}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <div>
            Page {pageNumber + 1} of {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPrevious || loading}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous (F7)
            </button>
            <button
              onClick={handleNextPage}
              disabled={!hasNext || loading}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next (F8)
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleProcessSelections}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Process Selection (Enter)
          </button>
          <button
            onClick={handleReturn}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Return (F3/F12)
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Enter U to update or D to delete next to User ID, then press Enter</p>
          <p className="mt-1">Press F7 for previous page, F8 for next page, F4 to clear</p>
          <p className="mt-1">Press F3 or F12 to return to admin menu</p>
        </div>
      </div>
    </div>
  );
}
