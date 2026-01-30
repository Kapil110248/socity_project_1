'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Users,
  TrendingUp,
  Globe,
  Server,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Database,
  CreditCard,
  BarChart3,
  ChevronRight,
  Plus,
  Eye,
  Power,
  Zap,
  HardDrive,
  Cpu,
  Clock,
  RefreshCw,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

// Types for platform stats (minimal as per mock structure)
interface PlatformStats {
  platformStats: {
    totalSocieties: number;
    activeSocieties: number;
    pendingSocieties: number;
    totalUsers: number;
    activeUsers: number;
    totalUnits: number;
    monthlyRevenue: number;
    pendingApprovals: number;
  };
  societyGrowthData: any[];
  revenueData: any[];
  recentSocieties: any[];
  subscriptionStats: any[];
  systemHealth: any;
}

// Mock data fallback or initial state logic omitted to use Query data

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export function SuperAdminDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [showSuccess, setShowSuccess] = useState<string | null>(null)

  const { data, isLoading } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const response = await api.get('/reports/platform-stats')
      return response.data
    }
  })

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const { platformStats, societyGrowthData, revenueData, recentSocieties, subscriptionStats, systemHealth } = data

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden"
    >
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Header - Super Admin Style */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-4 ring-white/20">
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-xl font-bold">
                {user?.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-purple-300 text-sm">Super Admin</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{user?.name || 'System Admin'}</h1>
              <p className="text-white/70 text-sm">Platform Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-0">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse" />
              All Systems Operational
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Platform Stats - System Level */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/90">Total Societies</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{platformStats?.totalSocieties || 0}</h3>
                  <p className="text-xs text-white/70 mt-1">{platformStats?.activeSocieties || 0} active</p>
                </div>
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-0 shadow-lg">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/90">Total Users</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {(platformStats?.totalUsers || 0) >= 1000
                      ? `${((platformStats.totalUsers || 0) / 1000).toFixed(1)}K`
                      : platformStats?.totalUsers ?? 0}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    {(platformStats?.activeUsers ?? platformStats?.totalUsers ?? 0)} active
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 shadow-lg">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/90">Monthly Revenue</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">₹{((platformStats?.monthlyRevenue || 0) / 100000).toFixed(1)}L</h3>
                  <p className="text-xs text-white/70 mt-1">+12% from last month</p>
                </div>
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/90">Pending Approvals</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{platformStats?.pendingApprovals || 0}</h3>
                  <p className="text-xs text-white/70 mt-1">
                    {(platformStats?.pendingSocieties ?? platformStats?.pendingApprovals ?? 0)} societies waiting
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* System Health Monitor */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-800">System Health Monitor</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200 text-center">
                <Server className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Server Uptime</p>
                <p className="text-xl font-bold text-green-700">{systemHealth?.serverUptime || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200 text-center">
                <Zap className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">API Latency</p>
                <p className="text-xl font-bold text-blue-700">{systemHealth?.apiLatency || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200 text-center">
                <Database className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Database Size</p>
                <p className="text-xl font-bold text-purple-700">{systemHealth?.databaseSize || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-4 border border-orange-200 text-center">
                <Globe className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Connections</p>
                <p className="text-xl font-bold text-orange-700">{systemHealth?.activeConnections || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-4 border border-pink-200 text-center">
                <Cpu className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">CPU Usage</p>
                <p className="text-xl font-bold text-pink-700">{systemHealth?.cpuUsage || 0}%</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl p-4 border border-indigo-200 text-center">
                <HardDrive className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Memory Usage</p>
                <p className="text-xl font-bold text-indigo-700">{systemHealth?.memoryUsage || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Growth Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Society Growth Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-800">Platform Growth</CardTitle>
              <CardDescription>Societies & Users over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={societyGrowthData || []}>
                  <defs>
                    <linearGradient id="societyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="societies" stroke="#8b5cf6" fill="url(#societyGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-800">Revenue Trend</CardTitle>
              <CardDescription>Monthly platform revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 100000}L`} />
                  <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Societies & Subscription Plans Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Societies */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-md h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-800">Recent Societies</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => router.push('/dashboard/super-admin/societies/new')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Society
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(recentSocieties || []).length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">No societies yet.</p>
                ) : (
                (recentSocieties || []).map((society) => (
                  <div
                    key={society.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{society.name}</p>
                        <p className="text-sm text-gray-500">{society.city} • {society.units} units</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={society.status === 'active'
                          ? 'bg-green-50 text-green-600 border-green-200'
                          : 'bg-orange-50 text-orange-600 border-orange-200'}
                      >
                        {society.status === 'active' ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {society.status}
                      </Badge>
                      <span className="text-xs text-gray-400">{society.joinedDate}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                ))
                )}
              </div>
              <Button
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => router.push('/dashboard/super-admin/societies')}
              >
                View All Societies
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Plans */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-800">Subscription Plans</CardTitle>
              <CardDescription>Active subscriptions by plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(subscriptionStats || []).map((plan) => (
                  <div key={plan.plan} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{plan.plan}</span>
                      <span className="text-sm font-bold text-gray-900">{plan.societies}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${plan.color} h-2 rounded-full`}
                        style={{ width: `${(plan.societies / (platformStats?.totalSocieties || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total MRR (this month)</p>
                    <p className="text-2xl font-bold text-purple-700">
                      ₹{((platformStats?.monthlyRevenue ?? 0) / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <CreditCard className="h-10 w-10 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions - System Level */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-800">System Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => router.push('/dashboard/super-admin/societies')}
              >
                <Building2 className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium">Manage Societies</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => router.push('/dashboard/super-admin/users')}
              >
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">User Management</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300"
                onClick={() => router.push('/dashboard/super-admin/billing')}
              >
                <CreditCard className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">Platform Billing</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300"
                onClick={() => router.push('/dashboard/super-admin/settings')}
              >
                <Settings className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts & Notifications */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg font-bold text-gray-800">System Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(platformStats?.pendingApprovals ?? platformStats?.pendingSocieties ?? 0) > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {platformStats?.pendingApprovals ?? platformStats?.pendingSocieties ?? 0} societies pending approval
                      </p>
                      <p className="text-sm text-gray-600">Review and approve new society registrations</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => router.push('/dashboard/super-admin/societies/pending')}
                  >
                    Review
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">System maintenance scheduled</p>
                    <p className="text-sm text-gray-600">Planned downtime on Dec 28, 2:00 AM - 4:00 AM IST</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-100">
                  Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
