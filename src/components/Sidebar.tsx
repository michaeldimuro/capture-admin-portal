import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Pill, 
  HeadphonesIcon, 
  Settings,
  ShoppingCart,
  Users,
  LogOut,
  X
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  closeSidebar?: () => void;
}

export function Sidebar({ closeSidebar }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const handleLogout = () => {
    logout();
    // No need to manually navigate as useAuth.logout() already redirects
  };

  const links = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ...(isSuperAdmin 
      ? [
          { href: '/companies', icon: Building2, label: 'Companies' },
          { href: '/medications', icon: Pill, label: 'Medications' },
          { href: '/support', icon: HeadphonesIcon, label: 'Support' },
        ] 
      : [
          { href: '/medication-offerings', icon: Pill, label: 'Offerings' },
          { href: '/orders', icon: ShoppingCart, label: 'Orders' },
          { href: '/patients', icon: Users, label: 'Patients' },
        ]
    ),
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
        <h1 className="text-xl font-bold text-gray-900">
          Capture Health
        </h1>
        {/* Close button for mobile */}
        {closeSidebar && (
          <button 
            onClick={closeSidebar}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md',
                  location.pathname === link.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={closeSidebar}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => {
            handleLogout();
            if (closeSidebar) closeSidebar();
          }}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}