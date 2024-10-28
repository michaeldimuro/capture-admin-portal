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
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPERADMIN';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-gray-500 mt-2">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <span className={cn(
                    "inline-flex items-center text-sm font-medium",
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4 ml-1" /> : <ArrowDownRight className="h-4 w-4 ml-1" />}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-3xl font-semibold mt-2">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{order.patient}</p>
                      <p className="text-sm text-gray-500">{order.medication}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
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
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className={cn(
                    "h-5 w-5",
                    {
                      'text-yellow-500': alert.type === 'warning',
                      'text-blue-500': alert.type === 'info',
                      'text-green-500': alert.type === 'success',
                    }
                  )} />
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}