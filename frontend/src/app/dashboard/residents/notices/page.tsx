'use client'

import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Bell,
  Calendar,
  AlertTriangle,
  Info,
  Megaphone,
  Pin,
  Eye,
  Plus,
  Send,
} from 'lucide-react'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const notices = [
  {
    id: '1',
    title: 'Society Annual General Meeting',
    content:
      'The Annual General Meeting will be held on January 20th, 2025 at 6:00 PM in the clubhouse. All members are requested to attend.',
    type: 'announcement',
    priority: 'high',
    publishedBy: 'Admin Team',
    publishedAt: '2 hours ago',
    expiresAt: 'Jan 20, 2025',
    isPinned: true,
    views: 124,
  },
  {
    id: '2',
    title: 'Water Supply Interruption Notice',
    content:
      'Water supply will be suspended on January 15th from 10:00 AM to 4:00 PM for tank cleaning. Please store water accordingly.',
    type: 'maintenance',
    priority: 'high',
    publishedBy: 'Maintenance Team',
    publishedAt: '1 day ago',
    expiresAt: 'Jan 15, 2025',
    isPinned: true,
    views: 256,
  },
  {
    id: '3',
    title: 'Republic Day Celebration 2025',
    content:
      'Join us for the Republic Day celebration on January 26th at 8:00 AM in the society garden. Flag hoisting ceremony followed by cultural program.',
    type: 'event',
    priority: 'medium',
    publishedBy: 'Cultural Committee',
    publishedAt: '2 days ago',
    expiresAt: 'Jan 26, 2025',
    isPinned: false,
    views: 89,
  },
  {
    id: '4',
    title: 'New Parking Rules Effective Immediately',
    content:
      'Parking stickers are now mandatory for all vehicles. Please collect your stickers from the security office. Vehicles without stickers will be towed.',
    type: 'announcement',
    priority: 'high',
    publishedBy: 'Security Team',
    publishedAt: '3 days ago',
    expiresAt: null,
    isPinned: false,
    views: 342,
  },
  {
    id: '5',
    title: 'Gym Renovation Update',
    content:
      'The gym renovation is complete! New equipment has been installed. The gym will reopen on January 12th with extended hours.',
    type: 'announcement',
    priority: 'medium',
    publishedBy: 'Admin Team',
    publishedAt: '4 days ago',
    expiresAt: null,
    isPinned: false,
    views: 178,
  },
  {
    id: '6',
    title: 'Important: Security Protocols',
    content:
      'For your safety, please do not share gate access codes with unknown persons. Always verify visitor identity before allowing entry.',
    type: 'emergency',
    priority: 'high',
    publishedBy: 'Security Team',
    publishedAt: '5 days ago',
    expiresAt: null,
    isPinned: false,
    views: 421,
  },
]

const getNoticeIcon = (type: string) => {
  switch (type) {
    case 'announcement':
      return Megaphone
    case 'emergency':
      return AlertTriangle
    case 'event':
      return Calendar
    case 'maintenance':
      return Info
    default:
      return Bell
  }
}

const getNoticeColor = (type: string) => {
  switch (type) {
    case 'announcement':
      return 'blue'
    case 'emergency':
      return 'red'
    case 'event':
      return 'purple'
    case 'maintenance':
      return 'orange'
    default:
      return 'gray'
  }
}

export default function NoticesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sendPush, setSendPush] = useState(false)

  const pinnedNotices = notices.filter((notice) => notice.isPinned)
  const regularNotices = notices.filter((notice) => !notice.isPinned)

  return (
    <RoleGuard allowedRoles={['admin', 'resident']}>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with society announcements and events
            </p>
          </div>
          <RoleGuard allowedRoles={['admin']}>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white gap-2 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create Notice
            </Button>
          </RoleGuard>
        </div>

        {/* Create Notice Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Society Notice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Notice Title</Label>
                <Input placeholder="Enter title..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue="announcement">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea placeholder="Enter notice content..." rows={5} />
              </div>
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <input
                  type="checkbox"
                  id="push"
                  checked={sendPush}
                  onChange={(e) => setSendPush(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="push" className="text-blue-900 flex items-center gap-2 cursor-pointer">
                  <Send className="h-4 w-4" />
                  Send instant push notification to all residents
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setIsModalOpen(false)}>Publish Notice</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pinned Notices */}
        {pinnedNotices.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Pin className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Pinned Notices
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pinnedNotices.map((notice, index) => {
                const Icon = getNoticeIcon(notice.type)
                const color = getNoticeColor(notice.type)

                return (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 border-2 border-red-200 bg-red-50/50 hover:shadow-lg transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-xl flex-shrink-0 ${color === 'blue'
                            ? 'bg-blue-100'
                            : color === 'red'
                              ? 'bg-red-100'
                              : color === 'purple'
                                ? 'bg-purple-100'
                                : 'bg-orange-100'
                            }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${color === 'blue'
                              ? 'text-blue-600'
                              : color === 'red'
                                ? 'text-red-600'
                                : color === 'purple'
                                  ? 'text-purple-600'
                                  : 'text-orange-600'
                              }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Pin className="h-4 w-4 text-red-600" />
                              <Badge
                                variant="secondary"
                                className={`${notice.priority === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-orange-100 text-orange-700'
                                  }`}
                              >
                                {notice.priority}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {notice.type}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {notice.title}
                          </h3>
                          <p className="text-gray-700 mb-4 line-clamp-3">
                            {notice.content}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              <span>{notice.publishedBy}</span>
                              <span>•</span>
                              <span>{notice.publishedAt}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{notice.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Regular Notices */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">All Notices</h2>
          <div className="space-y-4">
            {regularNotices.map((notice, index) => {
              const Icon = getNoticeIcon(notice.type)
              const color = getNoticeColor(notice.type)

              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-xl flex-shrink-0 ${color === 'blue'
                          ? 'bg-blue-100'
                          : color === 'red'
                            ? 'bg-red-100'
                            : color === 'purple'
                              ? 'bg-purple-100'
                              : 'bg-orange-100'
                          }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${color === 'blue'
                            ? 'text-blue-600'
                            : color === 'red'
                              ? 'text-red-600'
                              : color === 'purple'
                                ? 'text-purple-600'
                                : 'text-orange-600'
                            }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="secondary"
                              className={`${notice.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                              {notice.priority}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {notice.type}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {notice.title}
                        </h3>
                        <p className="text-gray-700 mb-4">{notice.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                  {notice.publishedBy.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{notice.publishedBy}</span>
                            </div>
                            <span>•</span>
                            <span>{notice.publishedAt}</span>
                            {notice.expiresAt && (
                              <>
                                <span>•</span>
                                <span>Expires: {notice.expiresAt}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{notice.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
