import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
import { 
  Users, 
  ShoppingCart, 
  Building2, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Calendar,
  Activity
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardStats } from '../lib/api/services/dashboardService';

export function Dashboard() {
  const { user } = useAuthStore();
  const { data: dashboardData, isLoading } = useDashboard();
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const stats = [
    ...(isSuperAdmin && (dashboardData as DashboardStats)?.companies ? [{
      title: 'Companies',
      value: (dashboardData as DashboardStats).companies.total,
      change: (dashboardData as DashboardStats).companies.newThisMonth,
      icon: Building2,
    }] : []),
    {
      title: 'Patients',
      value: dashboardData?.patients?.total || 0,
      change: dashboardData?.patients?.newThisMonth || 0,
      icon: Users,
    },
    {
      title: 'Orders',
      value: dashboardData?.orders?.total || 0,
      change: dashboardData?.orders?.newThisMonth || 0,
      icon: ShoppingCart,
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(dashboardData?.revenue?.thisMonth || 0),
      change: ((dashboardData?.revenue?.thisMonth || 0) / (dashboardData?.revenue?.total || 1) * 100 - 100).toFixed(1) + '%',
      icon: TrendingUp,
    }
  ];

  const intakeStats = [
    {
      title: 'Total Intakes',
      value: dashboardData?.intakes?.total || 0,
      change: dashboardData?.intakes?.newThisMonth || 0,
      icon: Activity,
    },
    {
      title: 'Completed Intakes',
      value: dashboardData?.intakes?.completed || 0,
      percentage: ((dashboardData?.intakes?.completed || 0) / (dashboardData?.intakes?.total || 1) * 100).toFixed(1) + '%',
      icon: Package,
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-gray-500 mt-1 sm:mt-2">Welcome back, {user?.firstName}.</p>
        </div>
      </div>
      
      {/* Main Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = parseFloat(stat.change.toString()) >= 0;
          return (
            <Card key={stat.title}>
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-600" />
                  </div>
                  <span className={cn(
                    "inline-flex items-center text-xs sm:text-sm font-medium",
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.change}
                    {isPositive 
                      ? <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5 sm:ml-1" /> 
                      : <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5 sm:ml-1" />
                    }
                  </span>
                </div>
                <div className="mt-3 sm:mt-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">{stat.title}</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold mt-1 sm:mt-2">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Intake Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2">
        {intakeStats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = parseFloat(stat.change?.toString() || '0') >= 0;
          return (
            <Card key={stat.title}>
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-600" />
                  </div>
                  {stat.change !== undefined && (
                    <span className={cn(
                      "inline-flex items-center text-xs sm:text-sm font-medium",
                      isPositive ? 'text-green-600' : 'text-red-600'
                    )}>
                      {stat.change}
                      {isPositive 
                        ? <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5 sm:ml-1" /> 
                        : <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5 sm:ml-1" />
                      }
                    </span>
                  )}
                  {stat.percentage !== undefined && (
                    <span className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-600">
                      {stat.percentage}
                    </span>
                  )}
                </div>
                <div className="mt-3 sm:mt-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">{stat.title}</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold mt-1 sm:mt-2">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}