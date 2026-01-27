'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import dynamic from 'next/dynamic'

// Loading skeleton for dashboards
const DashboardSkeleton = () => (
  <div className="w-full h-full p-6 space-y-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-gray-200 rounded-xl"></div>
      <div className="h-32 bg-gray-200 rounded-xl"></div>
      <div className="h-32 bg-gray-200 rounded-xl"></div>
    </div>
    <div className="h-64 bg-gray-200 rounded-xl"></div>
  </div>
)

const SuperAdminDashboard = dynamic(
  () => import('@/components/dashboard/super-admin-dashboard').then(mod => mod.SuperAdminDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const AdminDashboard = dynamic(
  () => import('@/components/dashboard/admin-dashboard').then(mod => mod.AdminDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const ResidentDashboard = dynamic(
  () => import('@/components/dashboard/resident-dashboard').then(mod => mod.ResidentDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const SecurityDashboard = dynamic(
  () => import('@/components/dashboard/security-dashboard').then(mod => mod.SecurityDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const VendorDashboard = dynamic(
  () => import('@/components/dashboard/vendor-dashboard').then(mod => mod.VendorDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const IndividualDashboard = dynamic(
  () => import('@/components/dashboard/individual-dashboard').then(mod => mod.IndividualDashboard),
  { loading: () => <DashboardSkeleton /> }
)

export default function DashboardPage() {
  const { user } = useAuthStore()

  // Render role-specific dashboard
  // Super Admin - System level operations (manage all societies, platform settings)
  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />
  }

  // Society Admin/Manager - Society-specific operations
  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  // Resident - Community member view
  if (user?.role === 'resident') {
    return <ResidentDashboard />
  }

  // Guard/Security - Gatekeeper operations
  if (user?.role === 'guard') {
    return <SecurityDashboard />
  }

  // Vendor - Lead and service management
  if (user?.role === 'vendor') {
    return <VendorDashboard />
  }

  // Individual - Standalone user view
  if (user?.role === 'individual') {
    return <IndividualDashboard />
  }

  // Default to resident dashboard if role is not set
  return <ResidentDashboard />
}
