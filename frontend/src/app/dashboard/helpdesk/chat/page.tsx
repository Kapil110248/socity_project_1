'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  Smile,
  CheckCheck,
  Building,
  ChevronLeft,
  Wrench,
  ShieldCheck,
  Users,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatService } from '@/services/chat.service'
import { toast } from 'sonner'
import { getSocket } from '@/lib/socket'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'

const SUPPORT_CHANNELS = [
  { type: 'SUPPORT_ADMIN', name: 'Admin Support', avatar: 'AS', icon: Building },
  { type: 'SUPPORT_MAINTENANCE', name: 'Maintenance Team', avatar: 'MT', icon: Wrench },
  { type: 'SUPPORT_SECURITY', name: 'Security Desk', avatar: 'SD', icon: ShieldCheck },
  { type: 'SUPPORT_COMMITTEE', name: 'Committee President', avatar: 'CP', icon: Users },
  { type: 'SUPPORT_ACCOUNTS', name: 'Accounts Department', avatar: 'AD', icon: CreditCard },
]

export default function HelpdeskChatPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [marketplaceContext, setMarketplaceContext] = useState<{
    sellerId: number | null;
    itemId: number | null;
    itemTitle: string | null;
  }>({ sellerId: null, itemId: null, itemTitle: null })
  const scrollEndRef = useRef<HTMLDivElement>(null)

  // Fetch Conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.listConversations
  })

  // Selected Conversation Data
  const selectedChat = conversations.find(c => c.id === selectedChatId)

  // Fetch Messages
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', selectedChatId],
    queryFn: () => selectedChatId ? chatService.getMessages(selectedChatId) : Promise.resolve([]),
    enabled: !!selectedChatId
  })

  // Mutations
  const sendMutation = useMutation({
    mutationFn: chatService.sendMessage,
    onSuccess: () => {
      setNewMessage('')
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChatId] })
    },
    onError: (error: any) => {
      toast.error('Failed to send message: ' + (error.response?.data?.error || error.message))
    }
  })

  const startMutation = useMutation({
    mutationFn: chatService.startConversation,
    onSuccess: (newConv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setSelectedChatId(newConv.id)
      toast.success('Conversation started')
    },
    onError: (error: any) => {
      toast.error('Failed to start chat: ' + (error.response?.data?.error || error.message))
    }
  })

  // Socket.io ... (unchanged)

  // ...

  const handleChannelClick = (type: string, existingId?: number) => {
    if (existingId && existingId !== -1) {
      setSelectedChatId(existingId)
      setShowMobileChat(true)
    } else {
      startMutation.mutate(type)
      setShowMobileChat(true)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChatId) return
    sendMutation.mutate({ conversationId: selectedChatId, content: newMessage })
  }

  // Handle marketplace context from URL
  useEffect(() => {
    const userId = searchParams.get('userId')
    const itemId = searchParams.get('itemId')
    const itemTitle = searchParams.get('itemTitle')
    
    if (userId && itemId && itemTitle) {
      setMarketplaceContext({
        sellerId: parseInt(userId),
        itemId: parseInt(itemId),
        itemTitle: decodeURIComponent(itemTitle)
      })
      // Pre-fill message with item context
      setNewMessage(`Hi! I'm interested in your listing: "${decodeURIComponent(itemTitle)}"`)
      // Start a direct message conversation
      startMutation.mutate(`DIRECT_${userId}`)
      setShowMobileChat(true)
    }
  }, [searchParams])

  // Combined List for UI
  const displayConversations = useMemo(() => {
    const userRole = user?.role?.toUpperCase();
    if (userRole === 'RESIDENT') {
      return SUPPORT_CHANNELS.map(channel => {
        const existing = conversations.find(c => c.type === channel.type)
        const lastMsg = existing?.messages?.[0]
        return {
          ...channel,
          id: existing?.id || -1,
          lastMessage: lastMsg?.content || 'Start a conversation',
          time: existing?.updatedAt ? format(new Date(existing.updatedAt), 'hh:mm a') : '',
          unread: 0,
          online: true,
          existingId: existing?.id
        }
      })
    }
    return conversations.map(c => ({
      id: c.id,
      name: c.participant?.name || c.type.split('_')[1],
      lastMessage: c.messages?.[0]?.content || 'Empty chat',
      time: format(new Date(c.updatedAt), 'hh:mm a'),
      unread: 0,
      avatar: c.participant?.name?.substring(0, 2) || 'U',
      online: true,
      type: c.type,
      existingId: c.id // Explicitly adding existingId for Admins
    }))
  }, [conversations, user])

  return (
    <div className="h-[calc(100vh-100px)] bg-gray-50">
      <div className="h-full flex">
        {/* Conversations List */}
        <div className={`w-full md:w-80 bg-white border-r flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Messages
            </h2>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search conversations..." className="pl-10 h-10 rounded-xl" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {displayConversations.map((conv) => (
              <motion.div
                key={conv.type || conv.id}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                onClick={() => handleChannelClick(conv.type, (conv as any).existingId)}
                className={`p-4 border-b cursor-pointer transition-colors ${selectedChatId === conv.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{conv.name}</p>
                      <span className="text-[10px] text-gray-500 font-medium">{conv.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden p-0 h-8 w-8"
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                      {selectedChat.participant?.name?.substring(0, 2) || selectedChat.type.split('_')[1].substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">{selectedChat.participant?.name || selectedChat.type.split('_')[1].replace('SUPPORT_', '')}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gray-50/50">
                <div className="space-y-6">
                  {messages.map((msg: any) => {
                    const isMe = msg.senderId === parseInt(user?.id || '0')
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                          <div
                            className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 px-1">
                            <span className="text-[10px] text-gray-400 font-medium">
                              {format(new Date(msg.createdAt), 'hh:mm a')}
                            </span>
                            {isMe && <CheckCheck className="h-3 w-3 text-blue-500" />}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  <div ref={scrollEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-gray-400">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="h-11 pl-4 pr-10 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 transition-all font-medium"
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-blue-500">
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-11 w-11 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                    disabled={!newMessage.trim() || sendMutation.isPending}
                  >
                    <Send className={`h-5 w-5 ${sendMutation.isPending ? 'animate-pulse' : ''}`} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-blue-500 opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Your Conversations</h3>
              <p className="text-sm text-gray-500 max-w-xs mt-2 font-medium">
                Select a support channel from the list to start a real-time chat with our team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
