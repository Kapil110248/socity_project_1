'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import {
  ArrowLeft,
  Send,
  Lock,
  Eye,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Paperclip,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/lib/stores/auth-store'
import { mockTickets } from '@/lib/mocks/tickets'
import { SupportTicket, TicketStatus, TicketMessage } from '@/types/tickets'
import { cn } from '@/lib/utils/cn'

export default function ClientPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => residentService.getTicketById(id as string),
    enabled: !!id
  })

  // Scroll to bottom on load/new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [ticket]) // Ideally depends on messages length

  // Handle Loading & Error states
  if (isLoading) return <div className="p-8">Loading ticket...</div>
  if (error || !ticket) return <div className="p-8 text-red-500">Error loading ticket or unauthorized.</div>

  const handleSendMessage = () => {
    // Placeholder for future implementation

    setNewMessage('')
  }

  // Reuse existing status logic if needed or simplify

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">#{ticket.id}</span>
            <Badge className="uppercase text-[10px]">{ticket.status}</Badge>
          </div>
          <h1 className="text-xl font-bold">{ticket.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold uppercase">
              {ticket.reportedBy?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-gray-900">{ticket.reportedBy?.name || 'User'}</p>
            <p className="text-xs text-gray-500">Created on {new Date(ticket.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700 mt-4 leading-relaxed">{ticket.description}</p>
          </div>
        </div>
      </div>

      {/* Chat Placeholder (Will need Messages API support later) */}
      {/* 
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
             // Messages map here
        </div>
        <div className="p-4 border-t flex gap-2">
          <Input ... />
          <Button ... ><Send /></Button>
        </div>
      </Card>
      */}
    </div>
  )
}
