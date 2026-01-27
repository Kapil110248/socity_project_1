'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  MessageSquare,
  Settings,
  X,
  Send,
  Building2,
  ChevronDown,
  Phone,
  HelpCircle,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/stores/auth-store'

const messages = [
  {
    id: 1,
    sender: 'Rajesh Kumar',
    unit: 'A-101',
    message: 'Hi, can you share the maintenance bill?',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    sender: 'Priya Sharma',
    unit: 'B-205',
    message: 'Thanks for resolving the water issue!',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    sender: 'Security Desk',
    unit: 'Gate 1',
    message: 'Visitor arrived for A-502',
    time: '3 hours ago',
    unread: false,
  },
]

const notifications = [
  {
    title: 'New Visitor Entry',
    description: 'John Doe checked in to Unit A-101',
    time: '2 min ago',
    unread: true,
    type: 'visitor',
  },
  {
    title: 'Payment Received',
    description: 'Rs. 15,000 received from Unit B-205',
    time: '1 hour ago',
    unread: true,
    type: 'payment',
  },
  {
    title: 'Complaint Resolved',
    description: 'Water leakage in Block C resolved',
    time: '3 hours ago',
    unread: false,
    type: 'complaint',
  },
  {
    title: 'New Amenity Booking',
    description: 'Clubhouse booked for tomorrow',
    time: '5 hours ago',
    unread: false,
    type: 'booking',
  },
]

export function Header() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()
  const [notificationCount] = useState(5)
  const [messageOpen, setMessageOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'visitor':
        return 'bg-blue-100 text-blue-600'
      case 'payment':
        return 'bg-green-100 text-green-600'
      case 'complaint':
        return 'bg-orange-100 text-orange-600'
      case 'booking':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <header className="h-16 border-b border-gray-100 bg-white sticky top-0 z-40 shadow-sm">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section - Logo & Community */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Logo on mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-md">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1e3a5f] uppercase">igatesecurity</h2>
              <p className="text-[10px] text-gray-500 -mt-0.5">
                {user?.role === 'admin'
                  ? 'Manager'
                  : user?.role === 'guard'
                    ? 'Gatekeeper'
                    : user?.role === 'individual'
                      ? 'Standalone'
                      : 'Resident'}
              </p>
            </div>
          </div>

          {/* Community Selector - Desktop */}
          {user?.role !== 'individual' && user?.role !== 'super_admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1.5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#1e3a5f]">Green Valley Apartments</p>
                    <p className="text-xs text-gray-500">Block A, Tower 1</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Switch Community</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-teal-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Green Valley Apartments</p>
                      <p className="text-xs text-gray-500">Block A, Tower 1</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Sunset Heights</p>
                      <p className="text-xs text-gray-500">Wing B</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Search - Desktop */}
          <div className="relative max-w-md w-full hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search residents, units, notices..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Search icon - Mobile/Tablet */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full hover:bg-gray-100"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Theme Toggle - Hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full hidden md:flex hover:bg-gray-100"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-600" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </Button>

          {/* Help - Hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden md:flex hover:bg-gray-100"
            onClick={() => router.push(
              user?.role === 'super_admin' ? '/dashboard/super-admin/settings' :
                user?.role === 'admin' ? '/dashboard/admin/complaints' :
                  '/dashboard/helpdesk/tickets'
            )}
          >
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Messages */}
          <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-gray-100">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-teal-600" />
                  </div>
                  Messages
                </DialogTitle>
                <DialogDescription>
                  Your recent conversations with residents
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${msg.unread ? 'bg-teal-50 hover:bg-teal-100' : 'hover:bg-gray-50'
                      }`}
                    onClick={() => alert(`Opening conversation with ${msg.sender}`)}
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-white">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-sm font-semibold">
                        {msg.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-[#1e3a5f]">{msg.sender}</p>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-xs text-teal-600 font-medium">{msg.unit}</p>
                      <p className="text-sm text-gray-600 truncate mt-0.5">{msg.message}</p>
                    </div>
                    {msg.unread && (
                      <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[60px] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <Button
                  size="icon"
                  className="h-[60px] w-[60px] bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  onClick={() => {
                    if (newMessage.trim()) {
                      alert('Message sent: ' + newMessage)
                      setNewMessage('')
                    }
                  }}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 border-2 border-white">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span className="font-bold text-[#1e3a5f]">Notifications</span>
                <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                  Mark all read
                </button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${getNotificationIcon(notification.type)}`}
                    >
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <span className="w-2 h-2 bg-teal-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-teal-600 hover:text-teal-700 cursor-pointer justify-center font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <Avatar className="h-9 w-9 ring-2 ring-teal-500/30">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-[#1e3a5f]">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 font-normal">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(user?.role === 'super_admin' ? '/dashboard/super-admin/settings' : '/dashboard/settings')}
                className="cursor-pointer"
              >
                <User className="h-4 w-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(user?.role === 'super_admin' ? '/dashboard/super-admin/settings' : '/dashboard/settings')}
                className="cursor-pointer"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => alert(`Contacting support at support@igatesecurity.com. Our team will get back to you shortly.`)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={() => {
                  useAuthStore.getState().logout()
                  router.push('/auth/login')
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute inset-x-0 top-0 bg-white p-4 shadow-lg z-50 lg:hidden"
        >
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search residents, units, notices..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(false)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  )
}
