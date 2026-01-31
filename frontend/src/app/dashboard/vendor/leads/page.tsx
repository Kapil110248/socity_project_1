'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, Clock, ClipboardList, Calendar, Phone, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function VendorLeadsPage() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')

    const { data: inquiriesRaw, isLoading } = useQuery({
        queryKey: ['vendor-my-leads'],
        queryFn: async () => {
            const res = await api.get('/services/inquiries', { params: { limit: 200 } })
            const body = res.data
            return Array.isArray(body) ? body : (body?.data ?? [])
        },
    })

    const inquiries = Array.isArray(inquiriesRaw) ? inquiriesRaw : []
    const leads = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return inquiries
        return inquiries.filter((inq: any) => {
            const name = (inq.residentName || '').toLowerCase()
            const service = (inq.serviceName || '').toLowerCase()
            const unit = (inq.unit || '').toLowerCase()
            return name.includes(q) || service.includes(q) || unit.includes(q)
        })
    }, [inquiries, searchQuery])

    const contactMutation = useMutation({
        mutationFn: async (id: number | string) => {
            const res = await api.patch(`/services/inquiries/${id}/contact`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-my-leads'] })
            toast.success('Customer marked as contacted.')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.error || 'Failed to mark as contacted')
        },
    })

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number | string; status: string }) => {
            const res = await api.patch(`/services/inquiries/${id}/status`, { status })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-my-leads'] })
        },
    })

    const isContacted = (lead: any) => {
        const s = String(lead?.status || '').toLowerCase()
        return (
            lead?.contactedAt != null ||
            s === 'contacted' ||
            s === 'confirmed' ||
            s === 'done' ||
            s === 'completed'
        )
    }

    const handleStatusUpdate = (id: string | number, status: string) => {
        statusMutation.mutate(
            { id, status },
            {
                onSuccess: () => {
                    const labels: Record<string, string> = {
                        confirmed: 'marked as contacted',
                        booked: 'marked as pending',
                        done: 'completed',
                    }
                    toast.success(`Service ${labels[status] || 'updated'}!`)
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.error || 'Failed to update status')
                },
            }
        )
    }

    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; leadId: number | null; amount: string }>({
        open: false,
        leadId: null,
        amount: ''
    })

    const confirmMutation = useMutation({
        mutationFn: async ({ id, amount }: { id: number | string; amount: number }) => {
            const res = await api.patch(`/services/inquiries/${id}/status`, { 
                status: 'confirmed',
                payableAmount: amount
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-my-leads'] })
            setConfirmDialog({ open: false, leadId: null, amount: '' })
            toast.success('Lead confirmed and quote sent!')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.error || 'Failed to confirm lead')
        },
    })

    const handleConfirmSubmit = () => {
        if (!confirmDialog.leadId || !confirmDialog.amount) {
            toast.error('Please enter a valid amount')
            return
        }
        confirmMutation.mutate({ 
            id: confirmDialog.leadId, 
            amount: parseFloat(confirmDialog.amount) 
        })
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-display">My assigned Leads</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage and complete your assigned service bookings</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search by resident, unit or service..."
                        className="pl-12 h-12 rounded-2xl border-0 shadow-sm bg-white ring-1 ring-black/5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Badge variant="outline" className="h-12 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-100 flex items-center">
                    {leads.filter(l => l.status === 'booked').length} ACTIVE BOOKINGS
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {leads.map((lead, index) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5 relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${lead.status === 'done' ? 'bg-green-500' : 'bg-blue-500'}`} />

                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="p-4 rounded-2xl bg-blue-50 shrink-0">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-gray-900">{lead.residentName}</h3>
                                                <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    {lead.unit ?? '—'}
                                                </Badge>
                                                {(lead.status === 'done' || lead.status === 'completed') && (
                                                    <Badge className="bg-green-100 text-green-700 border-green-200">Done</Badge>
                                                )}
                                                {isContacted(lead) && lead.status !== 'done' && lead.status !== 'completed' && (
                                                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">Contacted</Badge>
                                                )}
                                                {!isContacted(lead) && (lead.status === 'booked' || lead.status === 'pending') && (
                                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">Pending</Badge>
                                                )}
                                                {lead.vendorName?.includes('(Platform)') && (
                                                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 font-black">PLATFORM</Badge>
                                                )}
                                                {lead.status === 'confirmed' && (
                                                    <Badge className="bg-green-100 text-green-700 border-green-200">Quote Sent</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">{lead.serviceName}</p>
                                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    Scheduled: {lead.preferredDate || 'Asap'} {lead.preferredTime}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Booked At: {new Date(lead.createdAt).toLocaleDateString()}
                                                </div>
                                                {lead.payableAmount && (
                                                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                                        <span className="bg-green-50 px-2 py-0.5 rounded-md">
                                                            Quote: ₹{lead.payableAmount}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={isContacted(lead) ? 'default' : 'outline'}
                                            disabled={isContacted(lead) || contactMutation.isPending}
                                            className={cn(
                                                "h-10 px-4 rounded-xl font-bold transition-all",
                                                isContacted(lead)
                                                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100"
                                                    : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50 hover:text-gray-600"
                                            )}
                                            onClick={() => contactMutation.mutate(lead.id)}
                                        >
                                            <Phone className="h-4 w-4 mr-2" />
                                            {contactMutation.isPending ? '...' : isContacted(lead) ? 'CONTACTED' : 'CONTACT'}
                                        </Button>
                                        
                                        {/* Quote/Confirm Button */}
                                        {lead.status === 'booked' && (
                                            <Button
                                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 h-10 px-4 rounded-xl font-bold"
                                                onClick={() => setConfirmDialog({ open: true, leadId: lead.id, amount: '' })}
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Confirm & Quote
                                            </Button>
                                        )}

                                        <Button
                                            variant={lead.status === 'done' || lead.status === 'completed' ? 'default' : 'outline'}
                                            className={cn(
                                                "h-10 px-4 rounded-xl font-bold transition-all",
                                                lead.status === 'done' || lead.status === 'completed'
                                                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100"
                                                    : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
                                            )}
                                            onClick={() => handleStatusUpdate(lead.id, 'done')}
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            COMPLETE
                                        </Button>

                                        <div className="h-10 w-[1px] bg-gray-100 mx-1" />

                                        <Button
                                            variant="outline"
                                            className="h-10 w-10 p-0 rounded-xl border-gray-100 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                            onClick={() => window.location.href = `tel:${lead.phone}`}
                                        >
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {lead.notes && (
                                    <div className="mt-4 pt-4 border-t border-gray-50 text-xs font-medium text-gray-400 italic">
                                        &quot; {lead.notes} &quot;
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {leads.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                        <ClipboardList className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No active bookings</h3>
                        <p className="text-gray-400 mt-2">When Super Admin assigns a service to you, it will appear here.</p>
                    </div>
                )}

                {/* Confirm Dialog */}
                {confirmDialog.open && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                         <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                         >
                             <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Booking</h3>
                             <p className="text-gray-500 mb-6">Enter the final service amount to quote to the customer.</p>
                             
                             <div className="space-y-2 mb-6">
                                 <label className="text-sm font-bold text-gray-700">Service Amount (₹)</label>
                                 <Input 
                                     type="number" 
                                     placeholder="e.g. 500" 
                                     className="h-12 rounded-xl text-lg font-bold"
                                     value={confirmDialog.amount}
                                     onChange={(e) => setConfirmDialog(prev => ({ ...prev, amount: e.target.value }))}
                                     autoFocus
                                 />
                             </div>
                             
                             <div className="flex gap-3">
                                 <Button 
                                     variant="outline" 
                                     className="flex-1 h-12 rounded-xl font-bold"
                                     onClick={() => setConfirmDialog({ open: false, leadId: null, amount: '' })}
                                 >
                                     Cancel
                                 </Button>
                                 <Button 
                                     className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                                     onClick={handleConfirmSubmit}
                                     disabled={!confirmDialog.amount}
                                 >
                                     Send Quote
                                 </Button>
                             </div>
                         </motion.div>
                     </div>
                )}
            </div>
        </div>
    )
}
