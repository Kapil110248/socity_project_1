'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Clock, Filter, MessageSquare, Search, Building2, User, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ComplaintsTable } from '@/components/complaints/complaints-table'

export default function SuperAdminComplaintsPage() {
    const { data: complaintsData, isLoading } = useQuery<any>({
        queryKey: ['super-admin-complaints'],
        queryFn: async () => {
            const response = await api.get('/complaints')
            return response.data
        }
    })

    const complaints = complaintsData?.data || []

    const stats = [
        {
            title: 'Total Complaints',
            value: complaints.length,
            icon: MessageSquare,
            color: 'bg-blue-500',
        },
        {
            title: 'Resolved',
            value: complaints.filter((c: any) => c.status === 'RESOLVED').length,
            icon: CheckCircle2,
            color: 'bg-green-500',
        },
        {
            title: 'Pending',
            value: complaints.filter((c: any) => c.status === 'PENDING').length,
            icon: Clock,
            color: 'bg-orange-500',
        },
        {
            title: 'High Priority',
            value: complaints.filter((c: any) => c.priority === 'HIGH').length,
            icon: AlertCircle,
            color: 'bg-red-500',
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Complaints Management</h1>
                <p className="text-gray-500">View and track complaints from all platform entities</p>
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-semibold">Complaints List</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-4 grid w-full grid-cols-3 lg:w-[300px]">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="PENDING">Pending</TabsTrigger>
                            <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <ComplaintsTable complaints={complaints} />
                        </TabsContent>
                        <TabsContent value="PENDING">
                            <ComplaintsTable complaints={complaints.filter((c: any) => c.status === 'PENDING')} />
                        </TabsContent>
                        <TabsContent value="RESOLVED">
                            <ComplaintsTable complaints={complaints.filter((c: any) => c.status === 'RESOLVED')} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
