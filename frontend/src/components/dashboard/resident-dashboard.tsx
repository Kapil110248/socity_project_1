'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Home,
  CreditCard,
  AlertCircle,
  Calendar,
  Bell,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Car,
  Dog,
  ChevronRight,
  Wrench,
  FileText,
  MessageSquare,
  ShoppingBag,
  User,
  Phone,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { SocietyService } from '@/services/society.service'
import { Skeleton } from '@/components/ui/skeleton'

// My Unit data - IGATESECURITY style (page 5)
const myUnitData = {
  unitNo: 'A - Block-1',
  members: 7,
  pets: 3,
  vehicles: 2,
}

// Gate Updates - IGATESECURITY style (page 6)
const gateUpdates = [
  { type: 'Visitor', count: 3, label: 'Today', icon: Users, color: 'bg-purple-100 text-purple-600' },
  { type: 'Helper', count: '3/4', label: 'In campus', icon: User, color: 'bg-pink-100 text-pink-600' },
  { type: 'Parcel', count: 3, label: 'Yet to collect', icon: Package, color: 'bg-blue-100 text-blue-600' },
]

// My Dues - IGATESECURITY style
const myDues = {
  title: 'Maintenance Fee',
  amount: 5300,
  penalty: 100,
  penaltyLabel: 'Overdue-Accured Penalty',
}

// Shortcuts - IGATESECURITY style (page 3)
const shortcuts = [
  { icon: Wrench, label: 'Services', href: '/dashboard/services', color: 'bg-blue-50' },
  { icon: Calendar, label: 'Facilities', href: '/dashboard/residents/amenities', color: 'bg-green-50' },
  { icon: FileText, label: 'Guidelines', href: '/dashboard/resident/guidelines', color: 'bg-yellow-50' },
  { icon: MessageSquare, label: 'Community', href: '/dashboard/resident/community', color: 'bg-purple-50' },
  { icon: ShoppingBag, label: 'Marketplace', href: '/dashboard/resident/market', color: 'bg-pink-50' },
]

// Announcements - IGATESECURITY style
const announcements = [
  {
    id: 1,
    title: 'Swimming Pool Under Maintenance',
    description: 'Dear Residents, This weekend the swimming pool will be closed for maintenance work.',
    author: 'Sharlow Bay Committee',
    time: '2hrs ago',
    type: 'maintenance',
  },
  {
    id: 2,
    title: 'New Year Celebration',
    description: 'Please join us for ring in the New Year celebration at the clubhouse.',
    author: 'Sharlow Bay Committee',
    time: '2hrs ago',
    type: 'event',
  },
]

// Community Buzz - IGATESECURITY style
const communityBuzz = [
  {
    id: 1,
    type: 'poll',
    title: "What's your favourite restaurant around our locality?",
    author: 'Nikita Dixit',
    hasResult: true,
  },
  {
    id: 2,
    type: 'album',
    title: '5 Photos to New Library Album',
    author: 'Mathew',
    hasResult: false,
  },
]

