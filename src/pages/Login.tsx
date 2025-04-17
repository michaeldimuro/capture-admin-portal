import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import axios from 'axios';

export function Login() {
  const { isAuthenticated } = useAuthStore();
  const { login, isLoading, error, validateSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setRedirecting(true);
        // Validate the session to make sure it's still valid
        await validateSession();
      }
    };
    
    checkAuth();
  }, [isAuthenticated, validateSession]);

  if (isAuthenticated() && redirecting) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const getFriendlyErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message;
      
      // Handle specific error cases
      if (status === 401) {
        return "Invalid email or password. Please check your credentials and try again.";
      } else if (status === 404) {
        return "Account not found. Please check your email address or create a new account.";
      } else if (status === 429) {
        return "Too many login attempts. Please wait a moment before trying again.";
      } else if (status === 500) {
        return "Our servers are experiencing issues. Please try again later.";
      } else if (errorMessage) {
        return errorMessage;
      }
    }
    
    // If it's a standard Error object
    if (error instanceof Error) {
      return error.message;
    }
    
    // Default fallback message
    return "Unable to sign in. Please try again later.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden shadow-xl rounded-xl border border-gray-100">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2
                }}
              >
                <div className="bg-blue-600 p-3 rounded-full inline-flex mb-3">
                  <LogIn className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Welcome back</h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>

            <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg bg-red-50 p-3 sm:p-4 border-l-4 border-red-400"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-red-800">
                      {getFriendlyErrorMessage(error)}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 sm:py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 sm:py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-4 sm:mt-6">
              <button 
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                {showDemoAccounts ? 'Hide demo accounts' : 'Show demo accounts'}
              </button>
              
              {showDemoAccounts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200"
                >
                  <p className="text-xs text-gray-600 font-medium mb-1">Demo Accounts:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div 
                      onClick={() => {
                        setEmail("admin@example.com");
                        setPassword("admin123");
                      }}
                      className="text-xs bg-white p-2 rounded border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors duration-200"
                    >
                      <p className="font-semibold text-gray-800">Admin</p>
                      <p className="text-gray-500">admin@example.com</p>
                      <p className="text-gray-500">admin123</p>
                    </div>
                    <div 
                      onClick={() => {
                        setEmail("company@example.com");
                        setPassword("company123");
                      }}
                      className="text-xs bg-white p-2 rounded border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors duration-200"
                    >
                      <p className="font-semibold text-gray-800">Company</p>
                      <p className="text-gray-500">company@example.com</p>
                      <p className="text-gray-500">company123</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}