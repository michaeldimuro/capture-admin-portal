import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
import { Save } from 'lucide-react';

export function Settings() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const [formData, setFormData] = useState({
    companyName: 'HealthCare Plus',
    email: 'admin@healthcare.com',
    stripeKey: 'pk_test_...',
    primaryColor: '#2563eb',
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=100&h=100',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {isSuperAdmin ? 'System Settings' : 'Company Settings'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isSuperAdmin ? 'System Name' : 'Company Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {!isSuperAdmin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stripe API Key
                      </label>
                      <input
                        type="text"
                        value={formData.stripeKey}
                        onChange={(e) => setFormData({ ...formData, stripeKey: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Logo
                      </label>
                      <div className="flex items-center space-x-4">
                        <img
                          src={formData.logo}
                          alt="Company logo"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Change Logo
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}