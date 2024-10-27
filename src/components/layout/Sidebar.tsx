import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Building2,
  Pill,
  Users,
  ShoppingCart,
  HeadphonesIcon,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const links = isSuperAdmin
    ? [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/companies', icon: Building2, label: 'Companies' },
        { to: '/medications', icon: Pill, label: 'Medications' },
        { to: '/support', icon: HeadphonesIcon, label: 'Support' },
      ]
    : [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/patients', icon: Users, label: 'Patients' },
        { to: '/orders', icon: ShoppingCart, label: 'Orders' },
        { to: '/medications', icon: Pill, label: 'Medication Offerings' },
      ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          </div>
          <nav className="mt-6 space-y-1 px-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                <link.icon className="mr-3 h-5 w-5" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mb-6 space-y-1 px-3">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </NavLink>
          <button
            onClick={() => {/* Add logout logic */}}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}