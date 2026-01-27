'use client'

import { useState } from 'react'
import { ServiceComplaint } from '@/types/services'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Clock, CheckCircle2, AlertTriangle, Building2, User, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ViewComplaintDialog } from './view-complaint-dialog'

interface ComplaintsTableProps {
    complaints: ServiceComplaint[]
    showSource?: boolean
}

export function ComplaintsTable({ complaints, showSource = true }: ComplaintsTableProps) {
    const [selectedComplaint, setSelectedComplaint] = useState<ServiceComplaint | null>(null)
    const [viewOpen, setViewOpen] = useState(false)

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase()
        switch (s) {
            case 'open': return 'bg-red-100 text-red-700 border-red-200'
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200'
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500 text-white'
            case 'high': return 'bg-orange-500 text-white'
            case 'medium': return 'bg-yellow-500 text-white'
            case 'low': return 'bg-blue-500 text-white'
            default: return 'bg-gray-500 text-white'
        }
    }

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'society': return <Building2 className="h-4 w-4 text-purple-500" />
            case 'resident': return <Users className="h-4 w-4 text-orange-500" />
            case 'individual': return <User className="h-4 w-4 text-blue-500" />
            default: return <User className="h-4 w-4" />
        }
    }

    return (
        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        {showSource && <TableHead>Source</TableHead>}
                        <TableHead>Society</TableHead>
                        <TableHead>Complaint Details</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {complaints.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                No complaints found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        complaints.map((complaint) => (
                            <TableRow key={complaint.id} className="hover:bg-gray-50/50">
                                <TableCell className="font-medium text-xs text-muted-foreground">
                                    {complaint.id}
                                </TableCell>

                                {showSource && (
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-gray-100">
                                                {getSourceIcon(complaint.source)}
                                            </div>
                                            <span className="capitalize text-sm font-medium">{complaint.source}</span>
                                        </div>
                                    </TableCell>
                                )}

                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                                        <div className="p-1.5 rounded-lg bg-indigo-50">
                                            <Building2 className="h-4 w-4" />
                                        </div>
                                        {complaint.society?.name || 'Platform'}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div>
                                        <p className="font-semibold text-gray-900">{complaint.title}</p>
                                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                            {complaint.description}
                                        </p>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge variant="outline" className="bg-slate-50">
                                        {complaint.serviceName}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">
                                                {complaint.reportedBy.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{complaint.reportedBy}</span>
                                            {complaint.unit && <span className="text-xs text-muted-foreground">Unit: {complaint.unit}</span>}
                                            {complaint.reportedByOriginal && (
                                                <span className="text-[10px] text-slate-400">{complaint.reportedByOriginal.email}</span>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge className={`${getPriorityColor(complaint.priority)} border-0`}>
                                        {complaint.priority}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(complaint.status)}>
                                        {complaint.status.toLowerCase() === 'resolved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                        {complaint.status.toLowerCase() === 'open' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                        {complaint.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-right">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 hover:bg-blue-50 text-blue-600"
                                        onClick={() => {
                                            setSelectedComplaint(complaint)
                                            setViewOpen(true)
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>
            <ViewComplaintDialog 
                complaint={selectedComplaint} 
                open={viewOpen} 
                onOpenChange={setViewOpen} 
            />
        </div>
    )
}
