// 'use client'

// import { useState, useMemo, useEffect, useRef } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//     ArrowLeft,
//     Send,
//     Lock,
//     Eye,
//     Clock,
//     User,
//     ShieldAlert,
//     CheckCircle2,
//     AlertCircle,
//     MoreVertical,
//     Paperclip,
//     ShieldCheck,
//     Building2
// } from 'lucide-react'
// import { Card } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { useAuthStore } from '@/lib/stores/auth-store'
// import { mockTickets } from '@/lib/mocks/tickets'
// import { SupportTicket, TicketStatus, TicketMessage } from '@/types/tickets'
// import { cn } from '@/lib/utils/cn'

// export default function TicketDetailPage() {
//     const { id } = useParams()
//     const router = useRouter()
//     const { user } = useAuthStore()
//     const [ticket, setTicket] = useState<SupportTicket | null>(null)
//     const [newMessage, setNewMessage] = useState('')
//     const scrollRef = useRef<HTMLDivElement>(null)

//     useEffect(() => {
//         // Find ticket from mock data
//         const foundTicket = mockTickets.find(t => t.id === id)
//         if (foundTicket) {
//             // Visibility Check
//             const canView = () => {
//                 if (user?.role === 'resident' || user?.role === 'committee') {
//                     return foundTicket.residentId === user.id
//                 }
//                 if (user?.role === 'admin') {
//                     if (foundTicket.isPrivate) return foundTicket.handlerId === user.id
//                     return true
//                 }
//                 if (user?.role === 'super_admin') {
//                     return !foundTicket.isPrivate
//                 }
//                 return false
//             }

//             if (!canView()) {
//                 router.push('/dashboard/helpdesk/tickets')
//                 return
//             }
//             setTicket(foundTicket)
//         } else {
//             router.push('/dashboard/helpdesk/tickets')
//         }
//     }, [id, user, router])

//     useEffect(() => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//         }
//     }, [ticket?.messages])

//     const handleSendMessage = () => {
//         if (!newMessage.trim() || !ticket || !user) return

//         const message: TicketMessage = {
//             id: `msg-${Date.now()}`,
//             senderId: user.id,
//             senderName: user.name,
//             senderRole: user.role,
//             content: newMessage,
//             createdAt: new Date().toISOString()
//         }

//         setTicket(prev => prev ? {
//             ...prev,
//             messages: [...prev.messages, message],
//             updatedAt: new Date().toISOString()
//         } : null)
//         setNewMessage('')
//     }

//     const handleStatusChange = (newStatus: TicketStatus) => {
//         if (!ticket) return
//         setTicket({ ...ticket, status: newStatus, updatedAt: new Date().toISOString() })
//     }

//     const handleEscalation = () => {
//         if (!ticket) return
//         setTicket({ ...ticket, escalatedToTech: true, updatedAt: new Date().toISOString() })
//     }

//     if (!ticket || !user) return null

//     const getStatusIcon = (status: TicketStatus) => {
//         switch (status) {
//             case 'open': return <Clock className="h-4 w-4 text-blue-500" />
//             case 'in-progress': return <AlertCircle className="h-4 w-4 text-yellow-500" />
//             case 'resolved': return <CheckCircle2 className="h-4 w-4 text-green-500" />
//             case 'closed': return <ShieldCheck className="h-4 w-4 text-gray-500" />
//         }
//     }

