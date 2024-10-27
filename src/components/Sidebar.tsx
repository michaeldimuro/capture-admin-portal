import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Pill, 
  HeadphonesIcon, 
  Settings,
  ShoppingCart,
  Users,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../lib/utils';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          { href: '/medication-offerings', icon: Pill, label: 'Medication Offerings' },
          { href: '/orders', icon: ShoppingCart, label: 'Orders' },
          { href: '/patients', icon: Users, label: 'Patients' },
        ]
    ),
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center justify-center h-12 mb-8">
            <h1 className="text-xl font-bold text-gray-900">
              {isSuperAdmin ? 'Admin Portal' : 'Company Portal'}
            </h1>
          </div>
          <nav className="space-y-1">
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
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}