'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Home,
  Calendar,
  Bell,
  Settings,
  Users,
  Package,
  Shield,
  MessageSquare,
  MoreHorizontal,
  X,
  Wallet,
  FileText,
  Megaphone,
  Car,
  Building,
  LogOut,
  User,
  UserCheck,
  AlertTriangle,
  ParkingCircle,
  HelpCircle,
  TrendingUp,
  Compass,
  ClipboardList,
  Wrench,
  QrCode,
  Phone,
  Headphones,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useAuthStore } from '@/lib/stores/auth-store'

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  // IGATESECURITY App style navigation for residents
  const residentPrimaryNav = [
    {
      icon: LayoutDashboard,
      label: 'HOME',
      href: '/dashboard',
    },
    {
      icon: Home,
      label: 'MY UNIT',
      href: '/dashboard/my-unit',
    },
    {
      icon: Users,
      label: 'COMMUNITY',
      href: '/dashboard/community/forum',
    },
    {
      icon: Compass,
      label: 'DISCOVER',
      href: '/dashboard/residents/events',
    },
  ]

  // More menu items for residents
  const residentMoreNav = [
    {
      icon: Headphones,
      label: 'Helpdesk',
      href: '/dashboard/helpdesk/tickets',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: AlertTriangle,
      label: 'SOS',
      href: '/dashboard/sos',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: Wrench,
      label: 'Services',
      href: '/dashboard/services',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Shield,
      label: 'QR Access',
      href: '/dashboard/qr-access',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: ShoppingBag,
      label: 'Marketplace',
      href: '/dashboard/marketplace',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Building,
      label: 'Amenities',
      href: '/dashboard/residents/amenities',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Calendar,
      label: 'Events',
      href: '/dashboard/residents/events',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Building,
      label: 'Facility Requests',
      href: '/dashboard/facilities/requests',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
    },
  ]

  // Admin navigation - Community Manager style
  const adminPrimaryNav = [
    {
      icon: LayoutDashboard,
      label: 'HOME',
      href: '/dashboard',
    },
    {
      icon: Wallet,
      label: 'FINANCE',
      href: '/dashboard/financial/billing',
    },
    {
      icon: Shield,
      label: 'SECURITY',
      href: '/dashboard/security/visitors',
    },
    {
      icon: ClipboardList,
      label: 'HELPDESK',
      href: '/dashboard/admin/complaints',
    },
  ]

  // More menu items for admin
  const adminMoreNav = [
    {
      icon: Users,
      label: 'Visitors',
      href: '/dashboard/security/visitors',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Car,
      label: 'Vehicles',
      href: '/dashboard/security/vehicles',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Package,
      label: 'Parcels',
      href: '/dashboard/security/parcels',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: FileText,
      label: 'Invoices',
      href: '/dashboard/financial/invoices',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Calendar,
      label: 'Amenities',
      href: '/dashboard/residents/amenities',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Bell,
      label: 'Events',
      href: '/dashboard/residents/events',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      icon: Megaphone,
      label: 'Notices',
      href: '/dashboard/residents/notices',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: Users,
      label: 'Directory',
      href: '/dashboard/residents/directory',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Building,
      label: 'Assets',
      href: '/dashboard/admin/assets',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: Wrench,
      label: 'Vendors',
      href: '/dashboard/admin/vendors',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
    },
  ]

  // Gatekeeper (Guard) navigation
  const gatekeeperPrimaryNav = [
    {
      icon: LayoutDashboard,
      label: 'HOME',
      href: '/dashboard/guard/dashboard',
    },
    {
      icon: Users,
      label: 'VISITORS',
      href: '/dashboard/security/visitors',
    },
    {
      icon: QrCode,
      label: 'SCAN',
      href: '/dashboard/qr-access',
      isCenter: true,
    },
    {
      icon: Package,
      label: 'PARCELS',
      href: '/dashboard/security/parcels',
    },
  ]

  // More menu items for gatekeepers
  const gatekeeperMoreNav = [
    {
      icon: Car,
      label: 'Vehicles',
      href: '/dashboard/security/vehicles',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: UserCheck,
      label: 'Staff',
      href: '/dashboard/staff/maids',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: AlertTriangle,
      label: 'Incidents',
      href: '/dashboard/security/security-logs',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: ParkingCircle,
      label: 'Parking',
      href: '/dashboard/parking/slots',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Phone,
      label: 'Emergency',
      href: '/dashboard/sos',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
    },
  ]

  // Individual navigation
  const individualPrimaryNav = [
    {
      icon: LayoutDashboard,
      label: 'HOME',
      href: '/dashboard',
    },
    {
      icon: Wrench,
      label: 'SERVICES',
      href: '/dashboard/services',
    },
    {
      icon: Shield,
      label: 'QR ACCESS',
      href: '/dashboard/qr-access',
    },
    {
      icon: Settings,
      label: 'SETTINGS',
      href: '/dashboard/settings',
    },
  ]

  const individualMoreNav: any[] = []

  // Super Admin navigation
  const superAdminPrimaryNav = [
    {
      icon: LayoutDashboard,
      label: 'HOME',
      href: '/dashboard',
    },
    {
      icon: Building,
      label: 'SOCIETIES',
      href: '/dashboard/super-admin/societies',
    },
    {
      icon: Users,
      label: 'USERS',
      href: '/dashboard/super-admin/users',
    },
    {
      icon: Wallet,
      label: 'BILLING',
      href: '/dashboard/super-admin/billing',
    },
  ]

  // More menu items for super admin
  const superAdminMoreNav = [
    {
      icon: Settings,
      label: 'System Settings',
      href: '/dashboard/super-admin/settings',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: TrendingUp,
      label: 'Reports',
      href: '/dashboard/super-admin/reports',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: ClipboardList,
      label: 'Leads',
      href: '/dashboard/super-admin/leads',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
    {
      icon: AlertTriangle,
      label: 'Emergency',
      href: '/dashboard/super-admin/emergency-logs',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: UserCheck,
      label: 'B2C Users',
      href: '/dashboard/super-admin/b2c-users',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ]

  // Vendor navigation
  const vendorPrimaryNav = [
    {
      icon: LayoutDashboard,
      label: 'HOME',
      href: '/dashboard',
    },
    {
      icon: ClipboardList,
      label: 'LEADS',
      href: '/dashboard/vendor/leads',
    },
  ]

  const vendorMoreNav = [
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
    },
  ]

  const isGuard = user?.role === 'guard'
  const isAdmin = user?.role === 'admin'
  const isIndividual = user?.role === 'individual'
  const isSuperAdmin = user?.role === 'super_admin'
  const isVendor = user?.role === 'vendor'

  const primaryNav = isSuperAdmin
    ? superAdminPrimaryNav
    : isAdmin
      ? adminPrimaryNav
      : isGuard
        ? gatekeeperPrimaryNav
        : isVendor
          ? vendorPrimaryNav
          : isIndividual
            ? individualPrimaryNav
            : residentPrimaryNav

  const moreNav = isSuperAdmin
    ? superAdminMoreNav
    : isAdmin
      ? adminMoreNav
      : isGuard
        ? gatekeeperMoreNav
        : isVendor
          ? vendorMoreNav
          : isIndividual
            ? individualMoreNav
            : residentMoreNav

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsMoreOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
    setIsMoreOpen(false)
  }

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />

            {/* More Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl md:hidden"
            >
              {/* Handle Bar */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a5f]">More Options</h3>
                  <p className="text-xs text-gray-500">Quick access to all features</p>
                </div>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Menu Grid */}
              <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-4 gap-3">
                  {moreNav.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          'flex flex-col items-center justify-center p-3 rounded-2xl transition-all',
                          isActive
                            ? 'bg-teal-50 ring-2 ring-teal-500'
                            : 'hover:bg-gray-50 active:scale-95'
                        )}
                      >
                        <div
                          className={cn(
                            'p-3 rounded-xl mb-2 transition-colors',
                            isActive ? 'bg-teal-500 text-white' : item.bgColor
                          )}
                        >
                          <Icon className={cn('h-5 w-5', isActive ? 'text-white' : item.color)} />
                        </div>
                        <span className={cn(
                          'text-xs font-medium',
                          isActive ? 'text-teal-600' : 'text-gray-700'
                        )}>
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    Account
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigation(isSuperAdmin ? '/dashboard/super-admin/settings' : '/dashboard/settings')}
                      className="flex items-center w-full gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-blue-50">
                        <User className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium text-gray-900">My Profile</span>
                        <p className="text-xs text-gray-500">View and edit your profile</p>
                      </div>
                    </button>
                    {!isIndividual && (
                      <button
                        onClick={() => handleNavigation(
                          isSuperAdmin ? '/dashboard/super-admin/settings' :
                            isAdmin ? '/dashboard/admin/complaints' :
                              '/dashboard/helpdesk/tickets'
                        )}
                        className="flex items-center w-full gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-purple-50">
                          <HelpCircle className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-medium text-gray-900">Help & Support</span>
                          <p className="text-xs text-gray-500">Get help using the app</p>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-3 py-3 px-4 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-red-50">
                        <LogOut className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium text-red-600">Logout</span>
                        <p className="text-xs text-gray-500">Sign out of your account</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation - IGATESECURITY Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {/* Safe area padding for iOS */}
        <div className="grid grid-cols-5 h-16 pb-safe">
          {primaryNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const isCenter = 'isCenter' in item && item.isCenter

            // Special center button for QR scan (guard role)
            if (isCenter) {
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="flex items-center justify-center relative"
                >
                  <div className="absolute -top-6 p-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-[9px] font-bold text-teal-600 mt-8">
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  'flex flex-col items-center justify-center space-y-0.5 transition-all relative',
                  isActive
                    ? 'text-teal-600'
                    : 'text-gray-400 hover:text-gray-600 active:bg-gray-50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-b-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={cn('h-5 w-5', isActive && 'text-teal-600')} />
                <span className={cn(
                  'text-[9px] font-bold tracking-wide',
                  isActive ? 'text-teal-600' : 'text-gray-500'
                )}>
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* More Button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center space-y-0.5 transition-all relative',
              isMoreOpen
                ? 'text-teal-600'
                : 'text-gray-400 hover:text-gray-600 active:bg-gray-50'
            )}
          >
            {isMoreOpen && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-b-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <MoreHorizontal className={cn('h-5 w-5', isMoreOpen && 'text-teal-600')} />
            <span className={cn(
              'text-[9px] font-bold tracking-wide',
              isMoreOpen ? 'text-teal-600' : 'text-gray-500'
            )}>
              MORE
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