//     return (
//         <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
//             {/* Detail Header */}
//             <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-4">
//                     <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
//                         <ArrowLeft className="h-5 w-5" />
//                     </Button>
//                     <div>
//                         <div className="flex items-center gap-2">
//                             <span className="text-xs font-bold text-gray-400">#{ticket.id}</span>
//                             <Badge className={cn(
//                                 "rounded-full px-2.5 py-0.5 text-[10px] font-bold border-0 uppercase",
//                                 ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
//                                     ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
//                                         ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
//                             )}>
//                                 {ticket.status.replace('-', ' ')}
//                             </Badge>
//                         </div>
//                         <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{ticket.title}</h1>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                     {/* Actions for Society Manager (Admin) */}
//                     {user.role === 'admin' && ticket.handlerId === user.id && (
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="outline" className="rounded-xl font-bold gap-2">
//                                     Actions
//                                     <MoreVertical className="h-4 w-4" />
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
//                                 <DropdownMenuItem onClick={() => handleStatusChange('in-progress')} className="rounded-lg gap-2 font-medium">
//                                     <AlertCircle className="h-4 w-4 text-yellow-500" /> Mark In Progress
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => handleStatusChange('resolved')} className="rounded-lg gap-2 font-medium">
//                                     <CheckCircle2 className="h-4 w-4 text-green-500" /> Mark Resolved
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => handleStatusChange('closed')} className="rounded-lg gap-2 font-medium">
//                                     <ShieldCheck className="h-4 w-4 text-gray-500" /> Close Ticket
//                                 </DropdownMenuItem>
//                                 <hr className="my-2 border-gray-100" />
//                                 {!ticket.escalatedToTech && (
//                                     <DropdownMenuItem onClick={handleEscalation} className="rounded-lg gap-2 font-bold text-rose-600 focus:text-rose-600">
//                                         <ShieldAlert className="h-4 w-4" /> Escalate to Tech Team
//                                     </DropdownMenuItem>
//                                 )}
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     )}
//                 </div>
//             </div>

//             <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
//                 {/* Main Content & Chat */}
//                 <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
//                     {/* Ticket Description */}
//                     <div className="p-6 border-b border-gray-50 bg-gray-50/30">
//                         <div className="flex items-start gap-4">
//                             <Avatar className="h-10 w-10 ring-2 ring-white">
//                                 <AvatarFallback className="bg-blue-100 text-blue-600 font-bold uppercase">
//                                     {ticket.residentName.charAt(0)}
//                                 </AvatarFallback>
//                             </Avatar>
//                             <div className="flex-1">
//                                 <div className="flex items-center justify-between">
//                                     <span className="font-bold text-gray-900">{ticket.residentName}</span>
//                                     <span className="text-[10px] font-bold text-gray-400 uppercase">Reported on {new Date(ticket.createdAt).toLocaleDateString()}</span>
//                                 </div>
//                                 <p className="text-gray-600 mt-2 text-sm leading-relaxed">{ticket.description}</p>
//                             </div>
//                         </div>

//                         <div className="flex flex-wrap gap-3 mt-6">
//                             <div className="bg-white px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-500 shadow-sm border border-gray-100 flex items-center gap-2">
//                                 <Building2 className="h-3.5 w-3.5 text-blue-500" /> UNIT {ticket.unit}
//                             </div>
//                             <div className="bg-white px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-500 shadow-sm border border-gray-100 flex items-center gap-2 uppercase">
//                                 CATEGORY: {ticket.category}
//                             </div>
//                             {ticket.isPrivate ? (
//                                 <div className="bg-purple-50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-purple-600 shadow-sm border border-purple-100 flex items-center gap-2">
//                                     <Lock className="h-3.5 w-3.5" /> PRIVATE ISSUE
//                                 </div>
//                             ) : (
//                                 <div className="bg-emerald-50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-emerald-600 shadow-sm border border-emerald-100 flex items-center gap-2">
//                                     <Eye className="h-3.5 w-3.5" /> PUBLIC TICKET
//                                 </div>
//                             )}
//                             {ticket.escalatedToTech && (
//                                 <div className="bg-rose-50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-rose-600 shadow-sm border border-rose-100 flex items-center gap-2">
//                                     <ShieldAlert className="h-3.5 w-3.5" /> WITH TECH TEAM
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Chat Messages */}
//                     <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
//                         <div className="text-center py-4">
//                             <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-400 rounded-full uppercase tracking-widest">Chat Started</span>
//                         </div>

