'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Wrench, Clock, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export default function SuperAdminLeadsPage() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [leadType, setLeadType] = useState<string>('all')

    const { data: inquiries = [], isLoading } = useQuery<any[]>({
        queryKey: ['platform-inquiries'],
        queryFn: async () => {
            const response = await api.get('/services/inquiries')
            return response.data
        }
    })

    const { data: vendors = [] } = useQuery<any[]>({
        queryKey: ['super-admin-vendors'],
        queryFn: async () => {
            const response = await api.get('/vendors/all')
            return response.data
        }
    })

    const assignVendorMutation = useMutation({
        mutationFn: async ({ inquiryId, vendorId, vendorName }: { inquiryId: string; vendorId: string; vendorName: string }) => {
            const response = await api.patch(`/services/inquiries/${inquiryId}/assign`, { vendorId, vendorName })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platform-inquiries'] })
            toast.success(`Vendor assigned successfully!`)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to assign vendor')
        }
    })

    const filteredInquiries = inquiries.filter((inq: any) => {
        const matchesSearch = (inq.residentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inq.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inq.unit || '').toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = leadType === 'all' || inq.source === leadType

        return matchesSearch && matchesType
    })

    const handleAssignVendor = (inquiryId: string, vendorId: string, vendorName: string) => {
        assignVendorMutation.mutate({ inquiryId, vendorId, vendorName })
    }

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Pending</Badge>
            case 'booked':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Assigned</Badge>
            case 'done':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Done</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-display">Service Leads</h1>
                    <p className="text-gray-500 mt-1 font-medium">Assign and track service requests across the platform</p>
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'society', 'resident', 'individual'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setLeadType(type)}
                            className={`
                                px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 capitalize
                                ${leadType === type
                                    ? 'bg-[#1e3a5f] text-white shadow-lg shadow-blue-500/20 translate-y-[-1px]'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {type === 'all' ? 'All Leads' : type}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search by resident, unit or service..."
                        className="pl-12 h-12 rounded-2xl border-0 shadow-sm bg-white ring-1 ring-black/5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredInquiries.length === 0 ? (
                    <Card className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                        <AlertCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No leads found</h3>
                        <p className="text-gray-400 mt-2">Any new service requests from residents will appear here.</p>
                    </Card>
                ) : (
                    filteredInquiries.map((inq, index) => (
                        <motion.div
                            key={inq.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5 relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${inq.status === 'pending' ? 'bg-yellow-500' : inq.status === 'booked' ? 'bg-blue-500' : 'bg-green-500'}`} />

                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="p-4 rounded-2xl bg-gray-50 shrink-0">
                                            <User className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-gray-900">{inq.residentName}</h3>
                                                <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    {inq.unit}
                                                </Badge>
                                                {getStatusBadge(inq.status)}
                                            </div>
                                            <p className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide flex items-center gap-2">
                                                <Wrench className="h-3.5 w-3.5" />
                                                {inq.serviceName}
                                                <span className="text-gray-300 mx-1">|</span>
                                                <span className="text-gray-400 lowercase italic">{inq.type}</span>
                                                {inq.source && (
                                                    <>
                                                        <span className="text-gray-300 mx-1">|</span>
                                                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                                            {inq.source}
                                                        </Badge>
                                                    </>
                                                )}
                                            </p>
                                            <div className="flex items-center gap-4 pt-2 text-xs text-gray-500 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {new Date(inq.createdAt).toLocaleString()}
                                                </span>
                                                {inq.vendorName && (
                                                    <span className="flex items-center gap-1.5 text-blue-600">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Assigned to: {inq.vendorName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="h-11 px-4 rounded-xl gap-2 font-bold ring-1 ring-black/5 border-0 hover:bg-gray-50"
                                                    disabled={inq.status === 'done'}
                                                >
                                                    {inq.vendorId ? 'Reassign Vendor' : 'Assign Vendor'}
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-0 shadow-2xl ring-1 ring-black/5">
                                                {vendors.map((vendor: any) => (
                                                    <DropdownMenuItem
                                                        key={vendor.id}
                                                        className="rounded-xl px-4 py-2.5 font-medium cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                                                        onClick={() => handleAssignVendor(inq.id, vendor.id.toString(), vendor.name)}
                                                    >
                                                        {vendor.name}
                                                    </DropdownMenuItem>
                                                ))}
                                                {vendors.length === 0 && (
                                                    <div className="p-4 text-center text-xs text-gray-400 font-medium">No vendors found</div>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {inq.notes && (
                                    <div className="mt-4 pt-4 border-t border-gray-50 text-xs font-medium text-gray-400 italic">
                                        &quot; {inq.notes} &quot;
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
