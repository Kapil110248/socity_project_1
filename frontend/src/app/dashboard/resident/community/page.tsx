'use client'

import { MessageCircle, MessageSquare } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { Skeleton } from '@/components/ui/skeleton'
import { RoleGuard } from '@/components/auth/role-guard'
import { PostCard } from '@/components/community/post-card'
import { CreatePostDialog } from '@/components/community/create-post-dialog'
import { Card, CardContent } from '@/components/ui/card'

export default function CommunityPage() {
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['community-feed'],
        queryFn: residentService.getCommunityFeed
    })

    if (isLoading) return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            <Skeleton className="h-12 w-48" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            </div>
        </div>
    )

    if (error) return (
        <div className="container mx-auto p-6 text-center">
            <h2 className="text-xl font-bold text-red-600">Error loading community feed</h2>
            <p className="text-muted-foreground">Please try again later.</p>
        </div>
    )

    return (
        <RoleGuard allowedRoles={['resident', 'committee', 'admin', 'super_admin', 'society_admin']}>
            <div className="container mx-auto p-6 max-w-4xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
                            <MessageSquare className="h-8 w-8 text-pink-600" />
                            Community Feed
                        </h1>
                        <p className="text-muted-foreground">
                            Connect with neighbors, see announcements, and share updates.
                        </p>
                    </div>
                    <CreatePostDialog />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {(posts || []).map((post: any) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                        {(!posts || posts.length === 0) && (
                            <Card className="p-12 text-center border-dashed border-2">
                                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                                <p className="text-muted-foreground">Be the first to share something with your community!</p>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Widgets */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    Upcoming Events
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                        <div className="bg-white/20 p-2 rounded-lg text-center min-w-[50px]">
                                            <span className="block text-[10px] font-bold opacity-70">MAR</span>
                                            <span className="block text-xl font-bold">15</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Holi Celebration</p>
                                            <p className="text-[10px] opacity-80 uppercase tracking-wider">Central Park • 10:00 AM</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                        <div className="bg-white/20 p-2 rounded-lg text-center min-w-[50px]">
                                            <span className="block text-[10px] font-bold opacity-70">MAR</span>
                                            <span className="block text-xl font-bold">22</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">AGM Meeting</p>
                                            <p className="text-[10px] opacity-80 uppercase tracking-wider">Clubhouse • 6:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm overflow-hidden bg-gray-50/50">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Useful Contacts</h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                        <span className="text-muted-foreground">Main Gate</span>
                                        <span className="font-semibold text-blue-600">Intercom: 101</span>
                                    </li>
                                    <li className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                        <span className="text-muted-foreground">Facility Manager</span>
                                        <span className="font-semibold text-blue-600">+91 98765 00000</span>
                                    </li>
                                    <li className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                        <span className="text-muted-foreground">Clubhouse</span>
                                        <span className="font-semibold text-blue-600">Intercom: 105</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </RoleGuard>
    )
}