//                         {ticket.messages.length > 0 ? (
//                             ticket.messages.map((msg) => (
//                                 <div key={msg.id} className={cn(
//                                     "flex gap-3 max-w-[85%]",
//                                     msg.senderId === user.id ? "ml-auto flex-row-reverse" : ""
//                                 )}>
//                                     <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
//                                         <AvatarFallback className={cn(
//                                             "text-[10px] font-bold uppercase",
//                                             msg.senderId === user.id ? "bg-[#1e3a5f] text-white" : "bg-gray-200 text-gray-600"
//                                         )}>
//                                             {msg.senderName.charAt(0)}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                     <div className="space-y-1">
//                                         <div className={cn(
//                                             "p-4 rounded-2xl shadow-sm text-sm border",
//                                             msg.senderId === user.id
//                                                 ? "bg-[#1e3a5f] text-white border-transparent rounded-tr-none"
//                                                 : "bg-white text-gray-800 border-gray-100 rounded-tl-none"
//                                         )}>
//                                             <p className="leading-relaxed">{msg.content}</p>
//                                         </div>
//                                         <p className={cn(
//                                             "text-[9px] font-bold uppercase text-gray-400 flex items-center gap-2",
//                                             msg.senderId === user.id ? "justify-end" : ""
//                                         )}>
//                                             {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="h-full flex flex-col items-center justify-center opacity-40">
//                                 <MessageSquare className="h-10 w-10 text-gray-300 mb-2" />
//                                 <p className="text-sm font-bold text-gray-400">No messages yet</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Chat Input */}
//                     <div className="p-4 bg-white border-t border-gray-50">
//                         <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
//                             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-blue-600 shrink-0">
//                                 <Paperclip className="h-5 w-5" />
//                             </Button>
//                             <Input
//                                 placeholder="Type your message..."
//                                 value={newMessage}
//                                 onChange={(e) => setNewMessage(e.target.value)}
//                                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                                 className="flex-1 h-12 bg-gray-50/80 border-0 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl px-4 font-medium"
//                             />
//                             <Button
//                                 onClick={handleSendMessage}
//                                 disabled={!newMessage.trim()}
//                                 className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 shrink-0"
//                             >
//                                 <Send className="h-5 w-5" />
//                             </Button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Info Sidebar (Optional/Desktop) */}
//                 <div className="hidden lg:block w-80 space-y-6">
//                     <Card className="p-5 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
//                         <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Ticket Lifecycle</h4>
//                         <div className="space-y-4">
//                             {['open', 'in-progress', 'resolved', 'closed'].map((s, i) => (
//                                 <div key={s} className="flex items-center gap-3">
//                                     <div className={cn(
//                                         "h-6 w-6 rounded-full flex items-center justify-center border-2",
//                                         ticket.status === s ? "bg-blue-600 border-blue-600" : "border-gray-100 bg-white"
//                                     )}>
//                                         {ticket.status === s ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> : <div className="h-2 w-2 rounded-full bg-gray-100" />}
//                                     </div>
//                                     <span className={cn(
//                                         "text-xs font-bold uppercase",
//                                         ticket.status === s ? "text-blue-600" : "text-gray-300"
//                                     )}>{s.replace('-', ' ')}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </Card>

//                     <Card className="p-5 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
//                         <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Stakeholders</h4>
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3">
//                                 <Avatar className="h-8 w-8">
//                                     <AvatarFallback className="text-[10px] font-bold bg-blue-100">CM</AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <p className="text-xs font-bold text-gray-900">Society Manager</p>
//                                     <p className="text-[10px] font-medium text-gray-400">Assigned Handler</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <Avatar className="h-8 w-8">
//                                     <AvatarFallback className="text-[10px] font-bold bg-gray-100">RK</AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <p className="text-xs font-bold text-gray-900">{ticket.residentName}</p>
//                                     <p className="text-[10px] font-medium text-gray-400">Reporter</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }

// function MessageSquare(props: any) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//         </svg>
//     )
// }



import ClientPage from '../ClientPage'
import { mockTickets } from '@/lib/mocks/tickets'

export async function generateStaticParams() {
  return mockTickets.map((ticket) => ({
    id: ticket.id,
  }))
}

export default function Page() {
  return <ClientPage />
}

