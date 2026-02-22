'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { connectSocket, getSocket } from '@/lib/socket'
import { toast } from 'react-hot-toast'
import { UserCheck, Bell, MapPin, Building2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function VisitorNotificationListener() {
    const { user, isAuthenticated } = useAuthStore()
    const queryClient = useQueryClient()
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated && (user?.role === 'guard' || user?.role === 'admin' || user?.role === 'community-manager')) {
            if (!user?.societyId) return

            const socket = connectSocket(user.societyId)

            socket.on('new_visitor_request', (data: any) => {
                console.log('Received new visitor request:', data)

                // Refresh relevant queries
                queryClient.invalidateQueries({ queryKey: ['visitors'] })
                queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
                queryClient.invalidateQueries({ queryKey: ['notifications'] })

                // Show non-disruptive toast
                toast((t) => (
                    <div className="flex flex-col gap-1 min-w-[280px]">
                        <div className="flex items-center gap-2 text-blue-600 font-bold">
                            <UserCheck className="h-5 w-5" />
                            <span>New Visitor Request</span>
                        </div>
                        <div className="text-sm text-gray-700">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-xs text-gray-500">Purpose: {data.purpose}</p>
                            {data.unit && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Building2 className="h-3 w-3" /> Unit: {data.unit}
                                </p>
                            )}
                            {data.gateName && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Gate: {data.gateName}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => {
                                    router.push('/dashboard/guard/dashboard')
                                    toast.dismiss(t.id)
                                }}
                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Manage
                            </button>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                ), {
                    duration: 8000,
                    position: 'top-right',
                    id: `visitor_${data.id}`
                })

                // Play sound
                try {
                    const audio = new Audio('/sounds/notification.mp3')
                    audio.play()
                } catch (e) { }
            })

            return () => {
                socket.off('new_visitor_request')
            }
        }
    }, [isAuthenticated, user, queryClient, router])

    return null
}
