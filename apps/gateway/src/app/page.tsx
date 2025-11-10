'use client';

import { useState } from 'react';

interface SubMenuItem {
  id: string;
  name: string;
  path: string;
}

interface MenuItem {
  id: string;
  name: string;
  url: string;
  port: number;
  submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { id: 'account', name: 'Account Management', url: 'http://localhost:4205/accounts', port: 4205 },
  { id: 'credit', name: 'Credit Card Management', url: 'http://localhost:4204/credit-cards', port: 4204 },
  { 
    id: 'transaction', 
    name: 'Transaction Management', 
    url: 'http://localhost:4203', 
    port: 4203,
    submenu: [
      { id: 'transactions', name: 'Transactions', path: '/transactions' },
      { id: 'reports', name: 'Reports', path: '/reports' }
    ]
  },
  { id: 'bill', name: 'Bill Payment', url: 'http://localhost:4202/bill-payment', port: 4202 },
  { id: 'user', name: 'User Management', url: 'http://localhost:4201', port: 4201 },
];

export default function Home() {
  const [selectedApp, setSelectedApp] = useState<MenuItem | null>(null);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [selectedSubmenu, setSelectedSubmenu] = useState<string | null>(null);

  const handleMenuClick = (item: MenuItem) => {
    if (item.submenu) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      setSelectedApp(item);
      setSelectedSubmenu(null);
    }
  };

  const handleSubmenuClick = (item: MenuItem, submenu: SubMenuItem) => {
    setSelectedApp({ ...item, url: `${item.url}${submenu.path}` });
    setSelectedSubmenu(submenu.id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar Menu */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">CardDemo</h1>
          <p className="text-blue-300 text-sm mt-1">Management System</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedApp?.id === item.id || expandedMenu === item.id
                      ? 'bg-blue-600 shadow-lg'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedApp?.id === item.id ? 'bg-green-400' : 'bg-blue-400'
                      }`} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.submenu && (
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                  {!item.submenu && (
                    <div className="text-xs text-blue-300 ml-5 mt-1">
                      Port: {item.port}
                    </div>
                  )}
                </button>
                
                {/* Submenu */}
                {item.submenu && expandedMenu === item.id && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {item.submenu.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleSubmenuClick(item, sub)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            selectedSubmenu === sub.id
                              ? 'bg-blue-500 shadow'
                              : 'bg-blue-700 hover:bg-blue-600'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                            <span>{sub.name}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 bg-blue-900">
          <p className="text-xs text-blue-300 text-center">
            © 2025 CardDemo System
          </p>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 flex flex-col">
        {selectedApp ? (
          <>
            <header className="bg-white shadow-md px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedApp.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Running on {selectedApp.url}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </header>
            
            <div className="flex-1 relative">
              <iframe
                src={selectedApp.url}
                className="absolute inset-0 w-full h-full border-0"
                title={selectedApp.name}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-8">
                <svg
                  className="w-32 h-32 mx-auto text-blue-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">
                Welcome to CardDemo Gateway
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                Select an application from the left menu to get started
              </p>
              <div className="inline-block bg-blue-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Available Applications:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.id}>• {item.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
