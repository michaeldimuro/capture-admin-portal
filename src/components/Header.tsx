import { Bell, Settings, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex-shrink-0">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {user?.role === 'SUPERADMIN' ? 'Admin Dashboard' : 'Company Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Settings className="h-6 w-6" />
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="h-6 w-6" />
              <span>{user?.name}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}