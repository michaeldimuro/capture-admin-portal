import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Bell } from 'lucide-react';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="text-lg font-semibold text-gray-900">
          Welcome back, {user?.name}
        </div>
        <div className="flex items-center space-x-4">
          <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Company Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}