'use client'

import { motion } from 'framer-motion'
import { ClipboardList, TrendingUp, Users, CheckCircle2, MoreVertical, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useServiceStore } from '@/lib/stores/service-store'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export function VendorDashboard() {
    const { user } = useAuthStore()
    const { leads, updateLeadStatus } = useServiceStore()

    const vendorLeads = leads.filter(l => l.vendorId === user?.id || l.vendorName === user?.name)

    const stats = [
        { label: 'Total Leads', value: vendorLeads.length, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'New', value: vendorLeads.filter(l => l.status === 'new').length, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Contacted', value: vendorLeads.filter(l => l.status === 'contacted').length, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Closed', value: vendorLeads.filter(l => l.status === 'closed').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    ]

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
                        {vendorLeads.slice(0, 5).map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center font-bold text-teal-600 shadow-sm">
                                        {lead.residentName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{lead.residentName} ({lead.unit})</h4>
                                        <p className="text-xs text-gray-500">{lead.serviceName} • {lead.inquiryType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {lead.status}
                                        </span>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1">
                                            {new Date(lead.receivedAt).toLocaleDateString()}
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
                                                onClick={() => updateLeadStatus(lead.id, 'new')}
                                                className="rounded-xl font-bold text-[10px] uppercase p-3"
                                            >
                                                <AlertCircle className="h-4 w-4 mr-2 text-blue-500" /> Mark New
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => updateLeadStatus(lead.id, 'contacted')}
                                                className="rounded-xl font-bold text-[10px] uppercase p-3"
                                            >
                                                <Clock className="h-4 w-4 mr-2 text-yellow-500" /> Mark Contacted
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => updateLeadStatus(lead.id, 'closed')}
                                                className="rounded-xl font-bold text-[10px] uppercase p-3"
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Mark Closed
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
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
