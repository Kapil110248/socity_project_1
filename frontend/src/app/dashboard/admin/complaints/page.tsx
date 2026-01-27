'use client'

import { motion } from 'framer-motion'
import { Plus, MessageSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ComplaintsTable } from '@/components/complaints/complaints-table'
import { UserRaiseComplaintDialog } from '@/components/complaints/user-raise-complaint-dialog'
import { useState } from 'react'
import { ComplaintService } from '@/services/complaint.service'

export default function AdminComplaintsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const { data: response, isLoading } = useQuery({
        queryKey: ['complaints', page, limit],
        queryFn: () => ComplaintService.getAll({ page, limit })
    })

    const complaints = response?.data || []
    const meta = response?.meta || { total: 0, totalPages: 0 }

    const { data: serverStats } = useQuery({
        queryKey: ['complaint-stats'],
        queryFn: () => ComplaintService.getStats()
    })

    const stats = [
        {
            title: 'Total Complaints',
            value: serverStats?.total || 0,
            icon: MessageSquare,
            color: 'bg-blue-500',
        },
        {
            title: 'Resolved',
            value: serverStats?.resolved || 0,
            icon: CheckCircle2,
            color: 'bg-green-500',
        },
        {
            title: 'Pending',
            value: serverStats?.pending || 0,
            icon: Clock,
            color: 'bg-orange-500',
        },
        {
            title: 'High Priority',
            value: serverStats?.highPriority || 0, // Assuming highPriority is added to stats or handled separately
            icon: AlertCircle,
            color: 'bg-red-500',
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Society Complaints</h1>
                    <p className="text-gray-500">Track and manage complaints from your society members</p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-100"
                >
                    <Plus className="h-4 w-4" />
                    Raise to Super Admin
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                        <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                                        <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Main Content */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">Complaints Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-4 grid w-full grid-cols-3 lg:w-[300px] h-11 bg-gray-100/50 p-1">
                            <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
                            <TabsTrigger value="PENDING" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
                            <TabsTrigger value="RESOLVED" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Resolved</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-0">
                            <ComplaintsTable complaints={complaints} />
                        </TabsContent>
                        <TabsContent value="PENDING" className="mt-0">
                            <ComplaintsTable complaints={complaints.filter((c: any) => c.status.toLowerCase() !== 'resolved' && c.status.toLowerCase() !== 'closed')} />
                        </TabsContent>
                        <TabsContent value="RESOLVED" className="mt-0">
                            <ComplaintsTable complaints={complaints.filter((c: any) => c.status.toLowerCase() === 'resolved')} />
                        </TabsContent>
                    </Tabs>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(page * limit, meta.total)}
                            </span>{' '}
                            of <span className="font-medium">{meta.total}</span> results
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                                    <Button
                                        key={p}
                                        variant={page === p ? 'default' : 'outline'}
                                        size="sm"
                                        className="w-8"
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <UserRaiseComplaintDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                escalateToSuperAdmin
            />
        </div>
    )
}

