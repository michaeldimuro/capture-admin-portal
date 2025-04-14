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
  AlertCircle,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export function Dashboard() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  const [timeFrame, setTimeFrame] = useState('7d');

  const stats = [
    {
      title: isSuperAdmin ? 'Total Companies' : 'Active Medications',
      value: isSuperAdmin ? '24' : '15',
      change: '+12%',
      trend: 'up',
      icon: isSuperAdmin ? Building2 : Package,
    },
    {
      title: 'Total Patients',
      value: '2,345',
      change: '+3.2%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Active Orders',
      value: '432',
      change: '+8.1%',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      title: 'Monthly Revenue',
      value: '$52,420',
      change: '-2.4%',
      trend: 'down',
      icon: TrendingUp,
    },
  ];

  const recentOrders = [
    { id: 'ORD-001', patient: 'John Smith', medication: 'Ibuprofen 400mg', status: 'processing' },
    { id: 'ORD-002', patient: 'Sarah Connor', medication: 'Amoxicillin 500mg', status: 'shipped' },
    { id: 'ORD-003', patient: 'Mike Johnson', medication: 'Lisinopril 10mg', status: 'pending' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Low stock alert: Ibuprofen 400mg' },
    { id: 2, type: 'info', message: '3 new support tickets require attention' },
    { id: 3, type: 'success', message: 'Monthly sales target achieved' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-gray-500 mt-1 sm:mt-2">Welcome back, {user?.firstName}.</p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select 
              className="bg-transparent outline-none"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-600" />
                  </div>
                  <span className={cn(
                    "inline-flex items-center text-xs sm:text-sm font-medium",
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.change}
                    {stat.trend === 'up' 
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

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Recent Orders</h3>
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">{order.patient}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{order.medication}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium",
                    {
                      'bg-yellow-100 text-yellow-800': order.status === 'processing',
                      'bg-blue-100 text-blue-800': order.status === 'shipped',
                      'bg-gray-100 text-gray-800': order.status === 'pending',
                    }
                  )}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Recent Alerts</h3>
            <div className="space-y-3 sm:space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0",
                    {
                      'text-yellow-500': alert.type === 'warning',
                      'text-blue-500': alert.type === 'info',
                      'text-green-500': alert.type === 'success',
                    }
                  )} />
                  <p className="text-xs sm:text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}