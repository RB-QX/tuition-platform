'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else {
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [user, router]);

  if (!user || isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <>
      <a href="/classes" className="underline text-blue-600">Go to Classes</a>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {user.email[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-100 hover:border-indigo-200 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </motion.button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { title: 'Projects', value: '12', trend: '↑ 2%', color: 'bg-indigo-100', icon: '📊' },
                { title: 'Tasks', value: '5', trend: '↓ 1', color: 'bg-blue-100', icon: '✅' },
                { title: 'Messages', value: '3', trend: 'New', color: 'bg-green-100', icon: '💬' },
                { title: 'Storage', value: '75%', trend: 'Warning', color: 'bg-amber-100', icon: '💾' },
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-5 rounded-xl ${card.color} hover:shadow-lg transition-shadow duration-300 flex flex-col`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{card.icon}</span>
                    <span className="text-xs px-2 py-1 bg-white/50 rounded-full">{card.trend}</span>
                  </div>
                  <h3 className="text-gray-500 text-sm mb-1">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { action: 'Created project', project: 'Website Redesign', time: '2 hours ago' },
                    { action: 'Completed task', project: 'API Integration', time: 'Yesterday' },
                    { action: 'Received message', project: 'Client Feedback', time: '2 days ago' },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="mt-1 h-2.5 w-2.5 bg-indigo-600 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 truncate">
                          <span className="font-medium">{activity.action}</span> - {activity.project}
                        </p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  {[
                    { icon: '➕', label: 'New Project', action: () => console.log('New project') },
                    { icon: '📝', label: 'Create Task', action: () => console.log('Create task') },
                    { icon: '📤', label: 'Share Files', action: () => console.log('Share files') },
                    { icon: '⚙️', label: 'Settings', action: () => console.log('Settings') },
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <span className="text-xl">{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}