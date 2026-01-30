'use client'

import { motion } from 'framer-motion'
import { ClipboardList, TrendingUp, Users, CheckCircle2, MoreVertical, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export function VendorDashboard() {
    const queryClient = useQueryClient()

    const { data: inquiriesRaw, isLoading } = useQuery({
        queryKey: ['vendor-my-leads'],
        queryFn: async () => {
            const res = await api.get('/services/inquiries', { params: { limit: 200 } })
            const body = res.data
            return Array.isArray(body) ? body : (body?.data ?? [])
        },
    })

    const vendorLeads = Array.isArray(inquiriesRaw) ? inquiriesRaw : []

    const contactMutation = useMutation({
        mutationFn: async (id: number | string) => {
            const res = await api.patch(`/services/inquiries/${id}/contact`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-my-leads'] })
            toast.success('Customer marked as contacted.')
        },
        onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to mark as contacted'),
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
        return lead?.contactedAt != null || s === 'contacted' || s === 'confirmed' || s === 'done' || s === 'completed'
    }

    const handleStatusUpdate = (id: string | number, status: string) => {
        statusMutation.mutate(
            { id, status },
            {
                onSuccess: () => toast.success('Status updated'),
                onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to update'),
            }
        )
    }

    const activeStatuses = ['pending', 'booked']
    const contactedStatuses = ['contacted', 'confirmed']
    const closedStatuses = ['done', 'completed']

    const stats = [
        { label: 'Total Leads', value: vendorLeads.length, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active', value: vendorLeads.filter((l: any) => activeStatuses.includes(String(l.status).toLowerCase())).length, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Contacted', value: vendorLeads.filter((l: any) => contactedStatuses.includes(String(l.status).toLowerCase())).length, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Completed', value: vendorLeads.filter((l: any) => closedStatuses.includes(String(l.status).toLowerCase())).length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    ]

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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your service inquiries and leads</p>
                </div>
                <Link href="/dashboard/vendor/leads">
                    <Button className="bg-[#1e3a5f] hover:bg-[#2d4a6f] rounded-xl font-bold h-11 px-6">
                        View All Leads
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Enquiries</h2>
                    <div className="space-y-4">
                        {vendorLeads.slice(0, 5).map((lead: any) => {
                            const name = lead.residentName || '—'
                            const unit = lead.unit ?? '—'
                            const st = String(lead.status || '').toLowerCase()
                            return (
                                <div key={lead.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center font-bold text-teal-600 shadow-sm">
                                            {name.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{name} ({unit})</h4>
                                            <p className="text-xs text-gray-500">{lead.serviceName || '—'} • {lead.type || 'booking'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                                activeStatuses.includes(st) ? 'bg-blue-100 text-blue-700' :
                                                contactedStatuses.includes(st) ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {st || '—'}
                                            </span>
                                            <p className="text-[10px] text-gray-400 font-bold mt-1">
                                                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                                            </p>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white shadow-sm">
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-0 ring-1 ring-black/5">
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(lead.id, 'booked')}
                                                    className="rounded-xl font-bold text-[10px] uppercase p-3"
                                                >
                                                    <AlertCircle className="h-4 w-4 mr-2 text-blue-500" /> Mark Pending
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => !isContacted(lead) && contactMutation.mutate(lead.id)}
                                                    disabled={isContacted(lead) || contactMutation.isPending}
                                                    className="rounded-xl font-bold text-[10px] uppercase p-3"
                                                >
                                                    <Clock className="h-4 w-4 mr-2 text-yellow-500" /> Mark Contacted
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(lead.id, 'done')}
                                                    className="rounded-xl font-bold text-[10px] uppercase p-3"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Mark Complete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {vendorLeads.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">No assigned leads yet. When Super Admin assigns a service to you, it will appear here.</p>
                    )}
                </Card>

                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Performance</h2>
                    <div className="space-y-6">
                        <div className="text-center py-8">
                            <TrendingUp className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-sm font-medium text-gray-400 italic">Advanced analytics coming soon...</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