// Upcoming Events
const upcomingEvents = [
  {
    id: 1,
    title: 'Diwali Celebration',
    date: 'Dec 15, 2024',
    time: '6:00 PM',
    location: 'Community Hall',
  },
  {
    id: 2,
    title: 'Yoga Session',
    date: 'Every Monday',
    time: '7:00 AM',
    location: 'Clubhouse',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export function ResidentDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['residentDashboard'],
    queryFn: residentService.getDashboardData,
  })

  // Fetch guidelines for residents (from Super Admin)
  const { data: guidelines = [] } = useQuery<any[]>({
    queryKey: ['guidelines-for-me'],
    queryFn: SocietyService.getGuidelinesForMe,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[100px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  const { societyName, unit, gateUpdates: apiGateUpdates, dues, announcements: apiAnnouncements, buzz: apiBuzz, events: apiEvents } = dashboardData || {}

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      {/* Welcome Header - IGATESECURITY App Style */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-4 ring-white/20">
              <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-lg sm:text-xl font-bold">
                {user?.name?.charAt(0) || 'R'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-cyan-100 text-sm">Hello {user?.name?.split(' ')[0] || 'Resident'}!!</p>
              <h1 className="text-xl sm:text-2xl font-bold">Sharlow Bay</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 h-10 w-10">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 h-10 w-10">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* My Dues Card - IGATESECURITY Style */}
        <div className="mt-4 bg-white dark:bg-card rounded-xl p-3 sm:p-4 text-gray-900 dark:text-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-muted-foreground">My Dues</p>
                <p className="text-xl sm:text-2xl font-bold">Rs. {dues?.amount?.toLocaleString() || '0'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/residents/dues">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">History</Button>
              </Link>
              <Link href="/dashboard/residents/dues">
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-xs sm:text-sm">Pay</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Shortcuts - IGATESECURITY Style */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-foreground">Shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
              {shortcuts.map((shortcut, index) => {
                const Icon = shortcut.icon
                return (
                  <Link key={index} href={shortcut.href} className="flex-shrink-0">
                    <div className="flex flex-col items-center gap-2 w-16 sm:w-20">
                      <div className={`p-3 sm:p-4 rounded-xl ${shortcut.color} dark:bg-muted/50`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground text-center">{shortcut.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* My Unit Card - IGATESECURITY Style (page 5) */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">My Unit</CardTitle>
              <Badge variant="outline" className="bg-muted text-foreground">
                Unit No : {unit?.unitNo || 'N/A'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{unit?.members?.toString().padStart(2, '0') || '00'}</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Dog className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{unit?.pets?.toString().padStart(2, '0') || '00'}</p>
                <p className="text-xs text-muted-foreground">Pets</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Car className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{unit?.vehicles?.toString().padStart(2, '0') || '00'}</p>
                <p className="text-xs text-muted-foreground">Vehicles</p>
              </div>
            </div>

            {/* Gate Updates Section */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">Gate Updates</h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(apiGateUpdates || gateUpdates).map((item: any, index: number) => {
                  const Icon = item.type === 'Visitor' ? Users : item.type === 'Helper' ? User : Package
                  const colorParts = (item.color || 'bg-muted text-muted-foreground').replace('bg-purple-100', 'bg-purple-100 dark:bg-purple-900/20').replace('bg-pink-100', 'bg-pink-100 dark:bg-pink-900/20').replace('bg-blue-100', 'bg-blue-100 dark:bg-blue-900/20').split(' ')
                  return (
                    <div key={index} className={`rounded-xl p-3 ${colorParts[0]} text-center`}>
                      <Icon className={`h-5 w-5 mx-auto mb-1 ${colorParts[1] || 'text-muted-foreground'}`} />
                      <p className="text-xs font-medium text-foreground">{item.type}</p>
                      <p className="text-lg font-bold text-foreground">{item.count}</p>
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* My Dues Detail */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">My Dues</h4>
              {dues?.penalty > 0 && dues?.penaltyLabel && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium px-3 py-1 rounded-full inline-block mb-2">
                  {dues.penaltyLabel} Rs. {dues.penalty}
                </div>
              )}
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-red-300">Maintenance Fee</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-red-100">Rs. {dues?.amount?.toLocaleString() || '0'}</p>
                  </div>
                  <Link href="/dashboard/residents/dues">
                    <Button className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white">PAY</Button>
                  </Link>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href="/dashboard/residents/dues" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Clock className="h-3 w-3 mr-1" /> History
                    </Button>
                  </Link>
                  <Link href="/dashboard/residents/dues?tab=wallet" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <CreditCard className="h-3 w-3 mr-1" /> Advance / Deposit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Announcements - IGATESECURITY Style */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Announcements</CardTitle>
              <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
              {(apiAnnouncements && apiAnnouncements.length > 0) ? apiAnnouncements.map((announcement: any) => (
                <div
                  key={announcement.id}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] p-4 rounded-xl border border-border hover:border-blue-200 transition-colors bg-card"
                >
                  <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{announcement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{announcement.description}</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        {(announcement.author || '').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{announcement.author}</span>
                    <span className="text-xs text-muted-foreground">• {announcement.time ? new Date(announcement.time).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground py-4">No announcements yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Community Buzz - IGATESECURITY Style */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Community Buzz</CardTitle>
              <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(apiBuzz && apiBuzz.length > 0) ? apiBuzz.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-border hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {item.hasResult && (
                        <Badge variant="outline" className="text-red-500 border-red-200 mb-2 text-xs">
                          View Result
                        </Badge>
                      )}
                      <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                            {(item.author || '').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{item.author}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground py-4">No community buzz yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Community Guidelines - Super Admin Messages */}
      {guidelines.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">Community Guidelines</CardTitle>
                <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                  {guidelines.length} {guidelines.length === 1 ? 'Guideline' : 'Guidelines'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guidelines.slice(0, 3).map((guideline: any) => (
                  <div
                    key={guideline.id}
                    className="p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 bg-purple-50/30 dark:bg-purple-900/10 hover:bg-purple-50/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1">{guideline.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{guideline.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs bg-card">
                            {guideline.category || 'General'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {guideline.createdAt ? new Date(guideline.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {guidelines.length > 3 && (
                  <Link href="/dashboard/resident/guidelines">
                    <Button variant="outline" className="w-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      View All {guidelines.length} Guidelines
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upcoming Events */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Upcoming Events</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(apiEvents && apiEvents.length > 0) ? apiEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-border hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push('/dashboard/residents/events')}
                >
                  <h4 className="font-semibold text-foreground mb-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.location}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground col-span-full py-4">No upcoming events.</p>
              )}
            </div>
            <Link href="/dashboard/residents/events">
              <Button variant="outline" className="w-full mt-4 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                View All Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
