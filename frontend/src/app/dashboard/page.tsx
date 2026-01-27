'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { SuperAdminDashboard } from '@/components/dashboard/super-admin-dashboard'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { ResidentDashboard } from '@/components/dashboard/resident-dashboard'
import { SecurityDashboard } from '@/components/dashboard/security-dashboard'
import { VendorDashboard } from '@/components/dashboard/vendor-dashboard'
import { IndividualDashboard } from '@/components/dashboard/individual-dashboard'

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
