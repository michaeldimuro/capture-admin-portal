import { Bell, Settings, User, Menu } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface HeaderProps {
  openSidebar?: () => void;
}

export function Header({ openSidebar }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex-shrink-0 sticky top-0 z-10">
      <div className="h-full px-4">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {openSidebar && (
              <button 
                onClick={openSidebar}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 -ml-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
              {user?.role === 'SUPERADMIN' ? 'Admin Dashboard' : 'Company Dashboard'}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden md:inline">{user?.firstName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}