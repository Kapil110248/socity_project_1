'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ClipboardList, UserCheck, Clock, MapPin, Search, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function SuperAdminLeadTrackingPage() {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSociety, setSelectedSociety] = useState<string>('all')
    const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null)
    const [selectedVendorId, setSelectedVendorId] = useState<string>('')
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

    const { data: inquiries = [], isLoading: isInqLoading } = useQuery<any[]>({
        queryKey: ['service-inquiries'],
        queryFn: async () => {
            const response = await api.get('/services/inquiries')
            return response.data
        }
    })

    const { data: societies = [] } = useQuery<any[]>({
        queryKey: ['all-societies'],
        queryFn: async () => {
            const response = await api.get('/society/all')
            return response.data
        }
    })

    const { data: vendors = [], isLoading: isVendorsLoading } = useQuery<any[]>({
        queryKey: ['super-admin-vendors'],
        queryFn: async () => {
            const response = await api.get('/vendors/all')
            return response.data
        }
    })

    const assignVendorMutation = useMutation({
        mutationFn: async ({ id, vendorId, vendorName }: { id: string, vendorId: string, vendorName: string }) => {
            const response = await api.put(`/services/inquiries/${id}/assign`, { vendorId, vendorName })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-inquiries'] })
            toast.success('Vendor assigned successfully')
            setIsAssignDialogOpen(false)
            setSelectedInquiry(null)
            setSelectedVendorId('')
        }
    })

    const filteredInquiries = inquiries.filter((inq: any) => {
        const matchesSearch = 
            inq.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.unit.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesSociety = selectedSociety === 'all' || String(inq.societyId) === selectedSociety
        
        return matchesSearch && matchesSociety
    })

    const getMatchingVendors = (serviceName: string) => {
        if (!serviceName) return vendors
        return vendors.filter((v: any) => 
            v.serviceType?.toLowerCase().includes(serviceName.toLowerCase()) || 
            v.vendorType === 'platform'
        )
    }

    const handleAssign = () => {
        if (!selectedInquiry || !selectedVendorId) return
        const vendor = vendors.find((v: any) => String(v.id) === selectedVendorId)
        if (!vendor) return

        assignVendorMutation.mutate({ 
            id: selectedInquiry.id, 
            vendorId: String(vendor.id), 
            vendorName: vendor.name 
        })
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        booked: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-display">Global Lead Management</h1>
                    <p className="text-gray-500 mt-1 font-medium">Assign vendors and track service requests across the platform</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                            <ClipboardList className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Enquiries</p>
                            <p className="text-3xl font-black text-gray-900">{inquiries.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-yellow-50 text-yellow-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</p>
                            <p className="text-3xl font-black text-gray-900">{inquiries.filter(i => i.status === 'pending').length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
                            <UserCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Booked</p>
                            <p className="text-3xl font-black text-gray-900">{inquiries.filter(i => i.status === 'booked').length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completed</p>
                            <p className="text-3xl font-black text-gray-900">{inquiries.filter(i => i.status === 'completed').length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="border-0 shadow-sm bg-white rounded-[40px] ring-1 ring-black/5 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900">Platform Service Enquiries</h2>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search enquiries..."
                                className="pl-9 h-11 rounded-2xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedSociety} onValueChange={setSelectedSociety}>
                            <SelectTrigger className="w-full md:w-64 h-11 rounded-2xl">
                                <SelectValue placeholder="Filter by Society" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                                <SelectItem value="all">All Societies</SelectItem>
                                {societies.map((soc: any) => (
                                    <SelectItem key={soc.id} value={String(soc.id)}>{soc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Resident / Unit</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Society</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Requested</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredInquiries.map((inquiry, index) => (
                                <motion.tr
                                    key={inquiry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{inquiry.residentName}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {inquiry.unit}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                <Building2 className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <span className="font-bold text-gray-700 text-sm whitespace-nowrap">
                                                {inquiry.society?.name || 'Platform Level'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#1e3a5f] uppercase tracking-wide text-xs">{inquiry.serviceName}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {new Date(inquiry.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={statusColors[inquiry.status]}>
                                            {inquiry.status.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        {inquiry.vendorName ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs uppercase">
                                                    {inquiry.vendorName.substring(0, 2)}
                                                </div>
                                                <span className="font-bold text-gray-900">{inquiry.vendorName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {inquiry.status === 'pending' || inquiry.status === 'confirmed' ? (
                                            <Button
                                                size="sm"
                                                className="bg-[#1e3a5f] hover:bg-[#2d4a6f] rounded-xl font-bold text-[10px] uppercase"
                                                onClick={() => {
                                                    setSelectedInquiry(inquiry)
                                                    setIsAssignDialogOpen(true)
                                                }}
                                            >
                                                Assign Vendor
                                            </Button>
                                        ) : (
                                            <Button size="sm" variant="ghost" className="rounded-xl" disabled>
                                                Locked
                                            </Button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Assign Vendor Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-md rounded-[32px] border-0 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Assign Service Vendor</DialogTitle>
                        <DialogDescription className="font-medium text-gray-500">
                            Select a vendor to handle {selectedInquiry?.residentName}&apos;s request for {selectedInquiry?.serviceName}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="p-6 bg-gray-50 rounded-3xl space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-400 tracking-widest uppercase">Service Category</span>
                                <Badge variant="secondary" className="bg-white font-black">{selectedInquiry?.serviceName}</Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-400 tracking-widest uppercase">Resident Unit</span>
                                <span className="font-black text-gray-900">{selectedInquiry?.unit}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Available Vendors</label>
                            <Select onValueChange={setSelectedVendorId} value={selectedVendorId}>
                                <SelectTrigger className="h-14 rounded-2xl border-0 ring-1 ring-black/5 bg-white shadow-sm font-bold">
                                    <SelectValue placeholder="Choose a vendor..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-0 shadow-2xl ring-1 ring-black/5">
                                    {selectedInquiry && getMatchingVendors(selectedInquiry.serviceName).map((vendor: any) => (
                                        <SelectItem key={vendor.id} value={String(vendor.id)} className="rounded-xl p-3 font-bold">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-[10px]">
                                                    {vendor.name.substring(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{vendor.name}</span>
                                                    <span className="text-[10px] text-gray-400 capitalize">{vendor.category}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsAssignDialogOpen(false)} className="rounded-2xl font-bold h-12 uppercase text-xs tracking-widest">Cancel</Button>
                        <Button
                            onClick={handleAssign}
                            disabled={!selectedVendorId}
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl font-black h-12 uppercase text-xs tracking-widest shadow-lg shadow-teal-100 px-8"
                        >
                            Confirm Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
