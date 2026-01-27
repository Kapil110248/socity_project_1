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
  Video,
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

function formatNotificationTime(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hour${Math.floor(diff / 3600000) > 1 ? 's' : ''} ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} day${Math.floor(diff / 86400000) > 1 ? 's' : ''} ago`
  return new Date(createdAt).toLocaleDateString()
}

export function Header() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()
  const [messageOpen, setMessageOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState('')

  // Fetch Conversations
  const { data: conversations = [], isLoading: isConversationsLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/chat/conversations')
      const sorted = response.data.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      return sorted
    },
    enabled: messageOpen // Only fetch when dialog is open
  })

  // Fetch Messages for selected conversation
  const { data: currentMessages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return []
      const response = await api.get(`/chat/conversations/${selectedConversationId}/messages`)
      return response.data
    },
    enabled: !!selectedConversationId,
    refetchInterval: 3000 // Poll every 3 seconds for new messages (simple real-time)
  })

  // Fetch Users for New Chat
  const { data: availableUsers = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['users-for-chat', userSearchTerm],
    queryFn: async () => {
      const response = await api.get('/auth/all') // Optimization: Should ideally be a search API
      let users = response.data.filter((u: any) => u.id !== user?.id)
      if (userSearchTerm) {
        const lowerTerm = userSearchTerm.toLowerCase()
        users = users.filter((u: any) => 
            u.name.toLowerCase().includes(lowerTerm) || 
            u.email.toLowerCase().includes(lowerTerm) ||
            u.role.toLowerCase().includes(lowerTerm)
        )
      }
      return users.slice(0, 20) // Limit to 20 for performance
    },
    enabled: isNewChatOpen
  })

  // Fetch current user's notifications (user-specific, no hardcoded data)
  // refetchInterval + refetchOnWindowFocus so new notifications (e.g. second lead assign) show without refresh
  const { data: notificationRes, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications', { params: { limit: 50 } })
      const body = res.data
      return {
        data: Array.isArray(body?.data) ? body.data : (body?.data ? [body.data] : []),
        unreadCount: body?.unreadCount ?? 0,
      }
    },
    enabled: !!user?.id,
    refetchInterval: 15000, // Poll every 15 sec so new lead-assign etc. show without refresh
    refetchOnWindowFocus: true,
  })
  const notificationsList = notificationRes?.data ?? []
  const notificationCount = notificationRes?.unreadCount ?? 0

  const markAllNotificationsRead = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  // Start Conversation Mutation
  const startConversationMutation = useMutation({
    mutationFn: async (targetUserId: number) => {
        console.log('Starting chat with user ID:', targetUserId)
        try {
            console.log('Posting to /chat/start...')
            const response = await api.post('/chat/start', { targetUserId })
            console.log('Response:', response)
            return response.data
        } catch (err: any) {
            console.error('API Post Failed:', err)
            throw err
        }
    },
    onSuccess: (conversation) => {
        setIsNewChatOpen(false)
        setSelectedConversationId(conversation.id)
        refetchConversations()
    },
    onError: (error: any) => {
        console.error('Mutation Error:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Unknown error'
        const errorStack = error.response?.data?.stack || ''
        alert(`Failed: ${errorMessage}\n\nBackend Stack:\n${errorStack}\n\nFull Error: ${JSON.stringify(error)}`)
    }
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedConversationId) return
      const response = await api.post('/chat/messages', {
        conversationId: selectedConversationId,
        content
      })
      return response.data
    },
    onSuccess: () => {
      setNewMessage('')
      refetchMessages()
      refetchConversations() // Update last message in list
    }
  })

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
      case 'lead_assigned':
        return 'bg-teal-100 text-teal-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  // Handle sending message
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversationId) {
      sendMessageMutation.mutate(newMessage)
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

          {/* Community Selector - Desktop (dynamic from user.society, no hardcoded data) */}
          {user?.role !== 'individual' && user?.role !== 'super_admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors min-w-0 max-w-[240px] lg:max-w-[280px]">
                  <div className="p-1.5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex-shrink-0">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left min-w-0 overflow-hidden flex-1">
                    <p className="text-sm font-semibold text-[#1e3a5f] truncate">
                      {(user as any)?.society?.name ?? (user?.role === 'vendor' ? 'Service Provider' : '—')}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {((user as any)?.society?.address ?? (user as any)?.society?.city ?? ((user as any)?.society?.pincode ? `PIN ${(user as any).society.pincode}` : '')) || (user?.role === 'vendor' ? 'My assigned leads' : '')}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Current community</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-teal-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{(user as any)?.society?.name ?? (user?.role === 'vendor' ? 'Service Provider' : '—')}</p>
                      <p className="text-xs text-gray-500">
                        {((user as any)?.society?.address ?? (user as any)?.society?.city ?? ((user as any)?.society?.pincode ? `PIN ${(user as any).society.pincode}` : '')) || (user?.role === 'vendor' ? 'My assigned leads' : '')}
                      </p>
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
          <Dialog open={messageOpen} onOpenChange={(open) => {
             setMessageOpen(open)
             if(!open) {
                setSelectedConversationId(null)
                setIsNewChatOpen(false)
             }
          }}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-gray-100">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                {/* Show dot if unread - logic to be added */}
                {/* <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white" /> */}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md h-[500px] flex flex-col p-0 gap-0 overflow-hidden">
              <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                <div className="flex flex-col gap-1">
                    <DialogTitle className="flex items-center gap-2">
                    <div className="p-2 bg-teal-100 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-teal-600" />
                    </div>
                    {isNewChatOpen ? 'New Chat' : selectedConversationId ? 'Chat' : 'Messages'}
                    </DialogTitle>
                    <DialogDescription>
                    {isNewChatOpen ? 'Select a user to message' : selectedConversationId ? 'Conversation' : 'Your recent conversations'}
                    </DialogDescription>
                </div>
                {!selectedConversationId && !isNewChatOpen && (
                    <Button size="sm" onClick={() => setIsNewChatOpen(true)} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full h-8 w-8 p-0 flex items-center justify-center">
                        <span className="text-lg font-bold pb-1">+</span>
                    </Button>
                )}
              </DialogHeader>

              {/* View: New Chat User Selection */}
              {isNewChatOpen && (
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b">
                        <Input 
                            placeholder="Search users..." 
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="bg-gray-50 border-gray-200"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {isUsersLoading ? (
                             <div className="text-center p-4 text-gray-500">Loading users...</div>
                        ) : availableUsers.length === 0 ? (
                            <div className="text-center p-4 text-gray-500">No users found.</div>
                        ) : (
                            availableUsers.map((u: any) => (
                                <div
                                key={u.id}
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
                                onClick={() => startConversationMutation.mutate(u.id)}
                                >
                                <Avatar className="h-10 w-10 ring-2 ring-white">
                                    <AvatarImage src={u.profileImg} />
                                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-sm font-semibold">
                                    {u.name?.charAt(0) || '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-[#1e3a5f]">{u.name}</p>
                                    <p className="text-xs text-teal-600 font-medium capitalize">{u.role?.toLowerCase()}</p>
                                </div>
                                <Button size="sm" variant="ghost" className="text-teal-600">
                                    Chat
                                </Button>
                                </div>
                            ))
                        )}
                    </div>
                     <div className="p-4 border-t">
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setIsNewChatOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
              )}

              {/* View: Conversation List */}
              {!selectedConversationId && !isNewChatOpen && (
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {isConversationsLoading ? (
                       <div className="text-center p-4 text-gray-500">Loading chats...</div>
                  ) : conversations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                          <div className="bg-gray-50 p-4 rounded-full mb-3">
                            <MessageSquare className="h-8 w-8 text-gray-300" />
                          </div>
                          <p className="text-gray-900 font-medium">No conversations yet</p>
                          <p className="text-sm text-gray-500 mt-1 mb-4">Start a new chat to connect with others.</p>
                          <Button variant="outline" onClick={() => setIsNewChatOpen(true)}>
                            Start New Chat
                          </Button>
                      </div>
                  ) : (
                    conversations.map((conv: any) => (
                    <div
                      key={conv.id}
                      className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
                      onClick={() => setSelectedConversationId(conv.id)}
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-white">
                        <AvatarImage src={conv.otherUser?.profileImg} />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-sm font-semibold">
                          {conv.otherUser?.name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm text-[#1e3a5f]">{conv.otherUser?.name || 'Unknown User'}</p>
                          <span className="text-xs text-gray-500">{new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-teal-600 font-medium capitalize">{conv.otherUser?.role?.toLowerCase()}</p>
                        <p className="text-sm text-gray-600 truncate mt-0.5">
                            {conv.lastMessage?.content || 'Started a conversation'}
                        </p>
                      </div>
                    </div>
                  )))}
                </div>
              )}

              {/* View: Chat Messages */}
              {selectedConversationId && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                        <div className="flex items-center justify-between mb-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedConversationId(null)} className="-ml-2 text-gray-500">
                                ← Back
                            </Button>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-teal-600"
                                title="Voice call"
                                onClick={() => {
                                  const conv = (conversations as any[]).find((c: any) => c.id === selectedConversationId)
                                  const phone = conv?.otherUser?.phone
                                  if (phone) window.open(`tel:${phone}`, '_self')
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-teal-600"
                                title="Video call"
                                onClick={() => window.open(`https://meet.jit.si/socity-c${selectedConversationId}`, '_blank', 'noopener,noreferrer')}
                              >
                                <Video className="h-4 w-4" />
                              </Button>
                            </div>
                        </div>
                        {currentMessages.map((msg: any) => {
                            const isMe = msg.sender?.id === user?.id
                            const senderLabel = isMe ? 'You' : (msg.sender?.name || 'Unknown')
                            return (
                                <div key={msg.id} className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                                    <span className={`text-xs font-medium px-1 ${isMe ? 'text-teal-600' : 'text-gray-500'}`}>
                                        {senderLabel}
                                    </span>
                                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} max-w-[85%]`}>
                                        <div className={`p-3 rounded-2xl text-sm ${
                                            isMe ? 'bg-teal-500 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                                        }`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-[10px] mt-1 ${isMe ? 'text-teal-100' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="p-3 bg-white border-t flex gap-2">
                         <Textarea
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 min-h-[44px] max-h-[80px] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                          />
                          <Button
                            size="icon"
                            disabled={sendMessageMutation.isPending || !newMessage.trim()}
                            className="h-[44px] w-[44px] bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                            onClick={handleSendMessage}
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                    </div>
                  </>
              )}
            </DialogContent>
          </Dialog>

          {/* Notifications – user-specific from API, no hardcoded data */}
          <DropdownMenu onOpenChange={(open) => { if (open) refetchNotifications() }}>
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
                {notificationCount > 0 && (
                  <button
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    onClick={() => markAllNotificationsRead.mutate()}
                  >
                    Mark all read
                  </button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {notificationsList.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">No notifications</p>
                ) : (
                  notificationsList.map((n: any) => (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                    >
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${getNotificationIcon(n.type || '')}`}
                      >
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        {n.description && (
                          <p className="text-sm text-gray-600 truncate">
                            {n.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatNotificationTime(n.createdAt)}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
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
