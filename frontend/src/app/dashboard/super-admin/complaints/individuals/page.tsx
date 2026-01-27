'use client'

import { User } from 'lucide-react'
import { mockServiceComplaints } from '@/lib/mocks/services'
import { ComplaintsTable } from '@/components/complaints/complaints-table'
import { RaiseComplaintDialog } from '@/components/complaints/raise-complaint-dialog'
import { Card, CardContent } from '@/components/ui/card'

export default function IndividualComplaintsPage() {
    const individualComplaints = mockServiceComplaints.filter(c => c.source === 'individual')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Individual Complaints</h1>
                        <p className="text-gray-500">Complaints from Individual Service Users</p>
                    </div>
                </div>
                <RaiseComplaintDialog />
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <ComplaintsTable complaints={individualComplaints} showSource={false} />
                </CardContent>
            </Card>
        </div>
    )
}
