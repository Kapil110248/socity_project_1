'use client'

import { Users } from 'lucide-react'
import { mockServiceComplaints } from '@/lib/mocks/services'
import { ComplaintsTable } from '@/components/complaints/complaints-table'
import { RaiseComplaintDialog } from '@/components/complaints/raise-complaint-dialog'
import { Card, CardContent } from '@/components/ui/card'

export default function ResidentComplaintsPage() {
    const residentComplaints = mockServiceComplaints.filter(c => c.source === 'resident')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Resident Complaints</h1>
                        <p className="text-gray-500">Service issues reported by Residents</p>
                    </div>
                </div>
                <RaiseComplaintDialog />
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <ComplaintsTable complaints={residentComplaints} showSource={false} />
                </CardContent>
            </Card>
        </div>
    )
}
